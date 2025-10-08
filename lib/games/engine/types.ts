export type GameOutcome = 'victory' | 'defeat';

export interface GameCompletionPayload {
  gameId: string;
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
