import { checkAchievements } from './tracker';
import type { Achievement, AchievementProgress } from './types';

/**
 * 게임 종료 시 업적 체크 및 알림 생성을 위한 유틸리티
 */

export interface GameEndStats {
  score?: number;
  time?: number;
  killCount?: number;
  comboMax?: number;
  special?: Record<string, number>;
}

/**
 * 게임 종료 시 업적을 체크하고 새로 해금된 업적을 반환
 *
 * @param gameId 게임 ID (예: 'stellar-salvo')
 * @param stats 게임 통계 (점수, 시간, 킬수 등)
 * @returns 새로 해금된 업적 목록
 *
 * @example
 * ```typescript
 * // 게임 종료 시 호출
 * const unlockedAchievements = handleGameEnd('stellar-salvo', {
 *   score: 150000,
 *   time: 600000, // 10분
 *   killCount: 150,
 *   special: {
 *     'perfect-defense-wave10': 1, // 웨이브 10을 90% 이상 에너지로 클리어
 *   }
 * });
 *
 * // 알림 표시
 * if (unlockedAchievements.length > 0) {
 *   showAchievementNotifications(unlockedAchievements);
 * }
 * ```
 */
export function handleGameEnd(gameId: string, stats: GameEndStats): AchievementProgress[] {
  return checkAchievements(gameId, stats);
}

/**
 * Stellar Salvo 게임용 헬퍼 함수
 */
export function handleStellarSalvoGameEnd(
  score: number,
  timeElapsed: number,
  killCount: number,
  wave: number,
  energy: number
): AchievementProgress[] {
  const special: Record<string, number> = {};

  // 웨이브 10을 90% 이상 에너지로 클리어했는지 체크
  if (wave >= 10 && energy >= 0.9) {
    special['perfect-defense-wave10'] = 1;
  }

  return handleGameEnd('stellar-salvo', {
    score,
    time: timeElapsed,
    killCount,
    special,
  });
}

/**
 * Neon Serpent 게임용 헬퍼 함수
 */
export function handleNeonSerpentGameEnd(
  score: number,
  length: number,
  timeAtMaxSpeed: number
): AchievementProgress[] {
  const special: Record<string, number> = {};

  // 30초 이상 최대 속도 유지했는지 체크
  if (timeAtMaxSpeed >= 30000) {
    special['speed-demon'] = 1;
  }

  return handleGameEnd('neon-serpent', {
    score,
    special: {
      length,
      ...special,
    },
  });
}

/**
 * Cascade Blocks 게임용 헬퍼 함수
 */
export function handleCascadeBlocksGameEnd(
  score: number,
  maxCombo: number,
  tetrisClears: number
): AchievementProgress[] {
  return handleGameEnd('cascade-blocks', {
    score,
    comboMax: maxCombo,
    special: {
      'tetris-clears': tetrisClears,
    },
  });
}

/**
 * 해금된 업적을 Achievement 객체로 변환
 * (알림 표시용)
 */
export function getUnlockedAchievements(
  unlockedProgress: AchievementProgress[]
): Achievement[] {
  // achievements/definitions에서 가져온 achievement 객체와 매칭
  // 실제 구현에서는 definitions.ts에서 getAchievementById를 사용
  return unlockedProgress
    .filter((p) => p.status === 'unlocked')
    .map((p) => {
      // 임포트 순환 참조를 피하기 위해 여기서는 타입만 사용
      // 실제 사용 시 definitions에서 getAchievementById 호출
      return { id: p.achievementId } as Achievement;
    });
}
