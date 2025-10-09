/**
 * AI 음악 생성기 (Gemini Lyria RealTime)
 */

import { ApiKeyManager } from '@/lib/sprite/ApiKeyManager';
import { UsageTracker } from '@/lib/sprite/UsageTracker';
import type { MusicParams, MusicGenerationResult } from './types';
import { buildBGMPrompt, buildSFXPrompt, validatePrompt } from './musicPrompts';

export class MusicGenerator {
  private static readonly API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
  private static readonly MODEL_NAME = 'models/lyria-realtime-exp';

  /**
   * 음악 프롬프트 생성
   */
  private static buildPrompt(params: MusicParams): string {
    if (params.type === 'bgm') {
      return buildBGMPrompt(
        params.genre!,
        params.mood!,
        params.length!,
        params.prompt
      );
    } else {
      return buildSFXPrompt(params.prompt);
    }
  }

  /**
   * 음악 생성 (Gemini Lyria API)
   */
  static async generate(params: MusicParams): Promise<MusicGenerationResult> {
    const startTime = Date.now();

    try {
      // 1. API 키 로드
      const apiKey = ApiKeyManager.loadApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.',
        };
      }

      // 2. 프롬프트 생성 및 검증
      const prompt = this.buildPrompt(params);
      const validation = validatePrompt(prompt);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      console.log('🎵 음악 생성 시작:', { type: params.type, prompt });

      // 3. Gemini Lyria API 호출
      const response = await fetch(
        `${this.API_BASE_URL}/${this.MODEL_NAME}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API 오류:', errorData);
        return {
          success: false,
          error: `API 오류: ${errorData.error?.message || response.statusText}`,
        };
      }

      // 4. 응답 파싱
      const data = await response.json();
      console.log('✅ API 응답 수신:', data);

      if (!data.candidates || data.candidates.length === 0) {
        return {
          success: false,
          error: '음악 생성에 실패했습니다. 프롬프트를 수정해주세요.',
        };
      }

      const content = data.candidates[0].content;
      if (!content || !content.parts || content.parts.length === 0) {
        return {
          success: false,
          error: '생성된 음악 데이터가 없습니다.',
        };
      }

      // 5. 오디오 데이터 추출 (Base64)
      const audioPart = content.parts.find(
        (part: { inlineData?: { data: string; mimeType: string } }) => part.inlineData
      );
      if (!audioPart || !audioPart.inlineData) {
        return {
          success: false,
          error: '오디오 데이터를 찾을 수 없습니다.',
        };
      }

      const audioData = audioPart.inlineData.data;
      const mimeType = audioPart.inlineData.mimeType || 'audio/wav';
      const format = mimeType.includes('mp3') ? 'mp3' : 'wav';

      // 6. Data URL 생성
      const audioUrl = `data:${mimeType};base64,${audioData}`;

      // 7. 바이너리 데이터 변환
      const binaryData = Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0));

      // 8. 사용량 기록
      const duration = params.type === 'bgm' ? params.length || 30 : 2;
      const estimatedCost = params.type === 'bgm' ? 0.05 : 0.02; // BGM: $0.05, SFX: $0.02

      UsageTracker.recordUsage(params.type, estimatedCost, false);

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ 음악 생성 완료 (${elapsedTime}초)`);

      return {
        success: true,
        audioUrl,
        audioData: binaryData,
        duration,
        format,
        metadata: {
          prompt,
          model: this.MODEL_NAME,
          timestamp: Date.now(),
          cost: estimatedCost,
        },
      };
    } catch (error) {
      console.error('음악 생성 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 오디오 후처리 (페이드 인/아웃, 루프 포인트, 노멀라이제이션)
   */
  static async postProcess(
    audioData: Uint8Array,
    options: {
      fadeIn?: number; // 초 단위
      fadeOut?: number; // 초 단위
      normalize?: boolean;
      loopEnabled?: boolean;
    }
  ): Promise<Blob> {
    try {
      // AudioContext 생성
      const audioContext = new AudioContext();

      // ArrayBuffer로 변환 (복사)
      const buffer = new ArrayBuffer(audioData.byteLength);
      const view = new Uint8Array(buffer);
      view.set(audioData);

      // 오디오 디코딩
      const audioBuffer = await audioContext.decodeAudioData(buffer);

      // 페이드 인/아웃 적용
      if (options.fadeIn || options.fadeOut) {
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;

        // 페이드 인
        if (options.fadeIn) {
          const fadeInSamples = Math.floor(options.fadeIn * sampleRate);
          for (let i = 0; i < fadeInSamples && i < channelData.length; i++) {
            channelData[i] *= i / fadeInSamples;
          }
        }

        // 페이드 아웃
        if (options.fadeOut) {
          const fadeOutSamples = Math.floor(options.fadeOut * sampleRate);
          const startSample = channelData.length - fadeOutSamples;
          for (let i = 0; i < fadeOutSamples && startSample + i < channelData.length; i++) {
            channelData[startSample + i] *= (fadeOutSamples - i) / fadeOutSamples;
          }
        }
      }

      // 노멀라이제이션
      if (options.normalize) {
        const channelData = audioBuffer.getChannelData(0);
        let maxAmplitude = 0;

        for (let i = 0; i < channelData.length; i++) {
          const absValue = Math.abs(channelData[i]);
          if (absValue > maxAmplitude) {
            maxAmplitude = absValue;
          }
        }

        if (maxAmplitude > 0 && maxAmplitude < 1) {
          const gain = 0.95 / maxAmplitude;
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] *= gain;
          }
        }
      }

      // WAV 변환
      const wavBlob = await this.audioBufferToWav(audioBuffer);

      audioContext.close();
      return wavBlob;
    } catch (error) {
      console.error('오디오 후처리 실패:', error);
      // 후처리 실패 시 원본 반환 (ArrayBuffer로 복사)
      const fallbackBuffer = new ArrayBuffer(audioData.byteLength);
      const fallbackView = new Uint8Array(fallbackBuffer);
      fallbackView.set(audioData);
      return new Blob([fallbackBuffer], { type: 'audio/wav' });
    }
  }

  /**
   * AudioBuffer를 WAV Blob으로 변환
   */
  private static async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
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
  private static writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
