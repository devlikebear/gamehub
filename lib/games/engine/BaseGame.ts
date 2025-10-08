import { GameLoop } from './GameLoop';
import { FONTS, NEON_COLORS, OVERLAY } from './constants';
import type { GameCompletionPayload } from './types';

/**
 * BaseGame - 모든 게임의 기본 클래스
 *
 * Canvas 기반 게임을 위한 공통 기능을 제공합니다.
 */

export interface GameConfig {
  canvas: HTMLCanvasElement;
  width?: number;
  height?: number;
  onGameComplete?: (payload: GameCompletionPayload) => void;
}

export abstract class BaseGame extends GameLoop {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  protected readonly onGameComplete?: (payload: GameCompletionPayload) => void;
  private completionEmitted = false;

  constructor(config: GameConfig) {
    super();

    this.canvas = config.canvas;
    this.onGameComplete = config.onGameComplete;
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.ctx = ctx;

    // Canvas 크기 설정
    this.width = config.width || this.canvas.clientWidth;
    this.height = config.height || this.canvas.clientHeight;

    this.setupCanvas();
  }

  /**
   * Canvas 초기 설정
   */
  private setupCanvas(): void {
    // 레티나 디스플레이 대응
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    // 이미지 렌더링 설정 (픽셀 아트용)
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Canvas 크기 조정
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.setupCanvas();
  }

  protected notifyGameComplete(payload: GameCompletionPayload): void {
    if (this.completionEmitted) return;
    this.completionEmitted = true;
    this.onGameComplete?.(payload);
  }

  protected resetGameCompletion(): void {
    this.completionEmitted = false;
  }

  /**
   * Canvas 지우기
   */
  protected clearCanvas(color: string = '#000000'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * 텍스트 그리기 (픽셀 폰트용)
   */
  protected drawText(
    text: string,
    x: number,
    y: number,
    options: {
      font?: string;
      color?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
    } = {}
  ): void {
    this.ctx.font = options.font || '16px "Press Start 2P"';
    this.ctx.fillStyle = options.color || '#ffffff';
    this.ctx.textAlign = options.align || 'left';
    this.ctx.textBaseline = options.baseline || 'top';

    this.ctx.fillText(text, x, y);
  }

  /**
   * 사각형 그리기
   */
  protected drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * 사각형 테두리 그리기
   */
  protected strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    lineWidth: number = 2
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  /**
   * 원 그리기
   */
  protected drawCircle(
    x: number,
    y: number,
    radius: number,
    color: string
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 게임 오버레이 그리기 (일시정지, 게임오버 등)
   */
  protected drawOverlay(
    message: string,
    color: string = NEON_COLORS.CYAN,
    subtitle?: string
  ): void {
    const ctx = this.ctx;
    ctx.save();

    // 반투명 배경
    ctx.fillStyle = OVERLAY.BACKGROUND;
    ctx.fillRect(0, 0, this.width, this.height);

    // 메인 메시지
    this.drawText(message, this.width / 2, this.height / 2 - 30, {
      color,
      font: FONTS.PIXEL_LARGE,
      align: 'center',
      baseline: 'middle',
    });

    // 서브 메시지
    if (subtitle) {
      this.drawText(subtitle, this.width / 2, this.height / 2 + 10, {
        color: NEON_COLORS.WHITE,
        font: FONTS.PIXEL_SMALL,
        align: 'center',
        baseline: 'middle',
      });
    }

    ctx.restore();
  }
}
