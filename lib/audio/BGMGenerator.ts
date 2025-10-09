/**
 * BGM 생성기 (개선 버전)
 * 음악 이론 기반 코드 진행, 멜로디, 화음 생성
 */

import type { BGMParams, AudioGenerationResult, TimeSignature } from './types';
import { selectProgression } from './chordProgressions';
import { selectTimeSignature } from './timeSignature';
import { expandToMeasures, calculateMeasures } from './structure';
import { MelodyGenerator, type NoteEvent } from './melodyGenerator';
import { LayerGenerator } from './layerGenerator';

export class BGMGenerator {
  private audioContext: AudioContext | null = null;
  private melodyGen = new MelodyGenerator();
  private layerGen = new LayerGenerator();

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
   * BGM 생성 (메인 메서드)
   */
  async generate(params: BGMParams): Promise<AudioGenerationResult> {
    const ctx = this.getAudioContext();
    const sampleRate = ctx.sampleRate;
    const duration = params.length;

    console.log('🎵 BGM 생성 시작:', params);

    // 1. 파라미터 자동 설정
    const timeSignature = selectTimeSignature(params.genre, params.tempo, params.mood);
    const key = 'C'; // 기본 조성
    const measures = calculateMeasures(duration, params.tempo);

    console.log(`📊 박자: ${timeSignature.beats}/${timeSignature.unit}, 조성: ${key}, 마디: ${measures}`);

    // 2. 코드 진행 생성 (장르/무드에 따라 자동 선택)
    const progression = selectProgression(params.genre, params.mood, key);

    console.log(`🎹 코드 진행: ${progression.name}`);

    // 3. 코드 진행을 목표 마디 수로 확장
    const fullProgression = expandToMeasures(progression.chords, measures);

    console.log(`📏 확장된 코드 수: ${fullProgression.length}마디`);

    // 4. 멜로디 생성
    const melody = this.melodyGen.generateMelody(fullProgression, params.genre, timeSignature);

    console.log(`🎼 멜로디 음표 수: ${melody.length}`);

    // 5. 베이스와 화음 레이어 생성
    const bassNotes = this.layerGen.generateBass(fullProgression, timeSignature, params.tempo);
    const harmonyNotes = this.layerGen.generateHarmony(fullProgression, timeSignature, params.tempo);

    console.log(`🎸 베이스 음표: ${bassNotes.length}, 🎹 화음 음표: ${harmonyNotes.length}`);

    // 6. 3-레이어를 오디오 버퍼로 변환
    const melodyBuffer = this.melodyToAudioBuffer(melody, duration, sampleRate, params.tempo, timeSignature);
    const bassBuffer = this.layerGen.notesToAudioBuffer(bassNotes, duration, sampleRate, 'triangle');
    const harmonyBuffer = this.layerGen.notesToAudioBuffer(harmonyNotes, duration, sampleRate, 'sawtooth');

    console.log('🔊 오디오 버퍼 생성 완료');

    // 7. 3-레이어 믹싱
    const mixedBuffer = this.mixLayers(melodyBuffer, harmonyBuffer, bassBuffer, sampleRate, duration);

    console.log('🎛️ 믹싱 완료');

    // 8. AudioBuffer를 WAV Blob으로 변환
    const buffer = ctx.createBuffer(2, mixedBuffer.length, sampleRate);
    const channelData = new Float32Array(mixedBuffer);
    buffer.copyToChannel(channelData, 0);
    buffer.copyToChannel(channelData, 1);

    const blob = await this.audioBufferToWav(buffer);

    console.log('✅ BGM 생성 완료');

    return {
      blob,
      duration,
      sampleRate,
    };
  }

  /**
   * 멜로디 음표 이벤트를 오디오 버퍼로 변환
   */
  private melodyToAudioBuffer(
    melody: NoteEvent[],
    totalDuration: number,
    sampleRate: number,
    tempo: number,
    _timeSignature: TimeSignature
  ): Float32Array {
    const buffer = new Float32Array(Math.floor(totalDuration * sampleRate));
    const secondsPerBeat = 60 / tempo; // 4분음표 1개의 길이 (초)

    let currentTime = 0;

    for (const note of melody) {
      const frequency = this.noteToFrequency(note.pitch);
      const noteDurationSeconds = note.duration * secondsPerBeat; // 박자를 초로 변환
      const startSample = Math.floor(currentTime * sampleRate);
      const durationSamples = Math.floor(noteDurationSeconds * sampleRate * 0.95); // 95% 길이 (약간의 공백)

      // 버퍼 범위를 벗어나지 않도록 체크
      if (startSample >= buffer.length) {
        break;
      }

      // 음표 생성
      for (let i = 0; i < durationSamples && startSample + i < buffer.length; i++) {
        const t = i / sampleRate;
        const sample = Math.sign(Math.sin(2 * Math.PI * frequency * t)); // Square wave

        // ADSR 엔벨로프
        const envelope = this.getEnvelope(i, durationSamples);

        buffer[startSample + i] += sample * envelope * 0.4; // 40% 볼륨
      }

      currentTime += noteDurationSeconds;
    }

    return buffer;
  }

  /**
   * 3-레이어 믹싱
   */
  private mixLayers(
    melody: Float32Array,
    harmony: Float32Array,
    bass: Float32Array,
    sampleRate: number,
    duration: number
  ): Float32Array {
    const totalSamples = Math.floor(duration * sampleRate);
    const mixed = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      let sample = 0;

      // 멜로디: 50% 볼륨
      if (i < melody.length) {
        sample += melody[i] * 0.5;
      }

      // 화음: 20% 볼륨
      if (i < harmony.length) {
        sample += harmony[i] * 0.2;
      }

      // 베이스: 30% 볼륨
      if (i < bass.length) {
        sample += bass[i] * 0.3;
      }

      mixed[i] = sample;
    }

    // 노멀라이제이션 (클리핑 방지)
    let maxAmplitude = 0;
    for (let i = 0; i < mixed.length; i++) {
      const absValue = Math.abs(mixed[i]);
      if (absValue > maxAmplitude) {
        maxAmplitude = absValue;
      }
    }

    if (maxAmplitude > 1) {
      for (let i = 0; i < mixed.length; i++) {
        mixed[i] /= maxAmplitude;
      }
    }

    return mixed;
  }

  /**
   * MIDI 음표 번호를 주파수로 변환
   */
  private noteToFrequency(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * ADSR 엔벨로프
   */
  private getEnvelope(sample: number, totalSamples: number): number {
    const attackTime = totalSamples * 0.1;
    const releaseTime = totalSamples * 0.2;

    if (sample < attackTime) {
      return sample / attackTime;
    } else if (sample > totalSamples - releaseTime) {
      return (totalSamples - sample) / releaseTime;
    } else {
      return 1.0;
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
