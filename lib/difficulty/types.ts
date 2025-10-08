/**
 * Difficulty levels for games
 */
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

/**
 * Difficulty configuration interface
 */
export interface DifficultyConfig {
  /** Unique difficulty level identifier */
  level: DifficultyLevel;

  /** Display name */
  name: string;
  nameKo: string;

  /** Icon emoji */
  icon: string;

  /** Description */
  description: string;
  descriptionKo: string;

  /** Recommended for */
  recommended: string;
  recommendedKo: string;

  /** Neon color theme */
  color: 'green' | 'cyan' | 'pink';

  /** Game speed multiplier (1.0 = normal) */
  speedMultiplier: number;

  /** AI reaction speed multiplier (higher = faster AI) */
  aiSpeedMultiplier: number;

  /** Obstacle/enemy density multiplier */
  densityMultiplier: number;

  /** Score multiplier */
  scoreMultiplier: number;
}

/**
 * Difficulty settings storage interface
 */
export interface DifficultySettings {
  /** Game ID */
  gameId: string;

  /** Selected difficulty level */
  difficulty: DifficultyLevel;

  /** Last updated timestamp */
  updatedAt: number;
}
