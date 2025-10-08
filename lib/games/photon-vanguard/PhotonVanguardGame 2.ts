/**
 * Photon Vanguard - Main Game Class
 * 방사형 궤도로 진입하는 포톤 군단을 시간 왜곡으로 제압하세요
 */

import type {
  Enemy,
  GameState,
  GameStats,
  Position,
  TimeWarp,
  Wave,
  AfterimageBarrier,
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

export class PhotonVanguardGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

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
  private playerSpeed = 5;
  private playerSize = 20;

  // 적
  private enemies: Enemy[] = [];
  private spawnTimer = 0;
  private spawnInterval = 2000; // 2초마다 스폰

  // 파동 공격
  private waves: Wave[] = [];
  private waveCharge = 0;
  private maxWaveCharge = 100;
  private waveChargeRate = 30; // per second
  private waveHits = 0;

  // 시간 왜곡
  private timeWarp: TimeWarp = {
    isActive: false,
    duration: 3000, // 3초
    slowFactor: 0.3, // 30% 속도
    cooldown: 5000, // 5초 쿨다운
    currentCooldown: 0,
  };

  // 잔상 방어벽
  private afterimageBarrier: AfterimageBarrier = {
    positions: [],
    opacity: 0,
    duration: 0,
    isActive: false,
  };

  // 입력
  private keys: Set<string> = new Set();

  // 게임 루프
  private rafId: number | null = null;
  private lastTime = 0;

  // 고득점
  private highScore = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;

    this.playerX = this.width / 2;

    this.loadHighScore();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.key);

    if (this.state === 'ready' && e.key === ' ') {
      this.start();
      e.preventDefault();
    } else if (this.state === 'playing') {
      if (e.key === ' ') {
        this.fireWave();
        e.preventDefault();
      } else if (e.key === 'Shift') {
        this.activateTimeWarp();
        e.preventDefault();
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        this.pause();
        e.preventDefault();
      }
    } else if (this.state === 'paused') {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        this.resume();
        e.preventDefault();
      }
    } else if (this.state === 'gameover') {
      if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
        this.restart();
        e.preventDefault();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key);
  };

  start(): void {
    this.state = 'playing';
    this.lastTime = performance.now();
    this.spawnWave();
    this.loop(this.lastTime);
  }

  pause(): void {
    if (this.state === 'playing') {
      this.state = 'paused';
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  restart(): void {
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
    this.afterimageBarrier.isActive = false;
    this.keys.clear();
    this.render();
  }

  private loop = (currentTime: number): void => {
    if (this.state !== 'playing') return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number): void {
    // 플레이어 이동
    this.updatePlayer(deltaTime);

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

  private updatePlayer(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;

    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) {
      this.playerX -= this.playerSpeed * deltaSeconds * 60;
    }
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) {
      this.playerX += this.playerSpeed * deltaSeconds * 60;
    }

    // 화면 경계 제한
    this.playerX = Math.max(this.playerSize, Math.min(this.width - this.playerSize, this.playerX));
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
      position: { x: this.playerX, y: this.height - 50 },
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
    const playerPos: Position = { x: this.playerX, y: this.height - 50 };

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

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private render(): void {
    // 배경
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

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
      this.drawPausedScreen();
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

      // 적 본체
      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;

      this.ctx.beginPath();
      this.ctx.arc(enemy.position.x, enemy.position.y, size / 2, 0, Math.PI * 2);
      this.ctx.fill();

      // 체력 바
      if (enemy.health < enemy.maxHealth) {
        const barWidth = size;
        const barHeight = 3;
        const healthPercent = enemy.health / enemy.maxHealth;

        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
          enemy.position.x - barWidth / 2,
          enemy.position.y - size / 2 - 5,
          barWidth,
          barHeight
        );

        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
          enemy.position.x - barWidth / 2,
          enemy.position.y - size / 2 - 5,
          barWidth * healthPercent,
          barHeight
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
    const playerY = this.height - 50;

    // 플레이어 (삼각형)
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#00f0ff';

    this.ctx.beginPath();
    this.ctx.moveTo(this.playerX, playerY - this.playerSize / 2);
    this.ctx.lineTo(this.playerX - this.playerSize / 2, playerY + this.playerSize / 2);
    this.ctx.lineTo(this.playerX + this.playerSize / 2, playerY + this.playerSize / 2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
  }

  private drawUI(): void {
    const panelHeight = 80;
    const panelY = this.height - panelHeight - 10;

    // 패널 배경
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, panelY, this.width - 20, panelHeight);

    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(10, panelY, this.width - 20, panelHeight);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '14px "Press Start 2P", monospace';

    // 점수
    this.ctx.fillText(`SCORE: ${this.stats.score}`, 20, panelY + 25);

    // 레벨
    this.ctx.fillText(`LEVEL: ${this.stats.level}`, 20, panelY + 50);

    // 파동 충전
    const chargePercent = (this.waveCharge / this.maxWaveCharge) * 100;
    this.ctx.fillText(`WAVE: ${Math.floor(chargePercent)}%`, 250, panelY + 25);

    // 시간 왜곡 쿨다운
    const warpText = this.timeWarp.isActive
      ? 'WARP: ACTIVE'
      : this.timeWarp.currentCooldown > 0
      ? `WARP: ${Math.ceil(this.timeWarp.currentCooldown / 1000)}s`
      : 'WARP: READY';
    this.ctx.fillText(warpText, 250, panelY + 50);

    // 정확도
    this.ctx.fillText(`ACC: ${this.stats.accuracy.toFixed(1)}%`, 500, panelY + 25);

    // 최고 점수
    this.ctx.fillText(`HIGH: ${this.highScore}`, 500, panelY + 50);
  }

  private drawTimeWarpEffect(): void {
    this.ctx.fillStyle = 'rgba(157, 0, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawReadyScreen(): void {
    this.ctx.fillStyle = '#ff10f0';
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PHOTON VANGUARD', this.width / 2, this.height / 2 - 40);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('Press SPACE to Start', this.width / 2, this.height / 2 + 20);

    this.ctx.textAlign = 'left';
  }

  private drawPausedScreen(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#ffff00';
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('Press ESC to Resume', this.width / 2, this.height / 2 + 40);

    this.ctx.textAlign = 'left';
  }

  private drawGameOverScreen(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#ff10f0';
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 60);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText(`Final Score: ${this.stats.score}`, this.width / 2, this.height / 2 - 10);
    this.ctx.fillText(`Level: ${this.stats.level}`, this.width / 2, this.height / 2 + 20);
    this.ctx.fillText(`Accuracy: ${this.stats.accuracy.toFixed(1)}%`, this.width / 2, this.height / 2 + 50);

    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 90);

    this.ctx.textAlign = 'left';
  }

  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('photon-vanguard-high-score');
      if (saved) {
        this.highScore = parseInt(saved, 10);
      }
    } catch (e) {
      console.error('Failed to load high score:', e);
    }
  }

  private saveHighScore(): void {
    try {
      localStorage.setItem('photon-vanguard-high-score', this.highScore.toString());
    } catch (e) {
      console.error('Failed to save high score:', e);
    }
  }

  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
