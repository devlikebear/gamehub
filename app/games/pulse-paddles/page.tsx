'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PulsePaddlesGame } from '@/lib/games/pulse-paddles/PulsePaddlesGame';
import { generateNickname, sanitizeNickname } from '@/lib/leaderboard/nickname';
import { saveLocalRank, loadLocalRank } from '@/lib/leaderboard/storage';
import type { GameResultPayload, LeaderboardEntry, LeaderboardSubmissionResponse } from '@/lib/leaderboard/types';

const GAME_ID = 'pulse-paddles';

export default function PulsePaddlesPage() {
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
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-pink uppercase tracking-wider">NEON ARC-LABS · ARENA DUEL</p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">PULSE PADDLES</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            에너지 볼의 궤도를 조작해 네온 골존을 공략하세요. Space/Shift로 곡선을 충전하고, 득점할 때마다
            재구성되는 필드 패턴을 읽어 우위를 확보하세요. 1 키로 AI 모드, 2 키로 로컬 2P를 전환할 수 있습니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-pink rounded-xl shadow-neon-pink p-4 md:p-6 lg:p-8">
          <GameCanvas
            GameClass={PulsePaddlesGame}
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

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-green uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>←/→ 방향키: 패들 이동</li>
              <li>Space 또는 Shift: 커브샷/스핀 충전</li>
              <li>W/S + F: 2P 모드에서 오른쪽 패들</li>
              <li>1: AI 모드 · 2: 로컬 2P · Enter: 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>커브샷으로 에너지 볼 궤도를 제어하세요.</li>
              <li>네온 존에서 속도가 바뀌니 타이밍을 조정하세요.</li>
              <li>득점마다 필드 패턴이 바뀌어 새로운 각도를 제공합니다.</li>
              <li>7점 선취로 매치를 승리하세요.</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-purple/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-purple uppercase">Arena Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>펄스 존은 공 속도를 가속하거나 감속시킵니다.</li>
              <li>콤보 글로우가 강할수록 스코어가 뜨겁습니다.</li>
              <li>AI 난이도는 점수 차이에 따라 적응합니다.</li>
              <li>네온 HUD에서 필드 시프트 메시지를 확인하세요.</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-pink text-bright-pink pixel-text text-xs rounded-lg hover:bg-bright-pink hover:text-black transition-all duration-300 shadow-neon-pink hover:shadow-none"
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
    <section className="bg-black/50 border border-bright-pink/60 rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="pixel-text text-xs text-bright">TOP DUELISTS (최근 5위)</h2>
        <Link href="/leaderboard" className="pixel-text text-xs text-bright-pink hover:underline">
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
      <div className="w-full max-w-md bg-black/80 border border-bright-pink/60 rounded-xl shadow-neon-pink p-6 space-y-4">
        <div className="space-y-2 text-center">
          <p className="pixel-text text-xs text-bright-pink uppercase">Submit Score</p>
          <h2 className="pixel-text text-2xl text-bright">{result.outcome === 'victory' ? 'MATCH WON!' : 'MATCH LOST'}</h2>
          <p className="text-bright text-sm">이번 라운드 점수: {result.score.toLocaleString()} pts</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-left text-bright text-xs">
            Duelist Nickname
            <input
              value={nickname}
              onChange={(event) => setNickname(sanitizeNickname(event.target.value))}
              className="mt-1 w-full rounded border border-bright-pink/50 bg-black/60 px-3 py-2 text-bright focus:outline-none focus:ring-2 focus:ring-bright-pink"
              maxLength={18}
              required
            />
          </label>
          <button
            type="button"
            className="pixel-text text-xs px-4 py-2 border border-bright-pink text-bright rounded hover:bg-bright-pink/20"
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
              className="pixel-text text-xs px-4 py-2 border-2 border-bright-pink text-bright rounded hover:bg-bright-pink hover:text-black transition-all duration-300 shadow-neon-pink hover:shadow-none disabled:opacity-60"
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
