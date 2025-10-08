import { BaseGame, GameConfig, InputHandler, ScoreManager, StorageManager, NEON_COLORS, BACKGROUND_COLORS } from '../engine';
import { playSound, SOUNDS } from '@/lib/audio/sounds';

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
  stuck: boolean;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  color: string;
  isPrism: boolean;
}

interface LayerState {
  bricks: Brick[];
  remaining: number;
}

const FIELD_MARGIN_X = 80;
const FIELD_MARGIN_Y = 70;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 16;
const BRICK_COLS = 10;
const BRICK_ROWS = 6;
const BRICK_GAP = 6;
const MAX_LIVES = 3;
const SWAP_COOLDOWN = 600;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class PrismSmashGame extends BaseGame {
  private paddle: Paddle;
  private ball: Ball;

  private layers: LayerState[] = [];
  private activeLayer = 0;
  private swapCooldown = 0;

  private readonly input: InputHandler;
  private readonly storage = new StorageManager({ namespace: 'prism-smash' });
  private highScore = 0;

  private fieldLeft = FIELD_MARGIN_X;
  private fieldTop = FIELD_MARGIN_Y;
  private fieldWidth = 0;
  private fieldHeight = 0;

  private readonly scoreManager = new ScoreManager({ comboDecayMs: 1500, comboStep: 0.18, maxComboMultiplier: 3 });
  private stage = 1;
  private lives = MAX_LIVES;
  private flashTimer = 0;
  private swapPulse = 0;
  private messageTimer = 0;
  private messageText = '';

  constructor(config: GameConfig) {
    super(config);
    this.input = new InputHandler({ targetElement: config.canvas });
    this.highScore = this.storage.getHighScore('global');
    this.recalculateField();

    this.paddle = {
      x: this.fieldLeft + (this.fieldWidth - PADDLE_WIDTH) / 2,
      y: this.fieldTop + this.fieldHeight - 40,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: 0.6,
    };

    this.ball = {
      x: this.paddle.x + PADDLE_WIDTH / 2,
      y: this.paddle.y - 14,
      radius: 10,
      vx: 0.22,
      vy: -0.36,
      speed: 0.42,
      stuck: true,
    };

    this.layers = this.generateLayers();
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected update(deltaTime: number): void {
    if (this.lives <= 0) {
      this.notifyGameComplete({
        gameId: this.gameId,
        outcome: 'defeat',
        score: this.scoreManager.getScore(),
        timestamp: new Date().toISOString(),
      });
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.resetMatch();
      }
      this.publishDebugState();
      return;
    }

    this.swapCooldown = Math.max(0, this.swapCooldown - deltaTime);
    this.flashTimer = Math.max(0, this.flashTimer - deltaTime);
    this.swapPulse = Math.max(0, this.swapPulse - deltaTime);
    this.messageTimer = Math.max(0, this.messageTimer - deltaTime);

    this.scoreManager.tick(deltaTime);

    this.updatePaddle(deltaTime);

    if (this.ball.stuck && this.input.justPressed('Enter')) {
      this.releaseBall();
    }

    if (this.swapCooldown === 0 && this.input.justPressed('Space')) {
      this.swapField();
      this.swapCooldown = SWAP_COOLDOWN;
    }

    if (this.input.justPressed('r') || this.input.justPressed('R')) {
      this.resetMatch();
      this.publishDebugState();
      return;
    }

    if (!this.ball.stuck) {
      this.updateBall(deltaTime);
      this.handleCollisions();
    } else {
      this.ball.x = this.paddle.x + this.paddle.width / 2;
      this.ball.y = this.paddle.y - this.ball.radius - 2;
    }

    this.publishDebugState();
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawField();
    this.drawLayers();
    this.drawPaddle();
    this.drawBall();
    this.drawHud();

    if (this.lives <= 0) {
      this.drawOverlay('SYSTEM FAILURE', '#ff4f78', 'Enter / R 키로 재시작');
    }
  }

  private recalculateField(): void {
    this.fieldWidth = this.width - FIELD_MARGIN_X * 2;
    this.fieldHeight = this.height - FIELD_MARGIN_Y * 2;
    this.fieldLeft = FIELD_MARGIN_X;
    this.fieldTop = FIELD_MARGIN_Y;
  }

  private updatePaddle(deltaTime: number): void {
    const direction = (this.input.isPressed('ArrowRight') ? 1 : 0) - (this.input.isPressed('ArrowLeft') ? 1 : 0);
    const booster = this.input.isPressed('Shift') ? 1.4 : 1;
    this.paddle.x += this.paddle.speed * direction * booster * deltaTime;
    this.paddle.x = clamp(this.paddle.x, this.fieldLeft, this.fieldLeft + this.fieldWidth - this.paddle.width);
  }

  private releaseBall(): void {
    const angle = (Math.random() * 0.4 - 0.2) * Math.PI;
    this.ball.vx = Math.cos(angle) * this.ball.speed;
    this.ball.vy = -Math.abs(Math.sin(angle)) * this.ball.speed - 0.25;
    this.ball.stuck = false;
    this.scoreManager.breakCombo();
  }

  private updateBall(deltaTime: number): void {
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;

    const leftBound = this.fieldLeft + this.ball.radius;
    const rightBound = this.fieldLeft + this.fieldWidth - this.ball.radius;
    if (this.ball.x <= leftBound || this.ball.x >= rightBound) {
      this.ball.vx *= -1;
      this.ball.x = clamp(this.ball.x, leftBound, rightBound);
      this.flashTimer = 200;
    }

    if (this.ball.y <= this.fieldTop + this.ball.radius) {
      this.ball.vy *= -1;
      this.ball.y = this.fieldTop + this.ball.radius;
      this.flashTimer = 200;
    }

    if (this.ball.y >= this.fieldTop + this.fieldHeight + this.ball.radius) {
      this.loseLife();
    }
  }

  private handleCollisions(): void {
    // paddle
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y + this.ball.radius <= this.paddle.y + this.paddle.height + 6 &&
      this.ball.x >= this.paddle.x - this.ball.radius &&
      this.ball.x <= this.paddle.x + this.paddle.width + this.ball.radius &&
      this.ball.vy > 0
    ) {
      const offset = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      this.ball.vy = -Math.abs(this.ball.vy);
      this.ball.vx += offset * 0.18;
      this.ball.vx = clamp(this.ball.vx, -0.55, 0.55);
      this.ball.y = this.paddle.y - this.ball.radius - 1;
      this.scoreManager.breakCombo();
      this.flashTimer = 200;
      playSound(SOUNDS.CLICK); // 패들 충돌음
    }

    const layer = this.layers[this.activeLayer];
    if (!layer) return;

    for (const brick of layer.bricks) {
      if (brick.hits <= 0) continue;

      const collision = this.ball.x + this.ball.radius > brick.x &&
        this.ball.x - this.ball.radius < brick.x + brick.width &&
        this.ball.y + this.ball.radius > brick.y &&
        this.ball.y - this.ball.radius < brick.y + brick.height;

      if (collision) {
        const distLeft = Math.abs(this.ball.x + this.ball.radius - brick.x);
        const distRight = Math.abs(brick.x + brick.width - (this.ball.x - this.ball.radius));
        const distTop = Math.abs(this.ball.y + this.ball.radius - brick.y);
        const distBottom = Math.abs(brick.y + brick.height - (this.ball.y - this.ball.radius));
        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist === distLeft || minDist === distRight) {
          this.ball.vx *= -1;
        } else {
          this.ball.vy *= -1;
        }

        brick.hits -= 1;
        layer.remaining -= 1;
        this.handleBrickBreak(brick);

        if (layer.remaining <= 0) {
          this.advanceStage();
        }
        break;
      }
    }
  }

  private handleBrickBreak(brick: Brick): void {
    const baseScore = brick.isPrism ? 120 : 80;
    this.scoreManager.add(baseScore, 1);
    this.updateHighScore();
    this.flashTimer = 280;

    // 사운드: 프리즘이면 파워업, 일반 벽돌이면 폭발음
    if (brick.isPrism) {
      playSound(SOUNDS.POWER_UP);
      this.messageText = 'PRISM SPLIT!';
      this.messageTimer = 800;
      this.spawnPrismFragments(brick);
    } else {
      playSound(SOUNDS.EXPLOSION);
    }
  }

  private spawnPrismFragments(brick: Brick): void {
    const layer = this.layers[this.activeLayer];
    const fragments: Brick[] = [];
    const fragmentWidth = brick.width / 2 - BRICK_GAP / 2;
    const fragmentHeight = brick.height / 2 - BRICK_GAP / 2;

    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        fragments.push({
          x: brick.x + i * (fragmentWidth + BRICK_GAP / 2),
          y: brick.y + j * (fragmentHeight + BRICK_GAP / 2),
          width: fragmentWidth,
          height: fragmentHeight,
          hits: 1,
          color: '#ff9df8',
          isPrism: false,
        });
      }
    }

    layer.bricks.push(...fragments);
    layer.remaining += fragments.length;
  }

  private loseLife(): void {
    this.lives -= 1;
    this.scoreManager.breakCombo();
    this.ball.stuck = true;
    this.ball.vx = 0.22;
    this.ball.vy = -0.36;
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
    this.swapCooldown = 0;

    if (this.lives <= 0) {
      this.messageText = '필드 붕괴!';
      this.messageTimer = 2000;
      this.updateHighScore();
      playSound(SOUNDS.GAME_OVER); // 게임 오버
    } else {
      playSound(SOUNDS.BEEP); // 생명 감소
    }
  }

  private resetMatch(): void {
    this.scoreManager.reset();
    this.highScore = this.storage.getHighScore('global');
    this.stage = 1;
    this.lives = MAX_LIVES;
    this.messageText = '';
    this.messageTimer = 0;
    this.flashTimer = 0;
    this.swapCooldown = 0;
    this.swapPulse = 0;
    this.resetGameCompletion();

    this.layers = this.generateLayers();
    this.activeLayer = 0;
    this.ball.stuck = true;
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
  }

  private swapField(): void {
    if (this.layers.length < 2) return;
    this.activeLayer = this.activeLayer === 0 ? 1 : 0;
    this.swapPulse = 400;
  }

  private advanceStage(): void {
    this.stage += 1;
    this.messageText = `STAGE ${this.stage}`;
    this.messageTimer = 1200;
    this.scoreManager.breakCombo();
    this.layers = this.generateLayers();
    this.activeLayer = this.stage % 2;
    this.swapPulse = 400;
    this.ball.stuck = true;
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
  }

  private updateHighScore(): void {
    const current = this.scoreManager.getScore();
    this.storage.setHighScore('global', current);
    this.highScore = Math.max(this.highScore, current, this.storage.getHighScore('global'));
  }

  private generateLayers(): LayerState[] {
    const layers: LayerState[] = [];
    for (let i = 0; i < 2; i += 1) {
      const bricks: Brick[] = [];
      const brickWidth = (this.fieldWidth - (BRICK_COLS - 1) * BRICK_GAP) / BRICK_COLS;
      const brickHeight = 26;

      let remaining = 0;
      for (let row = 0; row < BRICK_ROWS; row += 1) {
        for (let col = 0; col < BRICK_COLS; col += 1) {
          const offset = (row + col + i + this.stage) % 4;
          const hue = 200 + offset * 25;
          const isPrism = (row + col + i + this.stage) % 5 === 0;
          const hits = isPrism ? 2 : 1;
          const color = isPrism ? '#f78cff' : `hsl(${hue}deg 90% 62%)`;

          const brick: Brick = {
            x: this.fieldLeft + col * (brickWidth + BRICK_GAP),
            y: this.fieldTop + row * (brickHeight + BRICK_GAP) + 20,
            width: brickWidth,
            height: brickHeight,
            hits,
            color,
            isPrism,
          };

          bricks.push(brick);
          remaining += hits;
        }
      }

      layers.push({ bricks, remaining });
    }

    return layers;
  }

  private drawField(): void {
    const ctx = this.ctx;
    ctx.save();

    const gradient = ctx.createLinearGradient(0, this.fieldTop, 0, this.fieldTop + this.fieldHeight);
    gradient.addColorStop(0, '#0b0f2c');
    gradient.addColorStop(1, '#040713');

    ctx.fillStyle = gradient;
    ctx.fillRect(this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight);

    ctx.strokeStyle = this.swapPulse > 0 ? 'rgba(255, 16, 240, 0.8)' : 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight);

    ctx.restore();
  }

  private drawLayers(): void {
    const frontLayer = this.layers[this.activeLayer];
    const backLayer = this.layers[this.activeLayer === 0 ? 1 : 0];

    if (backLayer) {
      this.drawBrickLayer(backLayer, 0.18);
    }
    if (frontLayer) {
      this.drawBrickLayer(frontLayer, 1);
    }
  }

  private drawBrickLayer(layer: LayerState, alpha: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const brick of layer.bricks) {
      if (brick.hits <= 0) continue;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      if (brick.isPrism && alpha > 0.5) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(brick.x + 2, brick.y + 2, brick.width - 4, brick.height - 4);
      }
    }
    ctx.restore();
  }

  private drawPaddle(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = NEON_COLORS.CYAN;
    ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    ctx.restore();
  }

  private drawBall(): void {
    const ctx = this.ctx;
    ctx.save();
    const gradient = ctx.createRadialGradient(this.ball.x, this.ball.y, 2, this.ball.x, this.ball.y, this.ball.radius + 4);
    gradient.addColorStop(0, NEON_COLORS.WHITE);
    gradient.addColorStop(1, this.flashTimer > 0 ? 'rgba(255, 100, 200, 0.5)' : 'rgba(160, 255, 255, 0.3)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius + 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = NEON_COLORS.WHITE;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawHud(): void {
    const infoY = this.fieldTop - 36;

    const score = this.scoreManager.getScore();
    const combo = this.scoreManager.getCombo();

    this.drawText(`SCORE ${score.toString().padStart(6, '0')}`, this.fieldLeft, infoY, {
      color: '#8b9fff',
      font: '14px "Press Start 2P"',
    });

    this.drawText(`STAGE ${this.stage}`, this.fieldLeft + this.fieldWidth, infoY, {
      align: 'right',
      color: '#ffd966',
      font: '14px "Press Start 2P"',
    });

    const livesText = '❤'.repeat(this.lives) || '💀';
    this.drawText(livesText, this.fieldLeft + this.fieldWidth / 2, infoY, {
      align: 'center',
      color: '#ff6ab2',
      font: '16px "Press Start 2P"',
    });

    const hiScore = Math.max(this.highScore, score);
    this.drawText(`HI ${hiScore.toString().padStart(6, '0')}`, this.fieldLeft + this.fieldWidth / 2, infoY + 18, {
      align: 'center',
      color: '#8b9fff',
      font: '12px "Press Start 2P"',
    });

    if (combo > 1) {
      this.drawText(`COMBO x${combo}`, this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight + 28, {
        align: 'center',
        color: '#ff8cf4',
        font: '12px "Press Start 2P"',
      });
    }

    if (this.messageTimer > 0) {
      this.drawText(this.messageText, this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight + 52, {
        align: 'center',
        color: '#ffb3ff',
        font: '12px "Press Start 2P"',
      });
    } else {
      const instructions = '←/→ 이동 · Space 필드 스왑 · Shift 가속 · Enter/R 시작·재시작';
      this.drawText(instructions, this.fieldLeft, this.height - 30, {
        color: '#7c86ff',
        font: '10px "Press Start 2P"',
      });
    }
  }


  private publishDebugState(): void {
    if (typeof window === 'undefined') return;
    (window as unknown as { __prismSmashDebug?: unknown }).__prismSmashDebug = {
      ball: { ...this.ball },
      paddle: { ...this.paddle },
      activeLayer: this.activeLayer,
      score: this.scoreManager.getScore(),
      lives: this.lives,
      stage: this.stage,
      combo: this.scoreManager.getCombo(),
      swapCooldown: this.swapCooldown,
      highScore: this.highScore,
    };
  }
}
