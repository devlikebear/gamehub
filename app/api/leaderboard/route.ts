import { NextResponse, type NextRequest } from 'next/server';
import { sanitizeNickname } from '@/lib/leaderboard/nickname';
import { fetchLeaderboard, submitScore } from '@/lib/leaderboard/supabase';
import type { LeaderboardSubmissionPayload } from '@/lib/leaderboard/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');
  if (!gameId) {
    return NextResponse.json({ error: 'Missing gameId parameter' }, { status: 400 });
  }

  try {
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Number(limitParam) || 100, 100) : 100;
    const leaderboard = await fetchLeaderboard(gameId, limit);
    return NextResponse.json({ entries: leaderboard });
  } catch (error) {
    console.error('Failed to fetch leaderboard', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let payload: LeaderboardSubmissionPayload;

  try {
    payload = await request.json();
  } catch (error) {
    console.error('Failed to parse leaderboard payload', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!payload || typeof payload.gameId !== 'string' || typeof payload.score !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (payload.score < 0) {
    return NextResponse.json({ error: 'Score must be non-negative' }, { status: 400 });
  }

  payload.nickname = sanitizeNickname(payload.nickname ?? '');

  try {
    const result = await submitScore(payload);
    const leaderboard = await fetchLeaderboard(payload.gameId);
    return NextResponse.json({ result, leaderboard });
  } catch (error) {
    console.error('Failed to submit leaderboard score', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
