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

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'rooms_data.json')

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
        # 모든 기기(PC, 태블릿, 모바일) 접속을 위한 CORS 허용 헤더
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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
    print("=" * 60)
    print(f"[DualCore Cockpit Server Running] Port: {PORT}")
    print(f"Local Access:   http://localhost:{PORT}")
    print(f"Network Access: http://0.0.0.0:{PORT}")
    print(f"PIN Sync API:   /rooms/<pin>.json")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    run()
