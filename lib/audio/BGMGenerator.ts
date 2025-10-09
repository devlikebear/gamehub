/**
 * BGM 생성기
 * Web Audio API를 사용한 간단한 치프튠 스타일 BGM 생성
 */

import type { BGMParams, AudioGenerationResult } from './types';

export class BGMGenerator {
  private audioContext: AudioContext | null = null;

  /**
   * AudioContext 초기화 (브라우저 환경 확인)
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      if (typeof window === 'undefined') {
        throw new Error('BGMGenerator는 브라우저 환경에서만 동작합니다');
      }
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  /**
   * BGM 생성
   */
  async generate(params: BGMParams): Promise<AudioGenerationResult> {
    const ctx = this.getAudioContext();
    const sampleRate = ctx.sampleRate;
    const duration = params.length;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

    // 장르별 프리셋 가져오기
    const preset = this.getPreset(params.genre, params.mood);

    // 템포에 따른 비트 간격
    const beatDuration = 60 / params.tempo; // 초 단위
    const totalBeats = Math.floor(duration / beatDuration);

    // 좌우 채널
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // 간단한 치프튠 멜로디 생성
    for (let beat = 0; beat < totalBeats; beat++) {
      const startSample = Math.floor(beat * beatDuration * sampleRate);
      const noteDuration = beatDuration * sampleRate * 0.8; // 80% 길이

      // 코드 진행에서 음표 선택
      const note = preset.melody[beat % preset.melody.length];
      const frequency = this.noteToFrequency(note);

      // 스퀘어 웨이브 (치프튠 스타일)
      for (let i = 0; i < noteDuration; i++) {
        const t = i / sampleRate;
        const sample = Math.sign(Math.sin(2 * Math.PI * frequency * t)) * 0.3;

        // ADSR 엔벨로프 적용 (간단한 버전)
        const envelope = this.getEnvelope(i, noteDuration);

        left[startSample + i] = sample * envelope;
        right[startSample + i] = sample * envelope;
      }

      // 베이스 추가 (옥타브 낮게)
      if (beat % 2 === 0) {
        const bassFreq = frequency / 2;
        for (let i = 0; i < noteDuration / 2; i++) {
          const t = i / sampleRate;
          const sample = Math.sign(Math.sin(2 * Math.PI * bassFreq * t)) * 0.2;
          const envelope = this.getEnvelope(i, noteDuration / 2);

          left[startSample + i] += sample * envelope;
          right[startSample + i] += sample * envelope;
        }
      }
    }

    // AudioBuffer를 WAV Blob로 변환
    const blob = await this.audioBufferToWav(buffer);

    return {
      blob,
      duration,
      sampleRate,
    };
  }

  /**
   * 장르/무드에 따른 프리셋
   */
  private getPreset(genre: string, _mood: string) {
    // 간단한 C 메이저 스케일 기반 멜로디
    const presets: Record<string, { melody: number[] }> = {
      chiptune: {
        melody: [60, 62, 64, 65, 67, 65, 64, 62], // C major scale
      },
      synthwave: {
        melody: [60, 64, 67, 72, 67, 64, 60, 57], // C major arpeggio
      },
      arcade: {
        melody: [60, 60, 62, 64, 62, 60, 64, 67], // Energetic pattern
      },
      ambient: {
        melody: [60, 62, 64, 67, 64, 62, 60, 60], // Calm pattern
      },
    };

    return presets[genre] || presets.chiptune;
  }

  /**
   * MIDI 음표 번호를 주파수로 변환
   */
  private noteToFrequency(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * ADSR 엔벨로프 (간단한 버전)
   */
  private getEnvelope(sample: number, totalSamples: number): number {
    const attackTime = totalSamples * 0.1;
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

  /**
   * AudioBuffer를 WAV Blob으로 변환
   */
  private async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2; // 16-bit
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV 헤더 작성
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
    view.setUint16(32, numChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // PCM 데이터 작성
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * DataView에 문자열 쓰기
   */
  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * 리소스 정리
   */
  close() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
