'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PrismSmashGame } from '@/lib/games/prism-smash/PrismSmashGame';
import { generateNickname, sanitizeNickname } from '@/lib/leaderboard/nickname';
import { saveLocalRank, loadLocalRank } from '@/lib/leaderboard/storage';
import type { GameResultPayload, LeaderboardEntry, LeaderboardSubmissionResponse } from '@/lib/leaderboard/types';

const GAME_ID = 'prism-smash';

export default function PrismSmashPage() {
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
        const response = await fetch(`/api/leaderboard?gameId=${GAME_ID}&limit=5`);
        if (!response.ok) return;
        const data = (await response.json()) as { entries: LeaderboardEntry[] };
        if (active) setRecentEntries(data.entries?.slice(0, 5) ?? []);
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
          <p className="pixel-text text-xs text-bright-cyan">NEON ARC-LABS · FIELD DECONSTRUCTION</p>
          <h1 className="pixel-text text-5xl md:text-6xl text-bright neon-text">PRISM SMASH</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            모듈형 프리즘 벽체를 해체하며 네온 에너지를 회수하세요. Space 키로 전경/후경 필드를 즉시
            전환해 숨겨진 라우트를 드러내고, 커브샷과 스왑 타이밍을 조합해 콤보를 이어가며 고득점을 노리세요.
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
            <h2 className="pixel-text text-sm text-bright-green">CONTROLS</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>←/→ : 패들 이동</li>
              <li>Shift : 이동 가속</li>
              <li>Space : 전경/후경 필드 스왑</li>
              <li>Enter : 라운드 시작/재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-pink">OBJECTIVES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>프리즘 블록을 파괴해 에너지 점수를 획득하세요.</li>
              <li>스왑 타이밍으로 숨겨진 구간을 열고 콤보를 유지하세요.</li>
              <li>프리즘 블록은 조각으로 분열되어 추가 콤보 기회를 제공합니다.</li>
              <li>모든 레이어를 정리하면 다음 스테이지로 진입합니다.</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-yellow">FIELD NOTES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>네온 필드의 속도 존은 공의 궤도를 증폭하거나 완화합니다.</li>
              <li>콤보가 높을수록 점수 배율이 상승하며 HUD에 표시됩니다.</li>
              <li>필드 스왑은 쿨다운이 있으니 타이밍을 계산하세요.</li>
              <li>라이프가 모두 소진되면 시스템이 리셋됩니다.</li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/games"
            className="inline-block px-6 py-3 border-2 border-bright-cyan text-bright-cyan pixel-text text-xs rounded hover:bg-bright-cyan hover:text-black transition-all"
          >
            BACK TO ARCADE LIST
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
        <h2 className="pixel-text text-xs text-bright">TOP DECONSTRUCTORS (최근 5위)</h2>
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
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          nickname,
          score: result.score,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      const data = (await response.json()) as {
        result: LeaderboardSubmissionResponse;
        leaderboard?: LeaderboardEntry[];
      };
      onSubmitted(data.result, data.leaderboard);
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
          <h2 className="pixel-text text-2xl text-bright">{result.outcome === 'victory' ? 'FIELD CLEARED!' : 'SYSTEM RESET'}</h2>
          <p className="text-bright text-sm">이번 라운드 점수: {result.score.toLocaleString()} pts</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-left text-bright text-xs">
            Operator Nickname
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
