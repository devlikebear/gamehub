/**
 * Game Engine Constants
 *
 * 모든 게임에서 공통으로 사용하는 상수 값들을 정의합니다.
 */

// 네온 컬러 팔레트
export const NEON_COLORS = {
  PINK: '#ff10f0',
  CYAN: '#00f0ff',
  PURPLE: '#9d00ff',
  YELLOW: '#ffff00',
  GREEN: '#00ff00',
  WHITE: '#ffffff',
} as const;

// 게임 배경 색상
export const BACKGROUND_COLORS = {
  DARK: '#04040a',
  DARKER: '#050512',
  FIELD: '#08081a',
  FIELD_DARK: '#08081c',
  BLACK: '#000000',
} as const;

// 기본 폰트
export const FONTS = {
  PIXEL_LARGE: '22px "Press Start 2P"',
  PIXEL_MEDIUM: '16px "Press Start 2P"',
  PIXEL_SMALL: '12px "Press Start 2P"',
  PIXEL_TINY: '10px "Press Start 2P"',
} as const;

// 타이밍 (밀리초)
export const TIMING = {
  FRAME_TIME: 16.67, // 60 FPS
  SECOND: 1000,
} as const;

// 오버레이 설정
export const OVERLAY = {
  BACKGROUND: 'rgba(0, 0, 0, 0.6)',
  FADE_ALPHA: 0.55,
} as const;
