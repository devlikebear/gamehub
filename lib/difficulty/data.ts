import type { DifficultyConfig, DifficultyLevel } from './types';

/**
 * Difficulty configurations for all games
 */
export const difficultyConfigs: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    level: 'easy',
    name: 'Easy',
    nameKo: '쉬움',
    icon: '⭐',
    description: 'Relaxed pace, forgiving gameplay',
    descriptionKo: '편안한 속도, 여유로운 플레이',
    recommended: 'For beginners and casual players',
    recommendedKo: '초보자와 캐주얼 플레이어에게 권장',
    color: 'green',
    speedMultiplier: 0.75,
    aiSpeedMultiplier: 0.7,
    densityMultiplier: 0.7,
    scoreMultiplier: 0.8,
  },
  normal: {
    level: 'normal',
    name: 'Normal',
    nameKo: '보통',
    icon: '⚡',
    description: 'Balanced challenge for most players',
    descriptionKo: '대부분의 플레이어에게 적당한 난이도',
    recommended: 'For players with some experience',
    recommendedKo: '어느 정도 경험이 있는 플레이어에게 권장',
    color: 'cyan',
    speedMultiplier: 1.0,
    aiSpeedMultiplier: 1.0,
    densityMultiplier: 1.0,
    scoreMultiplier: 1.0,
  },
  hard: {
    level: 'hard',
    name: 'Hard',
    nameKo: '어려움',
    icon: '🔥',
    description: 'Fast-paced, intense gameplay',
    descriptionKo: '빠른 속도, 치열한 플레이',
    recommended: 'For experienced players seeking challenge',
    recommendedKo: '도전을 원하는 숙련된 플레이어에게 권장',
    color: 'pink',
    speedMultiplier: 1.3,
    aiSpeedMultiplier: 1.4,
    densityMultiplier: 1.3,
    scoreMultiplier: 1.5,
  },
};

/**
 * Get difficulty config by level
 */
export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return difficultyConfigs[level];
}

/**
 * Get all difficulty configs as array
 */
export function getAllDifficultyConfigs(): DifficultyConfig[] {
  return Object.values(difficultyConfigs);
}

/**
 * Default difficulty level
 */
export const DEFAULT_DIFFICULTY: DifficultyLevel = 'normal';
