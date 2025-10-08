import type { LeaderboardEntry, LeaderboardSubmissionPayload, LeaderboardSubmissionResponse } from './types';

const TABLE_NAME = 'leaderboard_entries';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getSupabaseUrl(): string {
  return getEnv('NEXT_PUBLIC_SUPABASE_URL');
}

function getAnonKey(): string {
  return getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

function getServiceKey(): string {
  return getEnv('SUPABASE_SERVICE_ROLE_KEY');
}

async function supabaseFetch(path: string, init: RequestInit = {}, useServiceKey = false): Promise<Response> {
  const url = `${getSupabaseUrl()}${path}`;
  const headers = new Headers(init.headers);
  const key = useServiceKey ? getServiceKey() : getAnonKey();
  headers.set('apikey', key);
  headers.set('Authorization', `Bearer ${key}`);
  if (!headers.has('Content-Type') && init.method && init.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...init, headers });
}

export async function fetchLeaderboard(gameId: string, limit = 100): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({
    select: 'id,game_id,nickname,score,created_at',
    'game_id': `eq.${gameId}`,
  });
  params.append('order', 'score.desc');
  params.append('order', 'created_at.asc');
  params.append('limit', String(limit));

  const response = await supabaseFetch(`/rest/v1/${TABLE_NAME}?${params.toString()}`, {
    headers: {
      Prefer: 'count=exact',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  const data = (await response.json()) as Array<{
    id: string;
    game_id: string;
    nickname: string;
    score: number;
    created_at: string;
  }>;

  return data.map((entry) => ({
    id: entry.id,
    gameId: entry.game_id,
    nickname: entry.nickname,
    score: entry.score,
    createdAt: entry.created_at,
  }));
}

export async function submitScore(payload: LeaderboardSubmissionPayload): Promise<LeaderboardSubmissionResponse> {
  const insertResponse = await supabaseFetch(`/rest/v1/${TABLE_NAME}`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        game_id: payload.gameId,
        nickname: payload.nickname,
        score: payload.score,
      },
    ]),
  }, true);

  if (!insertResponse.ok) {
    const detail = await safeJson(insertResponse);
    throw new Error(`Failed to submit score: ${insertResponse.statusText} ${detail ? JSON.stringify(detail) : ''}`);
  }

  const [inserted] = (await insertResponse.json()) as Array<{
    id: string;
    created_at: string;
    score: number;
  }>;

  await trimLeaderboard(payload.gameId);

  const rank = await fetchRank(payload.gameId, payload.score, inserted.created_at);

  return {
    rank,
    nickname: payload.nickname,
    score: payload.score,
    submittedAt: inserted.created_at,
  };
}

async function fetchRank(gameId: string, score: number, createdAt: string): Promise<number> {
  const query = new URLSearchParams({
    select: 'id',
    'game_id': `eq.${gameId}`,
    'score': `gt.${score}`,
  });
  const responseGreater = await supabaseFetch(`/rest/v1/${TABLE_NAME}?${query.toString()}`, {
    headers: {
      Prefer: 'count=exact',
    },
  }, true);
  const countGreater = parseCount(responseGreater.headers.get('content-range'));

  // handle ties by counting equal scores with earlier creation time
  const tieQuery = new URLSearchParams({
    select: 'id',
    'game_id': `eq.${gameId}`,
    'score': `eq.${score}`,
    'created_at': `lt.${createdAt}`,
  });
  const responseEqual = await supabaseFetch(`/rest/v1/${TABLE_NAME}?${tieQuery.toString()}`, {
    headers: {
      Prefer: 'count=exact',
    },
  }, true);
  const countEqualBefore = parseCount(responseEqual.headers.get('content-range'));

  return countGreater + countEqualBefore + 1;
}

async function trimLeaderboard(gameId: string): Promise<void> {
  const params = new URLSearchParams({
    select: 'id',
    'game_id': `eq.${gameId}`,
    order: 'score.desc',
  });
  params.append('order', 'created_at.asc');
  params.append('limit', '100');
  params.append('offset', '100');

  const response = await supabaseFetch(`/rest/v1/${TABLE_NAME}?${params.toString()}`, {}, true);
  if (!response.ok) return;
  const extra = (await response.json()) as Array<{ id: string }>;
  if (extra.length === 0) return;

  const ids = extra.map((entry) => `"${entry.id}"`).join(',');
  await supabaseFetch(`/rest/v1/${TABLE_NAME}?id=in.(${ids})`, { method: 'DELETE' }, true);
}

function parseCount(contentRange: string | null): number {
  if (!contentRange) return 0;
  const parts = contentRange.split('/');
  if (parts.length !== 2) return 0;
  const total = Number(parts[1]);
  return Number.isFinite(total) ? total : 0;
}

async function safeJson(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
