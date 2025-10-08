'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PrismSmashGame } from '@/lib/games/prism-smash/PrismSmashGame';
import { generateNickname, sanitizeNickname } from '@/lib/leaderboard/nickname';
import { saveLocalRank, loadLocalRank } from '@/lib/leaderboard/storage';
import { fetchLeaderboard, submitScore } from '@/lib/leaderboard/supabase';
import type { GameResultPayload, LeaderboardEntry, LeaderboardSubmissionResponse } from '@/lib/leaderboard/types';
import { loadAllSounds } from '@/lib/audio/sounds';
import { playGameBGM, stopGameBGM, resumeGameBGM } from '@/lib/audio/bgmPlayer';

import { useI18n } from '@/lib/i18n/provider';
const GAME_ID = 'prism-smash';

export default function PrismSmashPage() {
  const { t } = useI18n();
  const [pendingResult, setPendingResult] = useState<GameResultPayload | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleGameComplete = useCallback((payload: GameResultPayload) => {
    setPendingResult(payload);
    setModalOpen(true);
  }, []);

  // 오디오 시스템 초기화 및 BGM 재생
  useEffect(() => {
    // 효과음 로드
    loadAllSounds();

    // BGM 재생 (랜덤 선택)
    playGameBGM(GAME_ID);


    const handleBgmToggle = (event: CustomEvent) => {
      if (event.detail.enabled) {
        resumeGameBGM();
      }
    };

    window.addEventListener('bgm-toggle', handleBgmToggle as EventListener);

    return () => {
      stopGameBGM();
      window.removeEventListener('bgm-toggle', handleBgmToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchPreview() {
      setLoadingPreview(true);
      try {
        const data = await fetchLeaderboard(GAME_ID, 5);
        if (active) setRecentEntries(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to load leaderboard preview', error);
      } finally {
        if (active) setLoadingPreview(false);
      }
    }
    fetchPreview();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl space-y-12">
        <section className="text-center space-y-4">
          <p className="pixel-text text-xs text-bright-cyan">{t.games['prism-smash'].tagline}</p>
          <h1 className="pixel-text text-5xl md:text-6xl text-bright neon-text">{t.games['prism-smash'].name}</h1>
          <p className="pixel-text text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            {t.games['prism-smash'].intro}
          </p>
        </section>

        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-6 md:p-8">
          <GameCanvas
            GameClass={PrismSmashGame}
            width={900}
            height={560}
            onGameComplete={handleGameComplete}
          />
        </section>

        <LeaderboardPreview entries={recentEntries} loading={loadingPreview} />
        <ScoreSubmissionModal
          gameId={GAME_ID}
          result={pendingResult}
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmitted={(response, leaderboard) => {
            const snapshot = {
              nickname: response.nickname,
              score: response.score,
              rank: response.rank,
              updatedAt: response.submittedAt,
            };
            saveLocalRank(GAME_ID, snapshot);
            if (leaderboard) {
              setRecentEntries(leaderboard.slice(0, 5));
            }
            setModalOpen(false);
          }}
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-green">{t.games['prism-smash'].controls.title}</h2>
            <ul className="pixel-text text-sm text-bright space-y-2">
              <li>{t.games['prism-smash'].controls.move}</li>
              <li>{t.games['prism-smash'].controls.boost}</li>
              <li>{t.games['prism-smash'].controls.swap}</li>
              <li>{t.games['prism-smash'].controls.restart}</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-pink">{t.games['prism-smash'].objectives.title}</h2>
            <ul className="pixel-text text-sm text-bright space-y-2">
              <li>{t.games['prism-smash'].objectives.item1}</li>
              <li>{t.games['prism-smash'].objectives.item2}</li>
              <li>{t.games['prism-smash'].objectives.item3}</li>
              <li>{t.games['prism-smash'].objectives.item4}</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-yellow">{t.games['prism-smash'].notes.title}</h2>
            <ul className="pixel-text text-sm text-bright space-y-2">
              <li>{t.games['prism-smash'].notes.item1}</li>
              <li>{t.games['prism-smash'].notes.item2}</li>
              <li>{t.games['prism-smash'].notes.item3}</li>
              <li>{t.games['prism-smash'].notes.item4}</li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/games"
            className="inline-block px-6 py-3 border-2 border-bright-cyan text-bright-cyan pixel-text text-xs rounded hover:bg-bright-cyan hover:text-black transition-all"
          >
            {t.gameUI.backToArcade}
          </Link>
        </section>
      </div>
    </main>
  );
}

function LeaderboardPreview({ entries, loading }: { entries: LeaderboardEntry[]; loading: boolean }) {
  const { t } = useI18n();

  if (!loading && entries.length === 0) {
    return null;
  }

  return (
    <section className="bg-black/50 border border-bright-cyan/60 rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="pixel-text text-xs text-bright">{t.gameUI.topPilots} ({t.gameUI.recentTop5})</h2>
        <Link href="/leaderboard" className="pixel-text text-xs text-bright-cyan hover:underline">
          {t.gameUI.viewFullRanking}
        </Link>
      </div>
      {loading ? (
        <p className="pixel-text text-bright text-sm">{t.gameUI.loading}</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry, index) => (
            <li key={entry.id} className="flex items-center justify-between pixel-text text-bright text-xs">
              <span>
                #{index + 1} · {entry.nickname}
              </span>
              <span>{entry.score.toLocaleString()} pts</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ScoreSubmissionModal({
  gameId,
  result,
  open,
  onClose,
  onSubmitted,
}: {
  gameId: string;
  result: GameResultPayload | null;
  open: boolean;
  onClose: () => void;
  onSubmitted: (response: LeaderboardSubmissionResponse, leaderboard?: LeaderboardEntry[]) => void;
}) {
  const { t } = useI18n();
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const localRank = useMemo(() => loadLocalRank(gameId), [gameId]);

  useEffect(() => {
    if (!open) return;
    const base = localRank?.nickname ?? generateNickname();
    setNickname(base);
    setStatus('idle');
    setError(null);
  }, [open, localRank]);

  if (!open || !result) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setError(null);
    try {
      const response = await submitScore({
        gameId,
        nickname,
        score: result.score,
  
      // Fetch updated leaderboard
      const leaderboard = await fetchLeaderboard(gameId, 100);
      onSubmitted(response, leaderboard);
      setStatus('success');
    } catch (submissionError) {
      console.error(submissionError);
      setError(t.gameUI.saveError);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
      <div className="w-full max-w-md bg-black/80 border border-bright-cyan/60 rounded-xl shadow-neon-cyan p-6 space-y-4">
        <div className="space-y-2 text-center">
          <p className="pixel-text text-xs text-bright-cyan uppercase">{t.gameUI.submitScore}</p>
          <h2 className="pixel-text text-2xl text-bright">{result.outcome === 'victory' ? t.gameUI.victory : t.gameUI.defeat}</h2>
          <p className="pixel-text text-bright text-sm">{t.gameUI.thisRoundScore}: {result.score.toLocaleString()} pts</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-left pixel-text text-bright text-xs">
            {t.gameUI.pilotNickname}
            <input
              value={nickname}
              onChange={(event) => setNickname(sanitizeNickname(event.target.value))}
              className="mt-1 w-full rounded border border-bright-cyan/50 bg-black/60 px-3 py-2 text-bright focus:outline-none focus:ring-2 focus:ring-bright-cyan"
              maxLength={18}
              required
            />
          </label>
          <button
            type="button"
            className="pixel-text text-xs px-4 py-2 border border-bright-cyan text-bright rounded hover:bg-bright-cyan/20"
            onClick={() => setNickname(generateNickname())}
          >
            {t.gameUI.newRandomNickname}
          </button>
          {error && <p className="pixel-text text-bright-pink text-xs">{error}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="pixel-text text-xs px-4 py-2 border border-bright text-bright rounded hover:bg-bright/10"
              onClick={onClose}
              disabled={status === 'submitting'}
            >
              {t.gameUI.close}
            </button>
            <button
              type="submit"
              className="pixel-text text-xs px-4 py-2 border-2 border-bright-cyan text-bright rounded hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none disabled:opacity-60"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? t.gameUI.saving : t.gameUI.saveScore}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
