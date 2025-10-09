/**
 * 오디오 레이어 생성기
 * 베이스 라인과 화음 패드 생성
 */

import type { Chord, TimeSignature } from './types';

/**
 * 음표 데이터 (음높이 + 길이)
 */
interface NoteEvent {
  pitch: number; // MIDI 음표 번호
  startTime: number; // 시작 시간 (초)
  duration: number; // 길이 (초)
  velocity: number; // 음량 (0-1)
}

/**
 * 레이어 생성기 클래스
 */
export class LayerGenerator {
  /**
   * 베이스 라인 생성
   * 각 코드의 근음을 낮은 옥타브로 연주
   *
   * @param progression - 코드 진행
   * @param timeSignature - 박자
   * @param tempo - BPM
   * @returns 베이스 음표 이벤트 배열
   */
  generateBass(progression: Chord[], timeSignature: TimeSignature, tempo: number): NoteEvent[] {
    const bass: NoteEvent[] = [];
    const secondsPerBeat = 60 / tempo;
    const beatsPerMeasure = timeSignature.beats;
    const measureDuration = secondsPerBeat * beatsPerMeasure;

    let currentTime = 0;

    for (const chord of progression) {
      // 근음을 2옥타브 낮게 (C4 → C2)
      const root = chord.notes[0] - 24;

      // 베이스 리듬 패턴 생성
      const bassPattern = this.getBassPattern(timeSignature);

      for (const beat of bassPattern) {
        bass.push({
          pitch: root,
          startTime: currentTime + beat.time * secondsPerBeat,
          duration: beat.duration * secondsPerBeat,
          velocity: beat.velocity,
        });
      }

      currentTime += measureDuration;
    }

    return bass;
  }

  /**
   * 화음 패드 생성
   * 코드의 구성음을 동시에 연주
   *
   * @param progression - 코드 진행
   * @param timeSignature - 박자
   * @param tempo - BPM
   * @returns 화음 음표 이벤트 배열
   */
  generateHarmony(progression: Chord[], timeSignature: TimeSignature, tempo: number): NoteEvent[] {
    const harmony: NoteEvent[] = [];
    const secondsPerBeat = 60 / tempo;
    const beatsPerMeasure = timeSignature.beats;
    const measureDuration = secondsPerBeat * beatsPerMeasure;

    let currentTime = 0;

    for (const chord of progression) {
      // 코드의 모든 구성음을 한 마디 동안 연주
      for (const pitch of chord.notes) {
        harmony.push({
          pitch,
          startTime: currentTime,
          duration: measureDuration * 0.9, // 90% 길이 (끝에 약간 공백)
          velocity: 0.3, // 조용하게 (멜로디보다 작게)
        });
      }

      currentTime += measureDuration;
    }

    return harmony;
  }

  /**
   * 박자에 따른 베이스 리듬 패턴
   *
   * @param timeSignature - 박자
   * @returns 베이스 리듬 패턴
   */
  private getBassPattern(timeSignature: TimeSignature): Array<{
    time: number;
    duration: number;
    velocity: number;
  }> {
    const beats = timeSignature.beats;

    switch (`${beats}/${timeSignature.unit}`) {
      case '2/4':
        // 강-약
        return [
          { time: 0, duration: 0.8, velocity: 0.8 }, // 1박
          { time: 1, duration: 0.8, velocity: 0.5 }, // 2박
        ];

      case '3/4':
        // 강-약-약
        return [
          { time: 0, duration: 0.8, velocity: 0.8 }, // 1박
          { time: 1, duration: 0.8, velocity: 0.4 }, // 2박
          { time: 2, duration: 0.8, velocity: 0.4 }, // 3박
        ];

      case '4/4':
        // 강-약-중강-약
        return [
          { time: 0, duration: 0.8, velocity: 0.8 }, // 1박
          { time: 1, duration: 0.8, velocity: 0.4 }, // 2박
          { time: 2, duration: 0.8, velocity: 0.6 }, // 3박
          { time: 3, duration: 0.8, velocity: 0.4 }, // 4박
        ];

      case '6/8':
        // 복합박자: 강-약-약-중강-약-약
        return [
          { time: 0, duration: 0.4, velocity: 0.8 }, // 1
          { time: 0.5, duration: 0.4, velocity: 0.3 }, // 2
          { time: 1, duration: 0.4, velocity: 0.3 }, // 3
          { time: 1.5, duration: 0.4, velocity: 0.6 }, // 4
          { time: 2, duration: 0.4, velocity: 0.3 }, // 5
          { time: 2.5, duration: 0.4, velocity: 0.3 }, // 6
        ];

      default:
        // 기본: 각 박자마다 연주
        return Array.from({ length: beats }, (_, i) => ({
          time: i,
          duration: 0.8,
          velocity: i === 0 ? 0.8 : 0.5,
        }));
    }
  }

  /**
   * 음표 이벤트를 AudioBuffer로 변환
   *
   * @param notes - 음표 이벤트 배열
   * @param totalDuration - 전체 길이 (초)
   * @param sampleRate - 샘플 레이트
   * @param waveType - 파형 타입
   * @returns 오디오 버퍼 (Float32Array)
   */
  notesToAudioBuffer(
    notes: NoteEvent[],
    totalDuration: number,
    sampleRate: number,
    waveType: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine'
  ): Float32Array {
    const totalSamples = Math.floor(totalDuration * sampleRate);
    const buffer = new Float32Array(totalSamples);

    for (const note of notes) {
      const frequency = this.noteToFrequency(note.pitch);
      const startSample = Math.floor(note.startTime * sampleRate);
      const durationSamples = Math.floor(note.duration * sampleRate);

      for (let i = 0; i < durationSamples && startSample + i < totalSamples; i++) {
        const t = i / sampleRate;
        const sample = this.generateWaveform(waveType, frequency, t);

        // ADSR 엔벨로프 적용
        const envelope = this.getEnvelope(i, durationSamples);

        buffer[startSample + i] += sample * envelope * note.velocity;
      }
    }

    // 노멀라이제이션 (클리핑 방지)
    let maxAmplitude = 0;
    for (let i = 0; i < buffer.length; i++) {
      const absValue = Math.abs(buffer[i]);
      if (absValue > maxAmplitude) {
        maxAmplitude = absValue;
      }
    }

    if (maxAmplitude > 1) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] /= maxAmplitude;
      }
    }

    return buffer;
  }

  /**
   * 파형 생성
   *
   * @param type - 파형 타입
   * @param frequency - 주파수
   * @param time - 시간
   * @returns 샘플 값
   */
  private generateWaveform(type: 'sine' | 'square' | 'sawtooth' | 'triangle', frequency: number, time: number): number {
    const phase = 2 * Math.PI * frequency * time;

    switch (type) {
      case 'sine':
        return Math.sin(phase);

      case 'square':
        return Math.sign(Math.sin(phase));

      case 'sawtooth':
        return 2 * ((frequency * time) % 1) - 1;

      case 'triangle':
        return 2 * Math.abs(2 * ((frequency * time) % 1) - 1) - 1;
    }
  }

  /**
   * MIDI 음표 번호를 주파수로 변환
   *
   * @param note - MIDI 음표 번호 (60 = middle C)
   * @returns 주파수 (Hz)
   */
  private noteToFrequency(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * ADSR 엔벨로프
   *
   * @param sample - 현재 샘플 위치
   * @param totalSamples - 전체 샘플 수
   * @returns 엔벨로프 값 (0-1)
   */
  private getEnvelope(sample: number, totalSamples: number): number {
    const attackTime = totalSamples * 0.05;
    const releaseTime = totalSamples * 0.2;

    if (sample < attackTime) {
      // Attack
      return sample / attackTime;
    } else if (sample > totalSamples - releaseTime) {
      // Release
      return (totalSamples - sample) / releaseTime;
    } else {
      // Sustain
      return 1.0;
    }
  }
}
