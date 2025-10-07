/**
 * Cascade Blocks Game
 * 가변 필드 낙하 퍼즐 게임
 */

import { BaseGame, GameConfig, InputHandler, ScoreManager, StorageManager, NEON_COLORS, BACKGROUND_COLORS } from '../engine';
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
  private scoreManager!: ScoreManager;
  private storageManager!: StorageManager;

  constructor(config: GameConfig) {
    super(config);
    this.init();
  }

  protected init(): void {
    this.inputHandler = new InputHandler({ targetElement: this.canvas });
    this.scoreManager = new ScoreManager();
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

    // 재시작
    if (this.isGameOver && (this.inputHandler.justPressed('Enter') || this.inputHandler.justPressed('r'))) {
      this.startNewGame();
    }
  }

  private updateFalling(deltaTime: number): void {
    if (!this.currentModule) return;

    this.fallTimer += deltaTime;

    if (this.fallTimer >= this.fallInterval) {
      this.fallTimer = 0;

      if (this.moveModule(0, 1)) {
        // 성공적으로 아래로 이동
        this.isLocking = false;
        this.lockTimer = 0;
      } else {
        // 더 이상 아래로 이동 불가 - 착지 상태
        if (!this.isLocking) {
          this.isLocking = true;
          this.lockTimer = 0;
        }

        this.lockTimer += deltaTime;

        if (this.lockTimer >= LOCK_DELAY) {
          this.lockCurrentModule();
        }
      }
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
    this.drawField();
    this.drawBoard();
    this.drawCurrentModule();
    this.drawGhostModule();
    this.drawNextModule();
    this.drawHUD();

    if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'Press ESC to resume');
    }

    if (this.isGameOver) {
      this.drawOverlay('GAME OVER', NEON_COLORS.PINK, 'Press ENTER to restart');
    }
  }

  private drawField(): void {
    const ctx = this.ctx;
    ctx.save();

    // 필드 배경
    ctx.fillStyle = BACKGROUND_COLORS.FIELD;
    ctx.fillRect(this.fieldOffsetX, this.fieldOffsetY, this.fieldWidth, this.fieldHeight);

    // 필드 테두리
    ctx.strokeStyle = NEON_COLORS.CYAN;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.fieldOffsetX, this.fieldOffsetY, this.fieldWidth, this.fieldHeight);

    // 그리드 그리기
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= this.board.width; x++) {
      const px = this.fieldOffsetX + x * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(px, this.fieldOffsetY);
      ctx.lineTo(px, this.fieldOffsetY + this.fieldHeight);
      ctx.stroke();
    }

    for (let y = 0; y <= this.board.height; y++) {
      const py = this.fieldOffsetY + y * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(this.fieldOffsetX, py);
      ctx.lineTo(this.fieldOffsetX + this.fieldWidth, py);
      ctx.stroke();
    }

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

  private drawNextModule(): void {
    if (!this.nextModule) return;

    const ctx = this.ctx;
    const previewX = this.fieldOffsetX + this.fieldWidth + 40;
    const previewY = this.fieldOffsetY + 60;

    ctx.save();

    this.drawText('NEXT', previewX, previewY - 30, {
      color: NEON_COLORS.CYAN,
      font: '14px "Press Start 2P"',
    });

    const cells = this.nextModule.shape.rotations[0];
    for (const cell of cells) {
      const px = previewX + cell.x * CELL_SIZE;
      const py = previewY + cell.y * CELL_SIZE;

      ctx.fillStyle = this.nextModule.shape.color;
      ctx.fillRect(px, py, CELL_SIZE - 2, CELL_SIZE - 2);
      ctx.strokeStyle = this.nextModule.shape.color;
      ctx.strokeRect(px, py, CELL_SIZE - 2, CELL_SIZE - 2);
    }

    ctx.restore();
  }

  private drawHUD(): void {
    const hudX = this.fieldOffsetX;
    const hudY = 30;

    this.drawText(`SCORE  ${this.stats.score.toString().padStart(6, '0')}`, hudX, hudY, {
      color: NEON_COLORS.YELLOW,
      font: '12px "Press Start 2P"',
    });

    this.drawText(`LEVEL  ${this.stats.level}`, hudX, hudY + 25, {
      color: NEON_COLORS.CYAN,
      font: '12px "Press Start 2P"',
    });

    this.drawText(`LINES  ${this.stats.linesCleared}`, hudX + 200, hudY, {
      color: NEON_COLORS.PINK,
      font: '12px "Press Start 2P"',
    });
  }

  private gameOver(): void {
    this.isGameOver = true;
    const highScore = this.storageManager.getHighScore('global');
    if (this.stats.score > highScore) {
      this.storageManager.setHighScore('global', this.stats.score);
    }
  }
}
