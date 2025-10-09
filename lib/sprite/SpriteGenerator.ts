/**
 * 스프라이트 생성기
 * Gemini API 이미지 생성 (클라이언트 사이드)
 */

'use client';

import type { SpriteParams, SpriteGenerationResult } from './types';
import { ApiKeyManager } from './ApiKeyManager';
import { UsageTracker } from './UsageTracker';

export class SpriteGenerator {
  private static readonly MODEL_NAME = 'gemini-2.5-flash-image-preview';
  private static readonly API_BASE_URL =
    'https://generativelanguage.googleapis.com/v1beta/models';

  /**
   * 프롬프트 생성 (스타일 가이드 포함)
   */
  private static buildPrompt(params: SpriteParams): string {
    const { type, style, palette, size, description, frames, animation } = params;

    // 기본 프롬프트
    let prompt = `Create a ${style} style ${type} sprite`;

    // 설명 추가
    if (description) {
      prompt += `: ${description}`;
    }

    // 스타일 가이드
    const styleGuides: Record<string, string> = {
      'pixel-art': 'retro 8-bit or 16-bit pixel art, sharp pixels, limited color palette',
      neon: 'neon arcade style with bright glowing colors, cyberpunk aesthetic',
      retro: 'classic 2D arcade game style, clean lines, vibrant colors',
      minimalist: 'simple geometric shapes, flat design, minimal details',
      cartoon: 'playful cartoon style, exaggerated features, bold outlines',
    };

    prompt += `. Style: ${styleGuides[style] || style}`;

    // 색상 팔레트
    const paletteGuides: Record<string, string> = {
      'neon-pink': 'dominant neon pink (#ff10f0) with cyan accents',
      'neon-cyan': 'dominant neon cyan (#00f0ff) with pink accents',
      'neon-purple': 'dominant neon purple (#9d00ff) with yellow accents',
      'neon-yellow': 'dominant neon yellow (#ffff00) with purple accents',
      'neon-green': 'dominant neon green (#00ff00) with cyan accents',
      rainbow: 'rainbow colors with neon glow effect',
      monochrome: 'black and white with grayscale shading',
    };

    if (palette !== 'custom' && paletteGuides[palette]) {
      prompt += `. Color palette: ${paletteGuides[palette]}`;
    }

    // 크기 및 해상도
    const [width, height] = size.split('x').map(Number);
    if (width && height) {
      prompt += `. Resolution: ${width}x${height} pixels`;
    }

    // 애니메이션 프레임
    if (frames && frames > 1 && animation) {
      prompt += `. Create ${frames} animation frames for ${animation} motion in a sprite sheet layout`;
    }

    // 투명 배경
    prompt += '. Transparent background. Game-ready sprite asset.';

    // 세부 지침
    if (style === 'pixel-art') {
      prompt += ' No anti-aliasing, crisp pixel edges.';
    } else if (style === 'neon') {
      prompt += ' Strong glow effects, high contrast, dark background for neon visibility.';
    }

    return prompt;
  }

  /**
   * 스프라이트 생성
   */
  static async generate(params: SpriteParams): Promise<SpriteGenerationResult> {
    try {
      // API 키 확인
      const apiKey = ApiKeyManager.loadApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.',
        };
      }

      // 일일 한도 확인
      const dailyLimit = 50;
      if (!UsageTracker.checkDailyLimit(dailyLimit)) {
        return {
          success: false,
          error: `일일 생성 한도(${dailyLimit}개)를 초과했습니다. 내일 다시 시도해주세요.`,
        };
      }

      // 프롬프트 생성
      const prompt = this.buildPrompt(params);
      console.log('Generated prompt:', prompt);

      // Gemini API 호출
      const response = await fetch(
        `${this.API_BASE_URL}/${this.MODEL_NAME}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Gemini API response:', data);

      // 이미지 데이터 추출
      const candidates = data.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('생성된 이미지가 없습니다.');
      }

      const content = candidates[0].content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('이미지 데이터를 찾을 수 없습니다.');
      }

      // 이미지 part 찾기
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = content.parts.find((part: any) => part.inlineData);
      if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        throw new Error('이미지 데이터 형식이 올바르지 않습니다.');
      }

      const imageData = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || 'image/png';

      // Data URL 생성
      const imageUrl = `data:${mimeType};base64,${imageData}`;

      // Base64 디코드
      const binaryData = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));

      // 크기 파싱
      const [width, height] = params.size.split('x').map(Number);

      // 사용량 기록
      UsageTracker.recordUsage('sprite', 1, false);

      // 결과 반환
      return {
        success: true,
        imageUrl,
        imageData: binaryData,
        width: width || 256,
        height: height || 256,
        frames: params.frames || 1,
        metadata: {
          prompt,
          model: this.MODEL_NAME,
          timestamp: Date.now(),
          cost: UsageTracker.estimateCost(1),
        },
      };
    } catch (error) {
      console.error('스프라이트 생성 실패:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  /**
   * 다운로드용 파일명 생성
   */
  static generateFileName(params: SpriteParams): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseName = params.description.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const frames = params.frames && params.frames > 1 ? `-${params.frames}frames` : '';
    return `sprite-${baseName}${frames}-${timestamp}.png`;
  }
}
