/**
 * Photon Vanguard - Type Definitions
 */

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

/**
 * 적 타입
 */
export type EnemyType = 'basic' | 'fast' | 'heavy' | 'elite';

/**
 * 궤도 타입 (방사형 진입 패턴)
 */
export type OrbitType = 'radial' | 'elliptical' | 'spiral';

/**
 * 적 유닛
 */
export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  orbit: OrbitPath;
  health: number;
  maxHealth: number;
  angle: number; // 궤도 상의 각도
  speed: number; // 궤도 이동 속도
  isActive: boolean;
  isDying: boolean;
  deathTimer: number;
}

/**
 * 궤도 경로
 */
export interface OrbitPath {
  type: OrbitType;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  startAngle: number;
  rotationSpeed: number; // 궤도 회전 속도 (rad/s)
}

/**
 * 플레이어 파동 공격
 */
export interface Wave {
  id: string;
  position: Position;
  radius: number;
  maxRadius: number;
  damage: number;
  isActive: boolean;
}

/**
 * 시간 왜곡 효과
 */
export interface TimeWarp {
  isActive: boolean;
  duration: number; // 남은 지속 시간 (ms)
  slowFactor: number; // 적 속도 감소 배수 (0.3 = 30% 속도)
  cooldown: number; // 쿨다운 (ms)
  currentCooldown: number; // 현재 쿨다운
}

/**
 * 잔상 방어벽
 */
export interface AfterimageBarrier {
  positions: Position[];
  opacity: number;
  duration: number;
  isActive: boolean;
}

/**
 * 게임 통계
 */
export interface GameStats {
  score: number;
  level: number;
  enemiesDestroyed: number;
  wavesFired: number;
  accuracy: number; // 파동 명중률
}

/**
 * 게임 상태
 */
export type GameState = 'ready' | 'playing' | 'paused' | 'gameover';
