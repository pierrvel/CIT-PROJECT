import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SUBJECT_META, DEFAULT_SUBJECT_PRESETS } from './constants/subjects';
import { DEFAULT_CHEERS } from './constants/lounge';
import { playChime, playSchoolBellSequence } from './utils/audio';
import { getSyncEndpoint, getFirebaseDbUrl } from './utils/env';

import Header from './components/common/Header';
import Toast from './components/common/Toast';
import VisualPulse from './components/common/VisualPulse';
import UndoPill from './components/common/UndoPill';

import SprintTab from './components/sprint/SprintTab';
import ExamPacer from './components/pacer/ExamPacer';
import LiveLounge from './components/lounge/LiveLounge';
import CalendarTab from './components/calendar/CalendarTab';

import BgModal from './components/modals/BgModal';
import SyncModal from './components/modals/SyncModal';
import GoalModal from './components/modals/GoalModal';
import PartEditModal from './components/modals/PartEditModal';
import SavePresetModal from './components/modals/SavePresetModal';
import ExamReportModal from './components/modals/ExamReportModal';
import ShareCardModal from './components/share/ShareCardModal';
import InstallModal from './components/modals/InstallModal';

export function App() {
  // 1. 네비게이션 & 환경 상태
  const [activeTab, setActiveTab] = useState('pacer'); // 'sprint' | 'pacer'
  // 테마 모드 상태: 'paper' (ClassSpace 감성 페이퍼) | 'dark' (클래식 다크) | 'light' (클래식 라이트)
  const [themeMode, setThemeMode] = useState(() => {
    const savedPaper = localStorage.getItem('dc_paper_theme');
    if (savedPaper === 'true') return 'paper';
    if (savedPaper === 'false') {
      const savedTheme = localStorage.getItem('dc_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    }
    return 'paper'; // 기본값: ClassSpace 감성 페이퍼 모드
  });

  const isPaperTheme = themeMode === 'paper';
  const isDarkMode = themeMode === 'dark';

  const setIsPaperTheme = (val) => {
    setThemeMode((prev) => {
      const nextPaper = typeof val === 'function' ? val(prev === 'paper') : val;
      if (nextPaper) return 'paper';
      const last = localStorage.getItem('dc_last_mode') || 'dark';
      return last === 'paper' ? 'dark' : last;
    });
  };

  const setIsDarkMode = (val) => {
    setThemeMode((prev) => {
      const nextDark = typeof val === 'function' ? val(prev === 'dark') : val;
      if (nextDark) return 'dark';
      return 'light';
    });
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 단일 통합 테마 동기화 (document.documentElement 'dark' 및 'theme-paper' 상호 배타적 관리)
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'paper') {
      root.classList.add('theme-paper');
      root.classList.remove('dark');
      localStorage.setItem('dc_paper_theme', 'true');
      localStorage.setItem('dc_theme', 'paper');
    } else if (themeMode === 'dark') {
      root.classList.remove('theme-paper');
      root.classList.add('dark');
      localStorage.setItem('dc_paper_theme', 'false');
      localStorage.setItem('dc_theme', 'dark');
      localStorage.setItem('dc_last_mode', 'dark');
    } else {
      root.classList.remove('theme-paper');
      root.classList.remove('dark');
      localStorage.setItem('dc_paper_theme', 'false');
      localStorage.setItem('dc_theme', 'light');
      localStorage.setItem('dc_last_mode', 'light');
    }
  }, [themeMode]);

  // 토스트 메시지 시스템
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // PWA (Progressive Web App) 설치 상태 및 이벤트 제어
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      showToast('🎉 듀얼코어 콕핏이 기기에 성공적으로 설치되었습니다!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showToast]);

  // 2. 글래스모피즘 & 배경화면 커스텀 상태
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('dc_bg_image') || null);
  const [dimOpacity, setDimOpacity] = useState(() => {
    const saved = localStorage.getItem('dc_dim_opacity');
    return saved !== null ? Number(saved) : 0.15;
  });
  const [blurAmount, setBlurAmount] = useState(() => {
    const saved = localStorage.getItem('dc_blur_amount');
    return saved !== null ? Number(saved) : 12;
  });
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (bgImage) {
      root.classList.add('has-custom-bg');
      try {
        localStorage.setItem('dc_bg_image', bgImage);
      } catch (e) {
        console.warn('[Cockpit] Failed to persist bgImage to localStorage:', e);
      }
    } else {
      root.classList.remove('has-custom-bg');
      localStorage.removeItem('dc_bg_image');
    }
  }, [bgImage]);

  useEffect(() => {
    localStorage.setItem('dc_dim_opacity', String(dimOpacity));
  }, [dimOpacity]);

  useEffect(() => {
    localStorage.setItem('dc_blur_amount', String(blurAmount));
  }, [blurAmount]);

  // 3. 6자리 PIN 클라우드 동기화 시스템 상태
  const [clientId] = useState(() => 'client_' + Math.random().toString(36).slice(2, 9));
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState(() => localStorage.getItem('dc_last_used_pin') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [customFirebaseUrl, setCustomFirebaseUrl] = useState(() => {
    return localStorage.getItem('dc_custom_firebase_url') || getFirebaseDbUrl();
  });
  const [showAdvancedSync, setShowAdvancedSync] = useState(false);

  useEffect(() => {
    if (customFirebaseUrl) {
      localStorage.setItem('dc_custom_firebase_url', customFirebaseUrl);
    } else {
      localStorage.removeItem('dc_custom_firebase_url');
    }
  }, [customFirebaseUrl]);

  // 실시간 자동 동기화 (Auto-Sync) 상태
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(() => {
    const saved = localStorage.getItem('dc_auto_sync');
    return saved !== null ? saved === 'true' : true;
  });
  const [autoSyncInterval, setAutoSyncInterval] = useState(() => {
    return Number(localStorage.getItem('dc_auto_interval')) || 3;
  });
  const [autoSyncStatus, setAutoSyncStatus] = useState('idle');
  const [lastSyncedTimeStr, setLastSyncedTimeStr] = useState('대기 중');
  const lastSyncedAtRef = useRef(0);
  const isSyncPausedByLocalRef = useRef(false);

  // 4. Sprint 플랜 상태
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('dc_goals_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const today = new Date();
    const d45 = new Date(today); d45.setDate(today.getDate() + 45);
    const d10 = new Date(today); d10.setDate(today.getDate() + 10);
    return [
      {
        id: 1, title: '수능특강 미적분', unit: '문제', totalAmount: 300,
        completedAmount: 140, deadline: d45.toISOString().split('T')[0],
        dailyCap: 15, prunedAmount: 0, strategyMode: 'normal', lastRecordDate: '오늘 14:20'
      },
      {
        id: 2, title: '수능완성 영어', unit: '강', totalAmount: 24,
        completedAmount: 4, deadline: d10.toISOString().split('T')[0],
        dailyCap: 1, prunedAmount: 0, strategyMode: 'normal', lastRecordDate: '오늘 11:05'
      }
    ];
  });
  const [newGoalModal, setNewGoalModal] = useState(false);
  const [newGoalForm, setNewGoalForm] = useState({
    title: '', unit: '문제', totalAmount: 100, completedAmount: 0,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], dailyCap: 15
  });
  const [inputDeltas, setInputDeltas] = useState({});

  useEffect(() => {
    localStorage.setItem('dc_goals_v2', JSON.stringify(goals));
  }, [goals]);

  // 4-1. 라이브 라운지 D-Day 응원 전광판 상태 (이전 예시 데이터 자동 필터링)
  const [cheerBoard, setCheerBoard] = useState(() => {
    const saved = localStorage.getItem('dualcore_cheer_board');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c) => c && !String(c.id).startsWith('cheer_default_'));
        }
      } catch (e) {}
    }
    return DEFAULT_CHEERS;
  });

  useEffect(() => {
    localStorage.setItem('dualcore_cheer_board', JSON.stringify(cheerBoard));
  }, [cheerBoard]);

  // 4-2. 2026~2027 입시 캘린더 맞춤 일정 & 관심 일정 상태
  const [customMilestones, setCustomMilestones] = useState(() => {
    const saved = localStorage.getItem('dualcore_custom_milestones');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('dualcore_custom_milestones', JSON.stringify(customMilestones));
  }, [customMilestones]);

  const [starredMilestoneIds, setStarredMilestoneIds] = useState(() => {
    const saved = localStorage.getItem('dualcore_starred_milestones');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('dualcore_starred_milestones', JSON.stringify(starredMilestoneIds));
  }, [starredMilestoneIds]);

  const [deletedMilestoneIds, setDeletedMilestoneIds] = useState(() => {
    const saved = localStorage.getItem('dualcore_deleted_milestones');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('dualcore_deleted_milestones', JSON.stringify(deletedMilestoneIds));
  }, [deletedMilestoneIds]);

  // 5. Exam Pacer: 순차 파이프라인 & 다중 프리셋 영구 저장 시스템
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('korean');

  const [subjectPresets, setSubjectPresets] = useState(() => {
    const saved = localStorage.getItem('dc_pacer_presets_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.korean && parsed.math && parsed.english && parsed.inquiry) {
          return {
            ...DEFAULT_SUBJECT_PRESETS,
            ...parsed
          };
        }
      } catch (e) {}
    }
    return DEFAULT_SUBJECT_PRESETS;
  });

  const currentSubjectPresets = subjectPresets[selectedSubjectKey] || DEFAULT_SUBJECT_PRESETS[selectedSubjectKey] || [];
  const [selectedPresetId, setSelectedPresetId] = useState(() => {
    return (subjectPresets['korean'] || DEFAULT_SUBJECT_PRESETS['korean'])[0].id;
  });

  const currentPreset = currentSubjectPresets.find(p => p.id === selectedPresetId) || currentSubjectPresets[0] || DEFAULT_SUBJECT_PRESETS[selectedSubjectKey][0];

  // 타이머 표시 모드 ('dual' | 'analog' | 'digital')
  const [timerDisplayMode, setTimerDisplayMode] = useState(() => {
    return localStorage.getItem('dc_timer_mode') || 'dual';
  });

  useEffect(() => {
    localStorage.setItem('dc_timer_mode', timerDisplayMode);
  }, [timerDisplayMode]);

  const subMeta = SUBJECT_META[selectedSubjectKey] || SUBJECT_META['korean'];
  const currentSubject = useMemo(() => ({
    id: selectedSubjectKey,
    name: subMeta?.name || '국어 영역',
    period: subMeta?.period || '1교시',
    startHour: subMeta?.startHour ?? 8,
    startMin: subMeta?.startMin ?? 40,
    startTimeStr: subMeta?.startTimeStr || '08:40',
    endTimeStr: subMeta?.endTimeStr || '10:00',
    totalMinutes: currentPreset?.totalMinutes || subMeta?.totalMinutes || 80,
    presetName: currentPreset?.name || '표준 프리셋',
    desc: subMeta?.desc || ''
  }), [selectedSubjectKey, subMeta, currentPreset]);

  const totalExamSeconds = currentSubject.totalMinutes * 60;

  // 파이프라인 파트 목록
  const [pipelineParts, setPipelineParts] = useState(() => {
    const parts = currentPreset?.parts || [];
    return parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes }));
  });
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(totalExamSeconds);
  const [partElapsed, setPartElapsed] = useState({}); // { [partId]: number }
  const [partStatus, setPartStatus] = useState({}); // { [partId]: 'pending' | 'active' | 'completed' }

  // 10분 전 알림 플래그 및 모달 상태
  const hasWarned10MinRef = useRef(false);
  const [isTimeEditModalOpen, setIsTimeEditModalOpen] = useState(false);
  const [editPartsTemp, setEditPartsTemp] = useState([]);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reviewMemo, setReviewMemo] = useState('');
  const [examHistory, setExamHistory] = useState(() => {
    const saved = localStorage.getItem('dc_exam_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 실모 성적 & 등급컷 트래커 상태
  const [scoreHistory, setScoreHistory] = useState(() => {
    const saved = localStorage.getItem('dualcore_score_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('dualcore_score_history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  // 타임 통계 대시보드 상태
  const [pacerSubView, setPacerSubView] = useState('timer'); // 'timer' | 'analytics'
  const [analyticsSubjectFilter, setAnalyticsSubjectFilter] = useState('all');
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [editingMemoText, setEditingMemoText] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // 5-1. Screen Wake Lock API
  const isWakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const wakeLockRef = useRef(null);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);

  const requestWakeLock = useCallback(async () => {
    if (!isWakeLockSupported || !wakeLockEnabled) return;
    try {
      if (wakeLockRef.current !== null && !wakeLockRef.current.released) return;
      const lock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = lock;
      setIsWakeLockActive(true);
      lock.addEventListener('release', () => {
        setIsWakeLockActive(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      console.warn('[WakeLock] Request failed:', err);
      setIsWakeLockActive(false);
      wakeLockRef.current = null;
    }
  }, [isWakeLockSupported, wakeLockEnabled]);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current !== null) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsWakeLockActive(false);
      }
    } catch (err) {
      console.warn('[WakeLock] Release error:', err);
    }
  }, []);

  useEffect(() => {
    if (isExamRunning && wakeLockEnabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isExamRunning, wakeLockEnabled, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isExamRunning && wakeLockEnabled) {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isExamRunning, wakeLockEnabled, requestWakeLock, releaseWakeLock]);

  const toggleWakeLock = async () => {
    if (!isWakeLockSupported) {
      showToast('현재 브라우저에서는 화면 꺼짐 방지(Wake Lock)를 지원하지 않습니다.', 'warn');
      return;
    }
    if (wakeLockEnabled) {
      setWakeLockEnabled(false);
      await releaseWakeLock();
      showToast('화면 꺼짐 방지가 꺼졌습니다.', 'info');
    } else {
      setWakeLockEnabled(true);
      if (isExamRunning) {
        await requestWakeLock();
      }
      showToast('화면 꺼짐 방지가 켜졌습니다. (시험 중 화면 켜짐 유지)', 'success');
    }
  };

  // 5-2. 독서실 무음 시각 플래시(Visual Pulse) 모드 & 볼륨 조절
  const [isMuteMode, setIsMuteMode] = useState(() => {
    const saved = localStorage.getItem('dc_pacer_mute');
    return saved !== null ? saved === 'true' : false;
  });
  const [pacerVolume, setPacerVolume] = useState(() => {
    const saved = localStorage.getItem('dc_pacer_volume');
    return saved !== null ? Number(saved) : 80;
  });
  const [visualFlash, setVisualFlash] = useState(null);
  const flashTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('dc_pacer_mute', isMuteMode);
  }, [isMuteMode]);

  useEffect(() => {
    localStorage.setItem('dc_pacer_volume', pacerVolume);
  }, [pacerVolume]);

  const toggleMuteMode = () => {
    setIsMuteMode((prev) => {
      const next = !prev;
      if (next) {
        showToast('🔇 독서실 무음 시각 플래시 모드가 켜졌습니다. 타종 시 화면 테두리가 점멸합니다.', 'info');
      } else {
        showToast('🔊 소리 모드가 켜졌습니다.', 'info');
      }
      return next;
    });
  };

  const triggerVisualFlash = useCallback((type) => {
    const messages = {
      start: '본령 타종 (시험 시작)',
      warning10m: '종료 10분 전입니다 (무음 모드)',
      end: '시험이 종료되었습니다'
    };
    const duration = type === 'end' ? 3200 : (type === 'warning10m' ? 2600 : 2000);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    setVisualFlash({ type, message: messages[type] || '타종 안내' });
    flashTimeoutRef.current = setTimeout(() => {
      setVisualFlash(null);
    }, duration);
  }, []);

  const triggerExamChime = useCallback((pattern) => {
    if (isMuteMode) {
      triggerVisualFlash(pattern);
      if (pattern === 'warning10m') {
        showToast('⏰ 종료 10분 전입니다 (무음 모드)', 'warn');
      } else if (pattern === 'end') {
        showToast('🏁 시험이 종료되었습니다', 'info');
      }
    } else {
      const volScale = pacerVolume / 100;
      playSchoolBellSequence(pattern, volScale);
      triggerVisualFlash(pattern);
      if (pattern === 'warning10m') {
        showToast('🔔 시험 종료 10분 전입니다! OMR 마킹을 점검하세요.', 'warn');
      }
    }
  }, [isMuteMode, pacerVolume, triggerVisualFlash, showToast]);

  // 5-3. 모의고사 페이지 이탈 방지 Guard: beforeunload
  useEffect(() => {
    if (!isExamRunning) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isExamRunning]);

  // 5-4. 파트 넘기기 실수 되돌리기: Undo Window (3초)
  const [undoState, setUndoState] = useState(null);
  const undoTimerRef = useRef(null);

  const triggerUndoWindow = useCallback((snapshot) => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    const totalDuration = 3000;
    const startTime = Date.now();

    setUndoState({
      snapshot,
      secondsLeft: 3,
      progress: 100
    });

    undoTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingSec = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
      const progressPct = Math.max(0, ((totalDuration - elapsed) / totalDuration) * 100);

      if (elapsed >= totalDuration) {
        clearInterval(undoTimerRef.current);
        undoTimerRef.current = null;
        setUndoState(null);
      } else {
        setUndoState((prev) => prev ? {
          ...prev,
          secondsLeft: remainingSec,
          progress: progressPct
        } : null);
      }
    }, 100);
  }, []);

  const handleUndoNextPart = useCallback(() => {
    if (!undoState || !undoState.snapshot) return;
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    const snap = undoState.snapshot;

    setCurrentPartIndex(snap.partIndex);

    setPartStatus((prev) => {
      const updated = { ...prev };
      updated[snap.prevPartId] = 'active';
      if (snap.nextPartId) {
        updated[snap.nextPartId] = 'pending';
      }
      return updated;
    });

    setPartElapsed((prev) => {
      const updated = { ...prev };
      if (snap.nextPartId) {
        const accidentalSec = updated[snap.nextPartId] || 0;
        updated[snap.nextPartId] = 0;
        updated[snap.prevPartId] = (updated[snap.prevPartId] || 0) + accidentalSec;
      }
      return updated;
    });

    if (snap.wasReportOpen) {
      setIsReportModalOpen(false);
      setIsExamRunning(true);
    }

    setUndoState(null);
    showToast(`↩️ '${snap.prevPartName}' 단계로 복구되었습니다. (전체 타이머 유지)`, 'info');
    if (!isMuteMode) playChime(600, 'sine', 0.08, pacerVolume / 100);
  }, [undoState, isMuteMode, pacerVolume, showToast]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearInterval(undoTimerRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  // 타이머 루프 (전체 카운트다운 + 현재 파트 누적 계측)
  useEffect(() => {
    let interval = null;
    if (isExamRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            triggerExamChime('end');
            setIsExamRunning(false);
            setIsReportModalOpen(true);
            return 0;
          }
          if (prev === 601 && !hasWarned10MinRef.current) {
            hasWarned10MinRef.current = true;
            triggerExamChime('warning10m');
          }
          return prev - 1;
        });

        if (pipelineParts[currentPartIndex]) {
          const activeId = pipelineParts[currentPartIndex].id;
          setPartElapsed((prev) => ({
            ...prev,
            [activeId]: (prev[activeId] || 0) + 1
          }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamRunning, currentPartIndex, pipelineParts, triggerExamChime]);

  // Exam Pacer 액션 핸들러
  const handleStartExam = useCallback(() => {
    triggerExamChime('start');
    setExamStarted(true);
    setIsExamRunning(true);
    setPartStatus((prev) => ({
      ...prev,
      [pipelineParts[currentPartIndex]?.id]: 'active'
    }));
    showToast(`본령 타종 완료! '${pipelineParts[0]?.name}' 풀이를 시작합니다.`, 'info');
  }, [currentPartIndex, pipelineParts, triggerExamChime, showToast]);

  const handlePauseExam = useCallback(() => {
    setIsExamRunning(false);
    if (!isMuteMode) playChime(440, 'triangle', 0.1, pacerVolume / 100);
  }, [isMuteMode, pacerVolume]);

  const handleResetExam = useCallback(() => {
    if (confirm('모의고사 진행 상황을 초기화하시겠습니까?')) {
      if (undoTimerRef.current) {
        clearInterval(undoTimerRef.current);
        undoTimerRef.current = null;
      }
      setUndoState(null);
      setIsExamRunning(false);
      setExamStarted(false);
      setCurrentPartIndex(0);
      setRemainingSeconds(currentSubject.totalMinutes * 60);
      setPartElapsed({});
      setPartStatus({});
      hasWarned10MinRef.current = false;
      if (!isMuteMode) playChime(300, 'sine', 0.1, pacerVolume / 100);
      showToast('시험이 초기화되었습니다.', 'info');
    }
  }, [currentSubject.totalMinutes, isMuteMode, pacerVolume, showToast]);

  const handleNextPart = useCallback(() => {
    const curPart = pipelineParts[currentPartIndex];
    if (!curPart) return;

    const isLastPart = currentPartIndex >= pipelineParts.length - 1;
    const nextPart = isLastPart ? null : pipelineParts[currentPartIndex + 1];

    triggerUndoWindow({
      partIndex: currentPartIndex,
      prevPartId: curPart.id,
      nextPartId: nextPart ? nextPart.id : null,
      prevPartName: curPart.name,
      nextPartName: isLastPart ? '시험 종료' : nextPart.name,
      wasReportOpen: isLastPart
    });

    setPartStatus((prev) => ({
      ...prev,
      [curPart.id]: 'completed'
    }));

    if (isLastPart) {
      triggerExamChime('end');
      setIsExamRunning(false);
      setIsReportModalOpen(true);
      showToast('수고하셨습니다! 시험이 종료되어 분석 리포트를 생성합니다.', 'success');
    } else {
      const nextIdx = currentPartIndex + 1;
      const nPart = pipelineParts[nextIdx];
      setCurrentPartIndex(nextIdx);
      setPartStatus((prev) => ({
        ...prev,
        [nPart.id]: 'active'
      }));
      if (!isMuteMode) playChime(950, 'sine', 0.08, pacerVolume / 100);
      showToast(`'${curPart.name}' 완료 ➔ '${nPart.name}' 타임어택 시작!`, 'info');
    }
  }, [currentPartIndex, pipelineParts, triggerUndoWindow, triggerExamChime, isMuteMode, pacerVolume, showToast]);

  // 키보드 단축키 연동
  useEffect(() => {
    if (activeTab !== 'pacer') return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        if (undoState) {
          e.preventDefault();
          handleUndoNextPart();
          return;
        }
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!examStarted) {
          handleStartExam();
        } else if (isExamRunning) {
          handleNextPart();
        } else {
          setIsExamRunning(true);
        }
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'ㅔ') {
        e.preventDefault();
        if (examStarted) {
          setIsExamRunning((prev) => !prev);
          if (!isMuteMode) playChime(isExamRunning ? 440 : 880, 'sine', 0.08, pacerVolume / 100);
        }
      } else if (e.key === 'Escape') {
        if (isReportModalOpen) setIsReportModalOpen(false);
        if (isTimeEditModalOpen) setIsTimeEditModalOpen(false);
        if (isSavePresetModalOpen) setIsSavePresetModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    examStarted,
    isExamRunning,
    undoState,
    handleUndoNextPart,
    handleStartExam,
    handleNextPart,
    isMuteMode,
    pacerVolume,
    isReportModalOpen,
    isTimeEditModalOpen,
    isSavePresetModalOpen
  ]);

  const movePartSequence = (index, direction) => {
    if (examStarted) return;
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= pipelineParts.length) return;

    const updated = [...pipelineParts];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setPipelineParts(updated);
    if (soundEnabled) playChime(750, 'sine', 0.05);
  };

  const handleSelectSubject = (newSubjectKey) => {
    if (examStarted && isExamRunning) {
      if (!confirm('시험이 진행 중입니다. 과목을 변경하면 시험이 초기화됩니다. 계속하시겠습니까?')) {
        return;
      }
    }
    setSelectedSubjectKey(newSubjectKey);
    const list = subjectPresets[newSubjectKey] || DEFAULT_SUBJECT_PRESETS[newSubjectKey] || [];
    const defaultP = list[0];
    setSelectedPresetId(defaultP.id);
    setPipelineParts(defaultP.parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes })));
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    setUndoState(null);
    setIsExamRunning(false);
    setExamStarted(false);
    setCurrentPartIndex(0);
    setRemainingSeconds(defaultP.totalMinutes * 60);
    setPartElapsed({});
    setPartStatus({});
    hasWarned10MinRef.current = false;
  };

  const handleSelectPreset = (newPresetId) => {
    if (examStarted && isExamRunning) {
      if (!confirm('시험이 진행 중입니다. 프리셋을 변경하면 시험이 초기화됩니다. 계속하시겠습니까?')) {
        return;
      }
    }
    const list = subjectPresets[selectedSubjectKey] || DEFAULT_SUBJECT_PRESETS[selectedSubjectKey] || [];
    const target = list.find(p => p.id === newPresetId);
    if (!target) return;

    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    setUndoState(null);
    setSelectedPresetId(newPresetId);
    setPipelineParts(target.parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes })));
    setIsExamRunning(false);
    setExamStarted(false);
    setCurrentPartIndex(0);
    setRemainingSeconds(target.totalMinutes * 60);
    setPartElapsed({});
    setPartStatus({});
    hasWarned10MinRef.current = false;
    if (!isMuteMode) playChime(850, 'sine', 0.08, pacerVolume / 100);
    showToast(`'${target.name}' 프리셋이 적용되었습니다.`, 'info');
  };

  const handleSaveNewPreset = () => {
    const name = newPresetName.trim() || `${currentSubject.name} 커스텀 전략`;
    const newPresetId = 'preset_' + Date.now();
    const newPreset = {
      id: newPresetId,
      name,
      totalMinutes: currentSubject.totalMinutes,
      isSystem: false,
      parts: pipelineParts.map((p, idx) => ({
        id: p.id || `p_${idx}`,
        name: p.name,
        targetMin: p.targetMinutes || p.targetMin,
        targetMinutes: p.targetMinutes || p.targetMin,
        desc: p.desc || ''
      }))
    };

    const currentList = subjectPresets[selectedSubjectKey] || DEFAULT_SUBJECT_PRESETS[selectedSubjectKey] || [];
    const updatedList = [...currentList, newPreset];
    const updatedPresets = {
      ...subjectPresets,
      [selectedSubjectKey]: updatedList
    };

    setSubjectPresets(updatedPresets);
    setSelectedPresetId(newPresetId);
    localStorage.setItem('dc_pacer_presets_v3', JSON.stringify(updatedPresets));
    setIsSavePresetModalOpen(false);
    setNewPresetName('');
    if (soundEnabled) playChime(920, 'sine', 0.12);
    showToast(`새 프리셋 '${name}'이 성공적으로 저장되었습니다!`, 'success');
  };

  const handleDeleteCurrentPreset = () => {
    if (currentPreset?.isSystem) {
      showToast('기본 제공 프리셋은 삭제할 수 없습니다.', 'warn');
      return;
    }

    if (confirm(`'${currentPreset.name}' 프리셋을 삭제하시겠습니까?`)) {
      const currentList = subjectPresets[selectedSubjectKey] || [];
      const updatedList = currentList.filter(p => p.id !== selectedPresetId);
      const updatedPresets = {
        ...subjectPresets,
        [selectedSubjectKey]: updatedList
      };

      setSubjectPresets(updatedPresets);
      localStorage.setItem('dc_pacer_presets_v3', JSON.stringify(updatedPresets));

      const fallbackPreset = updatedList[0] || DEFAULT_SUBJECT_PRESETS[selectedSubjectKey][0];
      setSelectedPresetId(fallbackPreset.id);
      setPipelineParts(fallbackPreset.parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes })));

      if (soundEnabled) playChime(500, 'sine', 0.1);
      showToast('프리셋이 삭제되었습니다.', 'info');
    }
  };

  const handleResetSubjectPresets = () => {
    if (confirm(`${currentSubject.name}의 모든 프리셋을 초기 기본값으로 복원하시겠습니까?`)) {
      const updatedPresets = {
        ...subjectPresets,
        [selectedSubjectKey]: DEFAULT_SUBJECT_PRESETS[selectedSubjectKey]
      };
      setSubjectPresets(updatedPresets);
      localStorage.setItem('dc_pacer_presets_v3', JSON.stringify(updatedPresets));

      const defaultPreset = DEFAULT_SUBJECT_PRESETS[selectedSubjectKey][0];
      setSelectedPresetId(defaultPreset.id);
      setPipelineParts(defaultPreset.parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes })));

      if (soundEnabled) playChime(700, 'sine', 0.1);
      showToast(`${currentSubject.name} 프리셋이 기본값으로 복원되었습니다.`, 'success');
    }
  };

  const openTimeEditModal = () => {
    setEditPartsTemp(pipelineParts.map(p => ({ ...p })));
    setIsTimeEditModalOpen(true);
  };

  const handlePartMinuteChange = (idx, newMinutes) => {
    const val = Math.max(1, Number(newMinutes) || 1);
    const updated = [...editPartsTemp];
    updated[idx].targetMinutes = val;

    const totalMinutes = currentSubject.totalMinutes;
    const lastIdx = updated.length - 1;

    if (idx !== lastIdx) {
      let sumOthers = 0;
      for (let i = 0; i < lastIdx; i++) {
        sumOthers += updated[i].targetMinutes;
      }
      const remainingForLast = totalMinutes - sumOthers;
      if (remainingForLast >= 1) {
        updated[lastIdx].targetMinutes = remainingForLast;
      }
    }
    setEditPartsTemp(updated);
  };

  const saveCustomTimePreset = () => {
    const total = editPartsTemp.reduce((acc, p) => acc + p.targetMinutes, 0);
    if (total !== currentSubject.totalMinutes) {
      showToast(`모든 파트 시간의 합이 총 시험 시간(${currentSubject.totalMinutes}분)과 일치해야 합니다.`, 'warn');
      return;
    }

    setPipelineParts(editPartsTemp);
    setIsTimeEditModalOpen(false);

    if (!currentPreset?.isSystem) {
      const list = subjectPresets[selectedSubjectKey] || [];
      const updatedList = list.map(p => {
        if (p.id === selectedPresetId) {
          return {
            ...p,
            parts: editPartsTemp.map(part => ({
              ...part,
              targetMin: part.targetMinutes,
              targetMinutes: part.targetMinutes
            }))
          };
        }
        return p;
      });
      const updatedPresets = { ...subjectPresets, [selectedSubjectKey]: updatedList };
      setSubjectPresets(updatedPresets);
      localStorage.setItem('dc_pacer_presets_v3', JSON.stringify(updatedPresets));
      showToast(`'${currentPreset.name}' 프리셋에 시간 배분이 반영되었습니다.`, 'success');
    } else {
      showToast('파이프라인에 시간이 적용되었습니다. 프리셋으로 저장하려면 [프리셋 저장]을 누르세요.', 'info');
    }

    if (soundEnabled) playChime(880, 'sine', 0.1);
  };

  const saveExamReport = () => {
    const totalElapsed = Object.values(partElapsed).reduce((a, b) => a + b, 0);
    const totalTarget = currentSubject.totalMinutes * 60;
    const totalDelta = totalElapsed - totalTarget;

    const padZero = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}`;

    const newReport = {
      id: `hist_${Date.now()}`,
      date: dateStr,
      subject: selectedSubjectKey,
      subjectName: currentSubject.name,
      presetName: currentPreset?.name || "표준 순서",
      totalTargetSec: totalTarget,
      totalActualSec: totalElapsed,
      totalDeltaSec: totalDelta,
      totalElapsed: totalElapsed,
      parts: pipelineParts.map((p) => {
        const actual = partElapsed[p.id] || 0;
        const target = (p.targetMinutes || p.targetMin || 10) * 60;
        return {
          id: p.id,
          name: p.name,
          targetSec: target,
          targetMinutes: p.targetMinutes || p.targetMin,
          actualSec: actual,
          actualSeconds: actual,
          deltaSec: actual - target,
          delta: actual - target,
          completed: partStatus[p.id] === 'completed'
        };
      }),
      partsResult: pipelineParts.map((p) => {
        const actual = partElapsed[p.id] || 0;
        const target = (p.targetMinutes || p.targetMin || 10) * 60;
        return {
          name: p.name,
          targetMinutes: p.targetMinutes || p.targetMin,
          actualSeconds: actual,
          delta: actual - target,
          completed: partStatus[p.id] === 'completed'
        };
      }),
      memo: reviewMemo
    };

    const updatedHistory = [newReport, ...examHistory].slice(0, 30);
    setExamHistory(updatedHistory);
    localStorage.setItem('dc_exam_history', JSON.stringify(updatedHistory));
    setIsReportModalOpen(false);
    setReviewMemo('');
    setPacerSubView('analytics');
    showToast('실전 복기 리포트가 성공적으로 저장되었습니다! 타임 통계 대시보드에 반영되었습니다.', 'success');
  };

  const handleUpdateMemo = (id, newMemo) => {
    const updated = examHistory.map(h => h.id === id ? { ...h, memo: newMemo } : h);
    setExamHistory(updated);
    localStorage.setItem('dc_exam_history', JSON.stringify(updated));
    setEditingMemoId(null);
    showToast('복기 메모가 수정되었습니다.', 'info');
  };

  const handleDeleteExamHistory = (id) => {
    if (confirm('해당 회차 모의고사 기록을 삭제하시겠습니까?')) {
      const updated = examHistory.filter(h => h.id !== id);
      setExamHistory(updated);
      localStorage.setItem('dc_exam_history', JSON.stringify(updated));
      showToast('회차 기록이 삭제되었습니다.', 'info');
    }
  };

  const handleClearAllHistory = () => {
    if (confirm('모든 누적 모의고사 통계 기록을 삭제하시겠습니까?')) {
      setExamHistory([]);
      localStorage.setItem('dc_exam_history', JSON.stringify([]));
      showToast('모든 기록이 초기화되었습니다.', 'info');
    }
  };

  const handleLoadSampleHistory = () => {
    const sampleData = [
      {
        id: "hist_1710000001",
        date: "2026-10-05 14:30",
        subject: "korean",
        subjectName: "국어 영역",
        presetName: "실전 전략 A (문학 선풀이형)",
        totalTargetSec: 4800,
        totalActualSec: 4690,
        totalDeltaSec: -110,
        totalElapsed: 4690,
        parts: [
          { name: "문학", targetSec: 1320, targetMinutes: 22, actualSec: 1200, actualSeconds: 1200, deltaSec: -120, delta: -120, completed: true },
          { name: "선택과목", targetSec: 780, targetMinutes: 13, actualSec: 810, actualSeconds: 810, deltaSec: +30, delta: +30, completed: true },
          { name: "독서", targetSec: 2100, targetMinutes: 35, actualSec: 2160, actualSeconds: 2160, deltaSec: +60, delta: +60, completed: true },
          { name: "마킹 및 검토", targetSec: 600, targetMinutes: 10, actualSec: 520, actualSeconds: 520, deltaSec: -80, delta: -80, completed: true }
        ],
        memo: "문학에서 시간 단축 성공했으나 독서 법경제 지문에서 1분 지체됨."
      },
      {
        id: "hist_1710000002",
        date: "2026-10-04 10:15",
        subject: "math",
        subjectName: "수학 영역",
        presetName: "실전 전략 B (비킬러 스피드런)",
        totalTargetSec: 6000,
        totalActualSec: 6100,
        totalDeltaSec: +100,
        totalElapsed: 6100,
        parts: [
          { name: "공통 비킬러 (스피드런)", targetSec: 1800, targetMinutes: 30, actualSec: 1710, actualSeconds: 1710, deltaSec: -90, delta: -90, completed: true },
          { name: "선택과목 (미적/기하/확통)", targetSec: 1080, targetMinutes: 18, actualSec: 1140, actualSeconds: 1140, deltaSec: +60, delta: +60, completed: true },
          { name: "준킬러·킬러 집중 공략", targetSec: 2400, targetMinutes: 40, actualSec: 2620, actualSeconds: 2620, deltaSec: +220, delta: +220, completed: true },
          { name: "철저한 단답형 재검토", targetSec: 720, targetMinutes: 12, actualSec: 630, actualSeconds: 630, deltaSec: -90, delta: -90, completed: true }
        ],
        memo: "22번 수열 귀납 추론에서 계산 꼬여 3분 초과됨. 과감히 넘기는 결단 필요."
      },
      {
        id: "hist_1710000003",
        date: "2026-10-02 16:40",
        subject: "english",
        subjectName: "영어 영역",
        presetName: "실전 전략 A (듣기 시간 독해 병행형)",
        totalTargetSec: 4200,
        totalActualSec: 4040,
        totalDeltaSec: -160,
        totalElapsed: 4040,
        parts: [
          { name: "듣기 + 하위 독해 병행", targetSec: 1200, targetMinutes: 20, actualSec: 1140, actualSeconds: 1140, deltaSec: -60, delta: -60, completed: true },
          { name: "독해 전반 (대의파악·도표)", targetSec: 1380, targetMinutes: 23, actualSec: 1320, actualSeconds: 1320, deltaSec: -60, delta: -60, completed: true },
          { name: "빈칸/순서/삽입 킬러 집중", targetSec: 1140, targetMinutes: 19, actualSec: 1110, actualSeconds: 1110, deltaSec: -30, delta: -30, completed: true },
          { name: "마킹 및 최종 검토", targetSec: 480, targetMinutes: 8, actualSec: 470, actualSeconds: 470, deltaSec: -10, delta: -10, completed: true }
        ],
        memo: "듣기 평가 중 안내문/도표 5문항 선풀이 전략 성공. 빈칸 34번에 안정적 4분 확보."
      }
    ];
    const merged = [...sampleData, ...examHistory];
    setExamHistory(merged);
    localStorage.setItem('dc_exam_history', JSON.stringify(merged));
    if (soundEnabled) playChime(950, 'sine', 0.12);
    showToast('샘플 모의고사 실전 기록 3회분이 추가되었습니다!', 'success');
  };

  // 6. 동기화 & 데이터 파이프라인
  const cleanPin = pinInput.trim().replace(/\D/g, '').slice(0, 6);

  const generateRandomPin = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setPinInput(random);
    if (soundEnabled) playChime(800, 'sine', 0.08);
  };

  const getSyncUrl = useCallback((pin) => {
    return getSyncEndpoint(pin, customFirebaseUrl);
  }, [customFirebaseUrl]);

  const pushToServer = useCallback(async (targetPin, isSilent = false) => {
    if (!targetPin || targetPin.length !== 6) return false;
    const now = Date.now();
    const syncPayload = {
      pin: targetPin, updatedAt: now, senderId: clientId, version: '2.4.0',
      data: {
        goals, selectedSubjectKey, selectedPresetId, subjectPresets, examHistory, scoreHistory, cheerBoard,
        customMilestones, starredMilestoneIds, deletedMilestoneIds,
        settings: { dimOpacity, blurAmount, isDarkMode }
      }
    };

    try {
      setAutoSyncStatus('syncing');
      const res = await fetch(getSyncUrl(targetPin), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      lastSyncedAtRef.current = now;
      setLastSyncedTimeStr(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setAutoSyncStatus('synced');
      localStorage.setItem('dc_last_used_pin', targetPin);
      if (!isSilent) {
        if (soundEnabled) playChime(920, 'sine', 0.15);
        showToast(`PIN [${targetPin}] 동기화 완료! 실시간 연동 중입니다.`, 'success');
        setIsSyncModalOpen(false);
      }
      return true;
    } catch (err) {
      console.warn('[AutoSync] Push error:', err);
      setAutoSyncStatus('error');
      if (!isSilent) showToast('동기화 서버 연결에 실패했습니다.', 'warn');
      return false;
    }
  }, [clientId, goals, selectedSubjectKey, selectedPresetId, subjectPresets, examHistory, scoreHistory, cheerBoard, customMilestones, starredMilestoneIds, deletedMilestoneIds, dimOpacity, blurAmount, isDarkMode, getSyncUrl, soundEnabled, showToast]);

  const pullFromServer = useCallback(async (targetPin, isSilent = true) => {
    if (!targetPin || targetPin.length !== 6) return false;
    try {
      if (!isSilent) setAutoSyncStatus('syncing');
      const res = await fetch(getSyncUrl(targetPin));
      if (!res.ok) return false;

      const cloudData = await res.json();
      if (!cloudData || !cloudData.data) return false;

      const serverTimestamp = Number(cloudData.updatedAt) || (cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : 0);
      if (cloudData.senderId === clientId || (serverTimestamp && serverTimestamp <= lastSyncedAtRef.current)) {
        return false;
      }

      isSyncPausedByLocalRef.current = true;
      if (cloudData.data.goals) setGoals(cloudData.data.goals);
      if (cloudData.data.subjectPresets) {
        setSubjectPresets(cloudData.data.subjectPresets);
        localStorage.setItem('dc_pacer_presets_v3', JSON.stringify(cloudData.data.subjectPresets));
      }
      if (cloudData.data.selectedPresetId) {
        setSelectedPresetId(cloudData.data.selectedPresetId);
      }
      if (cloudData.data.examHistory) setExamHistory(cloudData.data.examHistory);
      if (cloudData.data.scoreHistory && Array.isArray(cloudData.data.scoreHistory)) {
        setScoreHistory(cloudData.data.scoreHistory);
      }
      if (cloudData.data.cheerBoard && Array.isArray(cloudData.data.cheerBoard)) {
        const cleaned = cloudData.data.cheerBoard.filter((c) => c && !String(c.id).startsWith('cheer_default_'));
        setCheerBoard(cleaned);
      }
      if (cloudData.data.customMilestones && Array.isArray(cloudData.data.customMilestones)) {
        setCustomMilestones(cloudData.data.customMilestones);
      }
      if (cloudData.data.starredMilestoneIds && Array.isArray(cloudData.data.starredMilestoneIds)) {
        setStarredMilestoneIds(cloudData.data.starredMilestoneIds);
      }
      if (cloudData.data.deletedMilestoneIds && Array.isArray(cloudData.data.deletedMilestoneIds)) {
        setDeletedMilestoneIds(cloudData.data.deletedMilestoneIds);
      }
      if (cloudData.data.settings) {
        if (typeof cloudData.data.settings.dimOpacity === 'number') setDimOpacity(cloudData.data.settings.dimOpacity);
        if (typeof cloudData.data.settings.blurAmount === 'number') setBlurAmount(cloudData.data.settings.blurAmount);
        if (typeof cloudData.data.settings.isDarkMode === 'boolean') setIsDarkMode(cloudData.data.settings.isDarkMode);
      }

      setTimeout(() => { isSyncPausedByLocalRef.current = false; }, 600);
      lastSyncedAtRef.current = Math.max(lastSyncedAtRef.current, serverTimestamp);
      setLastSyncedTimeStr(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setAutoSyncStatus('synced');
      localStorage.setItem('dc_last_used_pin', targetPin);
      if (!isSilent) {
        if (soundEnabled) playChime(1050, 'triangle', 0.2);
        showToast('동기화 완료! 최신 데이터를 불러왔습니다.', 'success');
        setIsSyncModalOpen(false);
      }
      return true;
    } catch (err) {
      setAutoSyncStatus('error');
      return false;
    }
  }, [clientId, getSyncUrl, soundEnabled, showToast]);

  // 디바운스 자동 푸시 (800ms)
  const isInitialMountRef = useRef(true);
  const autoPushTimerRef = useRef(null);
  useEffect(() => {
    if (isInitialMountRef.current) { isInitialMountRef.current = false; return; }
    if (isSyncPausedByLocalRef.current) return;
    if (autoSyncEnabled && cleanPin.length === 6) {
      if (autoPushTimerRef.current) clearTimeout(autoPushTimerRef.current);
      autoPushTimerRef.current = setTimeout(() => pushToServer(cleanPin, true), 800);
    }
  }, [goals, examHistory, scoreHistory, subjectPresets, selectedPresetId, cheerBoard, customMilestones, starredMilestoneIds, deletedMilestoneIds, dimOpacity, blurAmount, isDarkMode, autoSyncEnabled, cleanPin, pushToServer]);

  // 자동 폴링 (N초 주기)
  useEffect(() => {
    if (!autoSyncEnabled || cleanPin.length !== 6) return;
    pullFromServer(cleanPin, true);
    const intervalId = setInterval(() => {
      if (!isSyncing && cleanPin.length === 6) pullFromServer(cleanPin, true);
    }, autoSyncInterval * 1000);
    return () => clearInterval(intervalId);
  }, [autoSyncEnabled, autoSyncInterval, cleanPin, isSyncing, pullFromServer]);

  // 전체화면 토글
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // 전체 시험 페이스 종합 오차 산출
  const overallPacing = useMemo(() => {
    let totalElapsedSoFar = 0;
    let totalTargetSoFar = 0;
    pipelineParts.forEach((p, idx) => {
      if (idx <= currentPartIndex) {
        const actual = partElapsed[p.id] || 0;
        const target = (p.targetMinutes || p.targetMin || 10) * 60;
        totalElapsedSoFar += actual;
        totalTargetSoFar += target;
      }
    });
    const delta = totalElapsedSoFar - totalTargetSoFar;
    return { delta, totalElapsedSoFar, totalTargetSoFar };
  }, [pipelineParts, currentPartIndex, partElapsed]);

  // 새 학습 목표 제출 핸들러
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalForm.title.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalForm.title.trim(),
      unit: newGoalForm.unit,
      totalAmount: Number(newGoalForm.totalAmount) || 100,
      completedAmount: Number(newGoalForm.completedAmount) || 0,
      deadline: newGoalForm.deadline,
      dailyCap: Number(newGoalForm.dailyCap) || 15,
      prunedAmount: 0,
      strategyMode: 'normal',
      lastRecordDate: '방금 등록됨'
    };
    setGoals((prev) => [...prev, newGoal]);
    setNewGoalModal(false);
    setNewGoalForm({
      title: '', unit: '문제', totalAmount: 100, completedAmount: 0,
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], dailyCap: 15
    });
    showToast(`'${newGoal.title}' 목표가 등록되었습니다.`, 'success');
  };

  // 정시 대학 역산 목표 -> Sprint 플래너 연계
  const handleGoToSprintWithGoal = (goalData) => {
    if (goalData) {
      setNewGoalForm((prev) => ({
        ...prev,
        title: goalData.title || prev.title,
        unit: goalData.unit || '문제',
        totalAmount: goalData.totalAmount || 100,
        dailyCap: goalData.dailyCap || 15
      }));
      setNewGoalModal(true);
    }
    setActiveTab('sprint');
    if (soundEnabled) playChime(640, 'sine', 0.05);
  };

  // 4-3. 공스타 감성 성적표 카드 모달 상태
  const [shareCardConfig, setShareCardConfig] = useState({
    isOpen: false,
    mode: 'single', // 'single' | 'overall'
    singleData: null,
    overallData: null
  });

  const handleOpenShareCard = useCallback(({ mode = 'single', singleData = null, overallData = null }) => {
    setShareCardConfig({
      isOpen: true,
      mode,
      singleData,
      overallData
    });
  }, []);

  return (
    <div className={`relative min-h-screen flex flex-col overflow-x-hidden ${isPaperTheme ? 'text-[#1f2c24]' : 'text-zinc-900 dark:text-zinc-100'} ${bgImage ? 'has-custom-bg' : ''} font-sans`}>
      {/* 고정 배경 레이어 (z-0) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* 1. 기본 베이스 톤 (페이퍼 / 라이트 / 다크) */}
        <div className={`absolute inset-0 transition-colors duration-500 ${isPaperTheme ? 'bg-[#f4f8f0]' : 'bg-zinc-50 dark:bg-zinc-950'}`} />

        {/* 2. 비페이퍼 모드 앰비언트 그라디언트 (커스텀 배경 이미지가 없을 때만) */}
        {!isPaperTheme && !bgImage && (
          <div
            className="absolute inset-0 opacity-60 dark:opacity-30 transition-all duration-700"
            style={{
              backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%)'
            }}
          />
        )}

        {/* 3. 커스텀 배경 이미지 */}
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 transform scale-105"
            style={{
              backgroundImage: `url(${bgImage})`,
              filter: `blur(${blurAmount}px)`
            }}
          />
        )}

        {/* 4. 어둡기 조절 오버레이 (Dim) - 배경 이미지가 있을 때 페이퍼 및 다크/라이트 모두 적용 */}
        {bgImage && (
          <div
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{ opacity: dimOpacity }}
          />
        )}
      </div>

      {/* 헤더 & 본문 래퍼 (relative z-10) */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* 헤더 */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        playChime={playChime}
        autoSyncStatus={autoSyncStatus}
        autoSyncEnabled={autoSyncEnabled}
        autoSyncInterval={autoSyncInterval}
        cleanPin={cleanPin}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenBg={() => setIsBgModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isPaperTheme={isPaperTheme}
        setIsPaperTheme={setIsPaperTheme}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* 메인 뷰 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'sprint' && (
          <SprintTab
            goals={goals}
            setGoals={setGoals}
            inputDeltas={inputDeltas}
            setInputDeltas={setInputDeltas}
            soundEnabled={soundEnabled}
            playChime={playChime}
            setNewGoalModal={setNewGoalModal}
            showToast={showToast}
          />
        )}

        {activeTab === 'lounge' && (
          <LiveLounge
            examHistory={examHistory}
            goals={goals}
            cheerBoard={cheerBoard}
            setCheerBoard={setCheerBoard}
            showToast={showToast}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            customMilestones={customMilestones}
            setCustomMilestones={setCustomMilestones}
            starredIds={starredMilestoneIds}
            setStarredIds={setStarredMilestoneIds}
            deletedMilestoneIds={deletedMilestoneIds}
            setDeletedMilestoneIds={setDeletedMilestoneIds}
            showToast={showToast}
          />
        )}

        {activeTab === 'pacer' && (
          <ExamPacer
            pacerSubView={pacerSubView}
            setPacerSubView={setPacerSubView}
            examHistory={examHistory}
            selectedSubjectKey={selectedSubjectKey}
            handleSelectSubject={handleSelectSubject}
            selectedPresetId={selectedPresetId}
            handleSelectPreset={handleSelectPreset}
            currentSubject={currentSubject}
            currentPreset={currentPreset}
            currentSubjectPresets={currentSubjectPresets}
            setNewPresetName={setNewPresetName}
            setIsSavePresetModalOpen={setIsSavePresetModalOpen}
            handleDeleteCurrentPreset={handleDeleteCurrentPreset}
            handleResetSubjectPresets={handleResetSubjectPresets}
            openTimeEditModal={openTimeEditModal}
            isMuteMode={isMuteMode}
            toggleMuteMode={toggleMuteMode}
            pacerVolume={pacerVolume}
            setPacerVolume={setPacerVolume}
            triggerExamChime={triggerExamChime}
            isWakeLockSupported={isWakeLockSupported}
            wakeLockEnabled={wakeLockEnabled}
            isWakeLockActive={isWakeLockActive}
            toggleWakeLock={toggleWakeLock}
            examStarted={examStarted}
            isExamRunning={isExamRunning}
            setIsExamRunning={setIsExamRunning}
            handleStartExam={handleStartExam}
            handleNextPart={handleNextPart}
            handleResetExam={handleResetExam}
            setIsReportModalOpen={setIsReportModalOpen}
            totalExamSeconds={totalExamSeconds}
            remainingSeconds={remainingSeconds}
            currentPartIndex={currentPartIndex}
            pipelineParts={pipelineParts}
            partElapsed={partElapsed}
            partStatus={partStatus}
            movePartSequence={movePartSequence}
            overallPacing={overallPacing}
            timerDisplayMode={timerDisplayMode}
            setTimerDisplayMode={setTimerDisplayMode}
            isDarkMode={isDarkMode}
            analyticsSubjectFilter={analyticsSubjectFilter}
            setAnalyticsSubjectFilter={setAnalyticsSubjectFilter}
            expandedHistoryId={expandedHistoryId}
            setExpandedHistoryId={setExpandedHistoryId}
            editingMemoId={editingMemoId}
            setEditingMemoId={setEditingMemoId}
            editingMemoText={editingMemoText}
            setEditingMemoText={setEditingMemoText}
            handleUpdateMemo={handleUpdateMemo}
            handleDeleteExamHistory={handleDeleteExamHistory}
            handleClearAllHistory={handleClearAllHistory}
            handleLoadSampleHistory={handleLoadSampleHistory}
            scoreHistory={scoreHistory}
            setScoreHistory={setScoreHistory}
            showToast={showToast}
            onGoToSprint={handleGoToSprintWithGoal}
            onOpenShareCard={handleOpenShareCard}
          />
        )}
      </main>
      </div>

      {/* 공통 오버레이 & 위젯 */}
      <Toast toasts={toasts} />
      <VisualPulse visualFlash={visualFlash} />
      <UndoPill
        undoState={undoState}
        onUndo={handleUndoNextPart}
        onClose={() => {
          if (undoTimerRef.current) clearInterval(undoTimerRef.current);
          setUndoState(null);
        }}
      />

      {/* 모달 팝업들 */}
      <BgModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        bgImage={bgImage}
        setBgImage={setBgImage}
        dimOpacity={dimOpacity}
        setDimOpacity={setDimOpacity}
        blurAmount={blurAmount}
        setBlurAmount={setBlurAmount}
        showToast={showToast}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        pinInput={pinInput}
        setPinInput={setPinInput}
        generateRandomPin={generateRandomPin}
        autoSyncEnabled={autoSyncEnabled}
        setAutoSyncEnabled={setAutoSyncEnabled}
        autoSyncInterval={autoSyncInterval}
        setAutoSyncInterval={setAutoSyncInterval}
        lastSyncedTimeStr={lastSyncedTimeStr}
        isSyncing={isSyncing}
        pushToServer={pushToServer}
        pullFromServer={pullFromServer}
      />

      <GoalModal
        isOpen={newGoalModal}
        onClose={() => setNewGoalModal(false)}
        newGoalForm={newGoalForm}
        setNewGoalForm={setNewGoalForm}
        onSubmit={handleCreateGoal}
      />

      <PartEditModal
        isOpen={isTimeEditModalOpen}
        onClose={() => setIsTimeEditModalOpen(false)}
        currentSubject={currentSubject}
        selectedSubjectKey={selectedSubjectKey}
        editPartsTemp={editPartsTemp}
        setEditPartsTemp={setEditPartsTemp}
        handlePartMinuteChange={handlePartMinuteChange}
        saveCustomTimePreset={saveCustomTimePreset}
        showToast={showToast}
      />

      <SavePresetModal
        isOpen={isSavePresetModalOpen}
        onClose={() => setIsSavePresetModalOpen(false)}
        currentSubject={currentSubject}
        newPresetName={newPresetName}
        setNewPresetName={setNewPresetName}
        pipelineParts={pipelineParts}
        handleSaveNewPreset={handleSaveNewPreset}
      />

      <ExamReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentSubject={currentSubject}
        pipelineParts={pipelineParts}
        partElapsed={partElapsed}
        partStatus={partStatus}
        reviewMemo={reviewMemo}
        setReviewMemo={setReviewMemo}
        saveExamReport={saveExamReport}
        onGoToGrader={() => {
          setPacerSubView('grader');
        }}
      />

      <ShareCardModal
        isOpen={shareCardConfig.isOpen}
        onClose={() => setShareCardConfig((prev) => ({ ...prev, isOpen: false }))}
        initialMode={shareCardConfig.mode}
        singleData={shareCardConfig.singleData}
        overallData={shareCardConfig.overallData}
        showToast={showToast}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => showToast('🎉 앱 설치가 완료되었습니다!', 'success')}
      />
    </div>
  );
}

export default App;
