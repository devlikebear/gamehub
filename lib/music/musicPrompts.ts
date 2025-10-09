/**
 * AI 음악 생성 프롬프트 템플릿 시스템
 */

import type { MusicGenre, MusicMood, MusicLength, MusicType } from './types';

// 장르별 기본 설명
const GENRE_DESCRIPTIONS: Record<MusicGenre, string> = {
  chiptune:
    '8-bit retro arcade game music, upbeat chiptune melody with square wave and triangle wave sounds, nostalgic 80s video game style',
  synthwave:
    '80s synthwave with neon atmosphere, analog synthesizers with dreamy pads and arpeggiated basslines, retro-futuristic vibe',
  arcade:
    'energetic rock music for arcade games, electric guitar riffs with driving drums and bass, upbeat and exciting',
  ambient:
    'atmospheric ambient music with ethereal pads and gentle synths, calm and peaceful soundscape, perfect for exploration',
  action:
    'intense action music with fast tempo, dramatic orchestral elements or electronic beats, heroic and epic theme',
};

// 무드별 수식어
const MOOD_MODIFIERS: Record<MusicMood, string> = {
  tense: 'tense, suspenseful, dark, ominous atmosphere',
  cheerful: 'cheerful, upbeat, energetic, playful and fun',
  mysterious: 'mysterious, enigmatic, ethereal, otherworldly',
  heroic: 'heroic, epic, triumphant, grand and inspiring',
};

// 길이 및 구조
const LENGTH_SPECS: Record<MusicLength, string> = {
  30: '30 second seamless loop, perfect for menu or background music',
  60: '60 second game BGM with intro and main theme',
  120: '2 minute boss battle music with buildup and climax',
};

// 효과음 프리셋
export const SFX_PRESETS = [
  {
    value: 'jump',
    label: '점프',
    prompt: 'retro game jump sound effect, 8-bit style, short and bouncy',
  },
  {
    value: 'laser',
    label: '레이저',
    prompt: 'sci-fi laser shot sound, arcade game style, pew pew sound',
  },
  {
    value: 'coin',
    label: '코인 수집',
    prompt: 'coin collection sound, cheerful chime, short and pleasant',
  },
  {
    value: 'explosion',
    label: '폭발',
    prompt: 'retro game explosion sound, 8-bit style, dramatic impact',
  },
  {
    value: 'powerup',
    label: '파워업',
    prompt: 'power-up sound effect, ascending chiptune melody, victorious feel',
  },
  {
    value: 'hit',
    label: '타격',
    prompt: 'hit impact sound, arcade fighting game style, punchy',
  },
  {
    value: 'menu',
    label: '메뉴 선택',
    prompt: 'UI menu selection sound, simple beep, retro game interface',
  },
  {
    value: 'gameover',
    label: '게임 오버',
    prompt: 'game over jingle, descending melody, sad and final',
  },
];

/**
 * BGM 프롬프트 생성
 */
export function buildBGMPrompt(
  genre: MusicGenre,
  mood: MusicMood,
  length: MusicLength,
  customPrompt?: string
): string {
  if (customPrompt && customPrompt.trim().length > 0) {
    // 사용자 커스텀 프롬프트
    return customPrompt.trim();
  }

  // 템플릿 기반 프롬프트
  const genreDesc = GENRE_DESCRIPTIONS[genre];
  const moodModifier = MOOD_MODIFIERS[mood];
  const lengthSpec = LENGTH_SPECS[length];

  return `${genreDesc}. ${moodModifier}. ${lengthSpec}. High quality game music.`;
}

/**
 * 효과음 프롬프트 생성
 */
export function buildSFXPrompt(customPrompt?: string): string {
  if (customPrompt && customPrompt.trim().length > 0) {
    return customPrompt.trim();
  }

  // 기본 효과음
  return 'retro arcade game sound effect, 8-bit style, short and impactful';
}

/**
 * 프롬프트 검증
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: '프롬프트를 입력해주세요.' };
  }

  if (prompt.length > 500) {
    return { valid: false, error: '프롬프트는 500자 이하로 입력해주세요.' };
  }

  return { valid: true };
}

/**
 * 프롬프트 미리보기 생성
 */
export function getPromptPreview(
  type: MusicType,
  genre?: MusicGenre,
  mood?: MusicMood,
  length?: MusicLength
): string {
  if (type === 'sfx') {
    return '효과음 예시: "retro game jump sound effect, 8-bit style, short and bouncy"';
  }

  if (!genre || !mood || !length) {
    return 'BGM 예시: 장르, 무드, 길이를 선택하면 자동 생성된 프롬프트를 확인할 수 있습니다.';
  }

  return buildBGMPrompt(genre, mood, length);
}
