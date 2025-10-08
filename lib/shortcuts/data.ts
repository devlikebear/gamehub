/**
 * Keyboard Shortcuts Data
 * 키보드 단축키 데이터 정의
 */

import type { ShortcutGroup } from './types';

export const shortcutGroups: ShortcutGroup[] = [
  {
    category: 'global',
    title: 'Global Shortcuts',
    titleKo: '전역 단축키',
    shortcuts: [
      {
        id: 'help',
        category: 'global',
        key: '?',
        description: 'Open keyboard shortcuts guide',
        descriptionKo: '키보드 단축키 가이드 열기',
        icon: '❓',
      },
      {
        id: 'search',
        category: 'global',
        key: '/',
        description: 'Focus search (on games page)',
        descriptionKo: '검색 포커스 (게임 목록 페이지)',
        icon: '🔍',
      },
      {
        id: 'escape',
        category: 'global',
        key: 'Esc',
        description: 'Close modal or dialog',
        descriptionKo: '모달 또는 대화상자 닫기',
        icon: '❌',
      },
    ],
  },
  {
    category: 'navigation',
    title: 'Navigation',
    titleKo: '네비게이션',
    shortcuts: [
      {
        id: 'nav-home',
        category: 'navigation',
        key: 'H',
        modifiers: ['shift'],
        description: 'Go to Home',
        descriptionKo: '홈으로 이동',
        icon: '🏠',
      },
      {
        id: 'nav-games',
        category: 'navigation',
        key: 'G',
        modifiers: ['shift'],
        description: 'Go to Games List',
        descriptionKo: '게임 목록으로 이동',
        icon: '🎮',
      },
      {
        id: 'nav-leaderboard',
        category: 'navigation',
        key: 'L',
        modifiers: ['shift'],
        description: 'Go to Leaderboard',
        descriptionKo: '리더보드로 이동',
        icon: '🏆',
      },
      {
        id: 'nav-achievements',
        category: 'navigation',
        key: 'A',
        modifiers: ['shift'],
        description: 'Go to Achievements',
        descriptionKo: '업적으로 이동',
        icon: '🎖️',
      },
      {
        id: 'nav-about',
        category: 'navigation',
        key: 'I',
        modifiers: ['shift'],
        description: 'Go to About',
        descriptionKo: '소개 페이지로 이동',
        icon: 'ℹ️',
      },
    ],
  },
  {
    category: 'game',
    title: 'In-Game Controls',
    titleKo: '게임 조작',
    shortcuts: [
      {
        id: 'game-pause',
        category: 'game',
        key: 'Space',
        description: 'Pause / Resume game',
        descriptionKo: '게임 일시정지 / 재개',
        icon: '⏸️',
      },
      {
        id: 'game-restart',
        category: 'game',
        key: 'R',
        description: 'Restart game',
        descriptionKo: '게임 재시작',
        icon: '🔄',
      },
      {
        id: 'game-mute',
        category: 'game',
        key: 'M',
        description: 'Mute / Unmute sound',
        descriptionKo: '음소거 / 음소거 해제',
        icon: '🔇',
      },
      {
        id: 'game-move',
        category: 'game',
        key: '← → ↑ ↓',
        description: 'Move player',
        descriptionKo: '플레이어 이동',
        icon: '🕹️',
      },
      {
        id: 'game-action',
        category: 'game',
        key: 'Shift',
        description: 'Action (dash, shoot, etc.)',
        descriptionKo: '액션 (대시, 발사 등)',
        icon: '⚡',
      },
    ],
  },
];

/**
 * 카테고리별 단축키 조회
 */
export function getShortcutsByCategory(category: 'global' | 'game' | 'navigation') {
  return shortcutGroups.find((group) => group.category === category);
}

/**
 * 모든 단축키 조회
 */
export function getAllShortcuts() {
  return shortcutGroups.flatMap((group) => group.shortcuts);
}
