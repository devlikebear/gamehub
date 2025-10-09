/**
 * 오디오 생성 관련 타입 정의
 */

export type Genre = 'chiptune' | 'synthwave' | 'arcade' | 'ambient';
export type Mood = 'tense' | 'cheerful' | 'mysterious' | 'heroic';
export type SFXType = 'ui' | 'action' | 'collect' | 'status';

export interface BGMParams {
  genre: Genre;
  tempo: number; // BPM (60-180)
  length: number; // seconds (30-120)
  mood: Mood;
  [key: string]: string | number | string[] | undefined;
}

export interface SFXParams {
  sfxType: SFXType;
  style: 'simple' | 'fancy' | 'retro';
  duration: number; // seconds (0.1-2)
  [key: string]: string | number | string[] | undefined;
}

export interface AudioGenerationResult {
  blob: Blob;
  duration: number;
  sampleRate: number;
}
