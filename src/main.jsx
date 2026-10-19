import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Cockpit ErrorBoundary]', error, errorInfo);
  }

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans select-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl">
            ⚡
          </div>
          <h1 className="text-xl font-bold text-zinc-100">
            화면 표시 중 일시적인 지연이 발생했습니다
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            최근 업데이트 배포본 적용 중 브라우저 캐시 불일치로 인한 현상일 수 있습니다. 아래 버튼을 눌러 새로고침해 주세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              🔄 바로 새로고침
            </button>
            <button
              type="button"
              onClick={this.handleHardReset}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold border border-zinc-700 transition-all"
            >
              캐시 초기화 후 재접속
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

window.__COCKPIT_MOUNTED__ = true;

// Service Worker 등록 (PWA 오프라인 구동 및 앱 셸 캐싱 지원)
if ('serviceWorker' in navigator && (import.meta.env.PROD || window.location.search.includes('pwa=1'))) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[Cockpit PWA] Service Worker 활성화 완료 (Scope:', reg.scope, ')');
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[Cockpit PWA] 새로운 버전이 준비되었습니다. 다음 접속 시 자동 적용됩니다.');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('[Cockpit PWA] Service Worker 등록 실패:', err);
      });
  });
}

