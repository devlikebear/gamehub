import {
  BACKGROUND_COLORS,
  BaseGame,
  FONTS,
  GameConfig,
  InputHandler,
  NEON_COLORS,
} from '../engine';
import { playSound, SOUNDS } from '@/lib/audio/sounds';
import {
  LabyrinthNode,
  LabyrinthState,
  createLabyrinthState,
  getActivePortals,
  stepLabyrinth,
} from './labyrinth';
import {
  HunterArchetype,
  HunterState,
  createHunter,
  stepHunter,
  updateHunterAwareness,
} from './hunters';
import {
  StealthMeter,
  applyStealthAction,
  createStealthMeter,
  decayThreat,
  getDetectionProbability,
} from './stealth';

interface LightShard {
  id: string;
  position: { x: number; y: number };
  collected: boolean;
  pulse: number;
}

interface DecoyEcho {
  position: { x: number; y: number };
  lifetime: number;
}

interface PlayerState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  cloaked: boolean;
  energy: number;
  shards: number;
  targetShards: number;
}

const LABYRINTH_WIDTH = 32;
const LABYRINTH_HEIGHT = 22;
const PLAYER_SPEED = 8.6;
const CLOAK_SPEED_MULTIPLIER = 0.55;
const BOARD_PADDING_X = 80;
const BOARD_PADDING_Y = 72;
const SHARD_TARGET = 5;
const DECOY_COOLDOWN_MS = 5400;

export class SpectralPursuitGame extends BaseGame {
  private readonly gameId = 'spectral-pursuit';
  private readonly input: InputHandler;
  private labyrinth: LabyrinthState;
  private hunters: HunterState[] = [];
  private stealth: StealthMeter;
  private player: PlayerState;
  private shards: LightShard[] = [];
  private decoyCooldown = 0;
  private decoyEchoes: DecoyEcho[] = [];
  private exitUnlocked = false;
  private exitPortal: { layerId: string; nodeId: string } | null = null;
  private threatLevel = 0;
  private timeSinceStart = 0;
  private gameOver = false;
  private missionComplete = false;

  constructor(config: GameConfig) {
    super(config);
    this.input = new InputHandler({ targetElement: config.canvas });
    this.labyrinth = createLabyrinthState({
      width: LABYRINTH_WIDTH,
      height: LABYRINTH_HEIGHT,
      seed: 9221,
      portalCount: 2,
    });
    this.stealth = createStealthMeter();
    this.player = {
      position: this.projectCenter(),
      velocity: { x: 0, y: 0 },
      cloaked: false,
      energy: 1,
      shards: 0,
      targetShards: SHARD_TARGET,
    };
    this.spawnHunters();
    this.spawnShards();
  }

  protected onStart(): void {
    this.input.attach();
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected update(deltaTime: number): void {
    if (this.gameOver || this.missionComplete) {
      this.notifyGameComplete({
        gameId: this.gameId,
        outcome: this.missionComplete ? 'victory' : 'defeat',
        score: this.player.shards * 1000 + Math.floor(this.timeSinceStart / 10),
        timestamp: new Date().toISOString(),
      });
      if (this.input.justPressed('Enter') || this.input.justPressed('r') || this.input.justPressed('R')) {
        this.reset();
      }
      return;
    }

    this.timeSinceStart += deltaTime;
    this.handleInput(deltaTime);

    this.stealth = applyStealthAction(this.stealth, this.computeStealthAction());
    this.stealth = decayThreat(this.stealth, deltaTime, { cloaked: this.player.cloaked });
    this.threatLevel = getDetectionProbability(this.stealth);

    this.labyrinth = stepLabyrinth(this.labyrinth, deltaTime, { reconfigure: false });
    if (this.exitUnlocked) {
      this.exitPortal = getActivePortals(this.labyrinth)[0] ?? null;
    }

    this.updateHunters(deltaTime);
    this.updateShards(deltaTime);
    this.updateDecoys(deltaTime);

    this.decoyCooldown = Math.max(0, this.decoyCooldown - deltaTime);
  }

  protected render(): void {
    this.clearCanvas(BACKGROUND_COLORS.DARKER);
    this.drawGridBackground();
    this.drawLabyrinth();
    this.drawPortals();
    this.drawShards();
    this.drawDecoys();
    this.drawHunters();
    this.drawPlayer();
    this.drawHUD();

    if (this.gameOver) {
      this.drawOverlay('DETECTED', NEON_COLORS.PINK, 'ENTER TO RETRY');
    } else if (this.missionComplete) {
      this.drawOverlay('ESCAPE ACHIEVED', NEON_COLORS.GREEN, 'ENTER TO CONTINUE');
    } else if (this.getIsPaused()) {
      this.drawOverlay('PAUSED', NEON_COLORS.CYAN, 'ESC TO RESUME');
    }
  }

  private handleInput(deltaTime: number): void {
    const inputVector = { x: 0, y: 0 };
    if (this.input.isPressed('ArrowUp') || this.input.isPressed('w') || this.input.isPressed('W')) inputVector.y -= 1;
    if (this.input.isPressed('ArrowDown') || this.input.isPressed('s') || this.input.isPressed('S')) inputVector.y += 1;
    if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A')) inputVector.x -= 1;
    if (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D')) inputVector.x += 1;

    this.player.cloaked = this.input.isPressed('Space');

    if (this.input.justPressed('Escape')) {
      this.togglePause();
    }

    if (this.input.justPressed('Shift') && this.decoyCooldown <= 0) {
      this.triggerDecoy();
    }

    const magnitude = Math.hypot(inputVector.x, inputVector.y);
    let moveX = 0;
    let moveY = 0;
    if (magnitude > 0) {
      moveX = inputVector.x / magnitude;
      moveY = inputVector.y / magnitude;
    }

    const baseSpeed = this.player.cloaked ? PLAYER_SPEED * CLOAK_SPEED_MULTIPLIER : PLAYER_SPEED;
    const velocity = baseSpeed * (deltaTime / 1000);

    const scaleX = LABYRINTH_WIDTH;
    const scaleY = LABYRINTH_HEIGHT;

    this.player.position.x = clamp(
      1,
      scaleX - 1,
      this.player.position.x + moveX * velocity
    );
    this.player.position.y = clamp(
      1,
      scaleY - 1,
      this.player.position.y + moveY * velocity
    );

    this.player.velocity = { x: moveX, y: moveY };
  }

  private computeStealthAction() {
    const movementNoise = Math.hypot(this.player.velocity.x, this.player.velocity.y);
    const baseNoise = this.player.cloaked ? 0.05 : 0.18;
    const noise = clamp(0, 1, baseNoise + movementNoise * (this.player.cloaked ? 0.1 : 0.35));
    const visibility = this.player.cloaked ? 0.12 : 0.58;
    return { noise, visibility };
  }

  private updateHunters(deltaTime: number): void {
    const timeScale = this.player.cloaked ? 0.7 : 1;
    const nextHunters: HunterState[] = [];

    for (const hunter of this.hunters) {
      const awarenessAdjusted = updateHunterAwareness(hunter, {
        playerPosition: this.player.position,
        threatLevel: this.threatLevel,
        deltaTime,
      });

      const advanced = stepHunter(awarenessAdjusted, deltaTime, {
        timeScale,
        target: this.player.position,
      });

      if (advanced.awareness >= 0.98) {
        this.gameOver = true;
        playSound(SOUNDS.GAME_OVER); // 탐지 소리
      }

      nextHunters.push(advanced);
    }

    this.hunters = nextHunters;
  }

  private updateShards(deltaTime: number): void {
    for (const shard of this.shards) {
      if (shard.collected) continue;
      const distance = Math.hypot(
        shard.position.x - this.player.position.x,
        shard.position.y - this.player.position.y
      );
      if (distance < 1.2) {
        shard.collected = true;
        this.player.shards += 1;
        playSound(SOUNDS.COIN); // 파편 수집 소리
        if (this.player.shards >= this.player.targetShards) {
          this.exitUnlocked = true;
          this.exitPortal = getActivePortals(this.labyrinth)[0] ?? null;
          playSound(SOUNDS.POWER_UP); // 탈출구 활성화 소리
        }
      }
    }

    if (this.exitUnlocked && this.exitPortal) {
      const exitNode = this.findNodeById(this.exitPortal.nodeId);
      if (exitNode) {
        const distance = Math.hypot(
          exitNode.position.x - this.player.position.x,
          exitNode.position.y - this.player.position.y
        );
        if (distance < 1.4) {
          this.missionComplete = true;
          playSound(SOUNDS.VICTORY); // 미션 완료 소리
        }
      }
    }

    this.shards.forEach((shard) => {
      shard.pulse = (shard.pulse + deltaTime * 0.004) % 1;
    });
  }

  private updateDecoys(deltaTime: number): void {
    this.decoyEchoes.forEach((echo) => {
      echo.lifetime -= deltaTime;
    });
    this.decoyEchoes = this.decoyEchoes.filter((echo) => echo.lifetime > 0);
  }

  private triggerDecoy(): void {
    this.decoyCooldown = DECOY_COOLDOWN_MS;
    playSound(SOUNDS.LASER); // 미끼 발사 소리
    this.stealth = decayThreat(
      {
        ...this.stealth,
        threat: this.stealth.threat * 0.6,
        heat: Math.max(0, this.stealth.heat - 0.2),
      },
      0,
      { cloaked: false }
    );
    this.decoyEchoes.push({
      position: { ...this.player.position },
      lifetime: 2300,
    });
  }

  private drawGridBackground(): void {
    const ctx = this.ctx;
    const cellSize = 32;
    ctx.save();
    ctx.strokeStyle = 'rgba(20, 40, 60, 0.35)';
    ctx.lineWidth = 1;

    for (let x = BOARD_PADDING_X; x <= this.width - BOARD_PADDING_X; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, BOARD_PADDING_Y);
      ctx.lineTo(x, this.height - BOARD_PADDING_Y);
      ctx.stroke();
    }

    for (let y = BOARD_PADDING_Y; y <= this.height - BOARD_PADDING_Y; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(BOARD_PADDING_X, y);
      ctx.lineTo(this.width - BOARD_PADDING_X, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawLabyrinth(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 240, 0.3)';
    ctx.lineWidth = 1.5;

    this.labyrinth.layers.forEach((layer, index) => {
      ctx.strokeStyle =
        index % 2 === 0 ? 'rgba(0,255,240,0.35)' : 'rgba(160,120,255,0.35)';

      layer.nodes.forEach((node) => {
        node.connections.forEach((connectionId) => {
          const target = this.findNodeById(connectionId);
          if (!target) return;
          const start = this.projectToCanvas(node.position);
          const end = this.projectToCanvas(target.position);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        });
      });
    });
    ctx.restore();
  }

  private drawPortals(): void {
    const ctx = this.ctx;
    ctx.save();
    const portals = getActivePortals(this.labyrinth);

    portals.forEach((portal) => {
      const node = this.findNodeById(portal.nodeId);
      if (!node) return;
      const pos = this.projectToCanvas(node.position);

      ctx.beginPath();
      ctx.strokeStyle = portal === this.exitPortal ? NEON_COLORS.PINK : NEON_COLORS.CYAN;
      ctx.lineWidth = portal === this.exitPortal ? 4 : 2;
      ctx.globalAlpha = portal === this.exitPortal ? 0.85 : 0.55;
      ctx.arc(pos.x, pos.y, portal === this.exitPortal ? 20 : 14, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  }

  private drawShards(): void {
    const ctx = this.ctx;
    ctx.save();

    this.shards.forEach((shard) => {
      if (shard.collected) return;
      const pos = this.projectToCanvas(shard.position);
      const pulse = 6 + Math.sin(shard.pulse * Math.PI * 2) * 3;
      ctx.fillStyle = NEON_COLORS.YELLOW;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - pulse);
      ctx.lineTo(pos.x + pulse * 0.7, pos.y);
      ctx.lineTo(pos.x, pos.y + pulse);
      ctx.lineTo(pos.x - pulse * 0.7, pos.y);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  private drawDecoys(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = NEON_COLORS.PURPLE;

    this.decoyEchoes.forEach((echo) => {
      const pos = this.projectToCanvas(echo.position);
      const progress = 1 - echo.lifetime / 2300;
      ctx.globalAlpha = Math.max(0, 0.5 - progress * 0.5);
      ctx.lineWidth = 3 - progress * 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18 + progress * 28, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  }

  private drawHunters(): void {
    const ctx = this.ctx;

    this.hunters.forEach((hunter) => {
      const pos = this.projectToCanvas(hunter.position);
      const detectionRadius = hunter.detectionRadius * this.getGridScaleX();

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 50, 120, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, detectionRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = hunter.awareness > 0.6 ? NEON_COLORS.PINK : NEON_COLORS.PURPLE;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();

      const awarenessBarWidth = 36;
      ctx.fillStyle = NEON_COLORS.PINK;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(pos.x - awarenessBarWidth / 2, pos.y + 14, awarenessBarWidth * hunter.awareness, 4);
      ctx.restore();
    });
  }

  private drawPlayer(): void {
    const ctx = this.ctx;
    const pos = this.projectToCanvas(this.player.position);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(Math.atan2(this.player.velocity.y, this.player.velocity.x) || 0);
    ctx.fillStyle = this.player.cloaked ? 'rgba(120, 220, 255, 0.45)' : NEON_COLORS.CYAN;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawHUD(): void {
    const padding = 24;
    const baseY = padding;

    this.drawText(`SHARDS ${this.player.shards}/${this.player.targetShards}`, padding, baseY, {
      font: FONTS.PIXEL_SMALL,
      color: NEON_COLORS.WHITE,
    });

    const stealthY = baseY + 28;
    const gaugeWidth = 180;
    this.drawText('THREAT', padding, stealthY, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.PINK,
    });
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    this.ctx.fillRect(padding, stealthY + 12, gaugeWidth, 10);
    this.ctx.fillStyle = NEON_COLORS.PINK;
    this.ctx.fillRect(padding, stealthY + 12, gaugeWidth * this.threatLevel, 10);

    this.drawText(this.player.cloaked ? 'CLOAK ENGAGED' : 'CLOAK READY', padding, stealthY + 32, {
      font: FONTS.PIXEL_TINY,
      color: this.player.cloaked ? NEON_COLORS.CYAN : NEON_COLORS.GREEN,
    });

    const decoyText =
      this.decoyCooldown > 0 ? `DECOY ${Math.ceil(this.decoyCooldown / 1000)}s` : 'DECOY READY';
    this.drawText(decoyText, padding, stealthY + 48, {
      font: FONTS.PIXEL_TINY,
      color: this.decoyCooldown > 0 ? NEON_COLORS.PURPLE : NEON_COLORS.YELLOW,
    });

    const rightPadding = this.width - padding - 180;
    this.drawText('HUNTER ALERT', rightPadding, baseY, {
      font: FONTS.PIXEL_TINY,
      color: NEON_COLORS.YELLOW,
    });

    const alertGaugeWidth = 150;
    const alertLevel = this.hunters.reduce((max, hunter) => Math.max(max, hunter.awareness), 0);
    this.ctx.fillStyle = 'rgba(255,255,255,0.12)';
    this.ctx.fillRect(rightPadding, baseY + 12, alertGaugeWidth, 10);
    this.ctx.fillStyle = NEON_COLORS.YELLOW;
    this.ctx.fillRect(rightPadding, baseY + 12, alertGaugeWidth * alertLevel, 10);

    if (this.exitUnlocked && this.exitPortal) {
      this.drawText('EXIT PORTAL ACTIVE', rightPadding, baseY + 32, {
        font: FONTS.PIXEL_TINY,
        color: NEON_COLORS.GREEN,
      });
    } else {
      this.drawText('COLLECT LIGHT SHARDS', rightPadding, baseY + 32, {
        font: FONTS.PIXEL_TINY,
        color: NEON_COLORS.CYAN,
      });
    }
  }

  private spawnHunters(): void {
    const layers = this.labyrinth.layers;
    const outerNodes = layers[layers.length - 1]?.nodes ?? [];
    const midNodes = layers[1]?.nodes ?? [];
    const innerNodes = layers[0]?.nodes ?? [];

    this.hunters = [
      createHunter({
        id: 'warden',
        archetype: HunterArchetype.Warden,
        path: this.selectPath(outerNodes, 6),
      }),
      createHunter({
        id: 'stalker',
        archetype: HunterArchetype.Stalker,
        path: this.selectPath(midNodes, 5),
      }),
      createHunter({
        id: 'seeker',
        archetype: HunterArchetype.Seeker,
        path: this.selectPath(innerNodes, 4),
      }),
    ];
  }

  private spawnShards(): void {
    const nodes = this.labyrinth.layers.flatMap((layer) => layer.nodes);
    const shards: LightShard[] = [];
    let index = 0;
    for (const node of nodes) {
      if (node.portal) continue;
      if (index % 4 === 0 && shards.length < SHARD_TARGET + 2) {
        shards.push({
          id: `shard-${node.id}`,
          position: { ...node.position },
          collected: false,
          pulse: Math.random(),
        });
      }
      index += 1;
    }

    this.shards = shards.slice(0, SHARD_TARGET + 1);
  }

  private selectPath(nodes: LabyrinthNode[], count: number): { x: number; y: number }[] {
    if (nodes.length === 0) return [{ x: LABYRINTH_WIDTH / 2, y: LABYRINTH_HEIGHT / 2 }];
    const step = Math.max(1, Math.floor(nodes.length / count));
    const path: { x: number; y: number }[] = [];
    for (let i = 0; i < nodes.length && path.length < count; i += step) {
      path.push({ ...nodes[i].position });
    }
    return path;
  }

  private projectCenter(): { x: number; y: number } {
    return { x: LABYRINTH_WIDTH / 2, y: LABYRINTH_HEIGHT / 2 };
  }

  private projectToCanvas(position: { x: number; y: number }): { x: number; y: number } {
    const scaleX = this.getGridScaleX();
    const scaleY = this.getGridScaleY();

    return {
      x: BOARD_PADDING_X + position.x * scaleX,
      y: BOARD_PADDING_Y + position.y * scaleY,
    };
  }

  private getGridScaleX(): number {
    return (this.width - BOARD_PADDING_X * 2) / LABYRINTH_WIDTH;
  }

  private getGridScaleY(): number {
    return (this.height - BOARD_PADDING_Y * 2) / LABYRINTH_HEIGHT;
  }

  private findNodeById(nodeId: string): LabyrinthNode | undefined {
    for (const layer of this.labyrinth.layers) {
      const node = layer.nodes.find((candidate) => candidate.id === nodeId);
      if (node) return node;
    }
    return undefined;
  }

  private reset(): void {
    this.labyrinth = createLabyrinthState({
      width: LABYRINTH_WIDTH,
      height: LABYRINTH_HEIGHT,
      seed: 9221 + Math.floor(this.timeSinceStart),
      portalCount: 2,
    });
    this.player = {
      position: this.projectCenter(),
      velocity: { x: 0, y: 0 },
      cloaked: false,
      energy: 1,
      shards: 0,
      targetShards: SHARD_TARGET,
    };
    this.stealth = createStealthMeter();
    this.decoyCooldown = 0;
    this.decoyEchoes = [];
    this.exitUnlocked = false;
    this.exitPortal = null;
    this.timeSinceStart = 0;
    this.gameOver = false;
    this.missionComplete = false;
    this.resetGameCompletion();
    this.spawnHunters();
    this.spawnShards();
  }
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
