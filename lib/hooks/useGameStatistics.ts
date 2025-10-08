/**
 * useGameStatistics Hook
 * 게임 통계를 관리하고 조회하는 React Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GameStatistics,
  AllStatistics,
  StatisticsSummary,
  getGameStatistics,
  setGameStatistics,
  loadStatistics,
  getStatisticsSummary,
  resetGameStatistics,
  resetAllStatistics,
} from '../storage/statistics';

/**
 * 특정 게임의 통계를 관리하는 Hook
 */
export function useGameStatistics(gameId: string) {
  const [statistics, setStatistics] = useState<GameStatistics>(() => getGameStatistics(gameId));
  const [isLoading, setIsLoading] = useState(true);

  // 통계 새로고침
  const refresh = useCallback(() => {
    const stats = getGameStatistics(gameId);
    setStatistics(stats);
  }, [gameId]);

  // 컴포넌트 마운트 시 통계 로드
  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  // 통계 업데이트
  const updateStatistics = useCallback(
    (updater: (prev: GameStatistics) => GameStatistics) => {
      setStatistics((prev) => {
        const updated = updater(prev);
        setGameStatistics(gameId, updated);
        return updated;
      });
    },
    [gameId]
  );

  // 통계 초기화
  const reset = useCallback(() => {
    resetGameStatistics(gameId);
    refresh();
  }, [gameId, refresh]);

  return {
    statistics,
    isLoading,
    refresh,
    updateStatistics,
    reset,
  };
}

/**
 * 모든 게임의 통계를 관리하는 Hook
 */
export function useAllStatistics() {
  const [statistics, setStatistics] = useState<AllStatistics>({});
  const [isLoading, setIsLoading] = useState(true);

  // 통계 새로고침
  const refresh = useCallback(() => {
    const stats = loadStatistics();
    setStatistics(stats);
  }, []);

  // 컴포넌트 마운트 시 통계 로드
  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  // 모든 통계 초기화
  const resetAll = useCallback(() => {
    resetAllStatistics();
    refresh();
  }, [refresh]);

  return {
    statistics,
    isLoading,
    refresh,
    resetAll,
  };
}

/**
 * 전체 통계 요약을 관리하는 Hook
 */
export function useStatisticsSummary() {
  const [summary, setSummary] = useState<StatisticsSummary>(() => getStatisticsSummary());
  const [isLoading, setIsLoading] = useState(true);

  // 요약 새로고침
  const refresh = useCallback(() => {
    const newSummary = getStatisticsSummary();
    setSummary(newSummary);
  }, []);

  // 컴포넌트 마운트 시 요약 로드
  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  return {
    summary,
    isLoading,
    refresh,
  };
}

/**
 * LocalStorage 변경 감지 Hook (다른 탭/창에서 통계 변경 시 자동 업데이트)
 */
export function useStatisticsSync(onSync?: () => void) {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gamehub_statistics') {
        onSync?.();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [onSync]);
}
