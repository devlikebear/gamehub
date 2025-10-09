/**
 * 곡 구조 확장 시스템
 * 기본 코드 진행을 4/8/16/32 마디로 확장
 */

import type { Chord, MeasureCount, ChordType } from './types';

/**
 * 기본 코드 진행을 목표 마디 수로 확장
 *
 * @param baseProgression - 기본 코드 진행 (보통 4마디)
 * @param targetMeasures - 목표 마디 수 (4, 8, 16, 32)
 * @returns 확장된 코드 배열
 */
export function expandToMeasures(baseProgression: Chord[], targetMeasures: MeasureCount): Chord[] {
  const baseMeasures = baseProgression.length;

  // 이미 목표 마디 수면 그대로 반환
  if (baseMeasures === targetMeasures) {
    return baseProgression;
  }

  switch (targetMeasures) {
    case 4:
      // 4마디: 기본 진행 그대로 또는 축소
      return baseProgression.slice(0, 4);

    case 8:
      // 8마디: A-A 구조 (같은 진행 2번)
      return [...baseProgression, ...baseProgression];

    case 16:
      // 16마디: A-A-B-A 구조
      // A: 기본 진행 (4마디)
      // B: 변형 진행 (4마디)
      const variation = createVariation(baseProgression);
      return [
        ...baseProgression, // A (4마디)
        ...baseProgression, // A (4마디)
        ...variation, // B (4마디)
        ...baseProgression, // A (4마디)
      ];

    case 32:
      // 32마디: Intro(2)-A(8)-B(8)-Bridge(6)-A(8)
      const intro = baseProgression.slice(0, 2);
      const variation32 = createVariation(baseProgression);
      const bridge = createBridge(baseProgression);

      return [
        ...intro, // Intro (2마디)
        ...baseProgression,
        ...baseProgression, // A section (8마디)
        ...variation32,
        ...variation32, // B section (8마디)
        ...bridge, // Bridge (6마디)
        ...baseProgression,
        ...baseProgression, // A section (8마디)
      ];

    default:
      return baseProgression;
  }
}

/**
 * 코드 진행의 변형 생성
 * 음악적으로 유사하지만 약간 다른 코드로 대체
 *
 * @param progression - 원본 코드 진행
 * @returns 변형된 코드 진행
 */
function createVariation(progression: Chord[]): Chord[] {
  return progression.map((chord, index) => {
    // 마지막 코드는 변형하지 않음 (해결감 유지)
    if (index === progression.length - 1) {
      return chord;
    }

    // 30% 확률로 변형
    if (Math.random() > 0.3) {
      return chord;
    }

    // 코드 타입 변형 (major ↔ minor)
    const variedType: ChordType = chord.type === 'major' ? 'minor' : chord.type === 'minor' ? 'major' : chord.type;

    // 구성음 재계산
    const intervals = getChordIntervals(variedType);
    const baseNote = chord.notes[0];
    const variedNotes = intervals.map((interval) => baseNote + interval);

    return {
      ...chord,
      type: variedType,
      notes: variedNotes,
    };
  });
}

/**
 * 브릿지 코드 진행 생성
 * 원본 진행에서 벗어난 새로운 코드로 구성
 *
 * @param progression - 원본 코드 진행
 * @returns 브릿지 코드 진행 (6마디)
 */
function createBridge(progression: Chord[]): Chord[] {
  // 원본의 vi 코드부터 시작 (상대 마이너)
  const firstChord = progression[0];
  const relativeMinorNote = firstChord.notes[0] + 9; // C → Am (9세미톤 위)

  // 브릿지 패턴: vi-IV-V-I (6마디로 확장)
  const bridgePattern = [
    relativeMinorNote, // vi
    relativeMinorNote, // vi (반복)
    firstChord.notes[0] + 5, // IV
    firstChord.notes[0] + 7, // V
    firstChord.notes[0] + 7, // V (반복)
    firstChord.notes[0], // I
  ];

  return bridgePattern.map((rootNote, index) => {
    // 마이너-메이저 교대
    const type: ChordType = index % 2 === 0 ? 'minor' : 'major';
    const intervals = getChordIntervals(type);

    return {
      root: firstChord.root,
      type,
      notes: intervals.map((interval) => rootNote + interval),
    };
  });
}

/**
 * 코드 타입에 따른 음정 간격 반환
 *
 * @param type - 코드 타입
 * @returns 음정 간격 배열 (세미톤)
 */
function getChordIntervals(type: ChordType): number[] {
  const intervals: Record<ChordType, number[]> = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    dominant7: [0, 4, 7, 10],
    minor7: [0, 3, 7, 10],
    major7: [0, 4, 7, 11],
  };

  return intervals[type];
}

/**
 * 템포와 길이로부터 적절한 마디 수 계산
 *
 * @param lengthSeconds - 곡 길이 (초)
 * @param tempo - BPM
 * @returns 권장 마디 수
 */
export function calculateMeasures(lengthSeconds: number, tempo: number): MeasureCount {
  // 한 마디의 길이 계산 (4/4 박자 기준, 4박)
  const secondsPerBeat = 60 / tempo;
  const secondsPerMeasure = secondsPerBeat * 4;
  const totalMeasures = Math.round(lengthSeconds / secondsPerMeasure);

  // 가장 가까운 표준 마디 수로 반올림
  if (totalMeasures <= 6) return 4;
  if (totalMeasures <= 12) return 8;
  if (totalMeasures <= 24) return 16;
  return 32;
}
