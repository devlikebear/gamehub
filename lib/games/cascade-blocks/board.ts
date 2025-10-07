/**
 * Color Match Cascade - Board Management
 * 보드 생성 및 매칭 로직
 */

import { GameBoard, Cell, Position, FallingBlock, BlockColor, MatchGroup } from './types';
import { NEON_COLORS } from '../engine';

const COLORS: BlockColor[] = ['pink', 'cyan', 'purple', 'yellow'];

const COLOR_MAP: Record<BlockColor, string> = {
  pink: NEON_COLORS.PINK,
  cyan: NEON_COLORS.CYAN,
  purple: NEON_COLORS.PURPLE,
  yellow: NEON_COLORS.YELLOW,
};

export function getColorHex(color: BlockColor): string {
  return COLOR_MAP[color];
}

/**
 * 빈 보드 생성
 */
export function createEmptyBoard(width: number, height: number): GameBoard {
  const cells: Cell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ color: null });
    }
    cells.push(row);
  }

  return { width, height, cells };
}

/**
 * 랜덤 색상 블록 생성
 */
export function createRandomBlock(): FallingBlock {
  return {
    cells: [
      COLORS[Math.floor(Math.random() * COLORS.length)],
      COLORS[Math.floor(Math.random() * COLORS.length)],
    ],
    position: { x: 4, y: 0 },
    orientation: 'vertical',
  };
}

/**
 * 블록이 차지하는 셀 위치 반환
 */
export function getBlockCells(block: FallingBlock): Position[] {
  const { position, orientation } = block;

  if (orientation === 'vertical') {
    return [
      position,
      { x: position.x, y: position.y + 1 },
    ];
  } else {
    return [
      position,
      { x: position.x + 1, y: position.y },
    ];
  }
}

/**
 * 블록이 유효한 위치인지 확인
 */
export function isValidPosition(board: GameBoard, block: FallingBlock): boolean {
  const cells = getBlockCells(block);

  for (const cell of cells) {
    if (cell.x < 0 || cell.x >= board.width || cell.y >= board.height) {
      return false;
    }
    if (cell.y >= 0 && board.cells[cell.y][cell.x].color !== null) {
      return false;
    }
  }

  return true;
}

/**
 * 블록을 보드에 고정
 */
export function lockBlock(board: GameBoard, block: FallingBlock): void {
  const cells = getBlockCells(block);

  cells.forEach((pos, index) => {
    if (pos.y >= 0 && pos.y < board.height && pos.x >= 0 && pos.x < board.width) {
      board.cells[pos.y][pos.x].color = block.cells[index];
    }
  });
}

/**
 * BFS로 연결된 같은 색 블록 찾기
 */
export function findConnectedBlocks(
  board: GameBoard,
  startX: number,
  startY: number,
  color: BlockColor
): Position[] {
  const visited = new Set<string>();
  const queue: Position[] = [{ x: startX, y: startY }];
  const connected: Position[] = [];

  while (queue.length > 0) {
    const pos = queue.shift()!;
    const key = `${pos.x},${pos.y}`;

    if (visited.has(key)) continue;
    if (pos.x < 0 || pos.x >= board.width || pos.y < 0 || pos.y >= board.height) continue;
    if (board.cells[pos.y][pos.x].color !== color) continue;

    visited.add(key);
    connected.push(pos);

    // 상하좌우 탐색
    queue.push({ x: pos.x + 1, y: pos.y });
    queue.push({ x: pos.x - 1, y: pos.y });
    queue.push({ x: pos.x, y: pos.y + 1 });
    queue.push({ x: pos.x, y: pos.y - 1 });
  }

  return connected;
}

/**
 * 모든 매칭 그룹 찾기 (3개 이상 연결)
 */
export function findAllMatches(board: GameBoard): MatchGroup[] {
  const visited = new Set<string>();
  const matches: MatchGroup[] = [];

  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const key = `${x},${y}`;
      if (visited.has(key)) continue;

      const color = board.cells[y][x].color;
      if (!color) continue;

      const connected = findConnectedBlocks(board, x, y, color);

      // 3개 이상 연결되어 있으면 매칭
      if (connected.length >= 3) {
        matches.push({ positions: connected, color });
        connected.forEach(pos => visited.add(`${pos.x},${pos.y}`));
      } else {
        connected.forEach(pos => visited.add(`${pos.x},${pos.y}`));
      }
    }
  }

  return matches;
}

/**
 * 매칭된 블록 제거
 */
export function removeMatches(board: GameBoard, matches: MatchGroup[]): number {
  let totalRemoved = 0;

  for (const match of matches) {
    for (const pos of match.positions) {
      board.cells[pos.y][pos.x].color = null;
      totalRemoved++;
    }
  }

  return totalRemoved;
}

/**
 * 중력 적용 (빈 공간 채우기)
 */
export function applyGravity(board: GameBoard): boolean {
  let hasFallen = false;

  // 아래에서 위로 스캔
  for (let x = 0; x < board.width; x++) {
    let writeY = board.height - 1;

    for (let readY = board.height - 1; readY >= 0; readY--) {
      if (board.cells[readY][x].color !== null) {
        if (writeY !== readY) {
          board.cells[writeY][x].color = board.cells[readY][x].color;
          board.cells[readY][x].color = null;
          hasFallen = true;
        }
        writeY--;
      }
    }
  }

  return hasFallen;
}

/**
 * 그림자(고스트) 위치 계산
 */
export function calculateGhostPosition(board: GameBoard, block: FallingBlock): Position {
  const ghostBlock = { ...block, position: { ...block.position } };

  while (isValidPosition(board, ghostBlock)) {
    ghostBlock.position.y++;
  }

  ghostBlock.position.y--;
  return ghostBlock.position;
}
