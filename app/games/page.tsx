'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';

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
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/neon-serpent',
  },
  {
    id: 'pulse-paddles',
    name: 'PULSE PADDLES',
    icon: '🏓',
    color: 'pink',
    difficulty: '⭐',
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/pulse-paddles',
  },
  {
    id: 'prism-smash',
    name: 'PRISM SMASH',
    icon: '🧊',
    color: 'cyan',
    difficulty: '⭐⭐',
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/prism-smash',
  },
  {
    id: 'cascade-blocks',
    name: 'COLOR MATCH CASCADE',
    icon: '🔷',
    color: 'purple',
    difficulty: '⭐⭐',
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/cascade-blocks',
  },
  {
    id: 'photon-vanguard',
    name: 'PHOTON VANGUARD',
    icon: '🛡️',
    color: 'yellow',
    difficulty: '⭐⭐⭐',
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/photon-vanguard',
  },
  {
    id: 'spectral-pursuit',
    name: 'SPECTRAL PURSUIT',
    icon: '🔮',
    color: 'yellow',
    difficulty: '⭐⭐⭐⭐',
    description: '',
    controls: '',
    status: 'playable',
    href: '/games/spectral-pursuit',
  },
  {
    id: 'stellar-salvo',
    name: 'STELLAR SALVO',
    icon: '🛡️',
    color: 'cyan',
    difficulty: '⭐⭐⭐',
    description: '',
    controls: '',
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
  const { t } = useI18n();
  const [selectedGameId, setSelectedGameId] = useState<string>(defaultSpotlightId);
  const selectedGame = games.find((game) => game.id === selectedGameId) ?? games[0];

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <section className="text-center mb-12 md:mb-16 space-y-3">
          <h1 className="pixel-text text-4xl md:text-6xl neon-text" style={{ color: '#00f0ff' }}>{t.gamesPage.title}</h1>
          <p className="text-bright-pink pixel-text text-sm tracking-wide">{t.gamesPage.subtitle}</p>
          <p className="pixel-text text-sm md:text-base max-w-3xl mx-auto leading-relaxed" style={{ color: '#00f0ff' }}>
            {t.gamesPage.description}
          </p>
        </section>

        <section className="mb-12 md:mb-16 bg-black/60 border border-[#00f0ff]/60 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <span className="pixel-text text-xs uppercase tracking-wider" style={{ color: '#00f0ff' }}>{t.gamesPage.spotlight}</span>
            <h2 className="pixel-text text-2xl md:text-3xl" style={{ color: '#00f0ff' }}>{t.games[selectedGame.id as keyof typeof t.games]?.name || selectedGame.name}</h2>
            <p className="pixel-text text-sm md:text-base leading-relaxed" style={{ color: '#00f0ff' }}>{t.games[selectedGame.id as keyof typeof t.games]?.description || selectedGame.description}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              <span className="px-3 py-1 border border-bright-yellow text-bright-yellow pixel-text text-[10px] rounded-md">
                {t.gamesPage.difficulty} {selectedGame.difficulty}
              </span>
              <span className="px-3 py-1 border border-bright-purple text-bright-purple pixel-text text-[10px] rounded-md">
                {t.games[selectedGame.id as keyof typeof t.games]?.controlsSummary || selectedGame.controls}
              </span>
              <span className="px-3 py-1 border border-bright-green text-bright-green pixel-text text-[10px] rounded-md">
                {selectedGame.status === 'playable' ? t.gamesPage.playable : t.gamesPage.comingSoon}
              </span>
            </div>
            <div>
              {selectedGame.status === 'playable' ? (
                <Link
                  href={selectedGame.href ?? '#'}
                  className="inline-block mt-4 px-6 py-2 border-2 border-[#00f0ff] pixel-text text-xs rounded-lg hover:bg-[#00f0ff]/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  style={{ color: '#00f0ff' }}
                >
                  {t.gamesPage.play} {t.games[selectedGame.id as keyof typeof t.games]?.name || selectedGame.name}
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-block mt-4 px-6 py-2 border border-gray-600 text-gray-500 pixel-text text-xs rounded-lg cursor-not-allowed"
                >
                  {t.gamesPage.comingSoon}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-video bg-gradient-to-br from-cyan-700/40 via-black to-purple-900/50 border border-[#00f0ff]/40 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="pixel-text text-5xl">{selectedGame.icon}</span>
                <p className="pixel-text text-xs md:text-sm max-w-sm text-center leading-relaxed px-4" style={{ color: '#00f0ff' }}>
                  {t.gamesPage.previewNote}
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
                  {t.games[game.id as keyof typeof t.games]?.name || game.name}
                </h2>
                <div className="text-center mb-3">
                  <span className="text-bright-yellow text-sm">{game.difficulty}</span>
                </div>
                <p className="pixel-text text-xs text-center mb-3 leading-relaxed" style={{ color: '#00f0ff' }}>{t.games[game.id as keyof typeof t.games]?.description || game.description}</p>
                <div className="text-center mb-4">
                  <p className="pixel-text text-bright-purple text-xs">{t.games[game.id as keyof typeof t.games]?.controlsSummary || game.controls}</p>
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
                      {t.gamesPage.play}
                    </Link>
                  ) : (
                    <span className="pixel-text text-xs px-6 py-2 rounded border border-gray-600 text-gray-500">
                      {t.gamesPage.comingSoon}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </section>

        <section className="text-center">
          <p className="pixel-text text-xs md:text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#00f0ff' }}>
            {t.gamesPage.feedbackNote}
          </p>
        </section>
      </div>
    </main>
  );
}
