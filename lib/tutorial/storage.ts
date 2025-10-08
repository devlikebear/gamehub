import type { TutorialSettings } from './types';

const STORAGE_KEY_PREFIX = 'gamehub_tutorial';

/**
 * Get storage key for a game
 */
function getStorageKey(gameId: string): string {
  return `${STORAGE_KEY_PREFIX}_${gameId}`;
}

/**
 * Check if user has seen tutorial for a game
 */
export function hasSeenTutorial(gameId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = localStorage.getItem(getStorageKey(gameId));
    if (!data) return false;

    const settings: TutorialSettings = JSON.parse(data);
    return settings.hasSeenTutorial || false;
  } catch (error) {
    console.error('Failed to check tutorial status:', error);
    return false;
  }
}

/**
 * Check if "don't show again" is enabled
 */
export function shouldShowTutorial(gameId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = localStorage.getItem(getStorageKey(gameId));
    if (!data) return true; // Show by default for first play

    const settings: TutorialSettings = JSON.parse(data);
    return !settings.dontShowAgain;
  } catch (error) {
    console.error('Failed to check tutorial setting:', error);
    return true;
  }
}

/**
 * Mark tutorial as seen
 */
export function markTutorialSeen(gameId: string, dontShowAgain: boolean = false): void {
  if (typeof window === 'undefined') return;

  const settings: TutorialSettings = {
    gameId,
    hasSeenTutorial: true,
    dontShowAgain,
    lastViewed: Date.now(),
  };

  try {
    localStorage.setItem(getStorageKey(gameId), JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save tutorial settings:', error);
  }
}

/**
 * Reset tutorial settings for a game (show again)
 */
export function resetTutorialSettings(gameId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(getStorageKey(gameId));
  } catch (error) {
    console.error('Failed to reset tutorial settings:', error);
  }
}

/**
 * Get tutorial settings for a game
 */
export function getTutorialSettings(gameId: string): TutorialSettings | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(getStorageKey(gameId));
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load tutorial settings:', error);
    return null;
  }
}

/**
 * Get all tutorial settings
 */
export function getAllTutorialSettings(): Record<string, TutorialSettings> {
  if (typeof window === 'undefined') return {};

  const settings: Record<string, TutorialSettings> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed: TutorialSettings = JSON.parse(data);
          settings[parsed.gameId] = parsed;
        }
      }
    }
  } catch (error) {
    console.error('Failed to load all tutorial settings:', error);
  }

  return settings;
}

/**
 * Clear all tutorial settings
 */
export function clearAllTutorialSettings(): void {
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
    console.error('Failed to clear all tutorial settings:', error);
  }
}
