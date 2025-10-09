/**
 * 효과음 생성기
 * Web Audio API를 사용한 레트로 아케이드 효과음 생성
 */

import type { SFXParams, AudioGenerationResult } from './types';

export class SFXGenerator {
  private audioContext: AudioContext | null = null;

  /**
   * AudioContext 초기화
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      if (typeof window === 'undefined') {
        throw new Error('SFXGenerator는 브라우저 환경에서만 동작합니다');
      }
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  /**
   * 효과음 생성
   */
  async generate(params: SFXParams): Promise<AudioGenerationResult> {
    const ctx = this.getAudioContext();
    const sampleRate = ctx.sampleRate;
    const duration = params.duration;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // 타입별 효과음 생성
    switch (params.type) {
      case 'ui':
        this.generateUISound(left, right, sampleRate, duration, params.style);
        break;
      case 'action':
        this.generateActionSound(left, right, sampleRate, duration, params.style);
        break;
      case 'collect':
        this.generateCollectSound(left, right, sampleRate, duration, params.style);
        break;
      case 'status':
        this.generateStatusSound(left, right, sampleRate, duration, params.style);
        break;
    }

    const blob = await this.audioBufferToWav(buffer);

    return {
      blob,
      duration,
      sampleRate,
    };
  }

  /**
   * UI 사운드 (클릭, 호버)
   */
  private generateUISound(
    left: Float32Array,
    right: Float32Array,
    sampleRate: number,
    duration: number,
    style: string
  ) {
    const samples = sampleRate * duration;
    const freq = style === 'fancy' ? 880 : 440; // A4 or A5

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      // 짧은 삐 소리
      const envelope = Math.exp(-t * 10);
      const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;

      left[i] = sample;
      right[i] = sample;
    }
  }

  /**
   * 액션 사운드 (점프, 공격)
   */
  private generateActionSound(
    left: Float32Array,
    right: Float32Array,
    sampleRate: number,
    duration: number,
    _style: string
  ) {
    const samples = sampleRate * duration;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      // 주파수 스윕 (높은 음 → 낮은 음)
      const freq = 880 - t * 600;
      const envelope = Math.exp(-t * 5);

      // 노이즈 추가 (레트로 스타일)
      const noise = (Math.random() * 2 - 1) * 0.1;
      const tone = Math.sin(2 * Math.PI * freq * t);
      const sample = (tone * 0.8 + noise * 0.2) * envelope * 0.4;

      left[i] = sample;
      right[i] = sample;
    }
  }

  /**
   * 수집 사운드 (코인, 아이템)
   */
  private generateCollectSound(
    left: Float32Array,
    right: Float32Array,
    sampleRate: number,
    duration: number,
    _style: string
  ) {
    const samples = sampleRate * duration;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      // 상승 아르페지오
      const noteIndex = Math.floor(t / (duration / 4));
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      const freq = notes[Math.min(noteIndex, notes.length - 1)];

      const envelope = Math.exp(-t * 8);
      const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;

      left[i] = sample;
      right[i] = sample;
    }
  }

  /**
   * 상태 사운드 (파워업, 게임오버)
   */
  private generateStatusSound(
    left: Float32Array,
    right: Float32Array,
    sampleRate: number,
    duration: number,
    _style: string
  ) {
    const samples = sampleRate * duration;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      // 진동하는 음
      const freq = 440 + Math.sin(t * 10) * 50;
      const envelope = Math.exp(-t * 3);
      const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;

      left[i] = sample;
      right[i] = sample;
    }
  }

  /**
   * AudioBuffer를 WAV Blob으로 변환
   */
  private async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV 헤더
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // PCM 데이터
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

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  close() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
