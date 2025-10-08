'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { LeaderboardEntry } from '@/lib/leaderboard/types';
import { loadLocalRank } from '@/lib/leaderboard/storage';
import { fetchLeaderboard } from '@/lib/leaderboard/supabase';
import { useI18n } from '@/lib/i18n/provider';

export default function LeaderboardPage() {
  const { t } = useI18n();

  const GAME_OPTIONS = [
    { id: 'stellar-salvo', name: t.games['stellar-salvo'].name, color: 'text-bright' },
    { id: 'photon-vanguard', name: t.games['photon-vanguard'].name, color: 'text-bright-yellow' },
    { id: 'spectral-pursuit', name: t.games['spectral-pursuit'].name, color: 'text-bright-pink' },
    { id: 'neon-serpent', name: t.games['neon-serpent'].name, color: 'text-bright-green' },
    { id: 'pulse-paddles', name: t.games['pulse-paddles'].name, color: 'text-bright' },
    { id: 'prism-smash', name: t.games['prism-smash'].name, color: 'text-bright' },
    { id: 'cascade-blocks', name: t.games['cascade-blocks'].name, color: 'text-bright' },
  ];
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
        const data = await fetchLeaderboard(selectedGame);
        if (isActive) {
          setEntries(data ?? []);
        }
      } catch (err) {
        console.error(err);
        if (isActive) {
          setError(t.leaderboard.error);
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
  }, [selectedGame, t.leaderboard.error]);

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl space-y-10">
        <section className="text-center space-y-4">
          <p className="pixel-text text-sm text-bright-cyan uppercase tracking-wider">{t.leaderboard.subtitle}</p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text animate-neon-pulse">
            {t.leaderboard.title}
          </h1>
          <p className="pixel-text text-bright text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t.leaderboard.description}
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
            <p className="pixel-text text-xs text-bright-green mb-2">{t.leaderboard.myBestRank}</p>
            <p className="pixel-text text-bright text-base md:text-lg">
              #{localRank.rank} · {localRank.nickname} · {localRank.score.toLocaleString()} pts
            </p>
            <p className="pixel-text text-bright text-xs mt-2 opacity-70">{t.leaderboard.recorded}: {new Date(localRank.updatedAt).toLocaleString()}</p>
          </section>
        )}

        <section className="bg-black/50 border border-bright-cyan/40 rounded-xl overflow-hidden">
          <header className="px-6 py-4 flex items-center justify-between border-b border-bright-cyan/30">
            <h2 className="pixel-text text-sm text-bright">{t.leaderboard.top100}</h2>
            <Link href="/games" className="pixel-text text-xs text-bright-cyan hover:underline">
              {t.leaderboard.backToGameList}
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="pixel-text text-bright text-xs">
                  <th className="px-4 py-2">{t.leaderboard.rank}</th>
                  <th className="px-4 py-2">{t.leaderboard.pilot}</th>
                  <th className="px-4 py-2">{t.leaderboard.score}</th>
                  <th className="px-4 py-2">{t.leaderboard.recorded}</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center pixel-text text-bright">
                      {t.leaderboard.loading}
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center pixel-text text-bright-pink">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center pixel-text text-bright">
                      {t.leaderboard.noEntries}
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  entries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}>
                      <td className="px-4 py-2 pixel-text text-bright">#{index + 1}</td>
                      <td className="px-4 py-2 pixel-text text-bright">{entry.nickname}</td>
                      <td className="px-4 py-2 pixel-text text-bright">{entry.score.toLocaleString()}</td>
                      <td className="px-4 py-2 pixel-text text-bright text-xs">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-center pixel-text text-bright text-xs opacity-70">
          <p>
            {t.leaderboard.nicknameNote}
          </p>
        </section>
      </div>
    </main>
  );
}
