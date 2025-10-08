import { BaseGame, GameConfig, InputHandler, NEON_COLORS, BACKGROUND_COLORS, FONTS } from '../engine';
import { createInitialSerpent, SerpentSegment, updateSegmentAges } from './segments';
import { generateHazardField, HazardField, spawnEnergyOrb, toKey } from './energyField';
import { playSound, SOUNDS } from '@/lib/audio/sounds';

interface Vector2 {
  x: number;
  y: number;
}

const TILE_SIZE = 24;
const GRID_COLS = 22;
const GRID_ROWS = 16;
const INITIAL_LENGTH = 5;
const ORB_TARGET = 3;
const BASE_MOVE_INTERVAL = 160; // ms
const HAZARD_TILE_COUNT = 18;
const FIELD_RECONFIG_MS = 8000;
const HAZARD_SLOW_DURATION = 1300;
const OVERLOAD_DURATION = 2400;
const DASH_DURATION = 420;
const DASH_COST = 22;
const DASH_COOLDOWN = 1400;
const MAX_ENERGY = 100;
const OVERLOAD_THRESHOLD = 100;
const MIN_SEGMENTS_AFTER_HAZARD = 3;

export class NeonSerpentGame extends BaseGame {
  private serpent: SerpentSegment[] = [];
  private direction: Vector2 = { x: 1, y: 0 };
  private nextDirection: Vector2 = { x: 1, y: 0 };

  private readonly boardPixelWidth = GRID_COLS * TILE_SIZE;
  private readonly boardPixelHeight = GRID_ROWS * TILE_SIZE;
  private boardOffsetX = 0;
  private boardOffsetY = 0;

  private energyOrbs: Vector2[] = [];
  private hazardField: HazardField = { tiles: [], tileKeys: new Set() };

  private moveAccumulator = 0;
  private fieldTimer = 0;
  private slowTimer = 0;
  private overloadTimer = 0;
  private dashTimer = 0;
  private dashCooldown = 0;
  private energyGauge = 40;
  private score = 0;
  private combo = 0;
  private bestCombo = 0;
  private gameOver = false;
  private pulseTimer = 0;

  private readonly input: InputHandler;

  constructor(config: GameConfig) {
    super(config);
    this.recalculateBoardOffset();
    this.input = new InputHandler({ targetElement: config.canvas });
    this.resetState();
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  private resetState(): void {
    const startX = Math.floor(GRID_COLS / 2) - 2;
    const startY = Math.floor(GRID_ROWS / 2);
    this.serpent = createInitialSerpent({ x: startX, y: startY }, INITIAL_LENGTH);
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.energyOrbs = [];
    this.hazardField = { tiles: [], tileKeys: new Set() };
    this.energyGauge = 40;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.moveAccumulator = 0;
    this.fieldTimer = 0;
    this.slowTimer = 0;
    this.overloadTimer = 0;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.gameOver = false;
    this.pulseTimer = 0;
    this.resetGameCompletion();

    this.rebuildHazards();
    this.ensureOrbCount();
  }

  private restart(): void {
    this.resetState();
  }

  private processInput(): void {
    if (this.input.isPressed('ArrowUp') || this.input.isPressed('w') || this.input.isPressed('W')) {
      this.queueDirection({ x: 0, y: -1 });
    }
    if (this.input.isPressed('ArrowDown') || this.input.isPressed('s') || this.input.isPressed('S')) {
      this.queueDirection({ x: 0, y: 1 });
    }
    if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A')) {
      this.queueDirection({ x: -1, y: 0 });
    }
    if (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D')) {
      this.queueDirection({ x: 1, y: 0 });
    }

    if (this.input.justPressed('Shift')) {
      this.tryDash();
    }

    if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
      this.restart();
    }
  }

  private recalculateBoardOffset(): void {
    this.boardOffsetX = Math.floor((this.width - this.boardPixelWidth) / 2);
    this.boardOffsetY = Math.floor((this.height - this.boardPixelHeight) / 2);
  }

  protected update(deltaTime: number): void {
    if (this.gameOver) {
      this.notifyGameComplete({
        gameId: this.gameId,
        outcome: 'defeat',
        score: this.score,
        timestamp: new Date().toISOString(),
      });
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.restart();
      }
      return;
    }

    this.processInput();

    this.pulseTimer += deltaTime;
    this.fieldTimer += deltaTime;

    if (this.fieldTimer >= FIELD_RECONFIG_MS) {
      this.fieldTimer = 0;
      this.rebuildHazards(true);
    }

    this.slowTimer = Math.max(0, this.slowTimer - deltaTime);
    this.dashTimer = Math.max(0, this.dashTimer - deltaTime);
    this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);

    if (this.overloadTimer > 0) {
      this.overloadTimer = Math.max(0, this.overloadTimer - deltaTime);
      this.energyGauge = Math.max(55, this.energyGauge - deltaTime * 0.02);
      if (this.overloadTimer === 0) {
        this.energyGauge = Math.min(this.energyGauge, 70);
      }
    }

    const interval = this.getMoveInterval();
    this.moveAccumulator += deltaTime;

    while (this.moveAccumulator >= interval) {
      this.moveAccumulator -= interval;
      this.advance();
      if (this.gameOver) break;
    }
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);

    this.drawBoardBackground();
    this.drawHazards();
    this.drawEnergyOrbs();
    this.drawSerpent();
    this.drawHUD();

    if (this.gameOver) {
      this.drawOverlay('SYSTEM FAILURE', '#ff3366', 'ENTER / R TO REBOOT');
    } else if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'SPACE TO RESUME · R TO RESTART');
    }
  }

  private getMoveInterval(): number {
    let interval = BASE_MOVE_INTERVAL;

    if (this.slowTimer > 0) {
      interval *= 1.7;
    }

    if (this.overloadTimer > 0) {
      interval *= 1.4;
    }

    if (this.dashTimer > 0) {
      interval *= 0.55;
    }

    return interval;
  }

  private advance(): void {
    this.direction = this.nextDirection;
    const head = this.serpent[0];
    const newHead: SerpentSegment = {
      x: this.wrap(head.x + this.direction.x, GRID_COLS),
      y: this.wrap(head.y + this.direction.y, GRID_ROWS),
      age: 0,
    };

    if (this.collidesWithSerpent(newHead)) {
      this.gameOver = true;
      playSound(SOUNDS.GAME_OVER);
      return;
    }

    this.serpent.unshift(newHead);

    const headKey = toKey(newHead);
    let consumedOrb = false;

    const orbIndex = this.energyOrbs.findIndex((orb) => orb.x === newHead.x && orb.y === newHead.y);
    if (orbIndex >= 0) {
      consumedOrb = true;
      this.energyOrbs.splice(orbIndex, 1);
      this.handleOrbConsumption();
    }

    const hitHazard = this.hazardField.tileKeys.has(headKey);
    if (!consumedOrb) {
      this.serpent.pop();
    }

    if (hitHazard && this.serpent.length > MIN_SEGMENTS_AFTER_HAZARD) {
      this.serpent.pop();
    }

    updateSegmentAges(this.serpent);

    if (hitHazard) {
      this.handleHazardCollision();
    }

    this.ensureOrbCount();
  }

  private handleOrbConsumption(): void {
    this.combo = Math.min(this.combo + 1, 999);
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const comboBonus = this.combo > 1 ? this.combo * 2 : 0;
    this.score += 15 + comboBonus;
    this.energyGauge = Math.min(MAX_ENERGY, this.energyGauge + 18);

    // 사운드: 콤보가 있으면 파워업, 아니면 코인 사운드
    if (this.combo > 3) {
      playSound(SOUNDS.POWER_UP);
    } else {
      playSound(SOUNDS.COIN);
    }

    if (this.energyGauge >= OVERLOAD_THRESHOLD && this.overloadTimer === 0) {
      this.overloadTimer = OVERLOAD_DURATION;
    }
  }

  private handleHazardCollision(): void {
    this.slowTimer = HAZARD_SLOW_DURATION;
    this.combo = 0;
    this.energyGauge = Math.max(0, this.energyGauge - 16);
  }

  private ensureOrbCount(): void {
    const occupied = this.buildOccupiedKeys();
    for (const key of this.hazardField.tileKeys) {
      occupied.add(key);
    }
    for (const orb of this.energyOrbs) {
      occupied.add(toKey(orb));
    }

    while (this.energyOrbs.length < ORB_TARGET) {
      const orb = spawnEnergyOrb(GRID_COLS, GRID_ROWS, occupied, Math.random);
      if (!orb) break;
      this.energyOrbs.push(orb);
      occupied.add(toKey(orb));
    }
  }

  private rebuildHazards(skipOrbCleanup: boolean = false): void {
    const forbidden = this.buildOccupiedKeys();
    const field = generateHazardField(GRID_COLS, GRID_ROWS, HAZARD_TILE_COUNT, forbidden, Math.random);
    this.hazardField = field;

    if (!skipOrbCleanup) return;

    this.energyOrbs = this.energyOrbs.filter((orb) => !field.tileKeys.has(toKey(orb)));
  }

  private buildOccupiedKeys(): Set<string> {
    const occupied = new Set<string>();
    for (const segment of this.serpent) {
      occupied.add(toKey(segment));
    }
    return occupied;
  }

  private queueDirection(direction: Vector2): void {
    if (this.gameOver) return;
    if (direction.x === -this.direction.x && direction.y === -this.direction.y) {
      return;
    }

    this.nextDirection = direction;
  }

  private tryDash(): void {
    if (this.gameOver) return;
    if (this.dashCooldown > 0 || this.dashTimer > 0) return;
    if (this.energyGauge < DASH_COST) return;

    this.dashTimer = DASH_DURATION;
    this.dashCooldown = DASH_COOLDOWN;
    this.energyGauge = Math.max(0, this.energyGauge - DASH_COST);
  }

  private collidesWithSerpent(pos: Vector2): boolean {
    return this.serpent.some((segment) => segment.x === pos.x && segment.y === pos.y);
  }

  private drawBoardBackground(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = BACKGROUND_COLORS.FIELD;
    ctx.fillRect(this.boardOffsetX - 8, this.boardOffsetY - 8, this.boardPixelWidth + 16, this.boardPixelHeight + 16);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.boardOffsetX - 6, this.boardOffsetY - 6, this.boardPixelWidth + 12, this.boardPixelHeight + 12);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;

    for (let x = 1; x < GRID_COLS; x += 1) {
      const px = this.boardOffsetX + x * TILE_SIZE;
      ctx.beginPath();
      ctx.moveTo(px, this.boardOffsetY);
      ctx.lineTo(px, this.boardOffsetY + this.boardPixelHeight);
      ctx.stroke();
    }

    for (let y = 1; y < GRID_ROWS; y += 1) {
      const py = this.boardOffsetY + y * TILE_SIZE;
      ctx.beginPath();
      ctx.moveTo(this.boardOffsetX, py);
      ctx.lineTo(this.boardOffsetX + this.boardPixelWidth, py);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawHazards(): void {
    const ctx = this.ctx;
    ctx.save();
    for (const tile of this.hazardField.tiles) {
      const x = this.boardOffsetX + tile.x * TILE_SIZE;
      const y = this.boardOffsetY + tile.y * TILE_SIZE;

      const gradient = ctx.createLinearGradient(x, y, x + TILE_SIZE, y + TILE_SIZE);
      gradient.addColorStop(0, 'rgba(255, 51, 102, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 160, 0, 0.45)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

      ctx.strokeStyle = 'rgba(255, 80, 160, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }
    ctx.restore();
  }

  private drawEnergyOrbs(): void {
    const ctx = this.ctx;
    const pulse = 1 + Math.sin(this.pulseTimer * 0.01) * 0.4;

    for (const orb of this.energyOrbs) {
      const centerX = this.boardOffsetX + orb.x * TILE_SIZE + TILE_SIZE / 2;
      const centerY = this.boardOffsetY + orb.y * TILE_SIZE + TILE_SIZE / 2;

      const radius = (TILE_SIZE / 3) * pulse;
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
      gradient.addColorStop(0, '#9dfffb');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0.05)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawSerpent(): void {
    const ctx = this.ctx;
    for (let i = this.serpent.length - 1; i >= 0; i -= 1) {
      const segment = this.serpent[i];
      const x = this.boardOffsetX + segment.x * TILE_SIZE;
      const y = this.boardOffsetY + segment.y * TILE_SIZE;

      if (i === 0) {
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else {
        const alpha = Math.max(0.15, 0.65 - segment.age * 0.05);
        ctx.fillStyle = `rgba(0, 240, 200, ${alpha})`;
        ctx.fillRect(x + 3, y + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      }
    }
  }

  private drawHUD(): void {
    const padding = 24;
    const textY = this.boardOffsetY + this.boardPixelHeight + padding;

    this.drawText(`SCORE ${this.score.toString().padStart(5, '0')}`, this.boardOffsetX, textY, {
      color: NEON_COLORS.CYAN,
      font: FONTS.PIXEL_MEDIUM,
    });
    this.drawText(`COMBO ${this.combo} (BEST ${this.bestCombo})`, this.boardOffsetX, textY + 22, {
      color: NEON_COLORS.PINK,
      font: FONTS.PIXEL_MEDIUM,
    });

    this.drawEnergyGauge();
    this.drawInstruction();
  }

  private drawEnergyGauge(): void {
    const gaugeWidth = 220;
    const gaugeHeight = 14;
    const x = this.boardOffsetX + this.boardPixelWidth - gaugeWidth;
    const y = this.boardOffsetY + this.boardPixelHeight + 42;

    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = NEON_COLORS.CYAN;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, gaugeWidth, gaugeHeight);

    const energyRatio = this.energyGauge / MAX_ENERGY;
    const filledWidth = gaugeWidth * energyRatio;

    const gradient = ctx.createLinearGradient(x, y, x + gaugeWidth, y);
    gradient.addColorStop(0, '#3af6ff');
    gradient.addColorStop(1, NEON_COLORS.PINK);

    ctx.fillStyle = gradient;
    ctx.fillRect(x + 1, y + 1, filledWidth - 2, gaugeHeight - 2);
    ctx.restore();

    const status = this.overloadTimer > 0 ? 'OVERLOAD COOLDOWN' : this.dashCooldown > 0 ? 'DASH RECHARGING' : 'SHIFT FOR DASH';
    const color = this.overloadTimer > 0 ? '#ff4f6d' : this.dashCooldown > 0 ? NEON_COLORS.YELLOW : NEON_COLORS.CYAN;
    this.drawText(status, x, y - 18, { color, font: FONTS.PIXEL_SMALL });
  }

  private drawInstruction(): void {
    const infoX = this.boardOffsetX + this.boardPixelWidth / 2;
    const infoY = this.boardOffsetY - 32;

    this.drawText('ARROWS MOVE  |  SHIFT DASH  |  SPACE PAUSE  |  ENTER/R REBOOT', infoX, infoY, {
      color: '#8b9fff',
      font: FONTS.PIXEL_SMALL,
      align: 'center',
    });
  }

  private wrap(value: number, max: number): number {
    let result = value % max;
    if (result < 0) {
      result += max;
    }
    return result;
  }
}
