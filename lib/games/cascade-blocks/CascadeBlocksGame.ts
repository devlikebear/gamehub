/**
 * Color Match Cascade Game
 * 컬러 매칭 퍼즐 게임
 */

import { BaseGame, GameConfig, InputHandler, StorageManager, NEON_COLORS, BACKGROUND_COLORS, FONTS } from '../engine';
import { GameBoard, FallingBlock, GameStats, MatchGroup, BlockColor } from './types';
import { playSound, SOUNDS } from '@/lib/audio/sounds';
import {
  createEmptyBoard,
  createRandomBlock,
  isValidPosition,
  lockBlock,
  findAllMatches,
  removeMatches,
  applyGravity,
  calculateGhostPosition,
  getBlockCells,
  getColorHex,
} from './board';

const CELL_SIZE = 28;
const FALL_SPEED = 800;
const FAST_FALL_SPEED = 50;
const MOVE_DELAY = 120;
const LOCK_DELAY = 500;
const MATCH_ANIMATION_DURATION = 400;
const GRAVITY_ANIMATION_DURATION = 300;

export class CascadeBlocksGame extends BaseGame {
  private readonly gameId = 'cascade-blocks';
  private board!: GameBoard;
  private currentBlock: FallingBlock | null = null;
  private nextBlock: FallingBlock | null = null;
  private stats: GameStats = {
    score: 0,
    level: 1,
    blocksCleared: 0,
    maxCombo: 0,
    blocksPlaced: 0,
  };
  private isGameOver = false;
  private isProcessing = false;

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

  private currentCombo = 0;
  private matchingBlocks: MatchGroup[] = [];
  private matchAnimationTimer = 0;

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
      blocksCleared: 0,
      maxCombo: 0,
      blocksPlaced: 0,
    };

    this.board = createEmptyBoard(10, 14);
    this.currentCombo = 0;
    this.matchingBlocks = [];
    this.isProcessing = false;

    this.fieldWidth = this.board.width * CELL_SIZE;
    this.fieldHeight = this.board.height * CELL_SIZE;
    this.fieldOffsetX = (this.width - this.fieldWidth) / 2;
    this.fieldOffsetY = 70;

    this.spawnNewBlock();
    this.nextBlock = createRandomBlock();
    this.isGameOver = false;
    this.resetGameCompletion();
  }

  private spawnNewBlock(): void {
    if (this.nextBlock) {
      this.currentBlock = this.nextBlock;
      this.nextBlock = createRandomBlock();
    } else {
      this.currentBlock = createRandomBlock();
    }

    this.fallTimer = 0;
    this.lockTimer = 0;
    this.isLocking = false;
    this.isFastFalling = false;

    if (this.currentBlock && !isValidPosition(this.board, this.currentBlock)) {
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
    if (this.getIsPaused() || this.isGameOver || !this.currentBlock) return;

    if (this.isProcessing) {
      this.updateMatchAnimation(deltaTime);
      return;
    }

    this.handleInput(deltaTime);
    this.updateFalling(deltaTime);
  }

  private handleInput(deltaTime: number): void {
    if (!this.currentBlock || this.isProcessing) return;

    this.moveTimer += deltaTime;

    if (this.moveTimer >= MOVE_DELAY) {
      if (this.inputHandler.isPressed('ArrowLeft')) {
        this.moveBlock(-1, 0);
        this.moveTimer = 0;
      } else if (this.inputHandler.isPressed('ArrowRight')) {
        this.moveBlock(1, 0);
        this.moveTimer = 0;
      }
    }

    if (this.inputHandler.justPressed('ArrowUp')) {
      this.rotateBlock();
    }

    if (this.inputHandler.isPressed('ArrowDown')) {
      this.isFastFalling = true;
      this.fallInterval = FAST_FALL_SPEED;
    } else {
      this.isFastFalling = false;
      this.fallInterval = FALL_SPEED;
    }

    if (this.inputHandler.justPressed(' ')) {
      this.hardDrop();
    }

    if (this.inputHandler.justPressed('Escape') || this.inputHandler.justPressed('p')) {
      this.togglePause();
    }
  }

  private updateFalling(deltaTime: number): void {
    if (!this.currentBlock || this.isProcessing) return;

    if (this.isLocking) {
      this.lockTimer += deltaTime;
      if (this.lockTimer >= LOCK_DELAY) {
        this.lockCurrentBlock();
        return;
      }
    }

    this.fallTimer += deltaTime;

    if (this.fallTimer < this.fallInterval) {
      return;
    }

    this.fallTimer = 0;

    if (this.moveBlock(0, 1)) {
      this.isLocking = false;
      this.lockTimer = 0;
      return;
    }

    if (!this.isLocking) {
      this.isLocking = true;
      this.lockTimer = 0;
    }
  }

  private moveBlock(dx: number, dy: number): boolean {
    if (!this.currentBlock) return false;

    const newPosition = {
      x: this.currentBlock.position.x + dx,
      y: this.currentBlock.position.y + dy,
    };

    const testBlock: FallingBlock = {
      ...this.currentBlock,
      position: newPosition,
    };

    if (isValidPosition(this.board, testBlock)) {
      this.currentBlock.position = newPosition;
      return true;
    }

    return false;
  }

  private rotateBlock(): void {
    if (!this.currentBlock) return;

    const newOrientation = this.currentBlock.orientation === 'vertical' ? 'horizontal' : 'vertical';
    const testBlock: FallingBlock = {
      ...this.currentBlock,
      orientation: newOrientation,
    };

    if (isValidPosition(this.board, testBlock)) {
      this.currentBlock.orientation = newOrientation;
      playSound(SOUNDS.BEEP); // 회전 소리
    }
  }

  private hardDrop(): void {
    if (!this.currentBlock) return;

    while (this.moveBlock(0, 1)) {
      // 바닥까지 이동
    }

    playSound(SOUNDS.LASER); // 하드 드롭 소리
    this.lockCurrentBlock();
  }

  private async lockCurrentBlock(): Promise<void> {
    if (!this.currentBlock) return;

    lockBlock(this.board, this.currentBlock);
    this.stats.blocksPlaced++;
    playSound(SOUNDS.CLICK); // 블록 고정 소리
    this.currentBlock = null;

    await this.processMatches();
  }

  private async processMatches(comboCount: number = 0): Promise<void> {
    this.isProcessing = true;

    const matches = findAllMatches(this.board);

    if (matches.length === 0) {
      this.isProcessing = false;
      this.currentCombo = 0;
      this.spawnNewBlock();
      return;
    }

    this.currentCombo = comboCount + 1;
    this.stats.maxCombo = Math.max(this.stats.maxCombo, this.currentCombo);

    this.matchingBlocks = matches;
    this.matchAnimationTimer = 0;

    await this.waitForAnimation(MATCH_ANIMATION_DURATION);

    const blocksRemoved = removeMatches(this.board, matches);
    this.stats.blocksCleared += blocksRemoved;
    this.stats.score += blocksRemoved * 100 * this.currentCombo;

    // 콤보에 따라 다른 소리
    if (this.currentCombo > 3) {
      playSound(SOUNDS.POWER_UP); // 높은 콤보
    } else if (this.currentCombo > 1) {
      playSound(SOUNDS.COIN); // 일반 콤보
    } else {
      playSound(SOUNDS.EXPLOSION); // 단일 매치
    }

    this.matchingBlocks = [];

    await this.waitForAnimation(GRAVITY_ANIMATION_DURATION);

    applyGravity(this.board);

    await this.waitForAnimation(GRAVITY_ANIMATION_DURATION);

    if (this.stats.blocksCleared >= this.stats.level * 30) {
      this.stats.level++;
      this.fallInterval = Math.max(300, FALL_SPEED - this.stats.level * 50);
    }

    this.processMatches(this.currentCombo);
  }

  private async waitForAnimation(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  private updateMatchAnimation(deltaTime: number): void {
    this.matchAnimationTimer += deltaTime;
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawBackdrop();
    this.drawField();
    this.drawBoard();
    this.drawGhostBlock();
    this.drawCurrentBlock();
    this.drawMatchingBlocks();
    this.drawNextBlock();
    this.drawStatusPanel();
    this.drawComboDisplay();

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
    haloGradient.addColorStop(0, 'rgba(157, 0, 255, 0.15)');
    haloGradient.addColorStop(1, 'rgba(157, 0, 255, 0)');

    ctx.fillStyle = haloGradient;
    ctx.fillRect(0, this.fieldOffsetY - 120, this.width, this.fieldHeight + 240);

    ctx.restore();
  }

  private drawField(): void {
    const ctx = this.ctx;
    ctx.save();

    const panelX = this.fieldOffsetX - 20;
    const panelY = this.fieldOffsetY - 20;
    const panelWidth = this.fieldWidth + 40;
    const panelHeight = this.fieldHeight + 40;

    const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    panelGradient.addColorStop(0, 'rgba(5, 10, 32, 0.9)');
    panelGradient.addColorStop(1, 'rgba(12, 24, 54, 0.92)');

    ctx.fillStyle = panelGradient;
    ctx.strokeStyle = 'rgba(157, 0, 255, 0.45)';
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

    ctx.strokeStyle = 'rgba(157, 0, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.fieldOffsetX, this.fieldOffsetY, this.fieldWidth, this.fieldHeight);

    ctx.restore();
  }

  private drawBoard(): void {
    const ctx = this.ctx;
    ctx.save();

    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cell = this.board.cells[y][x];
        if (cell.color) {
          this.drawCell(x, y, cell.color, 1.0);
        }
      }
    }

    ctx.restore();
  }

  private drawCurrentBlock(): void {
    if (!this.currentBlock) return;

    const cells = getBlockCells(this.currentBlock);
    cells.forEach((pos, index) => {
      if (pos.y >= 0) {
        this.drawCell(pos.x, pos.y, this.currentBlock!.cells[index], 1.0);
      }
    });
  }

  private drawGhostBlock(): void {
    if (!this.currentBlock) return;

    const ghostPos = calculateGhostPosition(this.board, this.currentBlock);
    const ghostBlock = { ...this.currentBlock, position: ghostPos };
    const cells = getBlockCells(ghostBlock);

    cells.forEach((pos, index) => {
      if (pos.y >= 0) {
        this.drawCell(pos.x, pos.y, this.currentBlock!.cells[index], 0.2);
      }
    });
  }

  private drawMatchingBlocks(): void {
    if (this.matchingBlocks.length === 0) return;

    const ctx = this.ctx;
    const alpha = 0.5 + 0.5 * Math.sin((this.matchAnimationTimer / MATCH_ANIMATION_DURATION) * Math.PI * 4);

    for (const match of this.matchingBlocks) {
      for (const pos of match.positions) {
        ctx.save();
        ctx.globalAlpha = alpha;
        this.drawCell(pos.x, pos.y, match.color, 1.0);
        ctx.restore();
      }
    }
  }

  private drawCell(gridX: number, gridY: number, color: string, alpha: number): void {
    const ctx = this.ctx;
    const px = this.fieldOffsetX + gridX * CELL_SIZE;
    const py = this.fieldOffsetY + gridY * CELL_SIZE;
    const colorHex = getColorHex(color as BlockColor);

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = colorHex;
    ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    ctx.restore();
  }

  private drawNextBlock(): void {
    if (!this.nextBlock) return;

    const ctx = this.ctx;
    const previewWidth = CELL_SIZE * 4;
    const previewHeight = CELL_SIZE * 3 + 30;
    const previewX = this.fieldOffsetX + this.fieldWidth + 40;
    const previewY = this.fieldOffsetY + 16;

    ctx.save();

    ctx.fillStyle = 'rgba(4, 12, 28, 0.85)';
    ctx.strokeStyle = 'rgba(255, 16, 240, 0.45)';
    ctx.lineWidth = 2;
    ctx.fillRect(previewX, previewY, previewWidth, previewHeight);
    ctx.strokeRect(previewX, previewY, previewWidth, previewHeight);

    this.drawText('NEXT', previewX + previewWidth / 2, previewY + 16, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_TINY,
      align: 'center',
    });

    const cells = this.nextBlock.cells;
    const centerX = previewX + previewWidth / 2;
    const centerY = previewY + previewHeight / 2 + 8;

    cells.forEach((color, index) => {
      const offsetY = index * CELL_SIZE - CELL_SIZE / 2;
      const px = centerX - CELL_SIZE / 2;
      const py = centerY + offsetY;

      const colorHex = getColorHex(color);
      ctx.fillStyle = colorHex;
      ctx.fillRect(px, py, CELL_SIZE - 4, CELL_SIZE - 4);
      ctx.strokeStyle = colorHex;
      ctx.strokeRect(px, py, CELL_SIZE - 4, CELL_SIZE - 4);
    });

    ctx.restore();
  }

  private drawStatusPanel(): void {
    const ctx = this.ctx;
    ctx.save();

    const panelWidth = Math.max(this.fieldWidth, 400);
    const panelHeight = 70;
    const panelX = this.fieldOffsetX - (panelWidth - this.fieldWidth) / 2;
    const panelY = this.height - panelHeight - 15;

    ctx.fillStyle = 'rgba(6, 16, 36, 0.88)';
    ctx.strokeStyle = 'rgba(157, 0, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    const col1X = panelX + 30;
    const col2X = panelX + panelWidth / 2;
    const col3X = panelX + panelWidth - 120;

    this.drawText('SCORE', col1X, panelY + 16, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_TINY,
    });
    this.drawText(this.stats.score.toString().padStart(7, '0'), col1X, panelY + 40, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_SMALL,
    });

    this.drawText('LEVEL', col2X, panelY + 16, {
      color: NEON_COLORS.CYAN,
      font: FONTS.PIXEL_TINY,
      align: 'center',
    });
    this.drawText(this.stats.level.toString().padStart(2, '0'), col2X, panelY + 40, {
      color: NEON_COLORS.CYAN,
      font: FONTS.PIXEL_SMALL,
      align: 'center',
    });

    this.drawText('CLEARED', col3X, panelY + 16, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_TINY,
    });
    this.drawText(this.stats.blocksCleared.toString().padStart(4, '0'), col3X, panelY + 40, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_SMALL,
    });

    ctx.restore();
  }

  private drawComboDisplay(): void {
    if (this.currentCombo <= 1) return;

    const ctx = this.ctx;
    const comboX = this.fieldOffsetX + this.fieldWidth / 2;
    const comboY = this.fieldOffsetY - 40;

    ctx.save();

    const scale = 1 + Math.sin((this.matchAnimationTimer / 200) * Math.PI) * 0.2;
    ctx.translate(comboX, comboY);
    ctx.scale(scale, scale);

    this.drawText(`${this.currentCombo}X COMBO!`, 0, 0, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_MEDIUM,
      align: 'center',
    });

    ctx.restore();
  }

  private gameOver(): void {
    this.isGameOver = true;
    playSound(SOUNDS.GAME_OVER); // 게임 오버 소리
    this.notifyGameComplete({
      gameId: this.gameId,
      outcome: 'defeat',
      score: this.stats.score,
      timestamp: new Date().toISOString(),
    });
    const highScore = this.storageManager.getHighScore('global');
    if (this.stats.score > highScore) {
      this.storageManager.setHighScore('global', this.stats.score);
    }
  }
}
