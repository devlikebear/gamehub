/**
 * Leaderboard Score Validation
 * 점수 어뷰징 방지를 위한 검증 로직
 */

export interface GameLimits {
  maxScore: number;
  minPlayTime: number; // milliseconds
  description: string;
}

/**
 * 게임별 최대 점수 및 최소 플레이 시간 설정
 */
export const GAME_LIMITS: Record<string, GameLimits> = {
  'stellar-salvo': {
    maxScore: 1000000,
    minPlayTime: 10000, // 10초
    description: 'Stellar Salvo - Space Shooter',
  },
  'photon-vanguard': {
    maxScore: 500000,
    minPlayTime: 15000, // 15초
    description: 'Photon Vanguard - Radial Defense',
  },
  'spectral-pursuit': {
    maxScore: 50000,
    minPlayTime: 20000, // 20초
    description: 'Spectral Pursuit - Stealth Chase',
  },
  'starshard-drift': {
    maxScore: 100000,
    minPlayTime: 15000, // 15초
    description: 'Starshard Drift - Gravity Missions',
  },
  'cascade-blocks': {
    maxScore: 500000,
    minPlayTime: 30000, // 30초
    description: 'Color Match Cascade - Puzzle',
  },
  'neon-serpent': {
    maxScore: 200000,
    minPlayTime: 10000, // 10초
    description: 'Neon Serpent - Classic Snake',
  },
  'pulse-paddles': {
    maxScore: 70,
    minPlayTime: 20000, // 20초 (점수제가 아닌 승점)
    description: 'Pulse Paddles - Pong',
  },
  'prism-smash': {
    maxScore: 300000,
    minPlayTime: 20000, // 20초
    description: 'Prism Smash - Breakout',
  },
};

/**
 * 점수가 유효한 범위 내에 있는지 검증
 */
export function validateScore(gameId: string, score: number): boolean {
  const limits = GAME_LIMITS[gameId];
  if (!limits) {
    console.error(`Unknown game ID: ${gameId}`);
    return false;
  }

  if (score < 0) {
    console.warn(`Negative score detected: ${score}`);
    return false;
  }

  if (score > limits.maxScore) {
    console.warn(`Score ${score} exceeds max ${limits.maxScore} for ${gameId}`);
    return false;
  }

  return true;
}

/**
 * 플레이 시간이 최소 요구 시간을 충족하는지 검증
 * (너무 짧은 시간에 높은 점수를 얻는 것을 방지)
 */
export function validatePlayTime(gameId: string, playTime: number): boolean {
  const limits = GAME_LIMITS[gameId];
  if (!limits) {
    return false;
  }

  if (playTime < limits.minPlayTime) {
    console.warn(`Play time ${playTime}ms is too short for ${gameId} (min: ${limits.minPlayTime}ms)`);
    return false;
  }

  return true;
}

/**
 * 게임의 최대 점수 반환
 */
export function getMaxScore(gameId: string): number | null {
  return GAME_LIMITS[gameId]?.maxScore ?? null;
}

/**
 * 게임의 최소 플레이 시간 반환
 */
export function getMinPlayTime(gameId: string): number | null {
  return GAME_LIMITS[gameId]?.minPlayTime ?? null;
}
