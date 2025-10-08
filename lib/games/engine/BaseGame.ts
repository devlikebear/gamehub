import { GameLoop } from './GameLoop';
import { FONTS, NEON_COLORS, OVERLAY } from './constants';
import type { GameCompletionPayload } from './types';
import { startPlaySession, endPlaySession, type PlaySession } from '../../storage/statistics';
import type { DifficultyLevel } from '../../difficulty/types';
import { loadDifficulty } from '../../difficulty/storage';
import { getDifficultyConfig } from '../../difficulty/data';

/**
 * BaseGame - 모든 게임의 기본 클래스
 *
 * Canvas 기반 게임을 위한 공통 기능을 제공합니다.
 */

export interface GameConfig {
  canvas: HTMLCanvasElement;
  width?: number;
  height?: number;
  gameId?: string; // 통계 추적을 위한 게임 ID
  difficulty?: DifficultyLevel; // 난이도 설정
  onGameComplete?: (payload: GameCompletionPayload) => void;
}

export abstract class BaseGame extends GameLoop {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  protected readonly onGameComplete?: (payload: GameCompletionPayload) => void;
  private completionEmitted = false;

  // Performance optimizations
  protected isDirty = true; // Dirty flag for rendering optimization
  private offscreenCanvas?: HTMLCanvasElement;
  private offscreenCtx?: CanvasRenderingContext2D;

  // Statistics tracking
  protected gameId?: string;
  private playSession?: PlaySession;
  private statisticsEnabled = true;

  // Difficulty settings
  protected difficulty: DifficultyLevel;
  protected speedMultiplier: number = 1.0;
  protected aiSpeedMultiplier: number = 1.0;
  protected densityMultiplier: number = 1.0;
  protected scoreMultiplier: number = 1.0;

  constructor(config: GameConfig) {
    super();

    this.canvas = config.canvas;
    this.gameId = config.gameId;
    this.onGameComplete = config.onGameComplete;

    // 난이도 설정 로드 (config에 있으면 사용, 없으면 저장된 값 로드)
    this.difficulty = config.difficulty || (config.gameId ? loadDifficulty(config.gameId) : 'normal');
    this.applyDifficultySettings();
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.ctx = ctx;

    // Canvas 크기 설정
    this.width = config.width || this.canvas.clientWidth;
    this.height = config.height || this.canvas.clientHeight;

    this.setupCanvas();
    this.setupOffscreenCanvas();

    // 통계 추적 시작
    if (this.gameId && this.statisticsEnabled) {
      this.playSession = startPlaySession(this.gameId);
    }
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
   * 오프스크린 캔버스 설정 (더블 버퍼링용)
   */
  private setupOffscreenCanvas(): void {
    if (typeof document === 'undefined') return;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;

    const ctx = this.offscreenCanvas.getContext('2d', {
      alpha: false, // 투명도 불필요 시 성능 향상
      desynchronized: true, // 렌더링 지연 감소
    });

    if (ctx) {
      this.offscreenCtx = ctx;
      this.offscreenCtx.imageSmoothingEnabled = false;
    }
  }

  /**
   * 오프스크린 캔버스로 전환 (더블 버퍼링)
   * 복잡한 렌더링 시 사용
   */
  protected useOffscreenRendering(): CanvasRenderingContext2D | null {
    return this.offscreenCtx || null;
  }

  /**
   * 오프스크린 캔버스를 메인 캔버스로 복사
   */
  protected commitOffscreenRender(): void {
    if (!this.offscreenCanvas) return;
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
  }

  /**
   * Dirty flag 설정 (재렌더링 필요)
   */
  protected markDirty(): void {
    this.isDirty = true;
  }

  /**
   * Canvas 크기 조정
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.setupCanvas();
    this.setupOffscreenCanvas();
    this.markDirty();
  }

  protected notifyGameComplete(payload: GameCompletionPayload): void {
    if (this.completionEmitted) return;
    this.completionEmitted = true;

    // 통계 업데이트 (게임 종료 시)
    if (this.gameId && this.statisticsEnabled && this.playSession) {
      endPlaySession(this.gameId, payload.score);
    }

    this.onGameComplete?.(payload);
  }

  protected resetGameCompletion(): void {
    this.completionEmitted = false;

    // 새 게임 시작 시 통계 세션 재시작
    if (this.gameId && this.statisticsEnabled) {
      this.playSession = startPlaySession(this.gameId);
    }
  }

  /**
   * 통계 추적 활성화/비활성화
   */
  public setStatisticsEnabled(enabled: boolean): void {
    this.statisticsEnabled = enabled;
  }

  /**
   * 현재 플레이 세션 정보 조회
   */
  public getPlaySession(): PlaySession | undefined {
    return this.playSession;
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

  /**
   * 난이도 설정 적용
   */
  private applyDifficultySettings(): void {
    const config = getDifficultyConfig(this.difficulty);
    this.speedMultiplier = config.speedMultiplier;
    this.aiSpeedMultiplier = config.aiSpeedMultiplier;
    this.densityMultiplier = config.densityMultiplier;
    this.scoreMultiplier = config.scoreMultiplier;
  }

  /**
   * 난이도 변경
   */
  public setDifficulty(difficulty: DifficultyLevel): void {
    this.difficulty = difficulty;
    this.applyDifficultySettings();
  }

  /**
   * 현재 난이도 가져오기
   */
  public getDifficulty(): DifficultyLevel {
    return this.difficulty;
  }

  /**
   * 난이도를 반영한 점수 계산
   */
  protected applyScoreMultiplier(baseScore: number): number {
    return Math.floor(baseScore * this.scoreMultiplier);
  }
}
