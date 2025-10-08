/**
 * Achievement System Types
 *
 * 게임 업적 시스템의 타입 정의
 */

// 업적 등급
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

// 업적 카테고리
export type AchievementCategory =
  | 'score'        // 점수 관련
  | 'survival'     // 생존 시간
  | 'combo'        // 콤보/연속
  | 'skill'        // 특수 스킬/테크닉
  | 'collection'   // 수집
  | 'challenge'    // 도전 과제
  | 'mastery';     // 마스터리

// 업적 상태
export type AchievementStatus = 'locked' | 'in_progress' | 'unlocked';

// 업적 정의
export interface Achievement {
  id: string;
  gameId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  tier: AchievementTier;
  category: AchievementCategory;

  // 해금 조건
  requirement: {
    type: 'score' | 'time' | 'count' | 'combo' | 'special';
    target: number;
    description: string;
  };

  // 보상 (선택적)
  reward?: {
    points: number;
    badge?: string;
  };

  // 숨김 업적 여부
  hidden?: boolean;
}

// 사용자 업적 진행도
export interface AchievementProgress {
  achievementId: string;
  status: AchievementStatus;
  progress: number;        // 0-100
  currentValue: number;    // 현재 달성 값
  targetValue: number;     // 목표 값
  unlockedAt?: number;     // Unix timestamp
  firstAttemptAt?: number; // 첫 시도 시간
}

// 게임별 업적 통계
export interface GameAchievementStats {
  gameId: string;
  totalAchievements: number;
  unlockedAchievements: number;
  completionRate: number; // 0-100
  totalPoints: number;
  earnedPoints: number;
  lastUnlockedAt?: number;
}

// 전체 업적 통계
export interface GlobalAchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  completionRate: number;
  totalPoints: number;
  earnedPoints: number;
  byTier: Record<AchievementTier, { total: number; unlocked: number }>;
  byCategory: Record<AchievementCategory, { total: number; unlocked: number }>;
  recentUnlocks: AchievementProgress[];
}

// 업적 알림 데이터
export interface AchievementNotification {
  achievement: Achievement;
  progress: AchievementProgress;
  showAt: number; // timestamp
}
