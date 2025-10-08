import {
  BACKGROUND_COLORS,
  BaseGame,
  FONTS,
  GameConfig,
  InputHandler,
  NEON_COLORS,
} from '../engine';
import {
  DriftPhysicsState,
  applyBoostPulse,
  createPhysicsState,
  stepPhysics,
} from './physics';
import {
  CollisionResult,
  ResonanceFieldState,
  applyResonanceCollision,
  createResonanceField,
  stepResonanceField,
} from './shards';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface MissionState {
  zoneIndex: number;
  completed: boolean;
  score: number;
}

interface PulseState {
  cooldown: number;
  active: boolean;
  lifetime: number;
}

const FIELD_WIDTH = 1400;
const FIELD_HEIGHT = 900;
const CANVAS_PADDING = 60;
const BOOST_DURATION = 900;
const PULSE_COOLDOWN = 3600;
const PULSE_LIFETIME = 620;

export class StarshardDriftGame extends BaseGame {
  private readonly input: InputHandler;
  private physics: DriftPhysicsState;
  private resonance: ResonanceFieldState;
  private mission: MissionState;
  private pulses: PulseState[] = [];
  private trails: TrailPoint[] = [];
  private energy = 1;
  private destabilized = false;
  private timeElapsed = 0;
  private gameOver = false;
  private missionComplete = false;

  constructor(config: GameConfig) {
    super(config);
    this.input = new InputHandler({ targetElement: config.canvas });
    this.physics = createPhysicsState({ seed: 1337 });
    this.resonance = createResonanceField({ shardCount: 12, seed: 901 });
    this.mission = {
      zoneIndex: 1,
      completed: false,
      score: 0,
    };
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected update(deltaTime: number): void {
    if (this.gameOver || this.missionComplete) {
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.reset();
      }
      return;
    }

    this.timeElapsed += deltaTime;
    const thrust = this.input.isPressed('ArrowUp') || this.input.isPressed('w') || this.input.isPressed('W') ? 1 : 0;
    const rotationInput =
      (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D') ? 1 : 0) -
      (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A') ? 1 : 0);

    const damping = this.input.isPressed('ArrowDown') || this.input.isPressed('s') || this.input.isPressed('S') ? 0.85 : 0.94;

    this.physics = stepPhysics(this.physics, deltaTime, {
      thrust,
      rotation: rotationInput,
      damping,
    });

    if (this.input.justPressed('Shift')) {
      this.physics = applyBoostPulse(this.physics, { boostScale: 1.45, durationMs: BOOST_DURATION });
    }

    if (this.input.justPressed('Space') && this.physics.cooldowns.pulse <= 0) {
      this.triggerPulse();
    }

    this.updatePulses(deltaTime);
    this.resonance = stepResonanceField(this.resonance, deltaTime, {
      stabilization: this.pulses.some((pulse) => pulse.active) ? 0.35 : 0,
    });

    this.handleShardCollisions();
    this.updateTrails(deltaTime);
    this.updateEnergy(deltaTime);
    this.evaluateMission();

    if (this.input.justPressed('Escape')) {
      this.togglePause();
    }
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawBackdrop();
    this.drawGravityWave();
    this.drawShards();
    this.drawShip();
    this.drawPulses();
    this.drawTrails();
    this.drawHUD();

    if (this.gameOver) {
      this.drawOverlay('CORE DETONATED', NEON_COLORS.PINK, 'ENTER TO RETRY');
    } else if (this.missionComplete) {
      this.drawOverlay('MISSION COMPLETE', NEON_COLORS.GREEN, 'ENTER TO CONTINUE');
    } else if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'ESC TO RESUME');
    }
  }

  private handleShardCollisions(): void {
    const shipPos = this.physics.ship.position;
    const fragments: CollisionResult[] = [];

    this.resonance.shards.forEach((shard) => {
      const distance = Math.hypot(shard.position.x - shipPos.x, shard.position.y - shipPos.y);
      if (distance < 2.2 && shard.state === 'overload') {
        if (this.pulses.some((pulse) => pulse.active)) {
          fragments.push(applyResonanceCollision(this.resonance, { shardId: shard.id }));
        } else {
          this.gameOver = true;
        }
      } else if (distance < 1.6 && shard.state !== 'overload') {
        const result = applyResonanceCollision(this.resonance, { shardId: shard.id });
        fragments.push(result);
        this.mission.score += 120;
      }
    });

    if (fragments.length > 0) {
      const last = fragments[fragments.length - 1];
      this.resonance = last.updatedField;
    }
  }

  private updateEnergy(deltaTime: number): void {
    const maxThreat = this.resonance.shards.reduce((max, shard) => Math.max(max, shard.resonance), 0);
    const drain = maxThreat > 0.9 ? 0.0009 : 0.0004;
    const regen = 0.00065;

    if (this.pulses.some((pulse) => pulse.active)) {
      this.energy = clamp(0, 1, this.energy - drain * deltaTime);
    } else {
      this.energy = clamp(0, 1, this.energy + regen * deltaTime);
    }

    if (this.energy <= 0.05) {
      this.destabilized = true;
    }
  }

  private evaluateMission(): void {
    const coresRequired = this.resonance.objective.requiredCores;
    const progress = this.resonance.stabilizedCores;

    if (progress >= coresRequired) {
      this.missionComplete = true;
      this.mission.completed = true;
      this.mission.score += 500;
    }

    if (this.resonance.objective.currentTime >= this.resonance.objective.timeLimitMs) {
      this.gameOver = true;
    }
  }

  private triggerPulse(): void {
    if (this.physics.cooldowns.pulse > 0) return;

    this.pulses.push({
      cooldown: PULSE_COOLDOWN,
      active: true,
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
        cooldown: Math.max(0, pulse.cooldown - deltaTime),
        lifetime: pulse.lifetime - deltaTime,
        active: pulse.lifetime - deltaTime > 0,
      }))
      .filter((pulse) => pulse.cooldown > 0 || pulse.active);
  }

  private updateTrails(deltaTime: number): void {
    this.trails.push({
      x: this.physics.ship.position.x,
      y: this.physics.ship.position.y,
      life: 480,
    });

    this.trails.forEach((trail) => {
      trail.life -= deltaTime;
    });

    while (this.trails.length > 120) {
      this.trails.shift();
    }

    this.trails = this.trails.filter((trail) => trail.life > 0);
  }

  private drawBackdrop(): void {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, 480);
    gradient.addColorStop(0, 'rgba(10,16,30,0.9)');
    gradient.addColorStop(1, 'rgba(2,4,12,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawGravityWave(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(this.physics.gravityWave.direction);

    const amplitude = 120 + Math.sin((this.timeElapsed / this.physics.gravityWave.cycleMs) * Math.PI * 2) * 45;
    ctx.strokeStyle = 'rgba(0, 255, 200, 0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-FIELD_WIDTH / 2, 0);
    ctx.lineTo(FIELD_WIDTH / 2, 0);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 100, 200, 0.18)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-FIELD_WIDTH / 2, amplitude);
    ctx.lineTo(FIELD_WIDTH / 2, -amplitude);
    ctx.stroke();
    ctx.restore();
  }

  private drawShards(): void {
    const ctx = this.ctx;
    this.resonance.shards.forEach((shard) => {
      const pos = this.worldToCanvas(shard.position);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      const resonanceColor =
        shard.state === 'overload'
          ? NEON_COLORS.PINK
          : shard.state === 'resonant'
            ? NEON_COLORS.PURPLE
            : NEON_COLORS.CYAN;
      ctx.fillStyle = resonanceColor;
      ctx.globalAlpha = 0.85;
      const size = 12 + shard.resonance * 18;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  private drawShip(): void {
    const ctx = this.ctx;
    const pos = this.worldToCanvas(this.physics.ship.position);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.physics.ship.velocity.angle);
    ctx.fillStyle = NEON_COLORS.YELLOW;
    ctx.beginPath();
    ctx.moveTo(24, 0);
    ctx.lineTo(-18, -12);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-18, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawPulses(): void {
    const ctx = this.ctx;
    this.pulses
      .filter((pulse) => pulse.active)
      .forEach((pulse) => {
        const pos = this.worldToCanvas(this.physics.ship.position);
        const progress = 1 - pulse.lifetime / PULSE_LIFETIME;
        ctx.save();
        ctx.strokeStyle = NEON_COLORS.CYAN;
        ctx.globalAlpha = Math.max(0, 0.6 - progress * 0.5);
        ctx.lineWidth = 6 - progress * 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30 + progress * 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
  }

  private drawTrails(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    this.trails.forEach((trail, index) => {
      const pos = this.worldToCanvas({ x: trail.x, y: trail.y });
      if (index === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  private drawHUD(): void {
    const padding = 26;

    this.drawText(`ZONE ${this.mission.zoneIndex}`, padding, padding, {
      font: FONTS.PIXEL_SMALL,
      color: NEON_COLORS.WHITE,
    });
    this.drawText(`SCORE ${this.mission.score.toString().padStart(6, '0')}`, padding, padding + 26, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.YELLOW,
    });

    const barWidth = 200;
    const barY = padding + 60;
    this.drawText('ENERGY', padding, barY - 12, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.CYAN,
    });
    this.ctx.fillStyle = 'rgba(255,255,255,0.12)';
    this.ctx.fillRect(padding, barY, barWidth, 12);
    this.ctx.fillStyle = NEON_COLORS.CYAN;
    this.ctx.fillRect(padding, barY, barWidth * this.energy, 12);

    const rightX = this.width - padding - 220;
    this.drawText('CORES STABILIZED', rightX, padding, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.GREEN,
    });
    this.drawText(
      `${this.resonance.stabilizedCores}/${this.resonance.objective.requiredCores}`,
      rightX,
      padding + 18,
      {
        font: FONTS.PIXEL_TINY,
        color: NEON_COLORS.GREEN,
      }
    );

    const timeRemaining = Math.max(
      0,
      this.resonance.objective.timeLimitMs - this.resonance.objective.currentTime
    );
    this.drawText(`TIME ${Math.ceil(timeRemaining / 1000)}s`, rightX, padding + 36, {
      font: FONTS.PIXEL_TINY,
      color: timeRemaining < 10000 ? NEON_COLORS.PINK : NEON_COLORS.WHITE,
    });
  }

  private worldToCanvas(position: { x: number; y: number }): { x: number; y: number } {
    const originX = this.width / 2;
    const originY = this.height / 2;
    return {
      x: originX + (position.x / (FIELD_WIDTH / 2)) * (this.width / 2 - CANVAS_PADDING),
      y: originY + (position.y / (FIELD_HEIGHT / 2)) * (this.height / 2 - CANVAS_PADDING),
    };
  }

  private reset(): void {
    this.physics = createPhysicsState({ seed: 1337 + Math.floor(this.timeElapsed) });
    this.resonance = createResonanceField({ shardCount: 12, seed: 901 + Math.floor(this.timeElapsed) });
    this.mission = {
      zoneIndex: 1,
      completed: false,
      score: 0,
    };
    this.energy = 1;
    this.destabilized = false;
    this.gameOver = false;
    this.missionComplete = false;
    this.timeElapsed = 0;
    this.pulses = [];
    this.trails = [];
  }
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
