import { useState, useCallback } from 'react';
import { handleGameEnd, type GameEndStats } from '@/lib/achievements/integration';
import { getAchievementById } from '@/lib/achievements/definitions';
import type { Achievement } from '@/lib/achievements/types';

/**
 * 업적 시스템을 React 컴포넌트에서 사용하기 위한 훅
 *
 * @example
 * ```tsx
 * function StellarSalvoPage() {
 *   const { checkAchievements, unlockedAchievements, clearUnlocked } = useAchievements();
 *
 *   const handleGameOver = (score: number, time: number, kills: number) => {
 *     const unlocked = checkAchievements('stellar-salvo', { score, time, killCount: kills });
 *     // unlocked가 있으면 알림 표시
 *   };
 *
 *   return (
 *     <>
 *       <Game onGameOver={handleGameOver} />
 *       {unlockedAchievements.length > 0 && (
 *         <AchievementNotificationQueue
 *           achievements={unlockedAchievements}
 *           onAllComplete={clearUnlocked}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  /**
   * 게임 종료 시 업적을 체크하고 새로 해금된 업적을 state에 저장
   */
  const checkGameAchievements = useCallback((gameId: string, stats: GameEndStats) => {
    const unlockedProgress = handleGameEnd(gameId, stats);

    if (unlockedProgress.length > 0) {
      // AchievementProgress를 Achievement 객체로 변환
      const achievements = unlockedProgress
        .map((p) => getAchievementById(p.achievementId))
        .filter((a): a is Achievement => a !== undefined);

      setUnlockedAchievements(achievements);
      return achievements;
    }

    return [];
  }, []);

  /**
   * 알림 표시가 완료되면 호출하여 state 초기화
   */
  const clearUnlockedAchievements = useCallback(() => {
    setUnlockedAchievements([]);
  }, []);

  return {
    unlockedAchievements,
    checkAchievements: checkGameAchievements,
    clearUnlocked: clearUnlockedAchievements,
  };
}
