import type { DifficultyLevel, DifficultySettings } from './types';
import { DEFAULT_DIFFICULTY } from './data';

const STORAGE_KEY_PREFIX = 'gamehub_difficulty';

/**
 * Get storage key for a game
 */
function getStorageKey(gameId: string): string {
  return `${STORAGE_KEY_PREFIX}_${gameId}`;
}

/**
 * Save difficulty setting for a game
 */
export function saveDifficulty(gameId: string, difficulty: DifficultyLevel): void {
  if (typeof window === 'undefined') return;

  const settings: DifficultySettings = {
    gameId,
    difficulty,
    updatedAt: Date.now(),
  };

  try {
    localStorage.setItem(getStorageKey(gameId), JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save difficulty:', error);
  }
}

/**
 * Load difficulty setting for a game
 */
export function loadDifficulty(gameId: string): DifficultyLevel {
  if (typeof window === 'undefined') return DEFAULT_DIFFICULTY;

  try {
    const data = localStorage.getItem(getStorageKey(gameId));
    if (!data) return DEFAULT_DIFFICULTY;

    const settings: DifficultySettings = JSON.parse(data);
    return settings.difficulty || DEFAULT_DIFFICULTY;
  } catch (error) {
    console.error('Failed to load difficulty:', error);
    return DEFAULT_DIFFICULTY;
  }
}

/**
 * Get all difficulty settings
 */
export function getAllDifficultySettings(): Record<string, DifficultyLevel> {
  if (typeof window === 'undefined') return {};

  const settings: Record<string, DifficultyLevel> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed: DifficultySettings = JSON.parse(data);
          settings[parsed.gameId] = parsed.difficulty;
        }
      }
    }
  } catch (error) {
    console.error('Failed to load all difficulty settings:', error);
  }

  return settings;
}

/**
 * Clear difficulty setting for a game
 */
export function clearDifficulty(gameId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(getStorageKey(gameId));
  } catch (error) {
    console.error('Failed to clear difficulty:', error);
  }
}

/**
 * Clear all difficulty settings
 */
export function clearAllDifficulties(): void {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all difficulties:', error);
  }
}
