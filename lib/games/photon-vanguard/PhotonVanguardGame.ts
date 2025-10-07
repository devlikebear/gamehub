/**
 * Photon Vanguard - Main Game Class
 * 방사형 궤도로 진입하는 포톤 군단을 시간 왜곡으로 제압하세요
 */

import { BaseGame, GameConfig, InputHandler, StorageManager, NEON_COLORS } from '../engine';
import type {
  Enemy,
  GameState,
  GameStats,
  Position,
  TimeWarp,
  Wave,
} from './types';
import {
  createEnemy,
  generateSpawnPattern,
  damageEnemy,
  getEnemyColor,
  getEnemySize,
  checkPlayerCollision,
} from './enemies';
import { calculateOrbitPosition, updateOrbitAngle, distance } from './orbits';

const GAME_ID = 'photon-vanguard';

export class PhotonVanguardGame extends BaseGame {
  private state: GameState = 'ready';
  private stats: GameStats = {
    score: 0,
    level: 1,
    enemiesDestroyed: 0,
    wavesFired: 0,
    accuracy: 0,
  };

  // 플레이어
  private playerX: number;
  private readonly playerSpeed = 5;
  private readonly playerSize = 20;

  // 적
  private enemies: Enemy[] = [];
  private spawnTimer = 0;
  private readonly spawnInterval = 2000; // 2초마다 스폰

  // 파동 공격
  private waves: Wave[] = [];
  private waveCharge = 0;
  private readonly maxWaveCharge = 100;
  private readonly waveChargeRate = 30; // per second
  private waveHits = 0;

  // 시간 왜곡
  private timeWarp: TimeWarp = {
    isActive: false,
    duration: 3000, // 3초
    slowFactor: 0.3, // 30% 속도
    cooldown: 5000, // 5초 쿨다운
    currentCooldown: 0,
  };

  // 입력 및 저장소
  private readonly input: InputHandler;
  private readonly storage: StorageManager;

  // 고득점
  private highScore = 0;

  constructor(config: GameConfig) {
    super(config);

    this.playerX = this.width / 2;

    this.input = new InputHandler({ targetElement: config.canvas });
    this.storage = new StorageManager();

    this.loadHighScore();
  }

  protected onStart(): void {
    this.input.attach();
    if (this.state === 'ready') {
      this.state = 'playing';
      this.spawnWave();
    }
  }

  protected onStop(): void {
    this.input.detach();
  }

  protected onPause(): void {
    this.state = 'paused';
  }

  protected onResume(): void {
    this.state = 'playing';
  }

  private restart(): void {
    this.state = 'ready';
    this.stats = {
      score: 0,
      level: 1,
      enemiesDestroyed: 0,
      wavesFired: 0,
      accuracy: 0,
    };
    this.playerX = this.width / 2;
    this.enemies = [];
    this.waves = [];
    this.waveCharge = 0;
    this.waveHits = 0;
    this.timeWarp.isActive = false;
    this.timeWarp.currentCooldown = 0;

    this.start();
  }

  protected update(deltaTime: number): void {
    if (this.state === 'ready') {
      this.processReadyInput();
      return;
    }

    if (this.state === 'gameover') {
      this.processGameOverInput();
      return;
    }

    if (this.state !== 'playing') return;

    // 게임플레이 입력
    this.processGameplayInput(deltaTime);

    // 시간 왜곡 업데이트
    this.updateTimeWarp(deltaTime);

    // 적 업데이트
    const slowFactor = this.timeWarp.isActive ? this.timeWarp.slowFactor : 1;
    this.updateEnemies(deltaTime, slowFactor);

    // 파동 업데이트
    this.updateWaves(deltaTime);

    // 파동 충전
    this.updateWaveCharge(deltaTime);

    // 적 스폰
    this.updateSpawn(deltaTime);

    // 충돌 체크
    this.checkCollisions();

    // 레벨업 체크
    this.checkLevelUp();
  }

  private processReadyInput(): void {
    if (this.input.isPressed('Space') || this.input.isPressed('Enter')) {
      this.start();
    }
  }

  private processGameOverInput(): void {
    if (this.input.isPressed('Enter') || this.input.isPressed('r') || this.input.isPressed('R')) {
      this.restart();
    }
  }

  private processGameplayInput(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;

    // 플레이어 이동
    if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a') || this.input.isPressed('A')) {
      this.playerX -= this.playerSpeed * deltaSeconds * 60;
    }
    if (this.input.isPressed('ArrowRight') || this.input.isPressed('d') || this.input.isPressed('D')) {
      this.playerX += this.playerSpeed * deltaSeconds * 60;
    }

    // 화면 경계 제한
    this.playerX = Math.max(this.playerSize, Math.min(this.width - this.playerSize, this.playerX));

    // 파동 발사
    if (this.input.justPressed('Space')) {
      this.fireWave();
    }

    // 시간 왜곡
    if (this.input.justPressed('Shift')) {
      this.activateTimeWarp();
    }
  }

  private updateTimeWarp(deltaTime: number): void {
    // 쿨다운 업데이트
    if (this.timeWarp.currentCooldown > 0) {
      this.timeWarp.currentCooldown = Math.max(0, this.timeWarp.currentCooldown - deltaTime);
    }

    // 지속시간 업데이트
    if (this.timeWarp.isActive) {
      this.timeWarp.duration -= deltaTime;
      if (this.timeWarp.duration <= 0) {
        this.timeWarp.isActive = false;
        this.timeWarp.currentCooldown = this.timeWarp.cooldown;
        this.timeWarp.duration = 3000; // 리셋
      }
    }
  }

  private updateEnemies(deltaTime: number, slowFactor: number): void {
    for (const enemy of this.enemies) {
      if (!enemy.isActive) continue;

      if (enemy.isDying) {
        enemy.deathTimer -= deltaTime;
        if (enemy.deathTimer <= 0) {
          enemy.isActive = false;
        }
        continue;
      }

      // 궤도 각도 업데이트
      enemy.angle = updateOrbitAngle(
        enemy.angle,
        enemy.orbit.rotationSpeed * enemy.speed,
        deltaTime,
        slowFactor
      );

      // 위치 계산
      enemy.position = calculateOrbitPosition(enemy.orbit, enemy.angle);
    }

    // 비활성 적 제거
    this.enemies = this.enemies.filter((e) => e.isActive);
  }

  private updateWaves(deltaTime: number): void {
    for (const wave of this.waves) {
      if (!wave.isActive) continue;

      // 파동 확장
      wave.radius += deltaTime * 0.3;

      if (wave.radius >= wave.maxRadius) {
        wave.isActive = false;
      }
    }

    // 비활성 파동 제거
    this.waves = this.waves.filter((w) => w.isActive);
  }

  private updateWaveCharge(deltaTime: number): void {
    if (this.waveCharge < this.maxWaveCharge) {
      const deltaSeconds = deltaTime / 1000;
      this.waveCharge = Math.min(
        this.maxWaveCharge,
        this.waveCharge + this.waveChargeRate * deltaSeconds
      );
    }
  }

  private updateSpawn(deltaTime: number): void {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      // 적이 모두 제거되면 새 웨이브
      if (this.enemies.length === 0) {
        this.spawnWave();
      }
    }
  }

  private spawnWave(): void {
    const pattern = generateSpawnPattern(this.stats.level);

    for (const enemyType of pattern) {
      const enemy = createEnemy(enemyType, this.width, this.height, this.stats.level);
      this.enemies.push(enemy);
    }
  }

  private fireWave(): void {
    if (this.waveCharge < this.maxWaveCharge) return;

    const wave: Wave = {
      id: `wave_${Date.now()}`,
      position: { x: this.playerX, y: this.height - 100 },
      radius: 0,
      maxRadius: 300,
      damage: 1,
      isActive: true,
    };

    this.waves.push(wave);
    this.waveCharge = 0;
    this.stats.wavesFired++;
  }

  private activateTimeWarp(): void {
    if (this.timeWarp.isActive || this.timeWarp.currentCooldown > 0) return;

    this.timeWarp.isActive = true;
    this.timeWarp.duration = 3000;
  }

  private checkCollisions(): void {
    const playerPos: Position = { x: this.playerX, y: this.height - 100 };

    // 파동과 적 충돌
    for (const wave of this.waves) {
      if (!wave.isActive) continue;

      for (const enemy of this.enemies) {
        if (!enemy.isActive || enemy.isDying) continue;

        const dist = distance(wave.position, enemy.position);
        const enemySize = getEnemySize(enemy.type);

        if (dist <= wave.radius + enemySize / 2) {
          const result = damageEnemy(enemy, wave.damage);
          if (result.destroyed) {
            this.stats.score += result.score;
            this.stats.enemiesDestroyed++;
            this.waveHits++;
          }
        }
      }
    }

    // 플레이어와 적 충돌
    for (const enemy of this.enemies) {
      if (checkPlayerCollision(playerPos, this.playerSize, enemy)) {
        this.gameOver();
        return;
      }
    }

    // 정확도 계산
    if (this.stats.wavesFired > 0) {
      this.stats.accuracy = (this.waveHits / this.stats.wavesFired) * 100;
    }
  }

  private checkLevelUp(): void {
    const enemiesPerLevel = 10;
    const targetEnemies = this.stats.level * enemiesPerLevel;

    if (this.stats.enemiesDestroyed >= targetEnemies) {
      this.stats.level++;
    }
  }

  private gameOver(): void {
    this.state = 'gameover';

    if (this.stats.score > this.highScore) {
      this.highScore = this.stats.score;
      this.saveHighScore();
    }
  }

  protected render(): void {
    // 배경
    this.clearCanvas('#000000');

    // 그리드 배경
    this.drawGrid();

    if (this.state === 'ready') {
      this.drawReadyScreen();
      return;
    }

    // 시간 왜곡 효과
    if (this.timeWarp.isActive) {
      this.drawTimeWarpEffect();
    }

    // 적 궤도
    this.drawOrbits();

    // 적
    this.drawEnemies();

    // 파동
    this.drawWaves();

    // 플레이어
    this.drawPlayer();

    // UI
    this.drawUI();

    if (this.state === 'paused') {
      this.drawOverlay('PAUSED', NEON_COLORS.YELLOW, 'Press ESC to Resume');
    } else if (this.state === 'gameover') {
      this.drawGameOverScreen();
    }
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    this.ctx.lineWidth = 1;

    const gridSize = 40;

    for (let x = 0; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  private drawOrbits(): void {
    this.ctx.strokeStyle = 'rgba(157, 0, 255, 0.3)';
    this.ctx.lineWidth = 1;

    for (const enemy of this.enemies) {
      if (!enemy.isActive || enemy.isDying) continue;

      this.ctx.beginPath();
      this.ctx.ellipse(
        enemy.orbit.centerX,
        enemy.orbit.centerY,
        enemy.orbit.radiusX,
        enemy.orbit.radiusY,
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }
  }

  private drawEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.isActive) continue;

      const size = getEnemySize(enemy.type);
      const color = getEnemyColor(enemy.type);

      // 사망 애니메이션
      if (enemy.isDying) {
        const opacity = enemy.deathTimer / 500;
        this.ctx.globalAlpha = opacity;
      }

      // 적 본체 (네온 글로우)
      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;

      this.drawCircle(enemy.position.x, enemy.position.y, size / 2, color);

      // 체력 바
      if (enemy.health < enemy.maxHealth) {
        const barWidth = size;
        const barHeight = 3;
        const healthPercent = enemy.health / enemy.maxHealth;

        this.drawRect(
          enemy.position.x - barWidth / 2,
          enemy.position.y - size / 2 - 5,
          barWidth,
          barHeight,
          '#ff0000'
        );

        this.drawRect(
          enemy.position.x - barWidth / 2,
          enemy.position.y - size / 2 - 5,
          barWidth * healthPercent,
          barHeight,
          '#00ff00'
        );
      }

      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }
  }

  private drawWaves(): void {
    for (const wave of this.waves) {
      if (!wave.isActive) continue;

      const opacity = 1 - wave.radius / wave.maxRadius;

      this.ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
      this.ctx.lineWidth = 3;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#00ff00';

      this.ctx.beginPath();
      this.ctx.arc(wave.position.x, wave.position.y, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.shadowBlur = 0;
    }
  }

  private drawPlayer(): void {
    const playerY = this.height - 100;

    // 플레이어 (삼각형)
    this.ctx.fillStyle = NEON_COLORS.CYAN;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = NEON_COLORS.CYAN;

    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, playerY - this.playerSize / 2);
    this.ctx.lineTo(this.playerX - this.playerSize / 2, playerY + this.playerSize / 2);
    this.ctx.lineTo(this.playerX + this.playerSize / 2, playerY + this.playerSize / 2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
  }

  private drawUI(): void {
    const panelHeight = 70;
    const panelY = this.height - panelHeight;

    // 패널 배경
    this.drawRect(0, panelY, this.width, panelHeight, 'rgba(0, 0, 0, 0.8)');
    this.strokeRect(0, panelY, this.width, panelHeight, NEON_COLORS.CYAN, 2);

    // 점수
    this.drawText(`SCORE: ${this.stats.score}`, 20, panelY + 25, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });

    // 레벨
    this.drawText(`LEVEL: ${this.stats.level}`, 20, panelY + 50, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });

    // 파동 충전
    const chargePercent = (this.waveCharge / this.maxWaveCharge) * 100;
    this.drawText(`WAVE: ${Math.floor(chargePercent)}%`, 250, panelY + 25, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });

    // 시간 왜곡 쿨다운
    const warpText = this.timeWarp.isActive
      ? 'WARP: ACTIVE'
      : this.timeWarp.currentCooldown > 0
      ? `WARP: ${Math.ceil(this.timeWarp.currentCooldown / 1000)}s`
      : 'WARP: READY';
    this.drawText(warpText, 250, panelY + 50, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });

    // 정확도
    this.drawText(`ACC: ${this.stats.accuracy.toFixed(1)}%`, 500, panelY + 25, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });

    // 최고 점수
    this.drawText(`HIGH: ${this.highScore}`, 500, panelY + 50, {
      font: '14px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
    });
  }

  private drawTimeWarpEffect(): void {
    this.ctx.fillStyle = 'rgba(157, 0, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawReadyScreen(): void {
    this.drawOverlay('PHOTON VANGUARD', NEON_COLORS.PINK, 'Press SPACE to Start');
  }

  private drawGameOverScreen(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawText('GAME OVER', this.width / 2, this.height / 2 - 60, {
      font: '32px "Press Start 2P"',
      color: NEON_COLORS.PINK,
      align: 'center',
      baseline: 'middle',
    });

    this.drawText(`Final Score: ${this.stats.score}`, this.width / 2, this.height / 2 - 10, {
      font: '16px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
      align: 'center',
      baseline: 'middle',
    });

    this.drawText(`Level: ${this.stats.level}`, this.width / 2, this.height / 2 + 20, {
      font: '16px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
      align: 'center',
      baseline: 'middle',
    });

    this.drawText(`Accuracy: ${this.stats.accuracy.toFixed(1)}%`, this.width / 2, this.height / 2 + 50, {
      font: '16px "Press Start 2P"',
      color: NEON_COLORS.CYAN,
      align: 'center',
      baseline: 'middle',
    });

    this.drawText('Press ENTER to Restart', this.width / 2, this.height / 2 + 90, {
      font: '16px "Press Start 2P"',
      color: NEON_COLORS.YELLOW,
      align: 'center',
      baseline: 'middle',
    });
  }

  private loadHighScore(): void {
    this.highScore = this.storage.getHighScore(GAME_ID);
  }

  private saveHighScore(): void {
    this.storage.setHighScore(GAME_ID, this.highScore);
  }
}
