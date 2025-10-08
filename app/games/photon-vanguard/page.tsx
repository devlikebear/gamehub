'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PhotonVanguardGame } from '@/lib/games/photon-vanguard/PhotonVanguardGame';
import { generateNickname, sanitizeNickname } from '@/lib/leaderboard/nickname';
import { saveLocalRank, loadLocalRank } from '@/lib/leaderboard/storage';
import { fetchLeaderboard, submitScore } from '@/lib/leaderboard/supabase';
import type { GameResultPayload, LeaderboardEntry, LeaderboardSubmissionResponse } from '@/lib/leaderboard/types';

const GAME_ID = 'photon-vanguard';

export default function PhotonVanguardPage() {
  const [pendingResult, setPendingResult] = useState<GameResultPayload | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleGameComplete = useCallback((payload: GameResultPayload) => {
    setPendingResult(payload);
    setModalOpen(true);
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
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-10 md:space-y-14">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-yellow uppercase tracking-wider">
            PHASE 4 · RADIANT DEFENSE
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            PHOTON VANGUARD
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            방사형 궤도로 진입하는 포톤 군단을 제압하세요. ←→으로 수호대를 회전시키고, Shift
            시간 왜곡으로 적의 돌진을 늦춘 뒤 Space 파동을 방출해 궤도를 정리하세요. 잔상
            장벽을 활용하면 추격자를 늦출 수 있습니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-yellow rounded-xl shadow-neon-yellow p-4 md:p-6 lg:p-8">
          <GameCanvas
            GameClass={PhotonVanguardGame}
            width={860}
            height={620}
            pauseOnSpace={false}
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

        {/* 게임 정보는 기존 내용 유지 - 생략 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}

function LeaderboardPreview({ entries, loading }: { entries: LeaderboardEntry[]; loading: boolean }) {
  if (!loading && entries.length === 0) return null;
  return (
    <section className="bg-black/50 border border-bright-cyan/60 rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="pixel-text text-xs text-bright">TOP PILOTS (최근 5위)</h2>
        <Link href="/leaderboard" className="pixel-text text-xs text-bright-cyan hover:underline">
          전체 랭킹 보기
        </Link>
      </div>
      {loading ? (
        <p className="text-bright text-sm">불러오는 중...</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry, index) => (
            <li key={entry.id} className="flex items-center justify-between text-bright text-xs">
              <span>#{index + 1} · {entry.nickname}</span>
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
      });
      // Fetch updated leaderboard
      const leaderboard = await fetchLeaderboard(gameId, 100);
      onSubmitted(response, leaderboard);
      setStatus('success');
    } catch (submissionError) {
      console.error(submissionError);
      setError('점수를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
      <div className="w-full max-w-md bg-black/80 border border-bright-cyan/60 rounded-xl shadow-neon-cyan p-6 space-y-4">
        <div className="space-y-2 text-center">
          <p className="pixel-text text-xs text-bright-cyan uppercase">Submit Score</p>
          <h2 className="pixel-text text-2xl text-bright">GAME OVER</h2>
          <p className="text-bright text-sm">이번 라운드 점수: {result.score.toLocaleString()} pts</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-left text-bright text-xs">
            Pilot Nickname
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
            새 랜덤 닉네임
          </button>
          {error && <p className="text-bright-pink text-xs">{error}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="pixel-text text-xs px-4 py-2 border border-bright text-bright rounded hover:bg-bright/10"
              onClick={onClose}
              disabled={status === 'submitting'}
            >
              닫기
            </button>
            <button
              type="submit"
              className="pixel-text text-xs px-4 py-2 border-2 border-bright-cyan text-bright rounded hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none disabled:opacity-60"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? '저장 중...' : '점수 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
