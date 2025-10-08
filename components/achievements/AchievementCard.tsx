'use client';

import type { Achievement, AchievementProgress } from '@/lib/achievements/types';

const tierColors = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-300 to-cyan-500',
  diamond: 'from-purple-400 to-purple-600',
};

const tierGlow = {
  bronze: 'shadow-[0_0_15px_rgba(217,119,6,0.5)]',
  silver: 'shadow-[0_0_15px_rgba(156,163,175,0.5)]',
  gold: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
  platinum: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
  diamond: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
};

interface Props {
  achievement: Achievement;
  progress?: AchievementProgress;
  language?: 'ko' | 'en';
}

export function AchievementCard({ achievement, progress, language = 'ko' }: Props) {
  const isUnlocked = progress?.status === 'unlocked';
  const isHidden = achievement.hidden && !isUnlocked;

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        isUnlocked
          ? `bg-gradient-to-br ${tierColors[achievement.tier]} ${tierGlow[achievement.tier]}`
          : 'bg-black/50 border-gray-700 opacity-60'
      }`}
    >
      {/* 아이콘 */}
      <div className="text-4xl mb-2 text-center">
        {isHidden ? '❓' : achievement.icon}
      </div>

      {/* 이름 */}
      <h3 className={`pixel-text text-sm text-center mb-2 ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>
        {isHidden ? '???' : language === 'ko' ? achievement.name : achievement.nameEn}
      </h3>

      {/* 설명 */}
      <p className={`text-xs text-center mb-3 leading-relaxed ${isUnlocked ? 'text-white/90' : 'text-gray-400'}`}>
        {isHidden
          ? '숨겨진 업적'
          : language === 'ko'
          ? achievement.description
          : achievement.descriptionEn}
      </p>

      {/* 진행도 바 */}
      {!isUnlocked && progress && progress.progress > 0 && (
        <div className="mb-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            {progress.currentValue} / {progress.targetValue}
          </p>
        </div>
      )}

      {/* 등급 및 포인트 */}
      <div className={`flex items-center justify-between text-xs ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
        <span className="uppercase opacity-75">{achievement.tier}</span>
        <span className="text-yellow-400 font-bold">{achievement.reward?.points || 0}P</span>
      </div>

      {/* 해금 뱃지 */}
      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-2xl text-green-400">✓</span>
        </div>
      )}
    </div>
  );
}
