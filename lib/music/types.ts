/**
 * AI 음악 생성기 타입 정의
 */

// 음악 타입
export type MusicType = 'bgm' | 'sfx';

// 장르 (Web Audio 생성기와 동일)
export type MusicGenre = 'chiptune' | 'synthwave' | 'arcade' | 'ambient' | 'action';

// 무드 (Web Audio 생성기와 동일)
export type MusicMood = 'tense' | 'cheerful' | 'mysterious' | 'heroic';

// 길이 프리셋
export type MusicLength = 30 | 60 | 120; // seconds

// 음악 생성 파라미터
export interface MusicParams {
  type: MusicType;
  genre?: MusicGenre; // BGM일 때만
  mood?: MusicMood; // BGM일 때만
  length?: MusicLength; // BGM일 때만 (기본 30초)
  prompt: string; // 사용자 프롬프트 (자유 형식 또는 템플릿)
  [key: string]: string | number | undefined;
}

// 생성 결과
export interface MusicGenerationResult {
  success: boolean;
  audioUrl?: string; // Data URL (audio/mpeg 또는 audio/wav)
  audioData?: Uint8Array; // 바이너리 데이터
  duration?: number; // 초 단위
  format?: 'mp3' | 'wav';
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    timestamp: number;
    cost: number; // USD (예상)
  };
}

// API 사용량 기록
export interface MusicUsageRecord {
  timestamp: number;
  operation: 'bgm' | 'sfx';
  duration: number; // 초 단위
  estimatedCost: number; // USD
  cached: boolean;
}
