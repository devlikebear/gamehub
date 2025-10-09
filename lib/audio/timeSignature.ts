/**
 * 박자 선택 시스템
 * 장르, 템포, 무드에 따라 적절한 박자를 자동 선택
 */

import type { Genre, Mood, TimeSignature } from './types';

/**
 * 장르/템포/무드 조합에 따라 박자 자동 선택
 *
 * @param genre - 음악 장르
 * @param tempo - BPM (60-180)
 * @param mood - 음악 분위기
 * @returns 선택된 박자
 */
export function selectTimeSignature(genre: Genre, tempo: number, mood: Mood): TimeSignature {
  // 1. Ambient + mysterious → 6/8 (흔들리는 미스테리)
  if (genre === 'ambient' && mood === 'mysterious') {
    return { beats: 6, unit: 8 };
  }

  // 2. Arcade/Chiptune + heroic + 빠른 템포 → 2/4 (행진곡)
  if ((genre === 'arcade' || genre === 'chiptune') && mood === 'heroic' && tempo >= 140) {
    return { beats: 2, unit: 4 };
  }

  // 3. Synthwave + cheerful → 6/8 (경쾌한 신스웨이브)
  if (genre === 'synthwave' && mood === 'cheerful') {
    return { beats: 6, unit: 8 };
  }

  // 4. 느린 템포 (< 90) + 우아한 장르 → 3/4 (우아한 왈츠)
  if (tempo < 90 && (genre === 'ambient' || genre === 'arcade')) {
    return { beats: 3, unit: 4 };
  }

  // 5. Chiptune + tense + 빠른 템포 → 3/4 (긴박한 왈츠)
  if (genre === 'chiptune' && mood === 'tense' && tempo >= 120) {
    return { beats: 3, unit: 4 };
  }

  // 6. 기본값: 4/4 (가장 일반적인 박자)
  return { beats: 4, unit: 4 };
}

/**
 * 박자에 따른 한 마디의 비트 수 계산
 *
 * @param timeSignature - 박자
 * @returns 한 마디의 비트 수
 */
export function getBeatsPerMeasure(timeSignature: TimeSignature): number {
  // 복합박자 (6/8, 9/8, 12/8) 처리
  if (timeSignature.unit === 8 && timeSignature.beats % 3 === 0) {
    // 6/8 = 2개의 점 4분음표 = 2비트
    // 9/8 = 3개의 점 4분음표 = 3비트
    return timeSignature.beats / 3;
  }

  // 단순박자 (2/4, 3/4, 4/4)
  return timeSignature.beats;
}

/**
 * 박자에 따른 강박/약박 패턴 생성
 *
 * @param timeSignature - 박자
 * @returns 강박 위치 배열 (true = 강박, false = 약박)
 */
export function getStrongBeatPattern(timeSignature: TimeSignature): boolean[] {
  const beats = timeSignature.beats;

  switch (`${beats}/${timeSignature.unit}`) {
    case '2/4':
      // 강-약
      return [true, false];

    case '3/4':
      // 강-약-약
      return [true, false, false];

    case '4/4':
      // 강-약-중강-약
      return [true, false, true, false];

    case '6/8':
      // 강-약-약-중강-약-약 (복합박자: 2개 그룹)
      return [true, false, false, true, false, false];

    default:
      // 기본값: 첫 박만 강박
      return Array.from({ length: beats }, (_, i) => i === 0);
  }
}

/**
 * 박자 정보를 문자열로 포맷
 *
 * @param timeSignature - 박자
 * @returns 박자 문자열 (예: "4/4", "6/8")
 */
export function formatTimeSignature(timeSignature: TimeSignature): string {
  return `${timeSignature.beats}/${timeSignature.unit}`;
}
