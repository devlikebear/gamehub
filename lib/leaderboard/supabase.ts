import type { LeaderboardEntry, LeaderboardSubmissionPayload, LeaderboardSubmissionResponse } from './types';

/**
 * Supabase Edge Function 클라이언트
 * Edge Function URL로 리더보드 요청을 전송합니다.
 */

function getEdgeFunctionUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  // Edge Function URL format: https://<project-ref>.supabase.co/functions/v1/<function-name>
  return `${supabaseUrl}/functions/v1/submit-score`;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  return key;
}

/**
 * 리더보드 조회 (GET)
 */
export async function fetchLeaderboard(gameId: string, limit = 100): Promise<LeaderboardEntry[]> {
  const url = `${getEdgeFunctionUrl()}?gameId=${encodeURIComponent(gameId)}&limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAnonKey()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  const data = await response.json();

  // Edge Function response format: { entries: [...] }
  const entries = data.entries as Array<{
    id: string;
    game_id: string;
    nickname: string;
    score: number;
    created_at: string;
  }>;

  return entries.map((entry) => ({
    id: entry.id,
    gameId: entry.game_id,
    nickname: entry.nickname,
    score: entry.score,
    createdAt: entry.created_at,
  }));
}

/**
 * 점수 제출 (POST)
 */
export async function submitScore(payload: LeaderboardSubmissionPayload): Promise<LeaderboardSubmissionResponse> {
  const url = getEdgeFunctionUrl();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAnonKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to submit score: ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  // Edge Function response format: { result: {...}, leaderboard: [...] }
  const result = data.result as {
    id: string;
    game_id: string;
    nickname: string;
    score: number;
    created_at: string;
  };

  const leaderboard = data.leaderboard as Array<{
    id: string;
    game_id: string;
    nickname: string;
    score: number;
    created_at: string;
  }>;

  // Calculate rank from leaderboard position
  const rank = leaderboard.findIndex((entry) => entry.id === result.id) + 1;

  return {
    rank: rank > 0 ? rank : leaderboard.length + 1,
    nickname: result.nickname,
    score: result.score,
    submittedAt: result.created_at,
  };
}
