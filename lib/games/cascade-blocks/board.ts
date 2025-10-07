/**
 * Cascade Blocks - Board Management
 * 게임 보드 생성 및 관리
 */

import { GameBoard, BoardCell, CellPosition, ActiveModule, RoundConfig } from './types';
import { getModuleSetForLevel } from './modules';
import { NEON_COLORS } from '../engine';

/**
 * 빈 보드 생성
 */
export function createEmptyBoard(width: number, height: number): GameBoard {
  const cells: BoardCell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: BoardCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        filled: false,
        color: null,
        energy: false,
      });
    }
    cells.push(row);
  }

  return { width, height, cells };
}

/**
 * 라운드 설정 생성
 */
export function generateRoundConfig(level: number): RoundConfig {
  // 레벨에 따라 보드 크기 변화 (12-18 폭, 16-24 높이)
  const baseWidth = 12;
  const baseHeight = 14;
  const widthIncrease = Math.min(Math.max(level - 1, 0) >> 1, 3) * 2; // 2칸 단위 확대
  const heightIncrease = Math.min(Math.max(level - 1, 0), 3) * 2;

  const boardWidth = baseWidth + widthIncrease;
  const boardHeight = baseHeight + heightIncrease;

  // 목표 영역 생성 (보드 중앙 부근)
  const targetZones: CellPosition[] = generateTargetZones(boardWidth, boardHeight, level);

  // 색상 팔레트 (라운드마다 다른 에너지 톤 적용)
  const colorPalettes = [
    [NEON_COLORS.CYAN, '#8d7bff', '#64ff9c'],
    [NEON_COLORS.PINK, '#ff8a5c', '#ffe66b'],
    [NEON_COLORS.PURPLE, '#00f0c8', '#f5c2ff'],
  ];
  const paletteIndex = (level - 1) % colorPalettes.length;

  return {
    level,
    boardWidth,
    boardHeight,
    targetZones,
    colorPalette: colorPalettes[paletteIndex],
    moduleSet: getModuleSetForLevel(level),
  };
}

/**
 * 목표 영역 생성 (에너지 루프를 만들어야 하는 위치)
 */
function generateTargetZones(width: number, height: number, level: number): CellPosition[] {
  const zones: CellPosition[] = [];
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const zoneCount = Math.min(3 + Math.floor(level / 2), 8);

  // 중앙 부근에 원형으로 목표 영역 배치
  for (let i = 0; i < zoneCount; i++) {
    const angle = (i / zoneCount) * Math.PI * 2;
    const radius = Math.min(width, height) / 4;
    const x = Math.round(centerX + Math.cos(angle) * radius);
    const y = Math.round(centerY + Math.sin(angle) * radius);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      zones.push({ x, y });
    }
  }

  return zones;
}

/**
 * 셀이 보드 범위 내인지 확인
 */
export function isInBounds(board: GameBoard, x: number, y: number): boolean {
  return x >= 0 && x < board.width && y >= 0 && y < board.height;
}

/**
 * 셀이 채워져 있는지 확인
 */
export function isCellFilled(board: GameBoard, x: number, y: number): boolean {
  if (!isInBounds(board, x, y)) return true;
  return board.cells[y][x].filled;
}

/**
 * 활성 모듈의 절대 좌표 계산
 */
export function getModuleCells(module: ActiveModule): CellPosition[] {
  const cells = module.shape.rotations[module.rotationIndex];
  return cells.map((cell) => ({
    x: module.position.x + cell.x,
    y: module.position.y + cell.y,
  }));
}

/**
 * 모듈이 유효한 위치인지 확인 (충돌 감지)
 */
export function isValidPosition(board: GameBoard, module: ActiveModule): boolean {
  const cells = getModuleCells(module);

  for (const cell of cells) {
    if (!isInBounds(board, cell.x, cell.y)) return false;
    if (isCellFilled(board, cell.x, cell.y)) return false;
  }

  return true;
}

/**
 * 모듈을 보드에 고정
 */
export function lockModule(board: GameBoard, module: ActiveModule): void {
  const cells = getModuleCells(module);

  for (const cell of cells) {
    if (isInBounds(board, cell.x, cell.y)) {
      board.cells[cell.y][cell.x] = {
        filled: true,
        color: module.shape.color,
        energy: false,
      };
    }
  }
}

/**
 * 완성된 라인 찾기
 */
export function findCompletedLines(board: GameBoard): number[] {
  const completedLines: number[] = [];

  for (let y = 0; y < board.height; y++) {
    let isComplete = true;
    for (let x = 0; x < board.width; x++) {
      if (!board.cells[y][x].filled) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completedLines.push(y);
    }
  }

  return completedLines;
}

/**
 * 라인 제거 및 위 블록 낙하
 */
export function clearLines(board: GameBoard, lines: number[]): void {
  // 아래에서 위로 정렬
  lines.sort((a, b) => b - a);

  for (const lineY of lines) {
    // 해당 라인 제거
    board.cells.splice(lineY, 1);
    // 맨 위에 빈 라인 추가
    const newRow: BoardCell[] = [];
    for (let x = 0; x < board.width; x++) {
      newRow.push({ filled: false, color: null, energy: false });
    }
    board.cells.unshift(newRow);
  }
}

/**
 * 모듈의 그림자 위치 계산 (낙하 예측)
 */
export function calculateGhostPosition(board: GameBoard, module: ActiveModule): CellPosition {
  let ghostY = module.position.y;

  while (
    isValidPosition(board, {
      ...module,
      position: { x: module.position.x, y: ghostY + 1 },
    })
  ) {
    ghostY++;
  }

  return { x: module.position.x, y: ghostY };
}
