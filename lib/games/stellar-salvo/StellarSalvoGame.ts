import {
  BACKGROUND_COLORS,
  BaseGame,
  FONTS,
  GameConfig,
  InputHandler,
  NEON_COLORS,
} from '../engine';
import {
  FluxDashOptions,
  ShooterControls,
  ShooterPhysicsState,
  applyFluxDash,
  createShooterPhysics,
  stepShooterPhysics,
} from './physics';
import {
  EnemyEntity,
  EnemyWaveController,
  WaveStepOptions,
  createEnemyWaveController,
  stepEnemyWaveController,
} from './waves';

interface PulseArc {
  angle: number;
  width: number;
  lifetime: number;
}

interface ScoreState {
  value: number;
  multiplier: number;
  streakTimer: number;
}

const DASH_OPTIONS: FluxDashOptions = { strength: 2.4, durationMs: 240 };
const WAVE_OPTIONS: WaveStepOptions = { difficultyScale: 1 };
const PULSE_COOLDOWN = 950;
const PULSE_LIFETIME = 280;
const CORE_RADIUS = 4.2;
const SHIP_RADIUS = 1.6;

export class StellarSalvoGame extends BaseGame {
  private readonly input: InputHandler;
  private physics: ShooterPhysicsState;
  private waves: EnemyWaveController;
  private pulses: PulseArc[] = [];
  private score: ScoreState = { value: 0, multiplier: 1, streakTimer: 0 };
  private energy = 1;
  private timeElapsed = 0;
  private killCount = 0;
  private gameOver = false;
  private victory = false;
  private readonly gameId = 'stellar-salvo';

  constructor(config: GameConfig) {
    super(config);
    this.input = new InputHandler({ targetElement: config.canvas });
    this.physics = createShooterPhysics({ seed: 404 });
    this.waves = createEnemyWaveController({ seed: 303 });
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected update(deltaTime: number): void {
    if (this.gameOver || this.victory) {
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.reset();
      }
      return;
    }

    this.timeElapsed += deltaTime;

    const controls: ShooterControls = {
      thrust: Number(this.input.isPressed('ArrowUp') || this.input.isPressed('w') || this.input.isPressed('W')),
      rotation:
        (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D') ? 1 : 0) -
        (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A') ? 1 : 0),
      brake: Boolean(this.input.isPressed('ArrowDown') || this.input.isPressed('s') || this.input.isPressed('S')),
    };

    if (this.input.justPressed('Shift')) {
      this.physics = applyFluxDash(this.physics, DASH_OPTIONS);
    }

    const beforePulseCooldown = this.physics.cooldowns.pulse;
    this.physics = stepShooterPhysics(this.physics, deltaTime, controls);

    if (this.input.justPressed('Space') && beforePulseCooldown <= 0) {
      this.triggerPulse();
    }

    this.updatePulses(deltaTime);
    this.updateWaves(deltaTime);
    this.resolveCollisions(deltaTime);
    this.updateScore(deltaTime);
    this.drainEnergy(deltaTime);

    if (this.gameOver) {
      this.reportGameResult('defeat');
    } else if (this.victory) {
      this.reportGameResult('victory');
    }

    if (this.input.justPressed('Escape')) {
      this.togglePause();
    }
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawBackdrop();
    this.drawCore();
    this.drawEnemies();
    this.drawPulses();
    this.drawShip();
    this.drawHUD();

    if (this.gameOver) {
      this.drawOverlay('CORE BREACHED', NEON_COLORS.PINK, 'ENTER TO RETRY');
    } else if (this.victory) {
      this.drawOverlay('GATE SECURED', NEON_COLORS.GREEN, 'ENTER TO CONTINUE');
    } else if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'ESC TO RESUME');
    }
  }

  private updateWaves(deltaTime: number): void {
    this.waves = stepEnemyWaveController(this.waves, deltaTime, WAVE_OPTIONS);

    const dt = deltaTime / 1000;
    this.waves.activeEnemies = this.waves.activeEnemies.map((enemy) => ({
      ...enemy,
      radius: Math.max(CORE_RADIUS, enemy.radius - enemy.speed * dt),
      angle: enemy.angle + dt * 0.6,
    }));

    const survivors = this.waves.activeEnemies.filter((enemy) => enemy.radius > CORE_RADIUS);
    const breached = this.waves.activeEnemies.length - survivors.length;
    if (breached > 0) {
      this.energy -= breached * 0.12;
      if (this.energy <= 0) {
        this.gameOver = true;
      }
    }
    this.waves.activeEnemies = survivors;

    if (this.score.value >= 12000) {
      this.victory = true;
    }
  }

  private triggerPulse(): void {
    this.pulses.push({
      angle: this.physics.ship.heading,
      width: 0.7,
      lifetime: PULSE_LIFETIME,
    });

    this.physics = {
      ...this.physics,
      cooldowns: {
        ...this.physics.cooldowns,
        pulse: PULSE_COOLDOWN,
      },
    };
  }

  private updatePulses(deltaTime: number): void {
    this.pulses = this.pulses
      .map((pulse) => ({
        ...pulse,
        lifetime: pulse.lifetime - deltaTime,
        width: Math.max(0.35, pulse.width - deltaTime * 0.0009),
      }))
      .filter((pulse) => pulse.lifetime > 0);
  }

  private resolveCollisions(deltaTime: number): void {
    if (this.gameOver) return;

    const pulses = this.pulses;
    const dt = deltaTime / 1000;
    const shipAngle = this.physics.ship.heading;

    const remainingEnemies: EnemyEntity[] = [];
    let destroyedThisFrame = 0;

    for (const enemy of this.waves.activeEnemies) {
      const angleDelta = smallestAngleDifference(enemy.angle, shipAngle);
      const withinCollision = Math.abs(angleDelta) < 0.35 && enemy.radius < SHIP_RADIUS + 1.1;
      if (withinCollision) {
        this.gameOver = true;
        return;
      }

      const hitByPulse = pulses.some(
        (pulse) => Math.abs(smallestAngleDifference(enemy.angle, pulse.angle)) <= pulse.width && enemy.radius < 28
      );

      if (hitByPulse) {
        destroyedThisFrame += 1;
        this.killCount += 1;
        this.score.value += 120 * this.score.multiplier;
        this.energy = Math.min(1, this.energy + 0.08);
        continue;
      }

      remainingEnemies.push(enemy);
    }

    this.waves.activeEnemies = remainingEnemies;

    if (destroyedThisFrame > 0) {
      this.score.multiplier = Math.min(6, this.score.multiplier + 0.2 * destroyedThisFrame);
      this.score.streakTimer = 2600;
      WAVE_OPTIONS.difficultyScale = Math.min(2.2, WAVE_OPTIONS.difficultyScale + 0.02);
    } else {
      this.score.multiplier = Math.max(1, this.score.multiplier - dt * 0.25);
    }
  }

  private updateScore(deltaTime: number): void {
    if (this.score.streakTimer > 0) {
      this.score.streakTimer = Math.max(0, this.score.streakTimer - deltaTime);
      if (this.score.streakTimer === 0) {
        this.score.multiplier = Math.max(1, this.score.multiplier - 0.5);
      }
    }
  }

  private drainEnergy(deltaTime: number): void {
    const drainRate = this.waves.threatLevel * 0.00008;
    this.energy = Math.max(0, this.energy - drainRate * deltaTime);
    if (this.energy <= 0) {
      this.gameOver = true;
    }
  }

  private reportGameResult(outcome: 'victory' | 'defeat'): void {
    const special: Record<string, number> = {};

    // Perfect Defense 업적 체크: 5분 이상 생존하고 90% 이상 에너지 유지
    const minutesPlayed = this.timeElapsed / 60000;
    if (minutesPlayed >= 5 && this.energy >= 0.9) {
      special['perfect-defense-wave10'] = 1;
    }

    this.notifyGameComplete({
      gameId: this.gameId,
      outcome,
      score: this.score.value,
      timestamp: new Date().toISOString(),
      stats: {
        timeElapsed: this.timeElapsed,
        killCount: this.killCount,
        energy: this.energy,
        special,
      },
    });
  }

  private drawBackdrop(): void {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, 420);
    gradient.addColorStop(0, 'rgba(12, 18, 30, 0.92)');
    gradient.addColorStop(1, 'rgba(2, 4, 12, 0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(40, 120, 180, 0.25)';
    ctx.lineWidth = 1;
    const spacing = 40;
    for (let x = spacing / 2; x < this.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = spacing / 2; y < this.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawCore(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(this.physics.coreRotation);
    ctx.fillStyle = 'rgba(255, 10, 140, 0.18)';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(24, 0);
    ctx.lineTo(0, 40);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawEnemies(): void {
    const ctx = this.ctx;
    this.waves.activeEnemies.forEach((enemy) => {
      const pos = this.polarToCanvas(enemy.radius, enemy.angle);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(enemy.angle);

      const color =
        enemy.archetype === 'skirmisher'
          ? NEON_COLORS.YELLOW
          : enemy.archetype === 'rupture'
          ? NEON_COLORS.PINK
          : NEON_COLORS.CYAN;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;

      const size = enemy.archetype === 'spire' ? 12 : enemy.archetype === 'rupture' ? 10 : 8;
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.6, size * 0.6);
      ctx.lineTo(-size * 0.8, 0);
      ctx.lineTo(-size * 0.6, -size * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }

  private drawPulses(): void {
    const ctx = this.ctx;
    const origin = { x: this.width / 2, y: this.height / 2 };

    this.pulses.forEach((pulse) => {
      const progress = 1 - pulse.lifetime / PULSE_LIFETIME;
      const radius = 340 * progress + 60;

      ctx.save();
      ctx.strokeStyle = NEON_COLORS.CYAN;
      ctx.globalAlpha = Math.max(0, 0.7 - progress * 0.6);
      ctx.lineWidth = 10 - progress * 8;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, radius, pulse.angle - pulse.width, pulse.angle + pulse.width);
      ctx.stroke();
      ctx.restore();
    });
  }

  private drawShip(): void {
    const ctx = this.ctx;
    const pos = this.polarToCanvas(this.physics.ship.position.radius, this.physics.ship.position.angle);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.physics.ship.heading);
    ctx.fillStyle = NEON_COLORS.GREEN;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawHUD(): void {
    const padding = 24;
    this.drawText(`SCORE ${this.score.value.toString().padStart(6, '0')}`, padding, padding, {
      font: FONTS.PIXEL_SMALL,
      color: NEON_COLORS.WHITE,
    });
    this.drawText(`WAVE ${Math.ceil(this.waves.threatLevel)}`, padding, padding + 26, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.PINK,
    });
    this.drawText(`MULTIPLIER x${this.score.multiplier.toFixed(1)}`, padding, padding + 46, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.YELLOW,
    });

    const energyBarWidth = 220;
    const barX = this.width - padding - energyBarWidth;
    const barY = padding;
    this.drawText('ENERGY', barX, barY, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.CYAN,
    });
    this.ctx.fillStyle = 'rgba(255,255,255,0.12)';
    this.ctx.fillRect(barX, barY + 14, energyBarWidth, 10);
    this.ctx.fillStyle = this.energy > 0.25 ? NEON_COLORS.CYAN : NEON_COLORS.PINK;
    this.ctx.fillRect(barX, barY + 14, energyBarWidth * this.energy, 10);
  }

  private polarToCanvas(radius: number, angle: number): { x: number; y: number } {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const scale = 10;
    return {
      x: centerX + Math.cos(angle) * radius * scale,
      y: centerY + Math.sin(angle) * radius * scale,
    };
  }

  private reset(): void {
    this.physics = createShooterPhysics({ seed: 404 + Math.floor(this.timeElapsed) });
    this.waves = createEnemyWaveController({ seed: 303 + Math.floor(this.timeElapsed) });
    this.pulses = [];
    this.score = { value: 0, multiplier: 1, streakTimer: 0 };
    this.energy = 1;
    this.gameOver = false;
    this.victory = false;
    this.timeElapsed = 0;
    WAVE_OPTIONS.difficultyScale = 1;
    this.resetGameCompletion();
  }
}

function smallestAngleDifference(a: number, b: number): number {
  const twoPi = Math.PI * 2;
  let diff = (a - b) % twoPi;
  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;
  return diff;
}
