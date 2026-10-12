import os
import sys
import json
import mimetypes
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ------------------------------------------------------------------------------
# 🔐 내장 경량 .env 파일 로더 (Zero-Dependency)
# ------------------------------------------------------------------------------
def load_dotenv(env_path=None):
    """외부 패키지(python-dotenv) 없이 .env 파일을 읽어 os.environ에 주입합니다."""
    if env_path is None:
        env_path = os.path.join(BASE_DIR, '.env')
    if not os.path.exists(env_path):
        return

    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip("'").strip('"')
                    # 기존 시스템 환경변수를 덮어쓰지 않고 기본값으로 주입
                    if key and key not in os.environ:
                        os.environ[key] = val
    except Exception as e:
        print(f"[Warn] Failed to load .env file: {e}")

# .env 파일 로드
load_dotenv()

# ------------------------------------------------------------------------------
# 🌐 환경변수 설정 읽기 (Fallback 기본값 포함)
# ------------------------------------------------------------------------------
PORT = int(os.environ.get('PORT', 8000))
SYNC_DATA_FILE_NAME = os.environ.get('SYNC_DATA_FILE', 'rooms_data.json')
DATA_FILE = os.path.join(BASE_DIR, SYNC_DATA_FILE_NAME)
ALLOWED_ORIGIN = os.environ.get('ALLOWED_ORIGIN', '*')

# 데이터베이스 및 API 보안 키 환경변수 (추후 확장용)
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "name": os.environ.get("DB_NAME", "cit_cockpit_db"),
    "user": os.environ.get("DB_USER", ""),
    "password": os.environ.get("DB_PASSWORD", ""),
    "api_secret": os.environ.get("API_SECRET_KEY", "")
}

def load_rooms():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading rooms: {e}")
            return {}
    return {}

def save_rooms(rooms):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(rooms, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving rooms: {e}")

class CockpitServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # 환경변수(ALLOWED_ORIGIN) 기반 CORS 허용 헤더
        self.send_header('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _extract_pin(self):
        # /rooms/<pin>.json 또는 /api/rooms/<pin> 지원
        path = self.path.split('?')[0]
        if path.startswith('/rooms/'):
            return path.replace('/rooms/', '').replace('.json', '')
        if path.startswith('/api/rooms/'):
            return path.replace('/api/rooms/', '').replace('.json', '')
        return None

    def do_GET(self):
        pin = self._extract_pin()
        if pin is not None:
            rooms = load_rooms()
            if pin in rooms:
                data = json.dumps(rooms[pin], ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                print(f"[동기화] PIN [{pin}] 데이터 다운로드 성공 (by {self.client_address[0]})")
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(b'{"error": "Room not found", "data": null}')
                print(f"[동기화] PIN [{pin}] 조회 실패: 데이터 없음 (by {self.client_address[0]})")
            return

        # 기본 정적 파일 서빙 (index.html 등)
        return super().do_GET()

    def do_PUT(self):
        pin = self._extract_pin()
        if pin is not None:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                payload = json.loads(body.decode('utf-8'))
                rooms = load_rooms()
                rooms[pin] = payload
                save_rooms(rooms)

                res = json.dumps({
                    "status": "success",
                    "pin": pin,
                    "updatedAt": payload.get("updatedAt"),
                    "message": "Saved successfully"
                }, ensure_ascii=False).encode('utf-8')

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(res)))
                self.end_headers()
                self.wfile.write(res)
                print(f"[동기화] PIN [{pin}] 데이터 업로드 성공 (by {self.client_address[0]})")
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                print(f"[동기화] PIN [{pin}] 업로드 실패: {e}")
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        return self.do_PUT()

def run():
    server_address = ('0.0.0.0', PORT)
    httpd = ThreadingHTTPServer(server_address, CockpitServerHandler)
    masked_pw = '***' if DB_CONFIG['password'] else '(미설정)'
    masked_secret = '***' if DB_CONFIG['api_secret'] else '(미설정)'

    print("=" * 65)
    print(f"[DualCore Cockpit Sync Server Running]")
    print(f"Server Port:    {PORT} (ENV: PORT)")
    print(f"Local Access:   http://localhost:{PORT}")
    print(f"Network Access: http://0.0.0.0:{PORT}")
    print(f"Data File:      {DATA_FILE} (ENV: SYNC_DATA_FILE)")
    print(f"CORS Origin:    {ALLOWED_ORIGIN} (ENV: ALLOWED_ORIGIN)")
    print(f"DB Config:      {DB_CONFIG['user']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['name']} (PW: {masked_pw})")
    print(f"API Secret:     {masked_secret}")
    print(f"PIN Sync API:   /rooms/<pin>.json")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    run()
