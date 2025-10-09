/**
 * 오디오 생성 관련 타입 정의
 */

export type Genre = 'chiptune' | 'synthwave' | 'arcade' | 'ambient';
export type Mood = 'tense' | 'cheerful' | 'mysterious' | 'heroic';
export type SFXType = 'ui' | 'action' | 'collect' | 'status';

// 코드 시스템
export type ChordType = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'minor7' | 'major7';
export type ChordRoot = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface Chord {
  root: ChordRoot;
  type: ChordType;
  notes: number[]; // MIDI 음표 번호 (60 = middle C)
}

// 코드 진행
export type ChordProgressionName =
  | 'I-V-vi-IV' // 대중적 (C-G-Am-F)
  | 'I-IV-V-IV' // 고전 록 (C-F-G-F)
  | 'vi-IV-I-V' // 감성적 (Am-F-C-G)
  | 'I-vi-IV-V' // 50년대 (C-Am-F-G)
  | 'ii-V-I' // 재즈 (Dm-G-C)
  | 'I-bVII-IV-I' // 미스테리 (C-Bb-F-C)
  | 'i-iv-i-V' // 마이너 긴장 (Am-Dm-Am-E)
  | 'i-bVII-bVI-V'; // 마이너 미스테리 (Am-G-F-E)

export interface ChordProgression {
  name: ChordProgressionName;
  chords: Chord[];
  key: ChordRoot;
  measures: number; // 진행이 몇 마디인지
}

// 박자
export interface TimeSignature {
  beats: 2 | 3 | 4 | 6; // 분자 (한 마디의 박자 수)
  unit: 4 | 8; // 분모 (기준 음표)
}

// 곡 구조
export type MeasureCount = 4 | 8 | 16 | 32;

// BGM 파라미터 (UI 및 캐시용)
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
