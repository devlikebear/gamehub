/**
 * Achievement Tracker
 *
 * 업적 진행도 추적 및 해금 시스템
 */

import type {
  AchievementProgress,
  GameAchievementStats,
  GlobalAchievementStats,
} from './types';
import { getGameAchievements, getAchievementById, getAllAchievements } from './definitions';

const STORAGE_KEY = 'gamehub_achievements';

// 로컬 스토리지에서 진행도 로드
export function loadProgress(): Record<string, AchievementProgress> {
  if (typeof window === 'undefined') return {};

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// 로컬 스토리지에 진행도 저장
export function saveProgress(progress: Record<string, AchievementProgress>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('[Achievements] Failed to save progress:', error);
  }
}

// 업적 진행도 업데이트
export function updateAchievementProgress(
  achievementId: string,
  currentValue: number
): AchievementProgress | null {
  const achievement = getAchievementById(achievementId);
  if (!achievement) return null;

  const allProgress = loadProgress();
  const existing = allProgress[achievementId];

  const targetValue = achievement.requirement.target;
  const progress = Math.min((currentValue / targetValue) * 100, 100);
  const isUnlocked = currentValue >= targetValue;

  const updated: AchievementProgress = {
    achievementId,
    status: isUnlocked ? 'unlocked' : currentValue > 0 ? 'in_progress' : 'locked',
    progress,
    currentValue,
    targetValue,
    unlockedAt: isUnlocked && !existing?.unlockedAt ? Date.now() : existing?.unlockedAt,
    firstAttemptAt: existing?.firstAttemptAt || Date.now(),
  };

  allProgress[achievementId] = updated;
  saveProgress(allProgress);

  return updated;
}

// 게임 플레이 후 업적 체크
export function checkAchievements(gameId: string, stats: {
  score?: number;
  time?: number;
  killCount?: number;
  comboMax?: number;
  special?: Record<string, number>;
}): AchievementProgress[] {
  const achievements = getGameAchievements(gameId);
  const unlocked: AchievementProgress[] = [];

  for (const achievement of achievements) {
    let currentValue = 0;

    switch (achievement.requirement.type) {
      case 'score':
        currentValue = stats.score || 0;
        break;
      case 'time':
        currentValue = stats.time || 0;
        break;
      case 'count':
        currentValue = stats.killCount || 0;
        break;
      case 'combo':
        currentValue = stats.comboMax || 0;
        break;
      case 'special':
        currentValue = stats.special?.[achievement.id] || 0;
        break;
    }

    const progress = updateAchievementProgress(achievement.id, currentValue);
    if (progress && progress.status === 'unlocked' && progress.unlockedAt === Date.now()) {
      unlocked.push(progress);
    }
  }

  return unlocked;
}

// 게임별 업적 통계
export function getGameStats(gameId: string): GameAchievementStats {
  const achievements = getGameAchievements(gameId);
  const allProgress = loadProgress();

  let unlockedCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;
  let lastUnlockedAt: number | undefined;

  for (const achievement of achievements) {
    totalPoints += achievement.reward?.points || 0;

    const progress = allProgress[achievement.id];
    if (progress?.status === 'unlocked') {
      unlockedCount++;
      earnedPoints += achievement.reward?.points || 0;
      if (progress.unlockedAt && (!lastUnlockedAt || progress.unlockedAt > lastUnlockedAt)) {
        lastUnlockedAt = progress.unlockedAt;
      }
    }
  }

  return {
    gameId,
    totalAchievements: achievements.length,
    unlockedAchievements: unlockedCount,
    completionRate: achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0,
    totalPoints,
    earnedPoints,
    lastUnlockedAt,
  };
}

// 전체 업적 통계
export function getGlobalStats(): GlobalAchievementStats {
  const allAchievements = getAllAchievements();
  const allProgress = loadProgress();

  const stats: GlobalAchievementStats = {
    totalAchievements: allAchievements.length,
    unlockedAchievements: 0,
    completionRate: 0,
    totalPoints: 0,
    earnedPoints: 0,
    byTier: {
      bronze: { total: 0, unlocked: 0 },
      silver: { total: 0, unlocked: 0 },
      gold: { total: 0, unlocked: 0 },
      platinum: { total: 0, unlocked: 0 },
      diamond: { total: 0, unlocked: 0 },
    },
    byCategory: {
      score: { total: 0, unlocked: 0 },
      survival: { total: 0, unlocked: 0 },
      combo: { total: 0, unlocked: 0 },
      skill: { total: 0, unlocked: 0 },
      collection: { total: 0, unlocked: 0 },
      challenge: { total: 0, unlocked: 0 },
      mastery: { total: 0, unlocked: 0 },
    },
    recentUnlocks: [],
  };

  for (const achievement of allAchievements) {
    stats.totalPoints += achievement.reward?.points || 0;
    stats.byTier[achievement.tier].total++;
    stats.byCategory[achievement.category].total++;

    const progress = allProgress[achievement.id];
    if (progress?.status === 'unlocked') {
      stats.unlockedAchievements++;
      stats.earnedPoints += achievement.reward?.points || 0;
      stats.byTier[achievement.tier].unlocked++;
      stats.byCategory[achievement.category].unlocked++;

      if (progress.unlockedAt) {
        stats.recentUnlocks.push(progress);
      }
    }
  }

  stats.completionRate = allAchievements.length > 0
    ? (stats.unlockedAchievements / stats.totalAchievements) * 100
    : 0;

  // 최근 해금 업적 정렬 (최신순)
  stats.recentUnlocks.sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
  stats.recentUnlocks = stats.recentUnlocks.slice(0, 10);

  return stats;
}
