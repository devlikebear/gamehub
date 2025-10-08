'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { NeonSerpentGame } from '@/lib/games/neon-serpent/NeonSerpentGame';
import { generateNickname, sanitizeNickname } from '@/lib/leaderboard/nickname';
import { saveLocalRank, loadLocalRank } from '@/lib/leaderboard/storage';
import { fetchLeaderboard, submitScore } from '@/lib/leaderboard/supabase';
import type { GameResultPayload, LeaderboardEntry, LeaderboardSubmissionResponse } from '@/lib/leaderboard/types';

const GAME_ID = 'neon-serpent';

export default function NeonSerpentPage() {
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
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-pink uppercase tracking-wider">NEON ARCADE ORIGINAL</p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">NEON SERPENT</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            절차적으로 재구성되는 에너지 필드에서 네온 서펀트를 조종하세요. 에너지 오브를 모아 게이지를 충전하고,
            Shift 대시로 추적자보다 빠르게 움직이며 EMP 위험 구역을 피해 콤보를 이어가세요.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-4 md:p-6 lg:p-8">
          <GameCanvas
            GameClass={NeonSerpentGame}
            width={840}
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

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-green uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → ↑ ↓ : 이동</li>
              <li>Shift : 에너지 대시</li>
              <li>Space : 일시정지</li>
              <li>R : 시스템 재부팅</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>에너지 오브 수집으로 네온 게이지 충전</li>
              <li>콤보를 유지해 점수 배수를 확보</li>
              <li>EMP 위험 구역은 속도 저하 및 꼬리 손실</li>
              <li>게이지가 가득 차면 과부하를 관리</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">Field Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>필드 레이아웃은 주기적으로 재구성됩니다.</li>
              <li>대시는 에너지를 소모하지만 속도를 증가시킵니다.</li>
              <li>과부하 상태에서는 속도가 느려지니 주의하세요.</li>
              <li>60 FPS 캔버스 엔진 기반으로 동작합니다.</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
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
  if (!loading && entries.length === 0) {
    return null;
  }

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
