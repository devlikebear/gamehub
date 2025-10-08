/**
 * BGM Tracks Configuration
 *
 * 각 게임에서 사용할 수 있는 BGM 목록을 정의합니다.
 * 나중에 게임별로 여러 BGM을 추가하고 랜덤 재생할 수 있습니다.
 *
 * Music by Oblidivm (https://oblidivmmusic.blogspot.com)
 * Licensed under CC-BY 4.0
 * Source: https://opengameart.org/content/chiptune-music-for-arcade-games
 */

export interface BGMTrack {
  id: string;
  title: string;
  path: string;
  duration?: number; // 초 단위 (선택적)
}

/**
 * 사용 가능한 모든 BGM 트랙
 */
export const ALL_BGM_TRACKS: BGMTrack[] = [
  {
    id: 'the-challenge',
    title: 'The Challenge',
    path: '/audio/bgm/01-the-challenge.ogg',
  },
  {
    id: 'the-fun-begins',
    title: 'The Fun Begins',
    path: '/audio/bgm/02-the-fun-begins.ogg',
  },
  {
    id: 'the-labyrinth',
    title: 'The Labyrinth',
    path: '/audio/bgm/03-the-labyrinth.ogg',
  },
  {
    id: 'survive',
    title: 'Survive',
    path: '/audio/bgm/04-survive.ogg',
  },
  {
    id: 'jump2sky',
    title: 'Jump2Sky',
    path: '/audio/bgm/05-jump2sky.mp3',
  },
  {
    id: 'the-undefeated',
    title: 'The Undefeated',
    path: '/audio/bgm/06-the-undefeated.ogg',
  },
];

/**
 * 게임별 BGM 매핑
 * 각 게임은 여러 개의 BGM을 가질 수 있으며, 랜덤하게 선택됩니다.
 */
export const GAME_BGM_MAP: Record<string, string[]> = {
  // 네온 서펀트 (뱀 게임) - 빠른 템포의 BGM
  'neon-serpent': ['the-fun-begins', 'the-challenge'],

  // 캐스케이드 블록 (테트리스) - 집중력 있는 BGM
  'cascade-blocks': ['the-labyrinth', 'survive'],

  // 프리즘 스매시 (벽돌깨기) - 역동적인 BGM
  'prism-smash': ['the-challenge', 'survive'],

  // 스펙트럴 퍼슈트 (팩맨) - 미로 탐험 BGM
  'spectral-pursuit': ['the-labyrinth', 'the-fun-begins'],

  // 펄스 패들 (퐁) - 클래식 아케이드 BGM
  'pulse-paddles': ['the-fun-begins', 'the-challenge'],

  // 스타샤드 드리프트 (우주선) - 우주 느낌의 BGM
  'starshard-drift': ['jump2sky', 'the-undefeated'],

  // 칼라 매치 캐스케이드 (뿌요뿌요) - 경쾌한 BGM
  'color-match-cascade': ['the-fun-begins', 'the-labyrinth'],

  // 포톤 뱅가드 (radial defense) - 긴장감 있는 BGM
  'photon-vanguard': ['survive', 'the-undefeated'],

  // 스텔라 살보 (우주 슈팅) - 격렬한 전투 BGM
  'stellar-salvo': ['the-undefeated', 'jump2sky'],
};

/**
 * 게임의 BGM 트랙 목록을 가져옵니다
 */
export function getGameBGMTracks(gameId: string): BGMTrack[] {
  const trackIds = GAME_BGM_MAP[gameId] || ['the-fun-begins']; // 기본값
  return trackIds.map(id => ALL_BGM_TRACKS.find(track => track.id === id)!).filter(Boolean);
}

/**
 * 게임에서 랜덤하게 BGM을 선택합니다
 */
export function selectRandomBGM(gameId: string): BGMTrack {
  const tracks = getGameBGMTracks(gameId);
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}

/**
 * BGM 트랙 ID로 트랙 정보를 가져옵니다
 */
export function getBGMTrack(trackId: string): BGMTrack | undefined {
  return ALL_BGM_TRACKS.find(track => track.id === trackId);
}
