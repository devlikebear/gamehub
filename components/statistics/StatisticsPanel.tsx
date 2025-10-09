/**
 * StatisticsPanel Component
 * 전체 게임 통계 요약을 표시하는 패널
 */

'use client';

import { useStatisticsSummary, useStatisticsSync } from '@/lib/hooks/useGameStatistics';
import { useI18n } from '@/lib/i18n/provider';

export function StatisticsPanel() {
  const { locale } = useI18n();
  const { summary, isLoading, refresh } = useStatisticsSummary();

  // 다른 탭에서 통계 변경 시 자동 업데이트
  useStatisticsSync(refresh);

  if (isLoading) {
    return (
      <div className="bg-black/60 border border-bright-cyan/40 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-black/40 border border-bright-cyan/20 rounded-lg p-4">
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (summary.totalPlayCount === 0) {
    return (
      <div className="bg-black/60 border border-bright-cyan/40 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <p className="pixel-text text-neon-cyan text-lg mb-2">
          {locale === 'ko' ? '아직 플레이한 게임이 없습니다' : 'No Games Played Yet'}
        </p>
        <p className="text-gray-400 text-sm">
          {locale === 'ko' ? '게임을 플레이하고 통계를 확인하세요!' : 'Start playing to track your statistics!'}
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: locale === 'ko' ? '플레이한 게임' : 'Games Played',
      value: summary.totalGamesPlayed.toString(),
      icon: '🎮',
      color: 'text-neon-cyan',
    },
    {
      label: locale === 'ko' ? '총 플레이 횟수' : 'Total Plays',
      value: summary.totalPlayCount.toLocaleString(),
      icon: '🕹️',
      color: 'text-neon-pink',
    },
    {
      label: locale === 'ko' ? '플레이 시간' : 'Play Time',
      value: summary.totalPlayTimeFormatted,
      icon: '⏱️',
      color: 'text-neon-yellow',
    },
    {
      label: locale === 'ko' ? '평균 플레이' : 'Avg Per Session',
      value: Math.floor(summary.totalPlayTime / summary.totalPlayCount) + 's',
      icon: '📊',
      color: 'text-neon-purple',
    },
  ];

  return (
    <div className="bg-black/60 border border-bright-cyan/40 rounded-xl p-6 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="pixel-text text-xl text-neon-cyan">
          {locale === 'ko' ? '나의 통계' : 'Your Statistics'}
        </h3>
        <button
          onClick={refresh}
          className="text-xs px-3 py-1 border border-bright-cyan/60 text-neon-cyan rounded hover:bg-bright-cyan/10 transition-all duration-300"
          aria-label={locale === 'ko' ? '통계 새로고침' : 'Refresh statistics'}
        >
          {locale === 'ko' ? '새로고침' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-black/40 border border-bright-cyan/20 rounded-lg p-4 text-center hover:border-bright-cyan/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`pixel-text text-2xl mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {summary.mostPlayedGame && (
        <div className="mt-6 pt-6 border-t border-bright-cyan/20 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">{locale === 'ko' ? '가장 많이 플레이' : 'Most Played'}</p>
            <p className="pixel-text text-neon-yellow text-sm">
              {summary.mostPlayedGame.replace(/-/g, ' ').toUpperCase()}
            </p>
          </div>
          {summary.highestScoringGame && (
            <div>
              <p className="text-xs text-gray-400 mb-1">{locale === 'ko' ? '최고 점수 게임' : 'Top Scorer'}</p>
              <p className="pixel-text text-neon-pink text-sm">
                {summary.highestScoringGame.replace(/-/g, ' ').toUpperCase()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
