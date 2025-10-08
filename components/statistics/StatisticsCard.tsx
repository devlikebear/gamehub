/**
 * StatisticsCard Component
 * 게임 통계를 카드 형태로 표시하는 컴포넌트
 */

'use client';

import type { GameStatistics } from '@/lib/storage/statistics';
import { formatPlayTime, formatRelativeTime } from '@/lib/storage/statistics';

interface StatisticsCardProps {
  statistics: GameStatistics;
  gameName?: string;
  className?: string;
}

export function StatisticsCard({ statistics, gameName, className = '' }: StatisticsCardProps) {
  const stats = [
    {
      label: 'Plays',
      value: statistics.playCount.toLocaleString(),
      icon: '🎮',
      color: 'text-bright-cyan',
    },
    {
      label: 'Play Time',
      value: formatPlayTime(statistics.totalPlayTime),
      icon: '⏱️',
      color: 'text-bright-yellow',
    },
    {
      label: 'High Score',
      value: statistics.highScore.toLocaleString(),
      icon: '🏆',
      color: 'text-bright-pink',
    },
    {
      label: 'Avg Score',
      value: Math.floor(statistics.averageScore).toLocaleString(),
      icon: '📊',
      color: 'text-bright-purple',
    },
  ];

  return (
    <div className={`bg-black/60 border border-bright-cyan/40 rounded-xl p-6 ${className}`}>
      {gameName && (
        <div className="mb-4 text-center">
          <h3 className="pixel-text text-lg text-bright-cyan">{gameName}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Last played {formatRelativeTime(statistics.lastPlayedAt)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-black/40 border border-bright-cyan/20 rounded-lg p-4 text-center hover:border-bright-cyan/60 transition-all duration-300"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`pixel-text text-xl mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {statistics.playCount > 1 && (
        <div className="mt-4 pt-4 border-t border-bright-cyan/20 text-center">
          <p className="text-xs text-gray-400">
            Avg play time: <span className="text-bright-yellow">{formatPlayTime(statistics.averagePlayTime)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
