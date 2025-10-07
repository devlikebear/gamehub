/**
 * Cascade Blocks Game
 * 가변 필드 낙하 퍼즐 게임
 */

import { BaseGame, GameConfig, InputHandler, StorageManager, NEON_COLORS, BACKGROUND_COLORS, FONTS } from '../engine';
import { GameBoard, ActiveModule, RoundConfig, GameStats } from './types';
import { createEmptyBoard, generateRoundConfig, isValidPosition, lockModule, getModuleCells, findCompletedLines, clearLines, calculateGhostPosition } from './board';
import { getRandomModule } from './modules';

const CELL_SIZE = 24; // 셀 크기 (픽셀)
const FALL_SPEED = 800; // 일반 낙하 속도 (ms)
const FAST_FALL_SPEED = 50; // 빠른 낙하 속도 (ms)
const MOVE_DELAY = 150; // 좌우 이동 딜레이 (ms)
const LOCK_DELAY = 500; // 착지 후 고정 딜레이 (ms)

export class CascadeBlocksGame extends BaseGame {
  private board!: GameBoard;
  private currentModule: ActiveModule | null = null;
  private nextModule: ActiveModule | null = null;
  private roundConfig!: RoundConfig;
  private stats: GameStats = {
    score: 0,
    level: 1,
    linesCleared: 0,
    loopsCompleted: 0,
    modulesPlaced: 0,
  };
  private isGameOver = false;

  private fallTimer = 0;
  private fallInterval = FALL_SPEED;
  private moveTimer = 0;
  private lockTimer = 0;
  private isLocking = false;
  private isFastFalling = false;

  private fieldOffsetX = 0;
  private fieldOffsetY = 0;
  private fieldWidth = 0;
  private fieldHeight = 0;

  private inputHandler!: InputHandler;
  private storageManager!: StorageManager;
  private readonly handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (this.isGameOver && (event.key === 'Enter' || event.key === 'r' || event.key === 'R')) {
      event.preventDefault();
      if (this.getIsPaused()) {
        this.resume();
      }
      this.startNewGame();
      return;
    }

    if (this.getIsPaused() && (event.key === 'Escape' || event.key === 'p' || event.key === 'P')) {
      event.preventDefault();
      this.togglePause();
    }
  };

  constructor(config: GameConfig) {
    super(config);
    this.init();
  }

  protected init(): void {
    this.inputHandler = new InputHandler({ targetElement: this.canvas });
    this.storageManager = new StorageManager({ namespace: 'cascade-blocks' });

    this.startNewGame();
  }

  private startNewGame(): void {
    this.stats = {
      score: 0,
      level: 1,
      linesCleared: 0,
      loopsCompleted: 0,
      modulesPlaced: 0,
    };

    this.startNewRound();
    this.isGameOver = false;
  }

  private startNewRound(): void {
    this.roundConfig = generateRoundConfig(this.stats.level);
    this.board = createEmptyBoard(this.roundConfig.boardWidth, this.roundConfig.boardHeight);

    // 필드 크기 및 오프셋 계산
    this.fieldWidth = this.board.width * CELL_SIZE;
    this.fieldHeight = this.board.height * CELL_SIZE;
    this.fieldOffsetX = (this.width - this.fieldWidth) / 2;
    this.fieldOffsetY = 80;

    this.spawnNewModule();
    this.nextModule = this.createModule();
  }

  private createModule(): ActiveModule {
    const shape = getRandomModule(this.roundConfig.moduleSet);
    return {
      shape,
      position: { x: Math.floor(this.board.width / 2), y: 0 },
      rotationIndex: 0,
    };
  }

  private spawnNewModule(): void {
    if (this.nextModule) {
      this.currentModule = this.nextModule;
      this.nextModule = this.createModule();
    } else {
      this.currentModule = this.createModule();
    }

    this.fallTimer = 0;
    this.lockTimer = 0;
    this.isLocking = false;
    this.isFastFalling = false;

    // 스폰 위치에서 충돌하면 게임 오버
    if (this.currentModule && !isValidPosition(this.board, this.currentModule)) {
      this.gameOver();
    }
  }

  protected onStart(): void {
    this.inputHandler.attach();
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleGlobalKeyDown);
    }
  }

  protected onStop(): void {
    this.inputHandler.detach();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleGlobalKeyDown);
    }
  }

  protected update(deltaTime: number): void {
    if (this.getIsPaused() || this.isGameOver || !this.currentModule) return;

    this.handleInput(deltaTime);
    this.updateFalling(deltaTime);
  }

  private handleInput(deltaTime: number): void {
    if (!this.currentModule) return;

    this.moveTimer += deltaTime;

    // 좌우 이동
    if (this.moveTimer >= MOVE_DELAY) {
      if (this.inputHandler.isPressed('ArrowLeft')) {
        this.moveModule(-1, 0);
        this.moveTimer = 0;
      } else if (this.inputHandler.isPressed('ArrowRight')) {
        this.moveModule(1, 0);
        this.moveTimer = 0;
      }
    }

    // 회전
    if (this.inputHandler.justPressed('ArrowUp')) {
      this.rotateModule();
    }

    // 빠른 낙하
    if (this.inputHandler.isPressed('ArrowDown')) {
      this.isFastFalling = true;
      this.fallInterval = FAST_FALL_SPEED;
    } else {
      this.isFastFalling = false;
      this.fallInterval = FALL_SPEED;
    }

    // 즉시 낙하 (하드 드롭)
    if (this.inputHandler.justPressed(' ')) {
      this.hardDrop();
    }

    // 일시정지
    if (this.inputHandler.justPressed('Escape') || this.inputHandler.justPressed('p')) {
      this.togglePause();
    }
  }

  private updateFalling(deltaTime: number): void {
    if (!this.currentModule) return;

    if (this.isLocking) {
      this.lockTimer += deltaTime;
      if (this.lockTimer >= LOCK_DELAY) {
        this.lockCurrentModule();
        return;
      }
    }

    this.fallTimer += deltaTime;

    if (this.fallTimer < this.fallInterval) {
      return;
    }

    this.fallTimer = 0;

    if (this.moveModule(0, 1)) {
      // 성공적으로 아래로 이동
      this.isLocking = false;
      this.lockTimer = 0;
      return;
    }

    // 더 이상 아래로 이동 불가 - 착지 상태
    if (!this.isLocking) {
      this.isLocking = true;
      this.lockTimer = 0;
    }
  }

  private moveModule(dx: number, dy: number): boolean {
    if (!this.currentModule) return false;

    const newPosition = {
      x: this.currentModule.position.x + dx,
      y: this.currentModule.position.y + dy,
    };

    const testModule: ActiveModule = {
      ...this.currentModule,
      position: newPosition,
    };

    if (isValidPosition(this.board, testModule)) {
      this.currentModule.position = newPosition;
      return true;
    }

    return false;
  }

  private rotateModule(): void {
    if (!this.currentModule) return;

    const newRotation = (this.currentModule.rotationIndex + 1) % 4;
    const testModule: ActiveModule = {
      ...this.currentModule,
      rotationIndex: newRotation,
    };

    if (isValidPosition(this.board, testModule)) {
      this.currentModule.rotationIndex = newRotation;
      return;
    }

    // Wall Kick 시도 (벽에서 밀려나기)
    const kicks = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
    ];

    for (const kick of kicks) {
      testModule.position = {
        x: this.currentModule.position.x + kick.x,
        y: this.currentModule.position.y + kick.y,
      };

      if (isValidPosition(this.board, testModule)) {
        this.currentModule.rotationIndex = newRotation;
        this.currentModule.position = testModule.position;
        return;
      }
    }
  }

  private hardDrop(): void {
    if (!this.currentModule) return;

    while (this.moveModule(0, 1)) {
      // 바닥까지 이동
    }

    this.lockCurrentModule();
  }

  private lockCurrentModule(): void {
    if (!this.currentModule) return;

    lockModule(this.board, this.currentModule);
    this.stats.modulesPlaced++;

    // 완성된 라인 확인 및 제거
    const completedLines = findCompletedLines(this.board);
    if (completedLines.length > 0) {
      clearLines(this.board, completedLines);
      this.stats.linesCleared += completedLines.length;
      this.stats.score += this.calculateScore(completedLines.length);

      // 레벨 업 조건 체크
      if (this.stats.linesCleared >= this.stats.level * 10) {
        this.stats.level++;
        this.startNewRound();
        return;
      }
    }

    this.spawnNewModule();
  }

  private calculateScore(lines: number): number {
    const baseScore = [0, 100, 300, 500, 800];
    return baseScore[Math.min(lines, 4)] * this.stats.level;
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawBackdrop();
    this.drawField();
    this.drawBoard();
    this.drawGhostModule();
    this.drawCurrentModule();
    this.drawIncomingModule();
    this.drawStatusPanel();

    if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'Press ESC to resume');
    }

    if (this.isGameOver) {
      this.drawOverlay('GAME OVER', NEON_COLORS.PINK, 'Press ENTER to restart');
    }
  }

  private drawBackdrop(): void {
    const ctx = this.ctx;
    ctx.save();

    const haloGradient = ctx.createRadialGradient(
      this.fieldOffsetX + this.fieldWidth / 2,
      this.fieldOffsetY + this.fieldHeight / 2,
      this.fieldWidth / 4,
      this.fieldOffsetX + this.fieldWidth / 2,
      this.fieldOffsetY + this.fieldHeight / 2,
      this.fieldWidth
    );
    haloGradient.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
    haloGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.fillStyle = haloGradient;
    ctx.fillRect(0, this.fieldOffsetY - 120, this.width, this.fieldHeight + 240);

    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = 'rgba(255, 106, 243, 0.35)';
    ctx.lineWidth = 2;

    const bandHeight = 36;
    for (let i = -4; i < 10; i++) {
      const y = this.fieldOffsetY - 100 + i * bandHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y + 40);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawField(): void {
    const ctx = this.ctx;
    ctx.save();

    // 필드 배경 (각진 캡슐 형태)
    const panelX = this.fieldOffsetX - 20;
    const panelY = this.fieldOffsetY - 20;
    const panelWidth = this.fieldWidth + 40;
    const panelHeight = this.fieldHeight + 40;

    const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    panelGradient.addColorStop(0, 'rgba(5, 10, 32, 0.9)');
    panelGradient.addColorStop(1, 'rgba(12, 24, 54, 0.92)');

    ctx.fillStyle = panelGradient;
    ctx.strokeStyle = 'rgba(0, 240, 200, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY);
    ctx.lineTo(panelX + panelWidth - 24, panelY);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY, panelX + panelWidth, panelY + 24);
    ctx.lineTo(panelX + panelWidth, panelY + panelHeight - 24);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY + panelHeight, panelX + panelWidth - 24, panelY + panelHeight);
    ctx.lineTo(panelX + 24, panelY + panelHeight);
    ctx.quadraticCurveTo(panelX, panelY + panelHeight, panelX, panelY + panelHeight - 24);
    ctx.lineTo(panelX, panelY + 24);
    ctx.quadraticCurveTo(panelX, panelY, panelX + 24, panelY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY);
    ctx.lineTo(panelX + panelWidth - 24, panelY);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY, panelX + panelWidth, panelY + 24);
    ctx.lineTo(panelX + panelWidth, panelY + panelHeight - 24);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY + panelHeight, panelX + panelWidth - 24, panelY + panelHeight);
    ctx.lineTo(panelX + 24, panelY + panelHeight);
    ctx.quadraticCurveTo(panelX, panelY + panelHeight, panelX, panelY + panelHeight - 24);
    ctx.lineTo(panelX, panelY + 24);
    ctx.quadraticCurveTo(panelX, panelY, panelX + 24, panelY);
    ctx.closePath();
    ctx.clip();

    const fieldGradient = ctx.createLinearGradient(
      this.fieldOffsetX,
      this.fieldOffsetY,
      this.fieldOffsetX + this.fieldWidth,
      this.fieldOffsetY + this.fieldHeight
    );
    fieldGradient.addColorStop(0, 'rgba(8, 8, 32, 0.95)');
    fieldGradient.addColorStop(1, 'rgba(4, 10, 24, 0.95)');

    ctx.fillStyle = fieldGradient;
    ctx.fillRect(this.fieldOffsetX, this.fieldOffsetY, this.fieldWidth, this.fieldHeight);

    // 필드 테두리
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.fieldOffsetX, this.fieldOffsetY, this.fieldWidth, this.fieldHeight);

    // 에너지 격자 (대각선 패턴)
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = 'rgba(100, 255, 156, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 14]);

    for (let y = -this.board.height; y < this.board.height * 2; y += 3) {
      const startX = this.fieldOffsetX;
      const startY = this.fieldOffsetY + y * (CELL_SIZE / 2);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + this.fieldWidth, startY + this.fieldWidth * 0.45);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }

  private drawBoard(): void {
    const ctx = this.ctx;
    ctx.save();

    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cell = this.board.cells[y][x];
        if (cell.filled && cell.color) {
          this.drawCell(x, y, cell.color, 1.0);
        }
      }
    }

    ctx.restore();
  }

  private drawCurrentModule(): void {
    if (!this.currentModule) return;

    const cells = getModuleCells(this.currentModule);
    for (const cell of cells) {
      this.drawCell(cell.x, cell.y, this.currentModule.shape.color, 1.0);
    }
  }

  private drawGhostModule(): void {
    if (!this.currentModule) return;

    const ghostPos = calculateGhostPosition(this.board, this.currentModule);
    const ghostModule: ActiveModule = {
      ...this.currentModule,
      position: ghostPos,
    };

    const cells = getModuleCells(ghostModule);
    for (const cell of cells) {
      this.drawCell(cell.x, cell.y, this.currentModule.shape.color, 0.2);
    }
  }

  private drawCell(gridX: number, gridY: number, color: string, alpha: number): void {
    const ctx = this.ctx;
    const px = this.fieldOffsetX + gridX * CELL_SIZE;
    const py = this.fieldOffsetY + gridY * CELL_SIZE;

    ctx.save();
    ctx.globalAlpha = alpha;

    // 셀 채우기
    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // 셀 테두리
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    ctx.restore();
  }

  private drawIncomingModule(): void {
    if (!this.nextModule) return;

    const ctx = this.ctx;
    const previewWidth = CELL_SIZE * 6;
    const previewHeight = CELL_SIZE * 3 + 30;
    const previewX = this.fieldOffsetX + this.fieldWidth + 40;
    const previewY = this.fieldOffsetY + 16;

    ctx.save();

    ctx.fillStyle = 'rgba(4, 12, 28, 0.85)';
    ctx.strokeStyle = 'rgba(255, 106, 243, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(previewX + 12, previewY);
    ctx.lineTo(previewX + previewWidth - 12, previewY);
    ctx.quadraticCurveTo(previewX + previewWidth, previewY, previewX + previewWidth, previewY + 12);
    ctx.lineTo(previewX + previewWidth, previewY + previewHeight);
    ctx.lineTo(previewX, previewY + previewHeight + 20);
    ctx.lineTo(previewX, previewY + 12);
    ctx.quadraticCurveTo(previewX, previewY, previewX + 12, previewY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    this.drawText('incoming cascade', previewX + 18, previewY + 14, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_TINY,
    });

    const cells = this.nextModule.shape.rotations[0];
    for (const cell of cells) {
      const px = previewX + previewWidth / 2 + (cell.x - 0.5) * CELL_SIZE;
      const py = previewY + 36 + (cell.y + 0.2) * CELL_SIZE;

      ctx.fillStyle = this.nextModule.shape.color;
      ctx.fillRect(px, py, CELL_SIZE - 3, CELL_SIZE - 3);
      ctx.strokeStyle = this.nextModule.shape.color;
      ctx.strokeRect(px, py, CELL_SIZE - 3, CELL_SIZE - 3);
    }

    ctx.restore();

    const labelY = previewY + previewHeight + 32;
    this.drawText(this.nextModule.shape.name.toUpperCase(), previewX + previewWidth / 2, labelY, {
      color: '#64ff9c',
      font: FONTS.PIXEL_TINY,
      align: 'center',
    });
  }

  private drawStatusPanel(): void {
    const ctx = this.ctx;
    ctx.save();

    const panelWidth = Math.max(this.fieldWidth, 520);
    const panelHeight = 82;
    const panelX = this.fieldOffsetX + (this.fieldWidth - panelWidth) / 2;
    const panelY = Math.min(this.height - panelHeight - 24, this.fieldOffsetY + this.fieldHeight + 32);

    ctx.fillStyle = 'rgba(6, 16, 36, 0.88)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    const leftColumnX = panelX + 28;
    const centerColumnX = panelX + panelWidth / 2;
    const rightColumnX = panelX + panelWidth - 180;

    this.drawText(`SCORE`, leftColumnX, panelY + 16, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_TINY,
    });
    this.drawText(this.stats.score.toString().padStart(7, '0'), leftColumnX, panelY + 40, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_SMALL,
    });

    const cycleX = leftColumnX + 140;
    this.drawText(`CYCLE`, cycleX, panelY + 16, {
      color: '#64ff9c',
      font: FONTS.PIXEL_TINY,
    });
    this.drawText(this.stats.level.toString().padStart(2, '0'), cycleX, panelY + 40, {
      color: '#64ff9c',
      font: FONTS.PIXEL_SMALL,
    });

    this.drawText(`LINES`, centerColumnX, panelY + 16, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_SMALL,
      align: 'center',
    });

    this.drawText(this.stats.linesCleared.toString().padStart(3, '0'), centerColumnX, panelY + 40, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_SMALL,
      align: 'center',
    });

    this.drawText(`MODULES`, rightColumnX, panelY + 16, {
      color: '#ff8a5c',
      font: FONTS.PIXEL_TINY,
    });

    this.drawText(this.stats.modulesPlaced.toString().padStart(3, '0'), rightColumnX, panelY + 40, {
      color: '#ff8a5c',
      font: FONTS.PIXEL_SMALL,
    });

    const gaugeWidth = 160;
    const gaugeX = rightColumnX;
    const gaugeY = panelY + 52;

    ctx.strokeStyle = 'rgba(255, 138, 92, 0.6)';
    ctx.strokeRect(gaugeX, gaugeY, gaugeWidth, 12);
    ctx.fillStyle = 'rgba(255, 138, 92, 0.65)';
    const cycleTarget = this.stats.level * 4 + 6;
    const progress = Math.min(1, (this.stats.linesCleared % cycleTarget) / cycleTarget);
    ctx.fillRect(gaugeX, gaugeY, gaugeWidth * progress, 12);

    this.drawText('FIELD STABILITY', gaugeX, gaugeY + 20, {
      color: '#f5c2ff',
      font: FONTS.PIXEL_TINY,
      align: 'left',
    });

    ctx.restore();
  }

  private gameOver(): void {
    this.isGameOver = true;
    const highScore = this.storageManager.getHighScore('global');
    if (this.stats.score > highScore) {
      this.storageManager.setHighScore('global', this.stats.score);
    }
  }
}
