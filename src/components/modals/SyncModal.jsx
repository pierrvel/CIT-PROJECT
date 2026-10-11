import React from 'react';
import Icon from '../common/Icon';

export const SyncModal = ({
  isOpen,
  onClose,
  pinInput,
  setPinInput,
  generateRandomPin,
  autoSyncEnabled,
  setAutoSyncEnabled,
  autoSyncInterval,
  setAutoSyncInterval,
  lastSyncedTimeStr,
  isSyncing,
  pushToServer,
  pullFromServer,
  customFirebaseUrl,
  setCustomFirebaseUrl,
  showAdvancedSync,
  setShowAdvancedSync
}) => {
  if (!isOpen) return null;

  const cleanPin = (pinInput || '').trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icon name="cloud" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">6자리 PIN 기기 동기화</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">로그인 없이 PIN 번호로 PC와 태블릿을 즉시 동기화</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
              {customFirebaseUrl ? 'Firebase 클라우드 모드' : '통합 동기화 서버 가동 중'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400 truncate max-w-[160px]">
            {customFirebaseUrl ? 'Custom RTDB' : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000')}
          </span>
        </div>

        {/* PIN 번호 입력 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Icon name="key" className="w-3.5 h-3.5 text-indigo-500" />
              <span>방 번호 (6자리 PIN)</span>
            </label>
            <button
              type="button"
              onClick={generateRandomPin}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Icon name="refreshCw" className="w-3 h-3" />
              <span>랜덤 생성</span>
            </button>
          </div>

          <input
            type="text"
            maxLength={6}
            placeholder="예: 789012"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            className="w-full py-3 px-4 text-center font-mono text-2xl font-black tracking-widest rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />

          {localStorage.getItem('dc_last_used_pin') && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              최근 사용: <button type="button" onClick={() => setPinInput(localStorage.getItem('dc_last_used_pin'))} className="font-mono font-bold text-indigo-600 dark:text-indigo-400 underline">{localStorage.getItem('dc_last_used_pin')}</button>
            </p>
          )}
        </div>

        {/* 실시간 자동 동기화 (Auto-Sync) 컨트롤 패널 */}
        <div className="p-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${autoSyncEnabled && cleanPin.length === 6 ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
              <div>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                  실시간 자동 동기화 (Auto-Sync)
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">수정 시 즉시 자동 전송 및 주기적 수신</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                autoSyncEnabled ? 'bg-emerald-600 text-white shadow-xs' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {autoSyncEnabled ? 'ON (자동)' : 'OFF (수동)'}
            </button>
          </div>

          {autoSyncEnabled && (
            <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                <span>체크 주기:</span>
                <div className="inline-flex gap-1.5">
                  {[2, 3, 5, 10].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setAutoSyncInterval(sec)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                        autoSyncInterval === sec ? 'bg-indigo-600 text-white shadow-xs' : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {sec}초
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500 dark:text-zinc-400">자동 감지:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{cleanPin.length === 6 ? `${autoSyncInterval}초마다 실시간 체크 중` : 'PIN을 먼저 입력하세요'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>마지막 동기화:</span>
                <span>{lastSyncedTimeStr}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            disabled={isSyncing || cleanPin.length !== 6}
            onClick={() => pushToServer(cleanPin, false)}
            className="py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <Icon name="upload" className="w-3.5 h-3.5" />
            <span>{isSyncing ? '동기화 중...' : '지금 즉시 올리기'}</span>
          </button>

          <button
            type="button"
            disabled={isSyncing || cleanPin.length !== 6}
            onClick={() => pullFromServer(cleanPin, false)}
            className="py-2.5 px-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-[0.98] disabled:opacity-50 text-zinc-800 dark:text-zinc-100 font-bold text-xs border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Icon name="download" className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isSyncing ? '동기화 중...' : '지금 즉시 가져오기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
