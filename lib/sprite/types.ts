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

// 애니메이션 타입
export type AnimationType =
  | 'idle' // 대기
  | 'walk' // 걷기
  | 'run' // 달리기
  | 'jump' // 점프
  | 'attack' // 공격
  | 'death' // 사망
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
