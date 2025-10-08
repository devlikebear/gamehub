// Supabase Edge Function for leaderboard submission
import { createClient } from 'jsr:@supabase/supabase-js@2';

// Types
interface LeaderboardSubmissionPayload {
  gameId: string;
  score: number;
  nickname?: string;
  outcome?: 'victory' | 'defeat';
  timestamp?: string;
}

interface GameLimits {
  maxScore: number;
  minPlayTime: number;
}

// Game score validation limits
const GAME_LIMITS: Record<string, GameLimits> = {
  'stellar-salvo': { maxScore: 1000000, minPlayTime: 10000 },
  'photon-vanguard': { maxScore: 500000, minPlayTime: 15000 },
  'spectral-pursuit': { maxScore: 50000, minPlayTime: 20000 },
  'starshard-drift': { maxScore: 100000, minPlayTime: 15000 },
  'cascade-blocks': { maxScore: 500000, minPlayTime: 30000 },
  'neon-serpent': { maxScore: 200000, minPlayTime: 10000 },
  'pulse-paddles': { maxScore: 70, minPlayTime: 20000 },
  'prism-smash': { maxScore: 300000, minPlayTime: 20000 },
};

// Rate limiting (in-memory, per-instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 5, // 5 requests per minute
};

function checkRateLimit(ip: string, gameId: string): boolean {
  const key = `${ip}:${gameId}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_CONFIG.windowMs });
    return true;
  }

  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

function validateScore(gameId: string, score: number): boolean {
  const limits = GAME_LIMITS[gameId];
  if (!limits) return false;
  return score >= 0 && score <= limits.maxScore;
}

function sanitizeNickname(nickname: string): string {
  return nickname.trim().slice(0, 20) || 'Anonymous';
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // GET: Fetch leaderboard
  if (req.method === 'GET') {
    const gameId = url.searchParams.get('gameId');
    if (!gameId) {
      return new Response(
        JSON.stringify({ error: 'Missing gameId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const limitParam = url.searchParams.get('limit');
      const limit = limitParam ? Math.min(Number(limitParam) || 100, 100) : 100;

      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('game_id', gameId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({ entries: data || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch leaderboard' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST: Submit score
  if (req.method === 'POST') {
    // 1. Origin/Referer validation
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');

    const ALLOWED_ORIGINS = [
      Deno.env.get('NEXT_PUBLIC_SITE_URL'),
      'http://localhost:3000',
      'http://localhost:3001',
    ].filter(Boolean);

    if (origin && !ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed!))) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse payload
    let payload: LeaderboardSubmissionPayload;
    try {
      payload = await req.json();
    } catch (error) {
      console.error('Failed to parse payload', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!payload || typeof payload.gameId !== 'string' || typeof payload.score !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Score validation
    if (!validateScore(payload.gameId, payload.score)) {
      console.warn(`Invalid score ${payload.score} for game ${payload.gameId}`);
      return new Response(
        JSON.stringify({ error: 'Invalid score' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               'unknown';

    if (!checkRateLimit(ip, payload.gameId)) {
      console.warn(`Rate limit exceeded for IP ${ip} on game ${payload.gameId}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Sanitize nickname
    payload.nickname = sanitizeNickname(payload.nickname ?? '');

    // 6. Submit score to Supabase
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: result, error: insertError } = await supabase
        .from('leaderboard_entries')
        .insert({
          game_id: payload.gameId,
          nickname: payload.nickname,
          score: payload.score,
          outcome: payload.outcome,
          created_at: payload.timestamp || new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Fetch updated leaderboard
      const { data: leaderboard, error: fetchError } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('game_id', payload.gameId)
        .order('score', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      return new Response(
        JSON.stringify({ result, leaderboard: leaderboard || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Failed to submit score', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit score' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Method not allowed
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
