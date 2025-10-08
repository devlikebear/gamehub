'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/leaderboard/types';
import { loadLocalRank } from '@/lib/leaderboard/storage';
import { generateNickname } from '@/lib/leaderboard/nickname';

const GAME_OPTIONS = [
  { id: 'stellar-salvo', name: 'Stellar Salvo', color: 'text-bright' },
  { id: 'photon-vanguard', name: 'Photon Vanguard', color: 'text-bright-yellow' },
  { id: 'spectral-pursuit', name: 'Spectral Pursuit', color: 'text-bright-pink' },
  { id: 'neon-serpent', name: 'Neon Serpent', color: 'text-bright-green' },
  { id: 'pulse-paddles', name: 'Pulse Paddles', color: 'text-bright' },
  { id: 'prism-smash', name: 'Prism Smash', color: 'text-bright' },
  { id: 'cascade-blocks', name: 'Color Match Cascade', color: 'text-bright' },
];

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState(GAME_OPTIONS[0]?.id ?? 'stellar-salvo');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localRank = useMemo(() => loadLocalRank(selectedGame), [selectedGame]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/leaderboard?gameId=${encodeURIComponent(selectedGame)}`);
        if (!response.ok) {
          throw new Error('Failed to load leaderboard');
        }
        const data = (await response.json()) as { entries: LeaderboardEntry[] };
        if (isActive) {
          setEntries(data.entries ?? []);
        }
      } catch (err) {
        console.error(err);
        if (isActive) {
          setError('리더보드를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isActive = false;
    };
  }, [selectedGame]);

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl space-y-10">
        <section className="text-center space-y-4">
          <p className="pixel-text text-sm text-bright-cyan uppercase tracking-wider">Global Leaderboards</p>
          <h1 className="pixel-text text-4xl md:text-5xl text-bright">NEON HALL OF FAME</h1>
          <p className="text-bright text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            각 게임에서 기록한 최고 점수는 상위 100위까지 클라우드에 저장됩니다. 하위 점수와 개인 기록은 브라우저에 안전하게 보관돼요.
          </p>
        </section>

        <section className="flex flex-wrap items-center justify-center gap-3">
          {GAME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedGame(option.id)}
              className={`px-4 py-2 border-2 rounded-lg pixel-text text-xs transition-all duration-200 ${
                selectedGame === option.id
                  ? 'border-bright-cyan bg-bright-cyan/10 shadow-neon-cyan'
                  : 'border-bright text-bright hover:bg-bright/10'
              }`}
            >
              <span className={option.color}>{option.name.toUpperCase()}</span>
            </button>
          ))}
        </section>

        {localRank && (
          <section className="bg-black/60 border border-bright-green/60 rounded-xl shadow-neon-green p-6 text-center">
            <p className="pixel-text text-xs text-bright-green mb-2">MY BEST RANK</p>
            <p className="text-bright text-base md:text-lg">
              #{localRank.rank} · {localRank.nickname} · {localRank.score.toLocaleString()} pts
            </p>
            <p className="text-bright text-xs mt-2 opacity-70">최근 기록: {new Date(localRank.updatedAt).toLocaleString()}</p>
          </section>
        )}

        <section className="bg-black/50 border border-bright-cyan/40 rounded-xl overflow-hidden">
          <header className="px-6 py-4 flex items-center justify-between border-b border-bright-cyan/30">
            <h2 className="pixel-text text-sm text-bright">TOP 100</h2>
            <Link href="/games" className="pixel-text text-xs text-bright-cyan hover:underline">
              Back to Game List
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-bright text-xs">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Pilot</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-bright">
                      Loading leaderboard...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-bright-pink">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-bright">
                      아직 등록된 기록이 없습니다. 가장 먼저 랭킹을 올려보세요!
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  entries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}>
                      <td className="px-4 py-2 text-bright">#{index + 1}</td>
                      <td className="px-4 py-2 text-bright">{entry.nickname}</td>
                      <td className="px-4 py-2 text-bright">{entry.score.toLocaleString()}</td>
                      <td className="px-4 py-2 text-bright text-xs">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-center text-bright text-xs opacity-70">
          <p>
            닉네임이 마음에 들지 않으면 게임 내에서 새 점수를 등록할 때마다 자동으로 생성된 다른 이름을 선택할 수 있어요.
            예시: <span className="text-bright-cyan font-semibold">{generateNickname()}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
