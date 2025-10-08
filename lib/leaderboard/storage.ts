import type { LocalRankSnapshot } from './types';

const STORAGE_KEY = 'gamehub:leaderboard-ranks';

export function loadLocalRank(gameId: string): LocalRankSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, LocalRankSnapshot>;
    return parsed[gameId] ?? null;
  } catch (error) {
    console.error('Failed to load leaderboard rank', error);
    return null;
  }
}

export function saveLocalRank(gameId: string, snapshot: LocalRankSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: Record<string, LocalRankSnapshot> = raw ? JSON.parse(raw) : {};
    parsed[gameId] = snapshot;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Failed to save leaderboard rank', error);
  }
}
