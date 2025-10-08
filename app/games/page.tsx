'use client';

import Link from 'next/link';
import { useState } from 'react';

type GameStatus = 'playable' | 'coming-soon';
type GameColor = 'green' | 'pink' | 'cyan' | 'yellow' | 'purple';

interface GameInfo {
  id: string;
  name: string;
  icon: string;
  color: GameColor;
  difficulty: string;
  description: string;
  controls: string;
  status: GameStatus;
  href?: string;
}

const games: GameInfo[] = [
  {
    id: 'neon-serpent',
    name: 'NEON SERPENT',
    icon: '🐍',
    color: 'green',
    difficulty: '⭐',
    description: '모듈형 네온 필드를 누비며 에너지 오브를 수집하세요',
    controls: '방향키로 이동, Shift 대시',
    status: 'playable',
    href: '/games/neon-serpent',
  },
  {
    id: 'pulse-paddles',
    name: 'PULSE PADDLES',
    icon: '🏓',
    color: 'pink',
    difficulty: '⭐',
    description: '곡선 궤적의 에너지 볼을 반사해 네온 골을 기록하세요',
    controls: '↑↓ 패들 제어, Space 커브샷',
    status: 'playable',
    href: '/games/pulse-paddles',
  },
  {
    id: 'prism-smash',
    name: 'PRISM SMASH',
    icon: '🧊',
    color: 'cyan',
    difficulty: '⭐⭐',
    description: '가변 패턴의 프리즘 블록을 해체하며 모듈을 수집하세요',
    controls: '←→ 패들 이동, Space 필드 스왑',
    status: 'playable',
    href: '/games/prism-smash',
  },
  {
    id: 'cascade-blocks',
    name: 'COLOR MATCH CASCADE',
    icon: '🔷',
    color: 'purple',
    difficulty: '⭐⭐',
    description: '같은 색 블록 3개 이상 연결해 제거하고 연쇄 콤보로 고득점 획득',
    controls: '방향키 이동/회전, Space 하드 드롭',
    status: 'playable',
    href: '/games/cascade-blocks',
  },
  {
    id: 'photon-vanguard',
    name: 'PHOTON VANGUARD',
    icon: '🛡️',
    color: 'yellow',
    difficulty: '⭐⭐⭐',
    description: '방사형 궤도로 진입하는 포톤 군단을 시간 왜곡으로 제압하세요',
    controls: '←→ 이동, Space 파동 발사',
    status: 'playable',
    href: '/games/photon-vanguard',
  },
  {
    id: 'spectral-pursuit',
    name: 'SPECTRAL PURSUIT',
    icon: '🔮',
    color: 'yellow',
    difficulty: '⭐⭐⭐⭐',
    description: '개방형 라비린스에서 추적자를 교란하며 빛의 파편을 모으세요',
    controls: '방향키 이동, Space 위장',
    status: 'playable',
    href: '/games/spectral-pursuit',
  },
  {
    id: 'stellar-salvo',
    name: 'STELLAR SALVO',
    icon: '🛡️',
    color: 'cyan',
    difficulty: '⭐⭐⭐',
    description: 'VOID WRAITH를 방어하며 공명의 관문을 지키는 네온 디펜스 슈팅',
    controls: '방향키 회전·추진, Space 펄스, Shift 대시',
    status: 'playable',
    href: '/games/stellar-salvo',
  },
] as const;

const defaultSpotlightId =
  games.find((game) => game.id === 'stellar-salvo')?.id ?? games[games.length - 1]?.id ?? games[0].id;

const colorClasses = {
  green: 'border-bright-green hover:shadow-neon-green',
  pink: 'border-bright-pink hover:shadow-neon-pink',
  cyan: 'border-bright-cyan hover:shadow-neon-cyan',
  yellow: 'border-bright-yellow hover:shadow-neon-yellow',
  purple: 'border-bright-purple hover:shadow-neon-purple',
} as const;

const textColorClasses = {
  green: 'text-bright-green',
  pink: 'text-bright-pink',
  cyan: 'text-bright',
  yellow: 'text-bright-yellow',
  purple: 'text-bright-purple',
} as const;

const playButtonClasses = {
  green: 'border-bright-green text-bright-green hover:bg-bright-green hover:text-black',
  pink: 'border-bright-pink text-bright-pink hover:bg-bright-pink hover:text-black',
  cyan: 'border-bright-cyan text-bright hover:bg-bright-cyan hover:text-black',
  yellow: 'border-bright-yellow text-bright-yellow hover:bg-bright-yellow hover:text-black',
  purple: 'border-bright-purple text-bright-purple hover:bg-bright-purple hover:text-black',
} as const;

export default function GamesPage() {
  const [selectedGameId, setSelectedGameId] = useState<string>(defaultSpotlightId);
  const selectedGame = games.find((game) => game.id === selectedGameId) ?? games[0];

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <section className="text-center mb-12 md:mb-16 space-y-3">
          <h1 className="pixel-text text-4xl md:text-6xl text-bright neon-text">GAME ARCADE</h1>
          <p className="text-bright-pink pixel-text text-sm tracking-wide">NEON DEFENSE · RETRO SHOOTERS · PUZZLE FUSION</p>
          <p className="text-bright text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            모든 타이틀이 플레이 가능한 오리지널 네온 아케이드입니다. 카드에 마우스를 올리거나 클릭해서 게임을 미리 소개받고,
            마음에 드는 타이틀은 즉시 플레이하세요.
          </p>
        </section>

        <section className="mb-12 md:mb-16 bg-black/60 border border-bright-cyan/60 rounded-xl shadow-neon-cyan p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <span className="pixel-text text-xs text-bright-cyan uppercase tracking-wider">Game Spotlight</span>
            <h2 className="pixel-text text-2xl md:text-3xl text-bright">{selectedGame.name}</h2>
            <p className="text-bright text-sm md:text-base leading-relaxed">{selectedGame.description}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              <span className="px-3 py-1 border border-bright-yellow text-bright-yellow pixel-text text-[10px] rounded-md">
                난이도 {selectedGame.difficulty}
              </span>
              <span className="px-3 py-1 border border-bright-purple text-bright-purple pixel-text text-[10px] rounded-md">
                {selectedGame.controls}
              </span>
              <span className="px-3 py-1 border border-bright-green text-bright-green pixel-text text-[10px] rounded-md">
                {selectedGame.status === 'playable' ? '플레이 가능' : '곧 공개'}
              </span>
            </div>
            <div>
              {selectedGame.status === 'playable' ? (
                <Link
                  href={selectedGame.href ?? '#'}
                  className="inline-block mt-4 px-6 py-2 border-2 border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
                >
                  Play {selectedGame.name}
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-block mt-4 px-6 py-2 border border-gray-600 text-gray-500 pixel-text text-xs rounded-lg cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-video bg-gradient-to-br from-cyan-700/40 via-black to-purple-900/50 border border-bright-cyan/40 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-bright">
                <span className="pixel-text text-5xl">{selectedGame.icon}</span>
                <p className="text-bright text-xs md:text-sm max-w-sm text-center leading-relaxed px-4">
                  카드 선택에 따라 이 영역이 갱신됩니다. 플레이 버튼을 누르면 해당 게임으로 이동합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {games.map((game) => {
            const isSelected = selectedGameId === game.id;
            return (
              <button
                type="button"
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`group relative p-6 text-left bg-black/50 border-2 ${
                  colorClasses[game.color]
                } rounded-lg transition-all duration-300 ${
                  game.status === 'coming-soon'
                    ? 'cursor-not-allowed opacity-70 hover:opacity-90'
                    : 'cursor-pointer hover:scale-105'
                } ${isSelected ? 'ring-4 ring-bright-cyan/60' : ''}`}
              >
                <div className="text-6xl mb-4 text-center">{game.icon}</div>
                <h2 className={`pixel-text text-sm text-center mb-2 ${textColorClasses[game.color]}`}>
                  {game.name}
                </h2>
                <div className="text-center mb-3">
                  <span className="text-bright-yellow text-sm">{game.difficulty}</span>
                </div>
                <p className="text-bright text-xs text-center mb-3 leading-relaxed">{game.description}</p>
                <div className="text-center mb-4">
                  <p className="text-bright-purple text-xs">{game.controls}</p>
                </div>
                {game.status === 'coming-soon' && (
                  <div className="absolute top-4 right-4">
                    <span className="pixel-text text-bright-yellow text-xs bg-black/80 px-2 py-1 rounded border border-bright-yellow">
                      SOON
                    </span>
                  </div>
                )}
                {game.status === 'playable' && (
                  <div className="absolute top-4 right-4">
                    <span className="pixel-text text-bright-green text-xs bg-black/80 px-2 py-1 rounded border border-bright-green">
                      LIVE
                    </span>
                  </div>
                )}
                <div className="text-center mt-3">
                  {game.status === 'playable' ? (
                    <Link
                      href={game.href ?? '#'}
                      className={`pixel-text text-xs px-6 py-2 rounded border-2 transition-all duration-300 inline-block ${
                        playButtonClasses[game.color]
                      }`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      PLAY
                    </Link>
                  ) : (
                    <span className="pixel-text text-xs px-6 py-2 rounded border border-gray-600 text-gray-500">
                      COMING SOON
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </section>

        <section className="text-center">
          <p className="pixel-text text-bright text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            새로운 네온 아이디어가 떠오른다면 언제든 제보해주세요. 커뮤니티 피드백을 바탕으로 더 많은 오리지널 타이틀이 제작될 거예요.
          </p>
        </section>
      </div>
    </main>
  );
}
