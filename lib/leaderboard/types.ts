import type { GameCompletionPayload, GameOutcome } from '@/lib/games/engine/types';

export type { GameOutcome };
export type GameResultPayload = GameCompletionPayload;

export interface LeaderboardEntry {
  id: string;
  gameId: string;
  nickname: string;
  score: number;
  createdAt: string;
}

export interface LeaderboardSubmissionPayload {
  gameId: string;
  nickname: string;
  score: number;
}

export interface LeaderboardSubmissionResponse {
  rank: number;
  nickname: string;
  score: number;
  submittedAt: string;
}

export interface LocalRankSnapshot {
  nickname: string;
  score: number;
  rank: number;
  updatedAt: string;
}
