/**
 * 코드 진행 라이브러리
 * 장르/무드별 코드 진행 패턴과 코드 생성 로직
 */

import type {
  Genre,
  Mood,
  ChordProgressionName,
  ChordRoot,
  ChordType,
  Chord,
  ChordProgression,
} from './types';

// 음계 정의 (C = 0, C# = 1, ..., B = 11)
const NOTE_VALUES: Record<ChordRoot, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};

const NOTE_NAMES: ChordRoot[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 코드 타입별 음정 간격 (세미톤)
const CHORD_INTERVALS: Record<ChordType, number[]> = {
  major: [0, 4, 7], // C-E-G
  minor: [0, 3, 7], // C-Eb-G
  diminished: [0, 3, 6], // C-Eb-Gb
  augmented: [0, 4, 8], // C-E-G#
  dominant7: [0, 4, 7, 10], // C-E-G-Bb
  minor7: [0, 3, 7, 10], // C-Eb-G-Bb
  major7: [0, 4, 7, 11], // C-E-G-B
};

// 장르/무드별 코드 진행 매핑
export const PROGRESSION_MAP: Record<Genre, Record<Mood, ChordProgressionName>> = {
  chiptune: {
    tense: 'I-vi-IV-V', // 긴장감 있는 클래식
    cheerful: 'I-V-vi-IV', // 밝고 경쾌
    mysterious: 'i-bVII-bVI-V', // 마이너 미스테리
    heroic: 'I-IV-V-IV', // 영웅적 고전
  },
  synthwave: {
    tense: 'i-iv-i-V', // 마이너 긴장
    cheerful: 'I-V-vi-IV', // 경쾌한 신스웨이브
    mysterious: 'vi-IV-I-V', // 감성적 미스테리
    heroic: 'I-IV-V-IV', // 드라마틱
  },
  arcade: {
    tense: 'I-vi-IV-V', // 긴박한 아케이드
    cheerful: 'I-IV-V-IV', // 경쾌한 아케이드
    mysterious: 'I-bVII-IV-I', // 미스테리 던전
    heroic: 'I-IV-V-IV', // 보스 배틀
  },
  ambient: {
    tense: 'i-iv-i-V', // 어두운 분위기
    cheerful: 'I-V-vi-IV', // 평화로운
    mysterious: 'i-bVII-bVI-V', // 몽환적
    heroic: 'vi-IV-I-V', // 서사적
  },
};

/**
 * 로마 숫자 코드를 실제 코드로 변환
 */
function romanToChord(roman: string, key: ChordRoot): Chord {
  const keyValue = NOTE_VALUES[key];
  const isMinor = roman[0] === roman[0].toLowerCase();
  const romanUpper = roman.toUpperCase();

  // 로마 숫자를 음계 도수로 변환
  const degreeMap: Record<string, number> = {
    I: 0,
    II: 2,
    III: 4,
    IV: 5,
    V: 7,
    VI: 9,
    VII: 11,
    bVII: 10,
    bVI: 8,
    bIII: 3,
  };

  // bVII, bVI 같은 플랫 코드 처리
  let degree = 0;
  if (romanUpper.startsWith('B')) {
    // bVII, bVI
    const romanPart = romanUpper.slice(1);
    degree = degreeMap[`b${romanPart}`] ?? degreeMap[romanPart] ?? 0;
  } else {
    degree = degreeMap[romanUpper.replace(/[^IVX]/g, '')] ?? 0;
  }

  // 근음 계산
  const rootValue = (keyValue + degree) % 12;
  const root = NOTE_NAMES[rootValue];

  // 코드 타입 결정
  let type: ChordType = isMinor ? 'minor' : 'major';

  // dim, aug, 7 등의 특수 코드 타입
  if (roman.includes('dim')) {
    type = 'diminished';
  } else if (roman.includes('aug')) {
    type = 'augmented';
  } else if (roman.includes('7')) {
    type = isMinor ? 'minor7' : 'dominant7';
  }

  // MIDI 음표 번호 생성 (중간 옥타브 기준, C4 = 60)
  const baseNote = 60 + rootValue;
  const notes = CHORD_INTERVALS[type].map((interval) => baseNote + interval);

  return {
    root,
    type,
    notes,
  };
}

/**
 * 코드 진행 이름으로부터 코드 배열 생성
 */
export function createProgression(name: ChordProgressionName, key: ChordRoot = 'C'): ChordProgression {
  // 코드 진행 문자열을 개별 코드로 분리
  const romanChords = name.split('-');

  // 각 로마 숫자를 실제 코드로 변환
  const chords = romanChords.map((roman) => romanToChord(roman, key));

  return {
    name,
    chords,
    key,
    measures: chords.length,
  };
}

/**
 * 장르와 무드에 맞는 코드 진행 선택
 */
export function selectProgression(genre: Genre, mood: Mood, key: ChordRoot = 'C'): ChordProgression {
  const progressionName = PROGRESSION_MAP[genre][mood];
  return createProgression(progressionName, key);
}

/**
 * 코드의 구성음에서 스케일 생성 (멜로디 생성용)
 */
export function getScale(root: ChordRoot, type: ChordType): number[] {
  const rootValue = NOTE_VALUES[root];
  const baseNote = 60 + rootValue;

  // 메이저/마이너 스케일
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11, 12]; // C major scale
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10, 12]; // C minor scale

  const intervals = type === 'minor' || type === 'minor7' || type === 'diminished' ? minorIntervals : majorIntervals;

  return intervals.map((interval) => baseNote + interval);
}
