import {
  BACKGROUND_COLORS,
  BaseGame,
  FONTS,
  GameConfig,
  InputHandler,
  NEON_COLORS,
} from '../engine';
import {
  OrbitLaneState,
  OrbitState,
  computeOrbitPosition,
  createOrbitState,
  stepOrbitState,
} from './orbits';
import {
  EnemyInstance,
  EnemyType,
  advanceEnemyInstance,
  applyWaveDamage,
  createEnemyInstance,
} from './enemies';

const PLAYER_RADIUS = 118;
const PLAYER_ANGULAR_SPEED = 2.2; // radians per second
const AFTERIMAGE_THRESHOLD = 0.22;
const AFTERIMAGE_WIDTH = 0.32;
const AFTERIMAGE_LIFETIME = 520;

const WAVE_SPEED = 0.0016; // progress per ms
const WAVE_WIDTH = 0.4;
const WAVE_THICKNESS = 26;
const WAVE_LIFETIME = 1200;

const TIME_WARP_SCALE = 0.45;
const TIME_WARP_DRAIN = 0.00045; // gauge per ms
const TIME_WARP_RECOVERY = 0.00032;

const CORE_INTEGRITY_MAX = 3;

interface WavePulse {
  id: number;
  angle: number;
  width: number;
  progress: number;
  speed: number;
  lifetime: number;
  hitIds: Set<number>;
}

interface AfterimageBarrier {
  angle: number;
  lifetime: number;
  strength: number;
}

export class PhotonVanguardGame extends BaseGame {
  private readonly input: InputHandler;
  private orbitState: OrbitState;
  private enemies: EnemyInstance[] = [];
  private waves: WavePulse[] = [];
  private afterimages: AfterimageBarrier[] = [];

  private readonly player = {
    angle: -Math.PI / 2,
    lastAngle: -Math.PI / 2,
  };

  private timeWarp = {
    gauge: 1,
    active: false,
  };

  private round = 1;
  private defeatedThisRound = 0;
  private roundTarget = 14;

  private waveCooldown = 0;
  private nextWaveId = 1;
  private nextEnemyId = 1;
  private maxOrbitRadius = 0;

  private coreIntegrity = CORE_INTEGRITY_MAX;
  private score = 0;
  private gameOver = false;
  private roundFlashTimer = 0;

  constructor(config: GameConfig) {
    super(config);
    this.input = new InputHandler({ targetElement: config.canvas });
    this.orbitState = createOrbitState({ round: this.round });
    this.maxOrbitRadius = this.getMaxOrbitRadius();
    this.resetState();
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected update(deltaTime: number): void {
    if (this.gameOver) {
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.resetGame();
      }
      return;
    }

    this.handleInput(deltaTime);

    const timeScale = this.timeWarp.active ? TIME_WARP_SCALE : 1;
    const spawnResult = stepOrbitState(this.orbitState, deltaTime, { timeScale });
    if (spawnResult.ready.length > 0) {
      for (const lane of spawnResult.ready) {
        this.spawnEnemy(lane);
      }
    }

    this.updateWaves(deltaTime);
    this.updateAfterimages(deltaTime);
    this.updateEnemies(deltaTime, timeScale);

    this.waveCooldown = Math.max(0, this.waveCooldown - deltaTime);
    this.roundFlashTimer = Math.max(0, this.roundFlashTimer - deltaTime);
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);

    const cx = this.width / 2;
    const cy = this.height / 2;

    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    this.drawStarfield();
    this.drawOrbits();
    this.drawAfterimages();
    this.drawWaves();
    this.drawEnemies();
    this.drawPlayer();
    this.drawCore();

    ctx.restore();

    this.drawHUD();

    if (this.gameOver) {
      this.drawOverlay('CORE COLLAPSED', NEON_COLORS.PINK, 'PRESS ENTER TO REBOOT');
    } else if (this.getIsPaused()) {
      this.drawOverlay('SYSTEM HOLD', NEON_COLORS.CYAN, 'ESC TO RESUME');
    } else if (this.roundFlashTimer > 0) {
      const label = `PHASE ${this.round}`;
      this.drawOverlay(label, NEON_COLORS.YELLOW, 'TIME WAVES RESONATE');
    }
  }

  private resetGame(): void {
    this.round = 1;
    this.orbitState = createOrbitState({ round: this.round });
    this.maxOrbitRadius = this.getMaxOrbitRadius();
    this.resetState();
  }

  private resetState(): void {
    this.player.angle = -Math.PI / 2;
    this.player.lastAngle = this.player.angle;
    this.timeWarp = { gauge: 1, active: false };
    this.enemies = [];
    this.waves = [];
    this.afterimages = [];
    this.waveCooldown = 0;
    this.nextWaveId = 1;
    this.nextEnemyId = 1;
    this.defeatedThisRound = 0;
    this.roundTarget = this.computeRoundTarget();
    this.coreIntegrity = CORE_INTEGRITY_MAX;
    this.score = 0;
    this.gameOver = false;
    this.roundFlashTimer = 1000;
  }

  private handleInput(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;
    let rotation = 0;

    if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A')) {
      rotation -= 1;
    }
    if (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D')) {
      rotation += 1;
    }

    if (rotation !== 0) {
      const prevAngle = this.player.angle;
      this.player.angle = normalizeAngle(prevAngle + rotation * PLAYER_ANGULAR_SPEED * deltaSeconds);
      const delta = angularDelta(prevAngle, this.player.angle);

      if (Math.abs(delta) > AFTERIMAGE_THRESHOLD) {
        this.createAfterimage(this.player.angle, Math.min(1, Math.abs(delta)));
      }

      this.player.lastAngle = prevAngle;
    }

    const shiftActive = this.input.isPressed('Shift');
    if (shiftActive && this.timeWarp.gauge > 0.02) {
      this.timeWarp.active = true;
      this.timeWarp.gauge = Math.max(0, this.timeWarp.gauge - TIME_WARP_DRAIN * deltaTime);
    } else {
      const rechargeBoost = this.enemies.length === 0 ? 1.4 : 1;
      this.timeWarp.active = false;
      this.timeWarp.gauge = Math.min(1, this.timeWarp.gauge + TIME_WARP_RECOVERY * deltaTime * rechargeBoost);
    }

    if (this.timeWarp.gauge <= 0.01) {
      this.timeWarp.active = false;
    }

    if (
      this.waveCooldown <= 0 &&
      (this.input.justPressed('Space') ||
        this.input.justPressed('x') ||
        this.input.justPressed('X'))
    ) {
      this.emitWave();
    }

    if (this.input.justPressed('Escape')) {
      this.togglePause();
    }
  }

  private emitWave(): void {
    const pulse: WavePulse = {
      id: this.nextWaveId++,
      angle: this.player.angle,
      width: WAVE_WIDTH * (this.timeWarp.active ? 1.2 : 1),
      progress: 0,
      speed: this.timeWarp.active ? WAVE_SPEED * 0.82 : WAVE_SPEED,
      lifetime: WAVE_LIFETIME,
      hitIds: new Set(),
    };

    this.waves.push(pulse);
    this.waveCooldown = this.timeWarp.active ? 440 : 360;
  }

  private updateWaves(deltaTime: number): void {
    for (const wave of this.waves) {
      wave.progress += wave.speed * deltaTime;
      wave.lifetime -= deltaTime;
    }
    this.waves = this.waves.filter((wave) => wave.progress <= 1.05 && wave.lifetime > 0);
  }

  private createAfterimage(angle: number, intensity: number): void {
    this.afterimages.push({
      angle,
      lifetime: AFTERIMAGE_LIFETIME,
      strength: clamp(0.35, 1, intensity / Math.PI),
    });
    if (this.afterimages.length > 22) {
      this.afterimages.shift();
    }
  }

  private updateAfterimages(deltaTime: number): void {
    for (const barrier of this.afterimages) {
      barrier.lifetime -= deltaTime;
      barrier.strength = Math.max(0, barrier.strength - deltaTime / AFTERIMAGE_LIFETIME);
    }
    this.afterimages = this.afterimages.filter((barrier) => barrier.lifetime > 0 && barrier.strength > 0.05);
  }

  private updateEnemies(deltaTime: number, timeScale: number): void {
    const updated: EnemyInstance[] = [];
    const maxRadius = this.maxOrbitRadius;
    const newlySpawned: EnemyInstance[] = [];

    for (const enemy of this.enemies) {
      const lane = this.findLane(enemy);
      const advance = advanceEnemyInstance(enemy, deltaTime, { lane, timeScale });

      if (advance.enteredCore) {
        this.handleCoreBreach();
        continue;
      }

      let currentEnemy = advance.enemy;
      let destroyed = false;

      const waveDamage = this.collectWaveDamage(currentEnemy, maxRadius);
      if (waveDamage > 0) {
        const damageResult = applyWaveDamage(currentEnemy, waveDamage);
        if (damageResult.spawned.length > 0) {
          for (const child of damageResult.spawned) {
            const adjustedChild = this.ensureSpawnRadius(child);
            const cloned: EnemyInstance = {
              ...adjustedChild,
              id: this.nextEnemyId++,
              lane: {
                id: adjustedChild.lane.id,
                radius: adjustedChild.lane.radius,
                angularSpeed: adjustedChild.lane.angularSpeed,
                ellipseRatio: adjustedChild.lane.ellipseRatio,
                direction: adjustedChild.lane.direction,
              },
            };
            newlySpawned.push(cloned);
          }
        }

        if (damageResult.destroyed) {
          destroyed = true;
          this.handleEnemyDestroyed(currentEnemy);
        } else if (damageResult.enemy) {
          currentEnemy = damageResult.enemy;
        }
      }

      if (destroyed) {
        continue;
      }

      this.applyAfterimages(currentEnemy);
      updated.push(currentEnemy);
    }

    if (newlySpawned.length > 0) {
      updated.push(...newlySpawned);
    }

    this.enemies = updated;
  }

  private findLane(enemy: EnemyInstance): OrbitLaneState {
    const lane = this.orbitState.lanes.find((candidate) => candidate.id === enemy.lane.id);
    if (lane) {
      return lane;
    }

    return {
      id: enemy.lane.id,
      radius: enemy.lane.radius,
      angularSpeed: enemy.lane.angularSpeed,
      spawnInterval: 0,
      spawnProgress: 0,
      ellipseRatio: enemy.lane.ellipseRatio,
      direction: enemy.lane.direction,
    };
  }

  private collectWaveDamage(enemy: EnemyInstance, maxRadius: number): number {
    let damage = 0;
    const targetRadius = this.computeEnemyRadius(enemy);
    const playerRadius = PLAYER_RADIUS;

    for (const wave of this.waves) {
      if (wave.hitIds.has(enemy.id)) continue;

      const angleDelta = Math.abs(angularDelta(enemy.angle, wave.angle));
      if (angleDelta > wave.width * 0.5) continue;

      const waveRadius = playerRadius + (maxRadius - playerRadius) * wave.progress;
      if (waveRadius >= targetRadius - WAVE_THICKNESS) {
        wave.hitIds.add(enemy.id);
        damage += 1;
      }
    }

    return damage;
  }

  private applyAfterimages(enemy: EnemyInstance): void {
    for (const barrier of this.afterimages) {
      const delta = Math.abs(angularDelta(enemy.angle, barrier.angle));
      if (delta > AFTERIMAGE_WIDTH) continue;
      if (barrier.strength <= 0) continue;

      enemy.radialProgress = Math.max(0, enemy.radialProgress - 0.02 * barrier.strength);
      enemy.angularVelocity *= 0.98;
    }
  }

  private handleEnemyDestroyed(enemy: EnemyInstance): void {
    this.score += enemy.scoreValue;
    this.defeatedThisRound += 1;

    if (this.defeatedThisRound >= this.roundTarget) {
      this.advanceRound();
    }
  }

  private handleCoreBreach(): void {
    this.coreIntegrity -= 1;
    this.timeWarp.active = false;
    this.timeWarp.gauge = Math.max(0.25, this.timeWarp.gauge);

    if (this.coreIntegrity <= 0) {
      this.gameOver = true;
    }
  }

  private advanceRound(): void {
    this.round += 1;
    this.orbitState = createOrbitState({ round: this.round });
    this.maxOrbitRadius = this.getMaxOrbitRadius();
    this.defeatedThisRound = 0;
    this.roundTarget = this.computeRoundTarget();
    this.timeWarp.gauge = 1;
    this.roundFlashTimer = 1600;
  }

  private computeEnemyRadius(enemy: EnemyInstance): number {
    const lane = this.findLane(enemy);
    const inwardFactor = 0.82;
    return lane.radius * (1 - enemy.radialProgress * inwardFactor);
  }

  private computeRoundTarget(): number {
    return 12 + this.round * 5;
  }

  private ensureSpawnRadius(enemy: EnemyInstance): EnemyInstance {
    const lane = this.findLane(enemy);
    const minRadius = PLAYER_RADIUS + 36;
    const inwardFactor = 0.82;

    if (lane.radius <= minRadius) {
      lane.radius = minRadius + 24;
      enemy.lane = {
        ...enemy.lane,
        radius: lane.radius,
      };
      this.maxOrbitRadius = Math.max(this.maxOrbitRadius, lane.radius);
    }

    const currentRadius = this.computeEnemyRadius(enemy);

    if (currentRadius < minRadius) {
      const desiredProgress = Math.max(
        0,
        Math.min(0.95, (1 - minRadius / lane.radius) / inwardFactor)
      );
      enemy.radialProgress = Math.min(enemy.radialProgress, desiredProgress);
    }

    return enemy;
  }

  private spawnEnemy(lane: OrbitLaneState): void {
    if (lane.radius < PLAYER_RADIUS + 60) {
      lane.radius = PLAYER_RADIUS + 60;
      this.maxOrbitRadius = Math.max(this.maxOrbitRadius, lane.radius);
    }
    const type = this.selectEnemyType();
    let enemy = createEnemyInstance({
      id: this.nextEnemyId++,
      type,
      lane,
      round: this.round,
      angle: Math.random() * Math.PI * 2,
    });

    enemy.radialProgress = Math.random() * 0.12;
    enemy = this.ensureSpawnRadius(enemy);
    this.enemies.push(enemy);
  }

  private selectEnemyType(): EnemyType {
    const pool: EnemyType[] = [EnemyType.Scout, EnemyType.Scout];
    if (this.round >= 3) {
      pool.push(EnemyType.Splitter);
    }
    if (this.round >= 4) {
      pool.push(EnemyType.Charger);
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  private drawStarfield(): void {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(0, 0, 20, 0, 0, this.maxOrbitRadius + 140);
    gradient.addColorStop(0, 'rgba(12, 20, 40, 0.9)');
    gradient.addColorStop(1, 'rgba(2, 4, 12, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-this.width, -this.height, this.width * 2, this.height * 2);
  }

  private drawOrbits(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 2;

    for (const lane of this.orbitState.lanes) {
      ctx.save();
      ctx.strokeStyle = lane.direction === 1 ? NEON_COLORS.CYAN : NEON_COLORS.PURPLE;
      ctx.globalAlpha = 0.45;
      ctx.scale(1, lane.ellipseRatio);
      ctx.beginPath();
      ctx.arc(0, 0, lane.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const marker = computeOrbitPosition(lane, performance.now() / 400 + lane.radius);
      ctx.fillStyle = lane.direction === 1 ? NEON_COLORS.CYAN : NEON_COLORS.PURPLE;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(marker.x * 0.04, marker.y * 0.04, 4, 4);
    }

    ctx.restore();
  }

  private drawAfterimages(): void {
    const ctx = this.ctx;
    const playerRadius = PLAYER_RADIUS;

    for (const barrier of this.afterimages) {
      ctx.save();
      ctx.rotate(barrier.angle);
      ctx.strokeStyle = NEON_COLORS.CYAN;
      ctx.globalAlpha = barrier.strength * 0.6;
      ctx.lineWidth = 6 * barrier.strength;
      ctx.beginPath();
      ctx.moveTo(playerRadius - 20, -10);
      ctx.lineTo(playerRadius + 110, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(playerRadius - 20, 10);
      ctx.lineTo(playerRadius + 110, 10);
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawWaves(): void {
    const ctx = this.ctx;
    const playerRadius = PLAYER_RADIUS;

    ctx.save();
    ctx.strokeStyle = NEON_COLORS.YELLOW;
    ctx.lineWidth = 4;

    for (const wave of this.waves) {
      const radius = playerRadius + (this.maxOrbitRadius - playerRadius) * wave.progress;
      ctx.save();
      ctx.rotate(wave.angle);
      ctx.globalAlpha = Math.max(0, Math.min(1, 1 - wave.progress));
      ctx.beginPath();
      ctx.arc(0, 0, radius, -wave.width * 0.5, wave.width * 0.5);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  private drawEnemies(): void {
    const ctx = this.ctx;

    for (const enemy of this.enemies) {
      const pos = this.getEnemyPosition(enemy);

      ctx.save();
      ctx.translate(pos.x, pos.y);

      let color = NEON_COLORS.YELLOW;
      switch (enemy.type) {
        case EnemyType.Splitter:
          color = NEON_COLORS.PURPLE;
          break;
        case EnemyType.Charger:
          color = NEON_COLORS.PINK;
          break;
        case EnemyType.Fragment:
          color = NEON_COLORS.GREEN;
          break;
        default:
          break;
      }

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      if (enemy.chargeState > 0) {
        ctx.strokeStyle = NEON_COLORS.PINK;
        ctx.globalAlpha = enemy.chargeState * 0.8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private drawPlayer(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.rotate(this.player.angle);
    ctx.translate(PLAYER_RADIUS, 0);

    ctx.fillStyle = NEON_COLORS.CYAN;
    ctx.strokeStyle = NEON_COLORS.WHITE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawCore(): void {
    const ctx = this.ctx;
    ctx.save();
    const radius = 32;
    ctx.fillStyle = 'rgba(10, 220, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = NEON_COLORS.CYAN;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawHUD(): void {
    const padding = 24;
    const gaugeWidth = 180;
    const gaugeHeight = 16;

    this.drawText(`SCORE ${this.score.toString().padStart(6, '0')}`, padding, padding, {
      font: FONTS.PIXEL_SMALL,
      color: NEON_COLORS.WHITE,
    });

    this.drawText(`ROUND ${this.round}`, padding, padding + 28, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.PINK,
    });

    // Time warp gauge
    const gaugeX = this.width - padding - gaugeWidth;
    const gaugeY = padding;

    this.drawText('TIME WARP', gaugeX, gaugeY - 12, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.CYAN,
      align: 'left',
    });

    this.ctx.strokeStyle = NEON_COLORS.CYAN;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);

    const fillWidth = gaugeWidth * this.timeWarp.gauge;
    this.ctx.fillStyle = this.timeWarp.active ? NEON_COLORS.PINK : NEON_COLORS.CYAN;
    this.ctx.fillRect(gaugeX + 1, gaugeY + 1, fillWidth - 2, gaugeHeight - 2);

    // Core integrity display
    const integrityX = gaugeX;
    const integrityY = gaugeY + 40;
    this.drawText('CORE', integrityX, integrityY, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.YELLOW,
    });

    for (let i = 0; i < CORE_INTEGRITY_MAX; i += 1) {
      const x = integrityX + i * 20;
      const y = integrityY + 12;
      const filled = i < this.coreIntegrity;
      this.ctx.fillStyle = filled ? NEON_COLORS.YELLOW : 'rgba(255,255,255,0.2)';
      this.ctx.fillRect(x, y, 14, 14);
    }

    // Round progress
    const progress = this.defeatedThisRound / this.roundTarget;
    const progressWidth = this.width - padding * 2;
    const progressY = this.height - padding - 16;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.fillRect(padding, progressY, progressWidth, 8);
    this.ctx.fillStyle = NEON_COLORS.PURPLE;
    this.ctx.fillRect(padding, progressY, Math.max(0, progressWidth * Math.min(1, progress)), 8);
  }

  private getEnemyPosition(enemy: EnemyInstance): { x: number; y: number } {
    const lane = this.findLane(enemy);
    const radius = this.computeEnemyRadius(enemy);
    const x = Math.cos(enemy.angle) * radius;
    const y = Math.sin(enemy.angle) * radius * lane.ellipseRatio;
    return { x, y };
  }

  private getMaxOrbitRadius(): number {
    return Math.max(...this.orbitState.lanes.map((lane) => lane.radius), PLAYER_RADIUS + 80);
  }
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  let result = angle % twoPi;
  if (result < 0) {
    result += twoPi;
  }
  return result;
}

function angularDelta(from: number, to: number): number {
  let diff = to - from;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}
