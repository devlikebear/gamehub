'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/lib/achievements/types';

const tierColors = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-300 to-cyan-500',
  diamond: 'from-purple-400 to-purple-600',
};

const tierGlow = {
  bronze: 'shadow-[0_0_30px_rgba(217,119,6,0.8)]',
  silver: 'shadow-[0_0_30px_rgba(156,163,175,0.8)]',
  gold: 'shadow-[0_0_30px_rgba(234,179,8,0.8)]',
  platinum: 'shadow-[0_0_30px_rgba(34,211,238,0.8)]',
  diamond: 'shadow-[0_0_30px_rgba(168,85,247,0.8)]',
};

interface Props {
  achievement: Achievement;
  onComplete: () => void;
  language?: 'ko' | 'en';
}

export function AchievementNotification({ achievement, onComplete, language = 'ko' }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 알림 표시 애니메이션
    const showTimeout = setTimeout(() => setIsVisible(true), 100);

    // 3초 후 자동 닫기
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // 애니메이션 완료 후 제거
    }, 3000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed top-20 right-4 z-[100] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
      }`}
    >
      <div
        className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${tierColors[achievement.tier]} ${tierGlow[achievement.tier]} min-w-[300px] max-w-[400px]`}
      >
        {/* 업적 해금 헤더 */}
        <div className="pixel-text text-xs text-center mb-2 text-yellow-300">
          {language === 'ko' ? '🏆 업적 해금!' : '🏆 Achievement Unlocked!'}
        </div>

        {/* 업적 아이콘 및 정보 */}
        <div className="flex items-center gap-3">
          {/* 아이콘 */}
          <div className="text-4xl flex-shrink-0">{achievement.icon}</div>

          {/* 업적 정보 */}
          <div className="flex-1 min-w-0">
            {/* 업적 이름 */}
            <h3 className="pixel-text text-sm mb-1 truncate">
              {language === 'ko' ? achievement.name : achievement.nameEn}
            </h3>

            {/* 업적 설명 */}
            <p className="text-xs opacity-90 line-clamp-2 leading-relaxed">
              {language === 'ko' ? achievement.description : achievement.descriptionEn}
            </p>

            {/* 등급 및 포인트 */}
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="uppercase opacity-75">{achievement.tier}</span>
              <span className="text-yellow-400 font-bold">
                +{achievement.reward?.points || 0}P
              </span>
            </div>
          </div>
        </div>

        {/* 반짝이는 효과 */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

/**
 * 여러 업적 알림을 큐로 관리하는 컨테이너 컴포넌트
 */
interface QueueProps {
  achievements: Achievement[];
  language?: 'ko' | 'en';
  onAllComplete?: () => void;
}

export function AchievementNotificationQueue({
  achievements,
  language = 'ko',
  onAllComplete,
}: QueueProps) {
  const [queue, setQueue] = useState<Achievement[]>(achievements);

  useEffect(() => {
    setQueue(achievements);
  }, [achievements]);

  const handleComplete = () => {
    setQueue((prev) => {
      const newQueue = prev.slice(1);
      if (newQueue.length === 0 && onAllComplete) {
        onAllComplete();
      }
      return newQueue;
    });
  };

  if (queue.length === 0) return null;

  return (
    <AchievementNotification
      achievement={queue[0]}
      onComplete={handleComplete}
      language={language}
    />
  );
}
