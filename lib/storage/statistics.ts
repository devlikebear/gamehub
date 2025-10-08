/**
 * Game Statistics Storage
 * 게임별 플레이 통계를 LocalStorage에 저장/관리하는 모듈
 */

const STORAGE_KEY = 'gamehub_statistics';

/**
 * 게임 통계 데이터 구조
 */
export interface GameStatistics {
  gameId: string;
  playCount: number; // 총 플레이 횟수
  totalPlayTime: number; // 총 플레이 시간 (초)
  averagePlayTime: number; // 평균 플레이 시간 (초)
  highScore: number; // 최고 점수
  totalScore: number; // 총 점수
  averageScore: number; // 평균 점수
  lastPlayedAt: string; // 마지막 플레이 날짜 (ISO 8601)
  firstPlayedAt: string; // 첫 플레이 날짜 (ISO 8601)
}

/**
 * 전체 통계 데이터 구조 (모든 게임)
 */
export interface AllStatistics {
  [gameId: string]: GameStatistics;
}

/**
 * 플레이 세션 데이터 (진행 중인 게임 추적)
 */
export interface PlaySession {
  gameId: string;
  startTime: number; // Unix timestamp (ms)
  score: number;
}

/**
 * 게임 통계 초기값 생성
 */
function createDefaultStatistics(gameId: string): GameStatistics {
  const now = new Date().toISOString();
  return {
    gameId,
    playCount: 0,
    totalPlayTime: 0,
    averagePlayTime: 0,
    highScore: 0,
    totalScore: 0,
    averageScore: 0,
    lastPlayedAt: now,
    firstPlayedAt: now,
  };
}

/**
 * LocalStorage에서 모든 통계 불러오기
 */
export function loadStatistics(): AllStatistics {
  if (typeof window === 'undefined') return {};

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};

    const parsed = JSON.parse(data) as AllStatistics;
    return parsed;
  } catch (error) {
    console.error('Failed to load statistics:', error);
    return {};
  }
}

/**
 * LocalStorage에 모든 통계 저장
 */
export function saveStatistics(statistics: AllStatistics): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statistics));
  } catch (error) {
    console.error('Failed to save statistics:', error);
  }
}

/**
 * 특정 게임의 통계 불러오기
 */
export function getGameStatistics(gameId: string): GameStatistics {
  const allStats = loadStatistics();
  return allStats[gameId] || createDefaultStatistics(gameId);
}

/**
 * 특정 게임의 통계 저장
 */
export function setGameStatistics(gameId: string, stats: GameStatistics): void {
  const allStats = loadStatistics();
  allStats[gameId] = stats;
  saveStatistics(allStats);
}

/**
 * 게임 시작 시 호출 - 플레이 세션 시작
 */
export function startPlaySession(gameId: string): PlaySession {
  const session: PlaySession = {
    gameId,
    startTime: Date.now(),
    score: 0,
  };

  // 세션 데이터를 sessionStorage에 저장 (새로고침 대응)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('gamehub_current_session', JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save play session:', error);
    }
  }

  return session;
}

/**
 * 현재 플레이 세션 불러오기
 */
export function getCurrentSession(): PlaySession | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = sessionStorage.getItem('gamehub_current_session');
    if (!data) return null;

    return JSON.parse(data) as PlaySession;
  } catch (error) {
    console.error('Failed to load current session:', error);
    return null;
  }
}

/**
 * 게임 종료 시 호출 - 플레이 통계 업데이트
 */
export function endPlaySession(gameId: string, finalScore: number): void {
  const session = getCurrentSession();
  if (!session || session.gameId !== gameId) {
    console.warn('No matching session found for', gameId);
    return;
  }

  const playTime = Math.floor((Date.now() - session.startTime) / 1000); // 초 단위
  const stats = getGameStatistics(gameId);

  // 통계 업데이트
  const newPlayCount = stats.playCount + 1;
  const newTotalPlayTime = stats.totalPlayTime + playTime;
  const newTotalScore = stats.totalScore + finalScore;

  const updatedStats: GameStatistics = {
    gameId,
    playCount: newPlayCount,
    totalPlayTime: newTotalPlayTime,
    averagePlayTime: Math.floor(newTotalPlayTime / newPlayCount),
    highScore: Math.max(stats.highScore, finalScore),
    totalScore: newTotalScore,
    averageScore: Math.floor(newTotalScore / newPlayCount),
    lastPlayedAt: new Date().toISOString(),
    firstPlayedAt: stats.firstPlayedAt || new Date().toISOString(),
  };

  setGameStatistics(gameId, updatedStats);

  // 세션 삭제
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('gamehub_current_session');
  }
}

/**
 * 특정 게임의 통계 초기화
 */
export function resetGameStatistics(gameId: string): void {
  const allStats = loadStatistics();
  delete allStats[gameId];
  saveStatistics(allStats);
}

/**
 * 모든 게임의 통계 초기화
 */
export function resetAllStatistics(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('gamehub_current_session');
  } catch (error) {
    console.error('Failed to reset statistics:', error);
  }
}

/**
 * 전체 게임 통계 요약 (대시보드용)
 */
export interface StatisticsSummary {
  totalGamesPlayed: number; // 플레이한 게임 수
  totalPlayCount: number; // 전체 플레이 횟수
  totalPlayTime: number; // 전체 플레이 시간 (초)
  totalPlayTimeFormatted: string; // 포맷된 플레이 시간 (1h 23m)
  mostPlayedGame: string | null; // 가장 많이 플레이한 게임 ID
  highestScoringGame: string | null; // 최고 점수 게임 ID
}

/**
 * 전체 통계 요약 생성
 */
export function getStatisticsSummary(): StatisticsSummary {
  const allStats = loadStatistics();
  const games = Object.values(allStats);

  if (games.length === 0) {
    return {
      totalGamesPlayed: 0,
      totalPlayCount: 0,
      totalPlayTime: 0,
      totalPlayTimeFormatted: '0m',
      mostPlayedGame: null,
      highestScoringGame: null,
    };
  }

  const totalPlayCount = games.reduce((sum, game) => sum + game.playCount, 0);
  const totalPlayTime = games.reduce((sum, game) => sum + game.totalPlayTime, 0);

  // 가장 많이 플레이한 게임
  const mostPlayedGame = games.reduce((prev, curr) =>
    curr.playCount > prev.playCount ? curr : prev
  ).gameId;

  // 최고 점수 게임
  const highestScoringGame = games.reduce((prev, curr) =>
    curr.highScore > prev.highScore ? curr : prev
  ).gameId;

  return {
    totalGamesPlayed: games.length,
    totalPlayCount,
    totalPlayTime,
    totalPlayTimeFormatted: formatPlayTime(totalPlayTime),
    mostPlayedGame,
    highestScoringGame,
  };
}

/**
 * 플레이 시간을 읽기 쉬운 형태로 포맷 (예: "1h 23m", "45s")
 */
export function formatPlayTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

/**
 * 날짜를 상대적 시간으로 포맷 (예: "2 days ago", "just now")
 */
export function formatRelativeTime(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
