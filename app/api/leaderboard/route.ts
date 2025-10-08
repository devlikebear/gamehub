import { NextResponse, type NextRequest } from 'next/server';
import { sanitizeNickname } from '@/lib/leaderboard/nickname';
import { fetchLeaderboard, submitScore } from '@/lib/leaderboard/supabase';
import { validateScore } from '@/lib/leaderboard/validation';
import { checkRateLimit } from '@/lib/leaderboard/rate-limiter';
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
  // 1. Origin/Referer 검증
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const ALLOWED_ORIGINS = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  if (origin && !ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed!))) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (referer && !ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed!))) {
    console.warn(`Blocked request from unauthorized referer: ${referer}`);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Payload 파싱
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

  // 3. 점수 범위 검증
  if (!validateScore(payload.gameId, payload.score)) {
    console.warn(`Invalid score ${payload.score} for game ${payload.gameId}`);
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  // 4. Rate Limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  if (!checkRateLimit(ip, payload.gameId)) {
    console.warn(`Rate limit exceeded for IP ${ip} on game ${payload.gameId}`);
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  // 5. 닉네임 검증
  payload.nickname = sanitizeNickname(payload.nickname ?? '');

  // 6. 점수 저장
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
