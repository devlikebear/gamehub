/**
 * 멜로디 생성기
 * 코드 진행에 맞는 자연스러운 멜로디 생성
 */

import type { Chord, Genre, TimeSignature } from './types';
import { getScale } from './chordProgressions';
import { getStrongBeatPattern } from './timeSignature';

/**
 * 음표 이벤트 (음높이 + 길이)
 */
export interface NoteEvent {
  pitch: number; // MIDI 음표 번호
  duration: number; // 길이 (박자 단위, 1 = 4분음표)
}

// 장르별 사용 가능한 음표 길이 풀
const NOTE_DURATIONS: Record<Genre, number[]> = {
  chiptune: [0.25, 0.5, 0.75, 1, 1.5, 2], // 16분음표 ~ 2분음표
  synthwave: [0.5, 0.75, 1, 1.5, 2, 3], // 8분음표 ~ 점2분음표
  arcade: [0.25, 0.5, 0.75, 1, 1.5], // 16분음표 ~ 점4분음표
  ambient: [1, 1.5, 2, 3, 4], // 4분음표 ~ 온음표
};

// 장르별 음표 길이 확률 분포
const DURATION_WEIGHTS: Record<Genre, Record<number, number>> = {
  chiptune: {
    0.25: 0.1, // 16분음표: 10%
    0.5: 0.3, // 8분음표: 30%
    0.75: 0.1, // 점8분음표: 10%
    1: 0.3, // 4분음표: 30%
    1.5: 0.1, // 점4분음표: 10%
    2: 0.1, // 2분음표: 10%
  },
  synthwave: {
    0.5: 0.25, // 8분음표: 25%
    0.75: 0.1, // 점8분음표: 10%
    1: 0.2, // 4분음표: 20%
    1.5: 0.15, // 점4분음표: 15%
    2: 0.2, // 2분음표: 20%
    3: 0.1, // 점2분음표: 10%
  },
  arcade: {
    0.25: 0.15, // 16분음표: 15%
    0.5: 0.35, // 8분음표: 35%
    0.75: 0.15, // 점8분음표: 15%
    1: 0.25, // 4분음표: 25%
    1.5: 0.1, // 점4분음표: 10%
  },
  ambient: {
    1: 0.2, // 4분음표: 20%
    1.5: 0.2, // 점4분음표: 20%
    2: 0.3, // 2분음표: 30%
    3: 0.2, // 점2분음표: 20%
    4: 0.1, // 온음표: 10%
  },
};

/**
 * 멜로디 생성기 클래스
 */
export class MelodyGenerator {
  /**
   * 코드 진행으로부터 멜로디 생성
   *
   * @param progression - 코드 진행 배열
   * @param genre - 음악 장르
   * @param timeSignature - 박자
   * @returns 멜로디 음표 이벤트 배열
   */
  generateMelody(progression: Chord[], genre: Genre, timeSignature: TimeSignature): NoteEvent[] {
    const melody: NoteEvent[] = [];
    const strongBeats = getStrongBeatPattern(timeSignature);

    let lastNote: number | undefined;

    for (const chord of progression) {
      const measureMelody = this.generateMeasureMelody(chord, genre, strongBeats, timeSignature, lastNote);
      melody.push(...measureMelody);
      if (measureMelody.length > 0) {
        lastNote = measureMelody[measureMelody.length - 1].pitch;
      }
    }

    return melody;
  }

  /**
   * 한 마디의 멜로디 생성
   *
   * @param chord - 현재 코드
   * @param genre - 장르
   * @param strongBeats - 강박 패턴
   * @param timeSignature - 박자
   * @param lastNote - 이전 음표 (부드러운 연결용)
   * @returns 한 마디의 멜로디
   */
  private generateMeasureMelody(
    chord: Chord,
    genre: Genre,
    strongBeats: boolean[],
    timeSignature: TimeSignature,
    lastNote?: number
  ): NoteEvent[] {
    const notes: NoteEvent[] = [];
    const chordTones = chord.notes; // [60, 64, 67] (C, E, G)
    const scale = getScale(chord.root, chord.type);

    let beatCount = 0; // 현재 박자 위치
    const totalBeats = timeSignature.beats; // 한 마디의 총 박자 수
    const durations = NOTE_DURATIONS[genre];
    const weights = DURATION_WEIGHTS[genre];

    // 한 마디를 채울 때까지 음표 생성
    while (beatCount < totalBeats) {
      // 랜덤한 음표 길이 선택 (확률 가중치 적용)
      const duration = this.selectRandomDuration(durations, weights, totalBeats - beatCount);

      // 마디를 넘지 않도록 길이 조정
      const actualDuration = Math.min(duration, totalBeats - beatCount);

      // 현재 박자가 강박인지 확인
      const beatIndex = Math.floor(beatCount);
      const isStrongBeat = strongBeats[beatIndex % strongBeats.length];

      // 음높이 선택 (랜덤성 추가)
      let pitch: number;

      if (isStrongBeat) {
        // 강박: 코드 톤 위주 (80%)
        if (Math.random() < 0.8) {
          pitch = this.selectChordTone(chordTones, lastNote);
        } else {
          pitch = this.selectScaleTone(scale, lastNote);
        }
      } else {
        // 약박: 코드 톤과 스케일 톤 혼합 (60% 코드 톤)
        if (Math.random() < 0.6) {
          pitch = this.selectChordTone(chordTones, lastNote);
        } else {
          pitch = this.selectScaleTone(scale, lastNote);
        }
      }

      // 멜로디 방향성 제어 (너무 큰 점프 방지)
      if (lastNote !== undefined) {
        pitch = this.smoothTransition(pitch, lastNote, chordTones);
      }

      // 옥타브 범위 제한 (C4~C6, 60~84)
      pitch = this.clampToRange(pitch, 60, 84);

      // 음표 추가
      notes.push({ pitch, duration: actualDuration });

      lastNote = pitch;
      beatCount += actualDuration;
    }

    return notes;
  }

  /**
   * 확률 가중치를 적용하여 음표 길이 선택
   *
   * @param durations - 사용 가능한 음표 길이 배열
   * @param weights - 각 길이의 확률 가중치
   * @param maxDuration - 최대 길이 (남은 박자)
   * @returns 선택된 음표 길이
   */
  private selectRandomDuration(
    durations: number[],
    weights: Record<number, number>,
    maxDuration: number
  ): number {
    // 남은 박자 내에서 사용 가능한 길이만 필터링
    const availableDurations = durations.filter((d) => d <= maxDuration);

    if (availableDurations.length === 0) {
      return maxDuration;
    }

    // 가중치 합계 계산
    const totalWeight = availableDurations.reduce((sum, d) => sum + (weights[d] || 0), 0);

    // 랜덤 값 생성
    let random = Math.random() * totalWeight;

    // 가중치 기반 선택
    for (const duration of availableDurations) {
      random -= weights[duration] || 0;
      if (random <= 0) {
        return duration;
      }
    }

    // 폴백: 마지막 음표 길이
    return availableDurations[availableDurations.length - 1];
  }

  /**
   * 코드 톤 중 하나를 선택
   *
   * @param chordTones - 코드 구성음
   * @param lastNote - 이전 음표
   * @returns 선택된 코드 톤
   */
  private selectChordTone(chordTones: number[], lastNote?: number): number {
    if (lastNote === undefined) {
      // 첫 음표는 근음 우선 (70% 확률)
      if (Math.random() < 0.7) {
        return chordTones[0];
      }
      return chordTones[Math.floor(Math.random() * chordTones.length)];
    }

    // 이전 음표와 가까운 코드 톤 선택 (50% 확률)
    // 나머지 50%는 완전 랜덤
    if (Math.random() < 0.5) {
      return this.findNearestNote(lastNote, chordTones);
    }

    // 랜덤 코드 톤
    return chordTones[Math.floor(Math.random() * chordTones.length)];
  }

  /**
   * 스케일 톤 중 하나를 선택
   *
   * @param scale - 스케일 음
   * @param lastNote - 이전 음표
   * @returns 선택된 스케일 톤
   */
  private selectScaleTone(scale: number[], lastNote?: number): number {
    if (lastNote === undefined) {
      // 랜덤 스케일 톤
      return scale[Math.floor(Math.random() * scale.length)];
    }

    // 이전 음표와 가까운 스케일 톤 선택 (60% 확률)
    if (Math.random() < 0.6) {
      return this.findNearestNote(lastNote, scale);
    }

    // 랜덤 스케일 톤
    return scale[Math.floor(Math.random() * scale.length)];
  }

  /**
   * 부드러운 전환 (너무 큰 점프 방지)
   *
   * @param note - 현재 음표
   * @param lastNote - 이전 음표
   * @param chordTones - 코드 구성음
   * @returns 조정된 음표
   */
  private smoothTransition(note: number, lastNote: number, chordTones: number[]): number {
    const interval = Math.abs(note - lastNote);

    // 옥타브(12세미톤) 이상 점프면 가까운 코드 톤으로 조정
    if (interval > 12) {
      return this.findNearestNote(lastNote, chordTones);
    }

    // 5도(7세미톤) 이상 점프는 50% 확률로 조정
    if (interval > 7 && Math.random() < 0.5) {
      return this.findNearestNote(lastNote, chordTones);
    }

    return note;
  }

  /**
   * 목표 음표에서 가장 가까운 음 찾기
   *
   * @param target - 목표 음표
   * @param candidates - 후보 음표 배열
   * @returns 가장 가까운 음표
   */
  private findNearestNote(target: number, candidates: number[]): number {
    return candidates.reduce((nearest, current) => {
      const currentDistance = Math.abs(current - target);
      const nearestDistance = Math.abs(nearest - target);
      return currentDistance < nearestDistance ? current : nearest;
    });
  }

  /**
   * 음표를 범위 내로 제한
   *
   * @param note - 음표
   * @param min - 최소값
   * @param max - 최대값
   * @returns 제한된 음표
   */
  private clampToRange(note: number, min: number, max: number): number {
    // 범위를 벗어나면 옥타브 조정
    while (note < min) {
      note += 12;
    }
    while (note > max) {
      note -= 12;
    }
    return note;
  }
}
