/**
 * Color Match Cascade Game Types
 * 컬러 매칭 퍼즐 게임 타입 정의
 */

export type BlockColor = 'pink' | 'cyan' | 'purple' | 'yellow';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  color: BlockColor | null;
  isMatched?: boolean;  // 매칭되어 제거될 예정인 셀
  isFalling?: boolean;  // 중력으로 떨어지는 중인 셀
}

export interface GameBoard {
  width: number;
  height: number;
  cells: Cell[][];
}

export interface FallingBlock {
  cells: [BlockColor, BlockColor];  // 2개의 색상 셀
  position: Position;  // 첫 번째 셀의 위치
  orientation: 'horizontal' | 'vertical';  // 가로(→) 또는 세로(↓)
}

export interface GameStats {
  score: number;
  level: number;
  blocksCleared: number;
  maxCombo: number;
  blocksPlaced: number;
}

export interface MatchGroup {
  positions: Position[];
  color: BlockColor;
}
