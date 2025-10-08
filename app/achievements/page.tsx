'use client';

import { useMemo, useState } from 'react';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { getAllAchievements, getGameAchievements } from '@/lib/achievements/definitions';
import { loadProgress, getGlobalStats, getGameStats } from '@/lib/achievements/tracker';
import type { AchievementTier, AchievementCategory } from '@/lib/achievements/types';
import { useI18n } from '@/lib/i18n/provider';

const GAMES = [
  { id: 'stellar-salvo', name: '스텔라 살보', nameEn: 'Stellar Salvo' },
  { id: 'neon-serpent', name: '네온 서펀트', nameEn: 'Neon Serpent' },
  { id: 'cascade-blocks', name: '캐스케이드 블록', nameEn: 'Cascade Blocks' },
  { id: 'prism-smash', name: '프리즘 스매시', nameEn: 'Prism Smash' },
  { id: 'photon-vanguard', name: '포톤 뱅가드', nameEn: 'Photon Vanguard' },
  { id: 'spectral-pursuit', name: '스펙트럴 퍼슈트', nameEn: 'Spectral Pursuit' },
  { id: 'starshard-drift', name: '스타샤드 드리프트', nameEn: 'Starshard Drift' },
  { id: 'color-match-cascade', name: '컬러 매치 캐스케이드', nameEn: 'Color Match Cascade' },
];

const TIER_FILTERS: AchievementTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
const CATEGORY_FILTERS: AchievementCategory[] = [
  'score',
  'survival',
  'combo',
  'skill',
  'collection',
  'challenge',
  'mastery',
];

const TIER_NAMES = {
  bronze: { ko: '브론즈', en: 'Bronze' },
  silver: { ko: '실버', en: 'Silver' },
  gold: { ko: '골드', en: 'Gold' },
  platinum: { ko: '플래티넘', en: 'Platinum' },
  diamond: { ko: '다이아몬드', en: 'Diamond' },
};

const CATEGORY_NAMES = {
  score: { ko: '점수', en: 'Score' },
  survival: { ko: '생존', en: 'Survival' },
  combo: { ko: '콤보', en: 'Combo' },
  skill: { ko: '스킬', en: 'Skill' },
  collection: { ko: '수집', en: 'Collection' },
  challenge: { ko: '도전', en: 'Challenge' },
  mastery: { ko: '숙련', en: 'Mastery' },
};

export default function AchievementsPage() {
  const { locale } = useI18n();
  const language = locale as 'ko' | 'en';
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<AchievementTier | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  // 진행도 데이터 로드
  const progress = useMemo(() => loadProgress(), []);
  const globalStats = useMemo(() => getGlobalStats(), []);

  // 필터링된 업적 목록
  const filteredAchievements = useMemo(() => {
    let achievements =
      selectedGame === 'all' ? getAllAchievements() : getGameAchievements(selectedGame);

    if (selectedTier !== 'all') {
      achievements = achievements.filter((a) => a.tier === selectedTier);
    }

    if (selectedCategory !== 'all') {
      achievements = achievements.filter((a) => a.category === selectedCategory);
    }

    return achievements;
  }, [selectedGame, selectedTier, selectedCategory]);

  // 게임별 통계
  const gameStats = useMemo(() => {
    if (selectedGame === 'all') return null;
    return getGameStats(selectedGame);
  }, [selectedGame]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="pixel-text text-3xl md:text-4xl mb-4 text-bright-cyan neon-text animate-neon-pulse">
          {language === 'ko' ? '🏆 업적' : '🏆 Achievements'}
        </h1>
        <p className="text-gray-400 text-sm">
          {language === 'ko'
            ? '게임을 플레이하고 업적을 해금하세요!'
            : 'Play games and unlock achievements!'}
        </p>
      </div>

      {/* 전체 통계 */}
      <div className="bg-black/50 border-2 border-bright-cyan rounded-lg p-6 mb-8">
        <h2 className="pixel-text text-lg mb-4 text-bright-yellow">
          {language === 'ko' ? '📊 전체 통계' : '📊 Overall Stats'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-bright-cyan">
              {globalStats.unlockedAchievements}/{globalStats.totalAchievements}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {language === 'ko' ? '해금된 업적' : 'Unlocked'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-bright-yellow">{globalStats.earnedPoints}</div>
            <div className="text-xs text-gray-400 mt-1">
              {language === 'ko' ? '획득 포인트' : 'Earned Points'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-bright-green">
              {Math.round(globalStats.completionRate)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {language === 'ko' ? '완료율' : 'Completion'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-bright-purple">
              {globalStats.totalPoints}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {language === 'ko' ? '총 포인트' : 'Total Points'}
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="mb-8 space-y-4">
        {/* 게임 필터 */}
        <div>
          <label className="pixel-text text-xs text-gray-400 mb-2 block">
            {language === 'ko' ? '게임' : 'Game'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGame('all')}
              className={`px-4 py-2 rounded text-xs transition-all ${
                selectedGame === 'all'
                  ? 'bg-bright-cyan text-black'
                  : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
              }`}
            >
              {language === 'ko' ? '전체' : 'All'}
            </button>
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`px-4 py-2 rounded text-xs transition-all ${
                  selectedGame === game.id
                    ? 'bg-bright-cyan text-black'
                    : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
                }`}
              >
                {language === 'ko' ? game.name : game.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* 등급 필터 */}
        <div>
          <label className="pixel-text text-xs text-gray-400 mb-2 block">
            {language === 'ko' ? '등급' : 'Tier'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-4 py-2 rounded text-xs transition-all ${
                selectedTier === 'all'
                  ? 'bg-bright-cyan text-black'
                  : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
              }`}
            >
              {language === 'ko' ? '전체' : 'All'}
            </button>
            {TIER_FILTERS.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded text-xs transition-all ${
                  selectedTier === tier
                    ? 'bg-bright-cyan text-black'
                    : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
                }`}
              >
                {language === 'ko' ? TIER_NAMES[tier].ko : TIER_NAMES[tier].en}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div>
          <label className="pixel-text text-xs text-gray-400 mb-2 block">
            {language === 'ko' ? '카테고리' : 'Category'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded text-xs transition-all ${
                selectedCategory === 'all'
                  ? 'bg-bright-cyan text-black'
                  : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
              }`}
            >
              {language === 'ko' ? '전체' : 'All'}
            </button>
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded text-xs transition-all ${
                  selectedCategory === category
                    ? 'bg-bright-cyan text-black'
                    : 'bg-black/50 border border-gray-700 text-gray-300 hover:border-bright-cyan hover:text-bright-cyan'
                }`}
              >
                {language === 'ko' ? CATEGORY_NAMES[category].ko : CATEGORY_NAMES[category].en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 게임별 통계 (게임 선택 시) */}
      {gameStats && (
        <div className="bg-black/50 border-2 border-bright-purple rounded-lg p-6 mb-8">
          <h2 className="pixel-text text-lg mb-4 text-bright-purple">
            {language === 'ko'
              ? `📊 ${GAMES.find((g) => g.id === selectedGame)?.name} 통계`
              : `📊 ${GAMES.find((g) => g.id === selectedGame)?.nameEn} Stats`}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-bright-cyan">
                {gameStats.unlockedAchievements}/{gameStats.totalAchievements}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {language === 'ko' ? '해금' : 'Unlocked'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-bright-yellow">{gameStats.earnedPoints}</div>
              <div className="text-xs text-gray-400 mt-1">
                {language === 'ko' ? '포인트' : 'Points'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-bright-green">
                {Math.round(gameStats.completionRate)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {language === 'ko' ? '완료' : 'Complete'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 업적 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            progress={progress[achievement.id]}
            language={language}
          />
        ))}
      </div>

      {/* 업적 없음 */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {language === 'ko'
              ? '조건에 맞는 업적이 없습니다.'
              : 'No achievements match the filters.'}
          </p>
        </div>
      )}
    </div>
  );
}
