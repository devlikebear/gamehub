import { BaseGame, GameConfig } from '../engine';

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

  private readonly keys = new Set<string>();

  private fieldLeft = FIELD_MARGIN_X;
  private fieldTop = FIELD_MARGIN_Y;
  private fieldWidth = 0;
  private fieldHeight = 0;

  private score = 0;
  private stage = 1;
  private combo = 0;
  private comboTimer = 0;
  private lives = MAX_LIVES;
  private flashTimer = 0;
  private swapPulse = 0;
  private messageTimer = 0;
  private messageText = '';

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;

    let handled = false;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case ' ': // Space - field swap
      case 'Shift':
      case 'Enter':
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
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  protected onStop(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  protected update(deltaTime: number): void {
    if (this.lives <= 0) {
      return;
    }

    this.swapCooldown = Math.max(0, this.swapCooldown - deltaTime);
    this.flashTimer = Math.max(0, this.flashTimer - deltaTime);
    this.swapPulse = Math.max(0, this.swapPulse - deltaTime);
    this.messageTimer = Math.max(0, this.messageTimer - deltaTime);

    if (this.combo > 0) {
      this.comboTimer -= deltaTime;
      if (this.comboTimer <= 0) {
        this.combo = Math.max(0, this.combo - 1);
        this.comboTimer = 1200;
      }
    }

    this.updatePaddle(deltaTime);

    if (this.keys.has('Enter') && this.ball.stuck) {
      this.releaseBall();
    }

    if (this.keys.has(' ') && this.swapCooldown === 0) {
      this.swapField();
      this.swapCooldown = SWAP_COOLDOWN;
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
    this.clearCanvas('#050713');
    this.drawField();
    this.drawLayers();
    this.drawPaddle();
    this.drawBall();
    this.drawHud();

    if (this.lives <= 0) {
      this.drawOverlay('SYSTEM FAILURE', '#ff4f78', 'Enter 키로 재시작');
    }
  }

  private recalculateField(): void {
    this.fieldWidth = this.width - FIELD_MARGIN_X * 2;
    this.fieldHeight = this.height - FIELD_MARGIN_Y * 2;
    this.fieldLeft = FIELD_MARGIN_X;
    this.fieldTop = FIELD_MARGIN_Y;
  }

  private updatePaddle(deltaTime: number): void {
    const direction = (this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('ArrowLeft') ? 1 : 0);
    const booster = this.keys.has('Shift') ? 1.4 : 1;
    this.paddle.x += this.paddle.speed * direction * booster * deltaTime;
    this.paddle.x = clamp(this.paddle.x, this.fieldLeft, this.fieldLeft + this.fieldWidth - this.paddle.width);
  }

  private releaseBall(): void {
    const angle = (Math.random() * 0.4 - 0.2) * Math.PI;
    this.ball.vx = Math.cos(angle) * this.ball.speed;
    this.ball.vy = -Math.abs(Math.sin(angle)) * this.ball.speed - 0.25;
    this.ball.stuck = false;
    this.combo = 0;
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
      this.combo = Math.max(0, this.combo - 1);
      this.comboTimer = 1500;
      this.flashTimer = 200;
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
    this.combo += 1;
    this.comboTimer = 1500;
    const multiplier = 1 + Math.min(this.combo, 12) * 0.12;
    this.score += Math.round(baseScore * multiplier);
    this.flashTimer = 280;
    if (brick.isPrism) {
      this.messageText = 'PRISM SPLIT!';
      this.messageTimer = 800;
      this.spawnPrismFragments(brick);
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
    this.combo = 0;
    this.ball.stuck = true;
    this.ball.vx = 0.22;
    this.ball.vy = -0.36;
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
    this.swapCooldown = 0;

    if (this.lives <= 0) {
      this.messageText = '필드 붕괴!';
      this.messageTimer = 2000;
    }
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
    this.layers = this.generateLayers();
    this.activeLayer = this.stage % 2;
    this.swapPulse = 400;
    this.ball.stuck = true;
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
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
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    ctx.restore();
  }

  private drawBall(): void {
    const ctx = this.ctx;
    ctx.save();
    const gradient = ctx.createRadialGradient(this.ball.x, this.ball.y, 2, this.ball.x, this.ball.y, this.ball.radius + 4);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, this.flashTimer > 0 ? 'rgba(255, 100, 200, 0.5)' : 'rgba(160, 255, 255, 0.3)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius + 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawHud(): void {
    const infoY = this.fieldTop - 36;

    this.drawText(`SCORE ${this.score.toString().padStart(6, '0')}`, this.fieldLeft, infoY, {
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

    if (this.combo > 1) {
      this.drawText(`COMBO x${this.combo}`, this.fieldLeft + this.fieldWidth / 2, this.fieldTop + this.fieldHeight + 28, {
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
    }

    const instructions = '←/→ 이동 · Space 필드 스왑 · Shift 가속 · Enter 시작/재시작';
    this.drawText(instructions, this.fieldLeft, this.height - 30, {
      color: '#7c86ff',
      font: '10px "Press Start 2P"',
    });
  }

  private drawOverlay(message: string, color: string, subtitle?: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawText(message, this.width / 2, this.height / 2 - 24, {
      align: 'center',
      color,
      font: '22px "Press Start 2P"',
    });

    if (subtitle) {
      this.drawText(subtitle, this.width / 2, this.height / 2 + 8, {
        align: 'center',
        color: '#ffffff',
        font: '12px "Press Start 2P"',
      });
    }
    ctx.restore();
  }

  private publishDebugState(): void {
    if (typeof window === 'undefined') return;
    (window as unknown as { __prismSmashDebug?: unknown }).__prismSmashDebug = {
      ball: { ...this.ball },
      paddle: { ...this.paddle },
      activeLayer: this.activeLayer,
      score: this.score,
      lives: this.lives,
      stage: this.stage,
      combo: this.combo,
      swapCooldown: this.swapCooldown,
    };
  }
}
