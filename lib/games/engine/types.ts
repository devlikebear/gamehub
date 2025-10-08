export type GameOutcome = 'victory' | 'defeat';

export interface GameCompletionPayload {
  gameId: string;
  score: number;
  outcome: GameOutcome;
  timestamp: string;
}
