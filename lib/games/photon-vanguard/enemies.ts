/**
 * Photon Vanguard - Enemy System
 * 적 생성 및 동작 관리
 */

import type { Enemy, EnemyType, Position } from './types';
import { generateRandomOrbit } from './orbits';

let enemyIdCounter = 0;

/**
 * 적 생성
 */
export function createEnemy(
  type: EnemyType,
  canvasWidth: number,
  canvasHeight: number,
  level: number
): Enemy {
  const orbit = generateRandomOrbit(canvasWidth, canvasHeight, level);

  const configs = getEnemyConfig(type, level);

  return {
    id: `enemy_${++enemyIdCounter}`,
    type,
    position: { x: 0, y: 0 }, // 궤도 계산으로 업데이트됨
    orbit,
    health: configs.health,
    maxHealth: configs.health,
    angle: orbit.startAngle,
    speed: configs.speed,
    isActive: true,
    isDying: false,
    deathTimer: 0,
  };
}

/**
 * 적 타입별 설정
 */
function getEnemyConfig(type: EnemyType, level: number) {
  const baseConfigs = {
    basic: {
      health: 1,
      speed: 1.0,
      score: 100,
    },
    fast: {
      health: 1,
      speed: 1.5,
      score: 150,
    },
    heavy: {
      health: 3,
      speed: 0.7,
      score: 300,
    },
    elite: {
      health: 5,
      speed: 1.2,
      score: 500,
    },
  };

  const config = baseConfigs[type];

  // 레벨에 따라 체력 증가
  return {
    health: config.health + Math.floor(level / 3),
    speed: config.speed * (1 + level * 0.05),
    score: config.score * (1 + level * 0.1),
  };
}

/**
 * 적 스폰 패턴 생성
 */
export function generateSpawnPattern(level: number): EnemyType[] {
  const pattern: EnemyType[] = [];

  // 기본 적
  const basicCount = 3 + Math.floor(level / 2);
  for (let i = 0; i < basicCount; i++) {
    pattern.push('basic');
  }

  // 빠른 적 (레벨 2부터)
  if (level >= 2) {
    const fastCount = 1 + Math.floor(level / 3);
    for (let i = 0; i < fastCount; i++) {
      pattern.push('fast');
    }
  }

  // 중장갑 적 (레벨 3부터)
  if (level >= 3) {
    const heavyCount = Math.floor(level / 4);
    for (let i = 0; i < heavyCount; i++) {
      pattern.push('heavy');
    }
  }

  // 엘리트 적 (레벨 5부터)
  if (level >= 5) {
    const eliteCount = Math.floor(level / 6);
    for (let i = 0; i < eliteCount; i++) {
      pattern.push('elite');
    }
  }

  // 랜덤 섞기
  return pattern.sort(() => Math.random() - 0.5);
}

/**
 * 적 피격 처리
 */
export function damageEnemy(enemy: Enemy, damage: number): { destroyed: boolean; score: number } {
  enemy.health -= damage;

  if (enemy.health <= 0) {
    enemy.isDying = true;
    enemy.deathTimer = 500; // 500ms 사망 애니메이션
    const configs = getEnemyConfig(enemy.type, 1);
    return { destroyed: true, score: configs.score };
  }

  return { destroyed: false, score: 0 };
}

/**
 * 적 색상 가져오기 (타입별)
 */
export function getEnemyColor(type: EnemyType): string {
  const colors = {
    basic: '#00f0ff', // cyan
    fast: '#ff10f0', // pink
    heavy: '#9d00ff', // purple
    elite: '#ffff00', // yellow
  };
  return colors[type];
}

/**
 * 적 크기 가져오기 (타입별)
 */
export function getEnemySize(type: EnemyType): number {
  const sizes = {
    basic: 12,
    fast: 10,
    heavy: 18,
    elite: 16,
  };
  return sizes[type];
}

/**
 * 플레이어와 적 충돌 체크
 */
export function checkPlayerCollision(
  playerPos: Position,
  playerSize: number,
  enemy: Enemy
): boolean {
  if (!enemy.isActive || enemy.isDying) return false;

  const enemySize = getEnemySize(enemy.type);
  const dx = playerPos.x - enemy.position.x;
  const dy = playerPos.y - enemy.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < (playerSize + enemySize) / 2;
}
