// ==============================================================================
// 🛡️ 건전한 수험생 커뮤니티를 위한 비속어 / 성적 표현 / 혐오 표현 필터
// ==============================================================================

// 대표적인 비속어 및 금칙어 목록 (공백 및 특수문자 변형 포함 매칭)
const BANNED_WORDS = [
  // 욕설 및 패드립
  '시발', '씨발', 'ㅅㅂ', 'ㅆㅂ', '개새끼', '개새', '개색기', '개샛기', '개련', '개년',
  '병신', 'ㅂㅅ', '븅신', '등신', '호구', '새끼', '새키', '쉐키',
  '지랄', 'ㅈㄹ', '염병', '옘병', '꺼져', '닥쳐', '미친놈', '미친년', '미친새끼',
  '엠창', '애미', '애비', '느금', '느개비', '니애미', '니애비', '맘충', '틀딱',

  // 성적 비속어 및 음란 표현
  '섹스', 'sex', '자지', '보지', 'ㅈㅈ', 'ㅂㅈ', '야동', '딸딸이', '자위',
  '사정', '발기', '걸레', '창녀', '노출', '콘돔', '성폭행', '강간', '음란',
  '떡치', '오르가즘', '젖꼭지', '음경', '음순', '질내', '조건만남',

  // 혐오 및 모욕
  '한남', '한녀', '일베', '메갈', '장애인새끼', '틀니', '벌레새끼', '죽어라', '자살해'
];

/**
 * 텍스트 정규화: 특수문자, 공백, 숫자 변형 제거 후 검사
 * 예: "씨  발", "ㅅ.ㅂ", "시-발", "존!나" 등 우회 시도 차단
 */
const normalizeText = (text = '') => {
  return String(text)
    .toLowerCase()
    .replace(/[^\uAC00-\uD7A3\u3131-\u318Ea-zA-Z]/g, '');
};

/**
 * 비속어 또는 부적절한 표현 포함 여부 검사
 * @param {string} text 검사할 문자열
 * @returns {boolean} 비속어 포함 시 true
 */
export const containsProfanity = (text = '') => {
  if (!text || typeof text !== 'string') return false;

  const raw = text.toLowerCase();
  const normalized = normalizeText(text);

  for (const word of BANNED_WORDS) {
    const normWord = normalizeText(word);
    if (!normWord) continue;

    // 1. 원본 텍스트 직접 매칭
    if (raw.includes(word)) return true;

    // 2. 특수문자/공백 제거된 정규화 텍스트 매칭
    if (normalized.includes(normWord)) return true;
  }

  return false;
};

/**
 * 비속어 마스킹 (필요 시 대체 표시)
 */
export const maskProfanity = (text = '') => {
  if (!text) return '';
  let result = String(text);
  for (const word of BANNED_WORDS) {
    const reg = new RegExp(word, 'gi');
    result = result.replace(reg, '*'.repeat(word.length));
  }
  return result;
};

export default {
  containsProfanity,
  maskProfanity
};
