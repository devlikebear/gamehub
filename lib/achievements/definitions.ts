/**
 * Achievement Definitions
 *
 * 모든 게임의 업적 정의
 */

import type { Achievement } from './types';

// Stellar Salvo 업적
const stellarSalvoAchievements: Achievement[] = [
  {
    id: 'stellar-salvo-first-blood',
    gameId: 'stellar-salvo',
    name: '첫 번째 사냥감',
    nameEn: 'First Blood',
    description: '첫 번째 VOID WRAITH 처치',
    descriptionEn: 'Eliminate your first VOID WRAITH',
    icon: '🎯',
    tier: 'bronze',
    category: 'skill',
    requirement: {
      type: 'count',
      target: 1,
      description: 'VOID WRAITH 1마리 처치',
    },
    reward: {
      points: 10,
    },
  },
  {
    id: 'stellar-salvo-centurion',
    gameId: 'stellar-salvo',
    name: '백인대장',
    nameEn: 'Centurion',
    description: '100마리의 VOID WRAITH 처치',
    descriptionEn: 'Eliminate 100 VOID WRAITH',
    icon: '💯',
    tier: 'silver',
    category: 'collection',
    requirement: {
      type: 'count',
      target: 100,
      description: 'VOID WRAITH 100마리 처치',
    },
    reward: {
      points: 50,
    },
  },
  {
    id: 'stellar-salvo-millennium',
    gameId: 'stellar-salvo',
    name: '천인참',
    nameEn: 'Millennium Slayer',
    description: '1000마리의 VOID WRAITH 처치',
    descriptionEn: 'Eliminate 1000 VOID WRAITH',
    icon: '⚔️',
    tier: 'gold',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 1000,
      description: 'VOID WRAITH 1000마리 처치',
    },
    reward: {
      points: 200,
    },
  },
  {
    id: 'stellar-salvo-rookie-score',
    gameId: 'stellar-salvo',
    name: '신병',
    nameEn: 'Rookie',
    description: '10,000점 달성',
    descriptionEn: 'Reach 10,000 points',
    icon: '🌟',
    tier: 'bronze',
    category: 'score',
    requirement: {
      type: 'score',
      target: 10000,
      description: '10,000점 이상 획득',
    },
    reward: {
      points: 15,
    },
  },
  {
    id: 'stellar-salvo-veteran-score',
    gameId: 'stellar-salvo',
    name: '베테랑',
    nameEn: 'Veteran',
    description: '50,000점 달성',
    descriptionEn: 'Reach 50,000 points',
    icon: '⭐',
    tier: 'silver',
    category: 'score',
    requirement: {
      type: 'score',
      target: 50000,
      description: '50,000점 이상 획득',
    },
    reward: {
      points: 50,
    },
  },
  {
    id: 'stellar-salvo-ace-score',
    gameId: 'stellar-salvo',
    name: '에이스',
    nameEn: 'Ace',
    description: '100,000점 달성',
    descriptionEn: 'Reach 100,000 points',
    icon: '💫',
    tier: 'gold',
    category: 'score',
    requirement: {
      type: 'score',
      target: 100000,
      description: '100,000점 이상 획득',
    },
    reward: {
      points: 100,
    },
  },
  {
    id: 'stellar-salvo-legendary-score',
    gameId: 'stellar-salvo',
    name: '전설',
    nameEn: 'Legend',
    description: '200,000점 달성',
    descriptionEn: 'Reach 200,000 points',
    icon: '🏆',
    tier: 'platinum',
    category: 'score',
    requirement: {
      type: 'score',
      target: 200000,
      description: '200,000점 이상 획득',
    },
    reward: {
      points: 250,
    },
  },
  {
    id: 'stellar-salvo-survivor',
    gameId: 'stellar-salvo',
    name: '생존자',
    nameEn: 'Survivor',
    description: '5분 생존',
    descriptionEn: 'Survive for 5 minutes',
    icon: '⏱️',
    tier: 'silver',
    category: 'survival',
    requirement: {
      type: 'time',
      target: 300,
      description: '300초 생존',
    },
    reward: {
      points: 75,
    },
  },
  {
    id: 'stellar-salvo-endurance',
    gameId: 'stellar-salvo',
    name: '불굴의 의지',
    nameEn: 'Iron Will',
    description: '10분 생존',
    descriptionEn: 'Survive for 10 minutes',
    icon: '🛡️',
    tier: 'gold',
    category: 'survival',
    requirement: {
      type: 'time',
      target: 600,
      description: '600초 생존',
    },
    reward: {
      points: 150,
    },
  },
  {
    id: 'stellar-salvo-perfect-defense',
    gameId: 'stellar-salvo',
    name: '완벽한 방어',
    nameEn: 'Perfect Defense',
    description: '에너지 90% 이상 유지하며 웨이브 10 클리어',
    descriptionEn: 'Clear Wave 10 with 90%+ energy',
    icon: '💎',
    tier: 'platinum',
    category: 'challenge',
    requirement: {
      type: 'special',
      target: 1,
      description: '웨이브 10, 에너지 90% 이상',
    },
    reward: {
      points: 300,
    },
    hidden: true,
  },
];

// Neon Serpent 업적
const neonSerpentAchievements: Achievement[] = [
  {
    id: 'neon-serpent-first-meal',
    gameId: 'neon-serpent',
    name: '첫 식사',
    nameEn: 'First Meal',
    description: '첫 번째 아이템 획득',
    descriptionEn: 'Collect your first item',
    icon: '🍎',
    tier: 'bronze',
    category: 'skill',
    requirement: {
      type: 'count',
      target: 1,
      description: '아이템 1개 획득',
    },
    reward: {
      points: 10,
    },
  },
  {
    id: 'neon-serpent-growth-spurt',
    gameId: 'neon-serpent',
    name: '성장기',
    nameEn: 'Growth Spurt',
    description: '길이 50 달성',
    descriptionEn: 'Reach length 50',
    icon: '📏',
    tier: 'silver',
    category: 'score',
    requirement: {
      type: 'count',
      target: 50,
      description: '몸 길이 50 이상',
    },
    reward: {
      points: 50,
    },
  },
  {
    id: 'neon-serpent-mega-serpent',
    gameId: 'neon-serpent',
    name: '메가 서펀트',
    nameEn: 'Mega Serpent',
    description: '길이 100 달성',
    descriptionEn: 'Reach length 100',
    icon: '🐲',
    tier: 'gold',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 100,
      description: '몸 길이 100 이상',
    },
    reward: {
      points: 150,
    },
  },
  {
    id: 'neon-serpent-speed-demon',
    gameId: 'neon-serpent',
    name: '질주본능',
    nameEn: 'Speed Demon',
    description: '최고 속도로 30초 생존',
    descriptionEn: 'Survive 30s at max speed',
    icon: '⚡',
    tier: 'platinum',
    category: 'challenge',
    requirement: {
      type: 'special',
      target: 30,
      description: '최고 속도 30초 유지',
    },
    reward: {
      points: 200,
    },
    hidden: true,
  },
];

// Cascade Blocks 업적
const cascadeBlocksAchievements: Achievement[] = [
  {
    id: 'cascade-blocks-first-line',
    gameId: 'cascade-blocks',
    name: '첫 줄 클리어',
    nameEn: 'First Line',
    description: '첫 번째 라인 클리어',
    descriptionEn: 'Clear your first line',
    icon: '📋',
    tier: 'bronze',
    category: 'skill',
    requirement: {
      type: 'count',
      target: 1,
      description: '라인 1개 클리어',
    },
    reward: {
      points: 10,
    },
  },
  {
    id: 'cascade-blocks-combo-master',
    gameId: 'cascade-blocks',
    name: '콤보 마스터',
    nameEn: 'Combo Master',
    description: '10콤보 달성',
    descriptionEn: 'Achieve 10 combo',
    icon: '🔥',
    tier: 'silver',
    category: 'combo',
    requirement: {
      type: 'combo',
      target: 10,
      description: '10콤보 이상',
    },
    reward: {
      points: 75,
    },
  },
  {
    id: 'cascade-blocks-tetris',
    gameId: 'cascade-blocks',
    name: 'TETRIS!',
    nameEn: 'TETRIS!',
    description: '4줄 동시 클리어',
    descriptionEn: 'Clear 4 lines at once',
    icon: '💥',
    tier: 'gold',
    category: 'skill',
    requirement: {
      type: 'special',
      target: 4,
      description: '4줄 동시 클리어',
    },
    reward: {
      points: 100,
    },
  },
];

// Photon Vanguard 업적 (기본)
const photonVanguardAchievements: Achievement[] = [
  {
    id: 'photon-vanguard-first-defense',
    gameId: 'photon-vanguard',
    name: '첫 번째 방어',
    nameEn: 'First Defense',
    description: '10,000점 달성',
    descriptionEn: 'Reach 10,000 points',
    icon: '🛡️',
    tier: 'bronze',
    category: 'score',
    requirement: { type: 'score', target: 10000, description: '10,000점 달성' },
    reward: { points: 25 },
  },
];

// Spectral Pursuit 업적 (기본)
const spectralPursuitAchievements: Achievement[] = [
  {
    id: 'spectral-pursuit-first-escape',
    gameId: 'spectral-pursuit',
    name: '첫 번째 탈출',
    nameEn: 'First Escape',
    description: '5,000점 달성',
    descriptionEn: 'Reach 5,000 points',
    icon: '👻',
    tier: 'bronze',
    category: 'score',
    requirement: { type: 'score', target: 5000, description: '5,000점 달성' },
    reward: { points: 25 },
  },
];

// Starshard Drift 업적 (기본)
const starshardDriftAchievements: Achievement[] = [
  {
    id: 'starshard-drift-first-collection',
    gameId: 'starshard-drift',
    name: '첫 번째 회수',
    nameEn: 'First Collection',
    description: '8,000점 달성',
    descriptionEn: 'Reach 8,000 points',
    icon: '💎',
    tier: 'bronze',
    category: 'score',
    requirement: { type: 'score', target: 8000, description: '8,000점 달성' },
    reward: { points: 25 },
  },
];

// Prism Smash 업적 (기본)
const prismSmashAchievements: Achievement[] = [
  {
    id: 'prism-smash-first-break',
    gameId: 'prism-smash',
    name: '첫 번째 파괴',
    nameEn: 'First Break',
    description: '5,000점 달성',
    descriptionEn: 'Reach 5,000 points',
    icon: '🔨',
    tier: 'bronze',
    category: 'score',
    requirement: { type: 'score', target: 5000, description: '5,000점 달성' },
    reward: { points: 25 },
  },
];

// Pulse Paddles 업적 (기본)
const pulsePaddlesAchievements: Achievement[] = [
  {
    id: 'pulse-paddles-first-win',
    gameId: 'pulse-paddles',
    name: '첫 번째 승리',
    nameEn: 'First Win',
    description: '첫 매치 승리',
    descriptionEn: 'Win your first match',
    icon: '🏓',
    tier: 'bronze',
    category: 'skill',
    requirement: { type: 'special', target: 1, description: '매치 승리' },
    reward: { points: 50 },
  },
];

// 전체 업적 맵
export const ALL_ACHIEVEMENTS: Record<string, Achievement[]> = {
  'stellar-salvo': stellarSalvoAchievements,
  'neon-serpent': neonSerpentAchievements,
  'cascade-blocks': cascadeBlocksAchievements,
  'photon-vanguard': photonVanguardAchievements,
  'spectral-pursuit': spectralPursuitAchievements,
  'starshard-drift': starshardDriftAchievements,
  'prism-smash': prismSmashAchievements,
  'pulse-paddles': pulsePaddlesAchievements,
};

// 게임별 업적 가져오기
export function getGameAchievements(gameId: string): Achievement[] {
  return ALL_ACHIEVEMENTS[gameId] || [];
}

// 모든 업적 가져오기
export function getAllAchievements(): Achievement[] {
  return Object.values(ALL_ACHIEVEMENTS).flat();
}

// 특정 업적 가져오기
export function getAchievementById(achievementId: string): Achievement | undefined {
  return getAllAchievements().find((a) => a.id === achievementId);
}
