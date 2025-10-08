import { BaseGame, GameConfig, NEON_COLORS, BACKGROUND_COLORS, FONTS } from '../engine';
import { ArenaPattern, pickRandomPattern } from './arena';
import { Ball, Paddle, clamp, createBall, createPaddle } from './entities';
import { playSound, SOUNDS } from '@/lib/audio/sounds';

const FIELD_MARGIN_X = 70;
const FIELD_MARGIN_Y = 80;
const SCORE_TO_WIN = 7;

export class PulsePaddlesGame extends BaseGame {
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private ball: Ball;

  private readonly keys = new Set<string>();

  private fieldLeft = FIELD_MARGIN_X;
  private fieldTop = FIELD_MARGIN_Y;
  private fieldWidth = 0;
  private fieldHeight = 0;

  private isBallActive = false;
  private roundResetTimer = 0;
  private matchOver = false;
  private lastServer: 'left' | 'right' = 'right';

  private scoreLeft = 0;
  private scoreRight = 0;

  private comboGlow = 0;
  private pulseFlash = 0;

  private pattern: ArenaPattern = pickRandomPattern();
  private patternTimer = 0;
  private zoneStates: boolean[] = [];

  private readonly aiState = {
    agility: 0.65,
    errorMargin: 24,
  };

  private isTwoPlayer = false;

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;

    let handled = false;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ': // Space
      case 'Shift':
      case 'w':
      case 'W':
      case 's':
      case 'S':
      case 'f':
      case 'F':
        handled = true;
        break;
      case '1':
      case '!':
        this.isTwoPlayer = false;
        handled = true;
        break;
      case '2':
      case '@':
        this.isTwoPlayer = true;
        handled = true;
        break;
      case 'Enter':
        if (this.matchOver) {
          this.resetMatch();
        }
        handled = true;
        break;
      default:
        break;
    }

    this.keys.add(event.key);

    if (handled) {
      event.preventDefault();
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.key);
  };

  constructor(config: GameConfig) {
    super(config);
    this.recalculateField();

    const centerX = this.fieldLeft + this.fieldWidth / 2;
    const centerY = this.fieldTop + this.fieldHeight / 2;

    this.leftPaddle = createPaddle(this.fieldLeft + 20, centerY - 60, 16, 120, 0.45);
    this.rightPaddle = createPaddle(this.fieldLeft + this.fieldWidth - 36, centerY - 60, 16, 120, 0.46);
    this.ball = createBall(centerX, centerY, 10, 0.42);
    this.zoneStates = this.pattern.zones.map(() => false);
    this.scheduleServe('left');
  }

  protected onStart(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  protected onStop(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  protected update(deltaTime: number): void {
    if (this.matchOver) {
      return;
    }

    this.patternTimer += deltaTime;
    this.comboGlow = Math.max(0, this.comboGlow - deltaTime * 0.0035);
    this.pulseFlash = Math.max(0, this.pulseFlash - deltaTime * 0.006);

    if (this.roundResetTimer > 0) {
      this.roundResetTimer -= deltaTime;
      if (this.roundResetTimer <= 0) {
        this.launchBall(this.lastServer === 'left' ? 'right' : 'left');
      }
    }

    this.updatePaddles(deltaTime);
    this.updateBall(deltaTime);
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARK);
    this.drawArena();
    this.drawZones();
    this.drawPaddles();
    this.drawBall();
    this.drawHUD();
    if (this.matchOver) {
      this.drawOverlay('MATCH COMPLETE', NEON_COLORS.PINK, 'Enter 키로 재시작');
    }
    this.publishDebugState();
  }

  private recalculateField(): void {
    this.fieldWidth = this.width - FIELD_MARGIN_X * 2;
    this.fieldHeight = this.height - FIELD_MARGIN_Y * 2;
    this.fieldLeft = FIELD_MARGIN_X;
    this.fieldTop = FIELD_MARGIN_Y;
  }

  private scheduleServe(server: 'left' | 'right'): void {
    this.isBallActive = false;
    this.roundResetTimer = 900;
    this.ball.x = this.fieldLeft + this.fieldWidth / 2;
    this.ball.y = this.fieldTop + this.fieldHeight / 2;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.lastServer = server;
    this.pattern = pickRandomPattern();
    this.zoneStates = this.pattern.zones.map(() => false);
    this.patternTimer = 0;

    const centerY = this.fieldTop + this.fieldHeight / 2;
    this.leftPaddle.y = centerY - this.leftPaddle.height / 2;
    this.rightPaddle.y = centerY - this.rightPaddle.height / 2;
    this.leftPaddle.spinCharge = 0;
    this.rightPaddle.spinCharge = 0;
  }

  private launchBall(direction: 'left' | 'right'): void {
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI;
    const speed = this.ball.baseSpeed * (1 + (this.scoreLeft + this.scoreRight) * 0.03);
    const dir = direction === 'left' ? -1 : 1;
    this.ball.vx = Math.cos(angle) * speed * dir;
    this.ball.vy = Math.sin(angle) * speed;
    this.isBallActive = true;
  }

  private updatePaddles(deltaTime: number): void {
    const leftDirection = (this.keys.has('ArrowDown') ? 1 : 0) - (this.keys.has('ArrowUp') ? 1 : 0);
    this.leftPaddle.y += leftDirection * this.leftPaddle.speed * deltaTime;
    this.leftPaddle.y = clamp(this.leftPaddle.y, this.fieldTop, this.fieldTop + this.fieldHeight - this.leftPaddle.height);

    if (this.keys.has(' ') || this.keys.has('Shift')) {
      this.leftPaddle.spinCharge = Math.min(3, this.leftPaddle.spinCharge + deltaTime * 0.004);
    } else {
      this.leftPaddle.spinCharge = Math.max(0, this.leftPaddle.spinCharge - deltaTime * 0.006);
    }

    if (this.isTwoPlayer) {
      const rightDirection = (this.keys.has('s') || this.keys.has('S') ? 1 : 0) - (this.keys.has('w') || this.keys.has('W') ? 1 : 0);
      this.rightPaddle.y += rightDirection * this.rightPaddle.speed * deltaTime;
    } else {
      this.updateAI(deltaTime);
    }

    this.rightPaddle.y = clamp(this.rightPaddle.y, this.fieldTop, this.fieldTop + this.fieldHeight - this.rightPaddle.height);

    if (this.keys.has('f') || this.keys.has('F')) {
      this.rightPaddle.spinCharge = Math.min(3, this.rightPaddle.spinCharge + deltaTime * 0.004);
    } else {
      this.rightPaddle.spinCharge = Math.max(0, this.rightPaddle.spinCharge - deltaTime * 0.006);
    }
  }

  private updateAI(deltaTime: number): void {
    const paddle = this.rightPaddle;
    const target = this.ball.y - paddle.height / 2 + (Math.random() * this.aiState.errorMargin - this.aiState.errorMargin / 2);
    const diff = target - paddle.y;
    const maxStep = paddle.speed * this.aiState.agility * deltaTime;
    const clamped = clamp(diff, -maxStep, maxStep);
    paddle.y += clamped;

    const spinBias = Math.abs(diff) < 18 ? 0.002 : 0;
    paddle.spinCharge = Math.max(0, Math.min(3, paddle.spinCharge + spinBias * deltaTime - 0.006 * deltaTime));

    if (this.scoreLeft > this.scoreRight + 1) {
      this.aiState.agility = 0.75;
      this.aiState.errorMargin = 16;
    } else if (this.scoreRight > this.scoreLeft + 1) {
      this.aiState.agility = 0.55;
      this.aiState.errorMargin = 30;
    } else {
      this.aiState.agility = 0.65;
      this.aiState.errorMargin = 24;
    }
  }

  private updateBall(deltaTime: number): void {
    if (!this.isBallActive) {
      return;
    }

    const nextY = this.ball.y + this.ball.vy * deltaTime;

    // 상하 반사
    if (nextY - this.ball.radius <= this.fieldTop || nextY + this.ball.radius >= this.fieldTop + this.fieldHeight) {
      this.ball.vy *= -1;
      this.ball.y = clamp(nextY, this.fieldTop + this.ball.radius, this.fieldTop + this.fieldHeight - this.ball.radius);
    }

    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;

    this.applySpeedZones();
    this.handlePaddleCollision();
    this.checkGoals();
  }

  private applySpeedZones(): void {
    const left = this.fieldLeft;
    const width = this.fieldWidth;

    this.pattern.zones.forEach((zone, index) => {
      const zoneLeft = left + zone.start * width;
      const zoneRight = left + zone.end * width;
      const inside = this.ball.x + this.ball.radius >= zoneLeft && this.ball.x - this.ball.radius <= zoneRight;

      if (inside && !this.zoneStates[index]) {
        this.ball.vx *= zone.multiplier;
        this.ball.vy *= zone.multiplier;
        const speedLimit = this.ball.baseSpeed * 1.9;
        this.ball.vx = clamp(this.ball.vx, -speedLimit, speedLimit);
        this.ball.vy = clamp(this.ball.vy, -speedLimit, speedLimit);
        this.zoneStates[index] = true;
        this.pulseFlash = 1;
        playSound(SOUNDS.POWER_UP); // 존 가속 소리
      }

      if (!inside && this.zoneStates[index]) {
        this.zoneStates[index] = false;
      }
    });

    const minSpeed = this.ball.baseSpeed * 0.38;
    if (Math.abs(this.ball.vx) < minSpeed) {
      const direction = this.ball.vx === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(this.ball.vx);
      this.ball.vx = minSpeed * direction;
    }
    this.ball.vy = clamp(this.ball.vy, -this.ball.baseSpeed * 1.6, this.ball.baseSpeed * 1.6);
  }

  private handlePaddleCollision(): void {
    const left = this.leftPaddle;
    const right = this.rightPaddle;

    // 왼쪽 패들
    if (
      this.ball.vx < 0 &&
      this.ball.x - this.ball.radius <= left.x + left.width &&
      this.ball.x - this.ball.radius > left.x &&
      this.ball.y >= left.y - 4 &&
      this.ball.y <= left.y + left.height + 4
    ) {
      const offset = (this.ball.y - (left.y + left.height / 2)) / (left.height / 2);
      const spin = left.spinCharge;
      left.spinCharge = 0;
      this.ball.x = left.x + left.width + this.ball.radius + 1;
      this.ball.vx = Math.abs(this.ball.vx) + this.ball.baseSpeed * (0.12 + Math.abs(offset) * 0.08 + spin * 0.05);
      this.ball.vy += this.ball.baseSpeed * (offset * 0.6 + spin * 0.18);
      this.ball.vx = clamp(this.ball.vx, this.ball.baseSpeed * 0.5, this.ball.baseSpeed * 2);
      this.comboGlow = Math.min(1.6, this.comboGlow + 0.35 + spin * 0.3);
      playSound(SOUNDS.CLICK); // 패들 충돌음
    }

    // 오른쪽 패들
    if (
      this.ball.vx > 0 &&
      this.ball.x + this.ball.radius >= right.x &&
      this.ball.x + this.ball.radius < right.x + right.width &&
      this.ball.y >= right.y - 4 &&
      this.ball.y <= right.y + right.height + 4
    ) {
      const offset = (this.ball.y - (right.y + right.height / 2)) / (right.height / 2);
      const spin = right.spinCharge;
      right.spinCharge = 0;
      this.ball.x = right.x - this.ball.radius - 1;
      this.ball.vx = -Math.abs(this.ball.vx) - this.ball.baseSpeed * (0.12 + Math.abs(offset) * 0.08 + spin * 0.05);
      this.ball.vy += this.ball.baseSpeed * (offset * 0.6 - spin * 0.18);
      this.ball.vx = clamp(this.ball.vx, -this.ball.baseSpeed * 2, -this.ball.baseSpeed * 0.5);
      this.comboGlow = Math.min(1.6, this.comboGlow + 0.35 + spin * 0.3);
      playSound(SOUNDS.CLICK); // 패들 충돌음
    }
  }

  private checkGoals(): void {
    if (this.ball.x + this.ball.radius < this.fieldLeft) {
      this.handleScore('right');
    } else if (this.ball.x - this.ball.radius > this.fieldLeft + this.fieldWidth) {
      this.handleScore('left');
    }
  }

  private handleScore(winner: 'left' | 'right'): void {
    if (winner === 'left') {
      this.scoreLeft += 1;
      playSound(SOUNDS.COIN); // 득점 소리
    } else {
      this.scoreRight += 1;
      playSound(SOUNDS.BEEP); // 실점 소리
    }

    if (this.scoreLeft >= SCORE_TO_WIN || this.scoreRight >= SCORE_TO_WIN) {
      this.matchOver = true;
      playSound(this.scoreLeft >= SCORE_TO_WIN ? SOUNDS.VICTORY : SOUNDS.GAME_OVER); // 승리/패배 소리
      this.notifyGameComplete({
        gameId: this.gameId,
        outcome: this.scoreLeft >= SCORE_TO_WIN ? 'victory' : 'defeat',
        score: this.scoreLeft,
        timestamp: new Date().toISOString(),
      });
      this.isBallActive = false;
      this.ball.x = this.fieldLeft + this.fieldWidth / 2;
      this.ball.y = this.fieldTop + this.fieldHeight / 2;
      this.ball.vx = 0;
      this.ball.vy = 0;
      return;
    }

    this.scheduleServe(winner === 'left' ? 'right' : 'left');
  }

  private resetMatch(): void {
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.comboGlow = 0;
    this.matchOver = false;
    this.isTwoPlayer = false;
    this.resetGameCompletion();
    this.scheduleServe('left');
  }

  private drawArena(): void {
    const ctx = this.ctx;
    ctx.save();

    const backgroundGradient = ctx.createLinearGradient(0, this.fieldTop, 0, this.fieldTop + this.fieldHeight);
    backgroundGradient.addColorStop(0, BACKGROUND_COLORS.FIELD_DARK);
    backgroundGradient.addColorStop(1, BACKGROUND_COLORS.DARKER);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight);

    ctx.strokeStyle = this.pulseFlash > 0 ? 'rgba(255, 16, 240, 0.7)' : 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight);

    ctx.setLineDash([12, 12]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.fieldLeft + this.fieldWidth / 2, this.fieldTop);
    ctx.lineTo(this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  private drawZones(): void {
    const ctx = this.ctx;
    const width = this.fieldWidth;
    for (const zone of this.pattern.zones) {
      const zoneLeft = this.fieldLeft + zone.start * width;
      const zoneWidth = Math.max(10, (zone.end - zone.start) * width);
      ctx.save();
      ctx.globalAlpha = 0.25 + this.pulseFlash * 0.3;
      ctx.fillStyle = zone.color;
      ctx.fillRect(zoneLeft, this.fieldTop, zoneWidth, this.fieldHeight);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = zone.color;
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(zoneLeft, this.fieldTop + 4, zoneWidth, this.fieldHeight - 8);
      ctx.restore();

      if (this.patternTimer < 1800) {
        this.drawText(zone.label, zoneLeft + zoneWidth / 2 - 24, this.fieldTop + this.fieldHeight / 2 - 8, {
          color: zone.color,
          font: FONTS.PIXEL_SMALL,
        });
      }
    }
  }

  private drawPaddles(): void {
    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = NEON_COLORS.CYAN;
    ctx.fillRect(this.leftPaddle.x, this.leftPaddle.y, this.leftPaddle.width, this.leftPaddle.height);

    ctx.fillStyle = NEON_COLORS.PINK;
    ctx.fillRect(this.rightPaddle.x, this.rightPaddle.y, this.rightPaddle.width, this.rightPaddle.height);

    ctx.restore();
  }

  private drawBall(): void {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(this.ball.x, this.ball.y, 2, this.ball.x, this.ball.y, this.ball.radius + 4);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, this.pulseFlash > 0 ? 'rgba(255, 16, 240, 0.3)' : 'rgba(160, 255, 255, 0.3)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius + 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawHUD(): void {
    const headerY = this.fieldTop - 40;
    const scoreColorLeft = this.comboGlow > 0.5 ? NEON_COLORS.CYAN : '#8b9fff';
    const scoreColorRight = this.comboGlow > 0.5 ? NEON_COLORS.PINK : '#ff89ff';

    this.drawText(`PLAYER ${this.scoreLeft}`, this.fieldLeft, headerY, {
      color: scoreColorLeft,
      font: '14px "Press Start 2P"',
    });

    this.drawText(`RIVAL ${this.scoreRight}`, this.fieldLeft + this.fieldWidth, headerY, {
      color: scoreColorRight,
      font: '14px "Press Start 2P"',
      align: 'right',
    });

    const modeText = this.isTwoPlayer ? 'MODE: LOCAL 2P (W/S + F)' : 'MODE: AI (1P)';
    this.drawText(modeText, this.fieldLeft + this.fieldWidth / 2, headerY, {
      color: NEON_COLORS.YELLOW,
      font: FONTS.PIXEL_SMALL,
      align: 'center',
    });

    const showingShift = this.patternTimer < 2200;
    if (showingShift) {
      this.drawText(`ARENA SHIFT · ${this.pattern.name}`, this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight + 24, {
        color: NEON_COLORS.PINK,
        font: FONTS.PIXEL_SMALL,
        align: 'center',
      });
      this.drawText(this.pattern.description, this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight + 46, {
        color: '#8b9fff',
        font: FONTS.PIXEL_TINY,
        align: 'center',
      });
    }

    this.drawSpinMeter();

    if (!showingShift) {
      this.drawText('←/→ 방향키: 이동 · Space/Shift: 커브샷 · 1: AI · 2: 로컬2P · Enter: 리셋', this.fieldLeft + this.fieldWidth / 2, this.height - 32, {
        color: '#7c86ff',
        font: FONTS.PIXEL_TINY,
        align: 'center',
      });
    }
  }

  private drawSpinMeter(): void {
    const gaugeWidth = 130;
    const gaugeHeight = 10;

    const leftRatio = this.leftPaddle.spinCharge / 3;
    const rightRatio = this.rightPaddle.spinCharge / 3;

    const leftX = this.fieldLeft;
    const rightX = this.fieldLeft + this.fieldWidth - gaugeWidth;
    const y = this.fieldTop - 18;

    this.drawGauge(leftX, y, gaugeWidth, gaugeHeight, leftRatio, '#00f0ff');
    this.drawGauge(rightX, y, gaugeWidth, gaugeHeight, rightRatio, '#ff10f0');
  }

  private drawGauge(x: number, y: number, width: number, height: number, ratio: number, color: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(x + 1, y + 1, (width - 2) * clamp(ratio, 0, 1), height - 2);
    ctx.restore();
  }

  private publishDebugState(): void {
    if (typeof window === 'undefined') return;
    (window as unknown as { __pulsePaddlesDebug?: unknown }).__pulsePaddlesDebug = {
      ball: { ...this.ball },
      leftPaddle: { ...this.leftPaddle },
      rightPaddle: { ...this.rightPaddle },
      isBallActive: this.isBallActive,
      pattern: this.pattern,
      score: { left: this.scoreLeft, right: this.scoreRight },
      roundResetTimer: this.roundResetTimer,
      matchOver: this.matchOver,
    };
  }
}
