export type GameOutcome = 'victory' | 'defeat';

export interface GameCompletionPayload {
  gameId?: string; // Optional for backwards compatibility
  score: number;
  outcome: GameOutcome;
  timestamp: string;
  stats?: {
    timeElapsed?: number;
    killCount?: number;
    wave?: number;
    energy?: number;
    special?: Record<string, number>;
  };
}
