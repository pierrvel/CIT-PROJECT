/**
 * 대입정보포털 어디가(adiga.kr) 정시 최종 등록자 공식 70% 컷(국수탐 백분위) 및
 * 메가스터디/대성마이맥/종로학원 실채점 정시 확정 배치표 기반 대학/학과 데이터베이스
 */

// 1. 대학 티어 정의 (7대 라인)
export const ADMISSION_TIERS = [
  {
    id: 'MYTHIC',
    name: 'MYTHIC (초극상위 메디컬)',
    shortName: '메디컬/초극상위',
    range: '상위 0.05% ~ 0.3%',
    minCum: 0,
    maxCum: 0.35,
    minPercentile: 98.5,
    color: 'from-rose-500/20 via-pink-500/10 to-amber-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
  },
  {
    id: 'DIAMOND',
    name: 'DIAMOND (서연고 최상위 & 치한약수)',
    shortName: '서연고 탑·치한약수',
    range: '상위 0.3% ~ 1.2%',
    minCum: 0.35,
    maxCum: 1.2,
    minPercentile: 96.0,
    color: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border-cyan-500/40 text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'PLATINUM',
    name: 'PLATINUM (연고대 일반 & 서성한 상위·계약과)',
    shortName: '연고대·서성한 상위',
    range: '상위 1.2% ~ 2.8%',
    minCum: 1.2,
    maxCum: 2.8,
    minPercentile: 93.5,
    color: 'from-purple-500/20 via-indigo-500/10 to-violet-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
  },
  {
    id: 'GOLD',
    name: 'GOLD (서성한 일반 & 중경외시 상위·이화여대)',
    shortName: '서성한·중경외시 상위',
    range: '상위 2.8% ~ 6.0%',
    minCum: 2.8,
    maxCum: 6.0,
    minPercentile: 89.5,
    color: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'SILVER',
    name: 'SILVER (중경외시 일반 & 건동홍·지거국 최상위)',
    shortName: '중경외시·건동홍',
    range: '상위 6.0% ~ 11.0%',
    minCum: 6.0,
    maxCum: 11.0,
    minPercentile: 84.5,
    color: 'from-blue-500/20 via-slate-500/10 to-zinc-500/20 border-zinc-400/40 text-zinc-700 dark:text-zinc-300',
    badgeBg: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30'
  },
  {
    id: 'BRONZE',
    name: 'BRONZE (국숭세단·인아단·주요 거점 국립대)',
    shortName: '국숭세단·지거국',
    range: '상위 11.0% ~ 20.0%',
    minCum: 11.0,
    maxCum: 20.0,
    minPercentile: 77.0,
    color: 'from-amber-600/20 via-yellow-600/10 to-stone-500/20 border-amber-500/40 text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
  },
  {
    id: 'CHALLENGER',
    name: 'CHALLENGER (광명상가·가톨릭·수도권 도약존)',
    shortName: '수도권·도약존',
    range: '상위 20.0% ~ 35.0%',
    minCum: 20.0,
    maxCum: 35.0,
    minPercentile: 65.0,
    color: 'from-slate-600/20 via-stone-600/10 to-neutral-600/20 border-stone-500/40 text-stone-600 dark:text-stone-400',
    badgeBg: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/30'
  }
];

// 2. 대학 및 학과별 공식 실채점 컷 DB (대교협 어디가 70% 컷 & 정시 배치 기준치)
export const UNIVERSITY_CUTOFFS = [
  // ==========================================
  // 🌟 MYTHIC (메디컬 & 초극상위)
  // ==========================================
  { id: 'snu_med', univ: '서울대', major: '의예과', track: 'med', cutPercentile: 99.6, cumPercent: 0.05, cutScore: 419, tier: 'MYTHIC', badge: '최고봉', note: '과탐 필수' },
  { id: 'yonsei_med', univ: '연세대', major: '의예과', track: 'med', cutPercentile: 99.4, cumPercent: 0.07, cutScore: 417, tier: 'MYTHIC', badge: '메이저의', note: '과탐' },
  { id: 'catholic_med', univ: '가톨릭대', major: '의예과', track: 'med', cutPercentile: 99.2, cumPercent: 0.09, cutScore: 415, tier: 'MYTHIC', badge: '메이저의', note: '과탐' },
  { id: 'skku_med', univ: '성균관대', major: '의예과', track: 'med', cutPercentile: 99.1, cumPercent: 0.10, cutScore: 414, tier: 'MYTHIC', badge: '메이저의', note: '과탐' },
  { id: 'korea_med', univ: '고려대', major: '의예과', track: 'med', cutPercentile: 99.0, cumPercent: 0.12, cutScore: 413, tier: 'MYTHIC', badge: '빅5의', note: '과탐' },
  { id: 'snu_dent', univ: '서울대', major: '치의학과', track: 'med', cutPercentile: 98.8, cumPercent: 0.18, cutScore: 410, tier: 'MYTHIC', badge: '치의예', note: '과탐 필수' },
  { id: 'yonsei_dent', univ: '연세대', major: '치의예과', track: 'med', cutPercentile: 98.6, cumPercent: 0.23, cutScore: 408, tier: 'MYTHIC', badge: '치의예', note: '과탐' },
  { id: 'khu_orient', univ: '경희대', major: '한의예과', track: 'med', cutPercentile: 98.3, cumPercent: 0.32, cutScore: 405, tier: 'MYTHIC', badge: '한의예', note: '자연/인문 분할' },

  // ==========================================
  // 💎 DIAMOND (서연고 최상위 & 약학/수의예)
  // ==========================================
  { id: 'snu_cs', univ: '서울대', major: '컴퓨터공학부', track: 'natural', cutPercentile: 98.2, cumPercent: 0.40, cutScore: 404, tier: 'DIAMOND', badge: '자연탑', note: '과탐 필수' },
  { id: 'snu_elec', univ: '서울대', major: '전기정보공학부', track: 'natural', cutPercentile: 98.0, cumPercent: 0.48, cutScore: 402, tier: 'DIAMOND', badge: '인기학과', note: '과탐 필수' },
  { id: 'snu_adv', univ: '서울대', major: '첨단융합학부', track: 'natural', cutPercentile: 97.7, cumPercent: 0.58, cutScore: 399, tier: 'DIAMOND', badge: '신설학과', note: '과탐 필수' },
  { id: 'snu_biz', univ: '서울대', major: '경영대학', track: 'humanities', cutPercentile: 97.5, cumPercent: 0.65, cutScore: 398, tier: 'DIAMOND', badge: '인문탑', note: '확통/미적' },
  { id: 'snu_econ', univ: '서울대', major: '경제학부', track: 'humanities', cutPercentile: 97.3, cumPercent: 0.70, cutScore: 397, tier: 'DIAMOND', badge: '대표학과', note: '상경계열' },
  { id: 'snu_pharm', univ: '서울대', major: '약학계열', track: 'med', cutPercentile: 97.8, cumPercent: 0.55, cutScore: 400, tier: 'DIAMOND', badge: '약학탑', note: '과탐 필수' },
  { id: 'snu_vet', univ: '서울대', major: '수의예과', track: 'med', cutPercentile: 97.2, cumPercent: 0.75, cutScore: 396, tier: 'DIAMOND', badge: '수의예', note: '과탐 필수' },
  { id: 'cau_pharm', univ: '중앙대', major: '약학부', track: 'med', cutPercentile: 97.0, cumPercent: 0.85, cutScore: 395, tier: 'DIAMOND', badge: '약학명문', note: '과탐' },
  { id: 'yonsei_ai', univ: '연세대', major: '인공지능융합대학', track: 'natural', cutPercentile: 96.8, cumPercent: 0.90, cutScore: 394, tier: 'DIAMOND', badge: 'AI선도', note: '미적/기하' },
  { id: 'korea_cyber', univ: '고려대', major: '스마트보안학부', track: 'natural', cutPercentile: 96.5, cumPercent: 0.98, cutScore: 393, tier: 'DIAMOND', badge: '계약학과', note: '미적/기하' },
  { id: 'korea_semi', univ: '고려대', major: '반도체공학과(SK)', track: 'natural', cutPercentile: 96.4, cumPercent: 1.05, cutScore: 392, tier: 'DIAMOND', badge: '대기업계약', note: '미적/기하' },
  { id: 'yonsei_biz', univ: '연세대', major: '경영학과', track: 'humanities', cutPercentile: 96.2, cumPercent: 1.15, cutScore: 391, tier: 'DIAMOND', badge: '경영명문', note: '상경계열' },

  // ==========================================
  // 🥇 PLATINUM (연고대 일반 & 서성한 상위·계약과)
  // ==========================================
  { id: 'korea_biz', univ: '고려대', major: '경영대학', track: 'humanities', cutPercentile: 95.8, cumPercent: 1.30, cutScore: 390, tier: 'PLATINUM', badge: '대표학과', note: '상경계열' },
  { id: 'yonsei_elec', univ: '연세대', major: '전기전자공학부', track: 'natural', cutPercentile: 95.6, cumPercent: 1.40, cutScore: 389, tier: 'PLATINUM', badge: '인기학과', note: '미적/기하' },
  { id: 'skku_semi', univ: '성균관대', major: '반도체시스템공학(삼성)', track: 'natural', cutPercentile: 95.5, cumPercent: 1.45, cutScore: 389, tier: 'PLATINUM', badge: '삼성계약', note: '장학혜택' },
  { id: 'korea_mech', univ: '고려대', major: '기계공학부', track: 'natural', cutPercentile: 95.0, cumPercent: 1.65, cutScore: 387, tier: 'PLATINUM', badge: '자연일반', note: '미적/기하' },
  { id: 'hanyang_auto', univ: '한양대', major: '미래자동차공학과', track: 'natural', cutPercentile: 94.8, cumPercent: 1.75, cutScore: 386, tier: 'PLATINUM', badge: '다이아7', note: '특성화과' },
  { id: 'skku_soft', univ: '성균관대', major: '소프트웨어학과', track: 'natural', cutPercentile: 94.6, cumPercent: 1.85, cutScore: 385, tier: 'PLATINUM', badge: 'SW특성화', note: '미적/기하' },
  { id: 'sogang_cs', univ: '서강대', major: '컴퓨터공학과', track: 'natural', cutPercentile: 94.4, cumPercent: 1.95, cutScore: 384, tier: 'PLATINUM', badge: '인기학과', note: '교차지원' },
  { id: 'sogang_biz', univ: '서강대', major: '경영학부', track: 'humanities', cutPercentile: 94.0, cumPercent: 2.15, cutScore: 383, tier: 'PLATINUM', badge: '서강경영', note: '상경계열' },
  { id: 'skku_global', univ: '성균관대', major: '글로벌경영학과', track: 'humanities', cutPercentile: 93.8, cumPercent: 2.30, cutScore: 382, tier: 'PLATINUM', badge: '글로벌리더', note: '인문상위' },
  { id: 'korea_kor', univ: '고려대', major: '국어국문/어문', track: 'humanities', cutPercentile: 93.5, cumPercent: 2.50, cutScore: 381, tier: 'PLATINUM', badge: '인문일반', note: '인문계열' },
  { id: 'yonsei_human', univ: '연세대', major: '인문학부/사학', track: 'humanities', cutPercentile: 93.4, cumPercent: 2.60, cutScore: 380, tier: 'PLATINUM', badge: '인문일반', note: '인문계열' },

  // ==========================================
  // 🥈 GOLD (서성한 일반 & 중경외시 상위·이화여대)
  // ==========================================
  { id: 'hanyang_data', univ: '한양대', major: '데이터사이언스학부', track: 'natural', cutPercentile: 93.2, cumPercent: 2.90, cutScore: 379, tier: 'GOLD', badge: '데이터', note: '미적/기하' },
  { id: 'hanyang_biz', univ: '한양대', major: '파이낸스경영학과', track: 'humanities', cutPercentile: 92.8, cumPercent: 3.20, cutScore: 378, tier: 'GOLD', badge: '특성화과', note: '상경계열' },
  { id: 'cau_ai', univ: '중앙대', major: 'AI학과 / 소프트웨어', track: 'natural', cutPercentile: 92.5, cumPercent: 3.40, cutScore: 377, tier: 'GOLD', badge: 'IT특성화', note: '미적/기하' },
  { id: 'sogang_human', univ: '서강대', major: '인문계열/어문', track: 'humanities', cutPercentile: 92.0, cumPercent: 3.70, cutScore: 376, tier: 'GOLD', badge: '인문일반', note: '인문계열' },
  { id: 'skku_human', univ: '성균관대', major: '인문과학계열', track: 'humanities', cutPercentile: 91.8, cumPercent: 3.90, cutScore: 375, tier: 'GOLD', badge: '인문일반', note: '인문계열' },
  { id: 'ewha_ai', univ: '이화여대', major: '인공지능학과', track: 'natural', cutPercentile: 91.5, cumPercent: 4.10, cutScore: 374, tier: 'GOLD', badge: '여대최고', note: '자연계열' },
  { id: 'cau_biz', univ: '중앙대', major: '경영학부(글로벌)', track: 'humanities', cutPercentile: 91.0, cumPercent: 4.40, cutScore: 373, tier: 'GOLD', badge: '인기학과', note: '상경계열' },
  { id: 'khu_cs', univ: '경희대', major: '컴퓨터공학과', track: 'natural', cutPercentile: 90.8, cumPercent: 4.60, cutScore: 372, tier: 'GOLD', badge: '인기학과', note: '미적/기하' },
  { id: 'uos_tax', univ: '서울시립대', major: '세무학과', track: 'humanities', cutPercentile: 90.5, cumPercent: 4.80, cutScore: 371, tier: 'GOLD', badge: '전통명문', note: '시립대간판' },
  { id: 'uos_cs', univ: '서울시립대', major: '전자전기컴퓨터공학', track: 'natural', cutPercentile: 90.2, cumPercent: 5.10, cutScore: 370, tier: 'GOLD', badge: '인기학과', note: '반값등록금' },
  { id: 'khu_biz', univ: '경희대', major: '경영학과', track: 'humanities', cutPercentile: 89.8, cumPercent: 5.50, cutScore: 368, tier: 'GOLD', badge: '대표학과', note: '상경계열' },
  { id: 'hufs_ld', univ: '한국외대', major: 'LD / LT학부', track: 'humanities', cutPercentile: 89.5, cumPercent: 5.80, cutScore: 367, tier: 'GOLD', badge: '외대간판', note: '외교통상' },

  // ==========================================
  // 🥉 SILVER (중경외시 일반 & 건동홍·지거국 최상위)
  // ==========================================
  { id: 'konkuk_smart', univ: '건국대', major: '스마트운행체/항공', track: 'natural', cutPercentile: 89.0, cumPercent: 6.30, cutScore: 366, tier: 'SILVER', badge: '특성화과', note: '자연계열' },
  { id: 'dongguk_police', univ: '동국대', major: '경찰행정학부', track: 'humanities', cutPercentile: 88.8, cumPercent: 6.50, cutScore: 365, tier: 'SILVER', badge: '전국탑', note: '경찰행정' },
  { id: 'konkuk_cs', univ: '건국대', major: '컴퓨터공학부', track: 'natural', cutPercentile: 88.5, cumPercent: 6.80, cutScore: 364, tier: 'SILVER', badge: '인기학과', note: '미적/기하' },
  { id: 'hongik_arch', univ: '홍익대', major: '건축학부(5년제)', track: 'natural', cutPercentile: 88.2, cumPercent: 7.10, cutScore: 363, tier: 'SILVER', badge: '전통명문', note: '홍익건축' },
  { id: 'ewha_human', univ: '이화여대', major: '인문통합/사회', track: 'humanities', cutPercentile: 88.0, cumPercent: 7.30, cutScore: 362, tier: 'SILVER', badge: '대표학부', note: '인문계열' },
  { id: 'uos_urban', univ: '서울시립대', major: '도시공학과/조경', track: 'natural', cutPercentile: 87.6, cumPercent: 7.70, cutScore: 361, tier: 'SILVER', badge: '도시명문', note: '자연계열' },
  { id: 'konkuk_biz', univ: '건국대', major: '경영학과', track: 'humanities', cutPercentile: 87.2, cumPercent: 8.10, cutScore: 359, tier: 'SILVER', badge: '상경계열', note: '인문상위' },
  { id: 'dongguk_cs', univ: '동국대', major: 'AI융합 / 컴퓨터', track: 'natural', cutPercentile: 87.0, cutScore: 358, cumPercent: 8.30, tier: 'SILVER', badge: '인기학과', note: '자연계열' },
  { id: 'hongik_biz', univ: '홍익대', major: '경영학부', track: 'humanities', cutPercentile: 86.5, cumPercent: 8.80, cutScore: 356, tier: 'SILVER', badge: '대표학부', note: '인문계열' },
  { id: 'pnu_mech', univ: '부산대', major: '기계공학부', track: 'natural', cutPercentile: 86.0, cumPercent: 9.30, cutScore: 354, tier: 'SILVER', badge: '지거국간판', note: '전통공대' },
  { id: 'knu_elec', univ: '경북대', major: '전자공학부', track: 'natural', cutPercentile: 85.8, cumPercent: 9.60, cutScore: 353, tier: 'SILVER', badge: '지거국간판', note: '삼성협약' },
  { id: 'sookmyung_biz', univ: '숙명여대', major: '경영학부', track: 'humanities', cutPercentile: 85.0, cumPercent: 10.4, cutScore: 350, tier: 'SILVER', badge: '인기학과', note: '인문상위' },

  // ==========================================
  // 🥉 BRONZE (국숭세단·인아단·지거국 주요학과)
  // ==========================================
  { id: 'ssu_cs', univ: '숭실대', major: '소프트웨어 / AI', track: 'natural', cutPercentile: 84.5, cumPercent: 11.2, cutScore: 348, tier: 'BRONZE', badge: 'SW명문', note: '숭실컴공' },
  { id: 'kookmin_auto', univ: '국민대', major: '자동차융합대학', track: 'natural', cutPercentile: 84.0, cumPercent: 11.8, cutScore: 346, tier: 'BRONZE', badge: '국민간판', note: '현대차협력' },
  { id: 'inha_mech', univ: '인하대', major: '기계 / 항공우주', track: 'natural', cutPercentile: 83.5, cumPercent: 12.5, cutScore: 344, tier: 'BRONZE', badge: '공대명문', note: '자연계열' },
  { id: 'ajou_elec', univ: '아주대', major: '전자공학 / SW', track: 'natural', cutPercentile: 83.0, cumPercent: 13.0, cutScore: 342, tier: 'BRONZE', badge: 'IT명문', note: '자연계열' },
  { id: 'sejong_hotel', univ: '세종대', major: '호텔관광외식경영', track: 'humanities', cutPercentile: 82.5, cumPercent: 13.7, cutScore: 340, tier: 'BRONZE', badge: '전국탑', note: '호텔경영' },
  { id: 'sejong_ai', univ: '세종대', major: '지능기전공학부', track: 'natural', cutPercentile: 82.0, cumPercent: 14.3, cutScore: 338, tier: 'BRONZE', badge: '특성화과', note: '자연계열' },
  { id: 'kookmin_biz', univ: '국민대', major: '경영학부', track: 'humanities', cutPercentile: 81.5, cumPercent: 15.0, cutScore: 336, tier: 'BRONZE', badge: '대표학부', note: '인문계열' },
  { id: 'ssu_biz', univ: '숭실대', major: '경영학부 / 벤처', track: 'humanities', cutPercentile: 81.0, cumPercent: 15.6, cutScore: 334, tier: 'BRONZE', badge: '대표학부', note: '인문계열' },
  { id: 'dankook_cs', univ: '단국대(죽전)', major: '컴퓨터공학과', track: 'natural', cutPercentile: 80.0, cumPercent: 16.8, cutScore: 330, tier: 'BRONZE', badge: '인기학과', note: '수도권캠' },
  { id: 'dankook_biz', univ: '단국대(죽전)', major: '경영학부', track: 'humanities', cutPercentile: 79.0, cumPercent: 18.0, cutScore: 326, tier: 'BRONZE', badge: '상경계열', note: '수도권캠' },
  { id: 'pnu_human', univ: '부산대', major: '인문/사회과학', track: 'humanities', cutPercentile: 78.0, cumPercent: 19.2, cutScore: 323, tier: 'BRONZE', badge: '지거국일반', note: '지역인재' },

  // ==========================================
  // 🏅 CHALLENGER (광운/명지/상명/가톨릭/수도권 도약존)
  // ==========================================
  { id: 'kw_elec', univ: '광운대', major: '전자공학과', track: 'natural', cutPercentile: 76.5, cumPercent: 21.0, cutScore: 318, tier: 'CHALLENGER', badge: '전자명문', note: '광운전자' },
  { id: 'kw_cs', univ: '광운대', major: '소프트웨어학부', track: 'natural', cutPercentile: 75.0, cumPercent: 22.8, cutScore: 314, tier: 'CHALLENGER', badge: 'SW중심', note: '자연계열' },
  { id: 'erica_robot', univ: '한양대(ERICA)', major: '로봇공학과', track: 'natural', cutPercentile: 74.0, cumPercent: 24.2, cutScore: 310, tier: 'CHALLENGER', badge: '특성화과', note: '안산캠' },
  { id: 'catholic_biz', univ: '가톨릭대', major: '경영학부', track: 'humanities', cutPercentile: 72.0, cumPercent: 26.5, cutScore: 304, tier: 'CHALLENGER', badge: '수도권', note: '인문계열' },
  { id: 'mju_biz', univ: '명지대', major: '경영정보 / 경영', track: 'humanities', cutPercentile: 70.0, cumPercent: 28.5, cutScore: 298, tier: 'CHALLENGER', badge: '수도권', note: '인문계열' },
  { id: 'smu_cs', univ: '상명대', major: '융합소프트웨어', track: 'natural', cutPercentile: 68.0, cumPercent: 30.5, cutScore: 292, tier: 'CHALLENGER', badge: '서울캠', note: '자연계열' },
  { id: 'cnu_mech', univ: '충남대', major: '기계공학부', track: 'natural', cutPercentile: 66.0, cumPercent: 32.5, cutScore: 286, tier: 'CHALLENGER', badge: '충청거점', note: '국립대' },
  { id: 'jnu_elec', univ: '전남대', major: '전자컴퓨터공학', track: 'natural', cutPercentile: 65.0, cumPercent: 34.0, cutScore: 282, tier: 'CHALLENGER', badge: '호남거점', note: '국립대' }
];

export const TRACK_OPTIONS = [
  { key: 'all', label: '전체 계열' },
  { key: 'natural', label: '자연계열 (이과/공대)' },
  { key: 'humanities', label: '인문계열 (문과/상경)' },
  { key: 'med', label: '의약학 (의치한약수)' }
];
