/**
 * 스프라이트 생성기 타입 정의
 */

// 스프라이트 타입
export type SpriteType = 'character' | 'enemy' | 'item' | 'effect' | 'ui' | 'background';

// 스타일
export type SpriteStyle =
  | 'pixel-art' // 픽셀 아트 (8-bit, 16-bit)
  | 'neon' // 네온 아케이드
  | 'retro' // 레트로 2D
  | 'minimalist' // 미니멀
  | 'cartoon'; // 카툰

// 색상 팔레트
export type ColorPalette =
  | 'neon-pink' // 핑크 네온
  | 'neon-cyan' // 시안 네온
  | 'neon-purple' // 보라 네온
  | 'neon-yellow' // 노랑 네온
  | 'neon-green' // 초록 네온
  | 'rainbow' // 무지개
  | 'monochrome' // 흑백
  | 'custom'; // 커스텀

// 크기 프리셋
export type SpriteSize = '16x16' | '32x32' | '64x64' | '128x128' | '256x256' | 'custom';

// 애니메이션 타입 (캐릭터/적)
export type CharacterAnimationType =
  | 'idle' // 대기
  | 'walk' // 걷기
  | 'run' // 달리기
  | 'jump' // 점프
  | 'attack' // 공격
  | 'death' // 사망
  | 'hit' // 피격
  | 'fly' // 비행 (비행 적)
  | 'swim' // 수영 (수중 적);

// 애니메이션 타입 (아이템)
export type ItemAnimationType =
  | 'idle' // 대기 (반짝임)
  | 'rotate' // 회전
  | 'bounce' // 튕김
  | 'float' // 부유
  | 'collect' // 수집됨
  | 'spawn'; // 생성

// 애니메이션 타입 (이펙트)
export type EffectAnimationType =
  | 'explosion' // 폭발
  | 'sparkle' // 반짝임
  | 'smoke' // 연기
  | 'fire' // 불
  | 'water' // 물
  | 'electric' // 전기
  | 'magic' // 마법
  | 'appear' // 등장
  | 'disappear'; // 사라짐

// 애니메이션 타입 (UI)
export type UIAnimationType =
  | 'pulse' // 맥박
  | 'glow' // 빛남
  | 'shake' // 흔들림
  | 'press' // 눌림
  | 'hover'; // 호버

// 애니메이션 타입 (배경)
export type BackgroundAnimationType =
  | 'scroll' // 스크롤
  | 'wave' // 파도
  | 'wind' // 바람
  | 'rain' // 비
  | 'snow'; // 눈

// 통합 애니메이션 타입
export type AnimationType =
  | CharacterAnimationType
  | ItemAnimationType
  | EffectAnimationType
  | UIAnimationType
  | BackgroundAnimationType
  | 'custom'; // 커스텀

// 스프라이트 생성 파라미터
export interface SpriteParams {
  type: SpriteType;
  style: SpriteStyle;
  palette: ColorPalette;
  size: SpriteSize;
  description: string; // 사용자 설명 (예: "검을 든 기사")
  frames?: number; // 애니메이션 프레임 수 (1-16)
  animation?: AnimationType;
  customAnimation?: string; // 커스텀 애니메이션 설명 (animation === 'custom'일 때)
  [key: string]: string | number | undefined;
}

// 생성 결과
export interface SpriteGenerationResult {
  success: boolean;
  imageUrl?: string; // Data URL
  imageData?: Uint8Array; // PNG 바이너리
  width?: number;
  height?: number;
  frames?: number;
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    timestamp: number;
    cost: number; // USD
  };
}

// 스프라이트시트 설정
export interface SpriteSheetConfig {
  frames: number;
  columns: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
}

// API 사용량 기록
export interface UsageRecord {
  timestamp: number;
  operation: 'sprite' | 'animation' | 'spritesheet';
  imageCount: number;
  estimatedCost: number; // USD
  cached: boolean;
}
