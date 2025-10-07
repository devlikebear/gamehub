/**
 * Cascade Blocks - Energy Modules
 * 다각형 에너지 모듈 정의 (테트로미노 + 추가 형태)
 */

import { ModuleShape, CellPosition } from './types';

/**
 * 모듈 회전 계산
 * 시계방향 90도 회전: (x, y) -> (y, -x)
 */
function rotateShape(cells: CellPosition[]): CellPosition[] {
  return cells.map((cell) => ({
    x: -cell.y,
    y: cell.x,
  }));
}

/**
 * 모듈의 4가지 회전 상태 생성
 */
function generateRotations(baseCells: CellPosition[]): CellPosition[][] {
  const rotations: CellPosition[][] = [baseCells];
  let current = baseCells;

  for (let i = 0; i < 3; i++) {
    current = rotateShape(current);
    rotations.push(current);
  }

  return rotations;
}

/** 기본 모듈 세트 (레벨 1-3) */
export const BASIC_MODULES: ModuleShape[] = [
  // I 모듈 (4칸 일자)
  {
    id: 'I',
    name: 'Line',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    color: '#00f0ff', // 시안
    rotations: [],
  },
  // O 모듈 (2x2 정사각형)
  {
    id: 'O',
    name: 'Square',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#ffff00', // 노랑
    rotations: [],
  },
  // T 모듈 (T자)
  {
    id: 'T',
    name: 'T-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    color: '#ff10f0', // 핑크
    rotations: [],
  },
  // L 모듈 (L자)
  {
    id: 'L',
    name: 'L-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    color: '#00ff00', // 그린
    rotations: [],
  },
  // J 모듈 (역L자)
  {
    id: 'J',
    name: 'J-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
    ],
    color: '#9d00ff', // 보라
    rotations: [],
  },
  // S 모듈 (S자)
  {
    id: 'S',
    name: 'S-Shape',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
    ],
    color: '#ff6b35', // 오렌지
    rotations: [],
  },
  // Z 모듈 (Z자)
  {
    id: 'Z',
    name: 'Z-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#ff4d4d', // 레드
    rotations: [],
  },
];

/** 고급 모듈 세트 (레벨 4+) - 5칸 블록 */
export const ADVANCED_MODULES: ModuleShape[] = [
  // + 모듈 (십자가)
  {
    id: 'PLUS',
    name: 'Plus',
    cells: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ],
    color: '#00f0ff',
    rotations: [],
  },
  // U 모듈 (U자)
  {
    id: 'U',
    name: 'U-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ],
    color: '#ff10f0',
    rotations: [],
  },
  // W 모듈 (W자)
  {
    id: 'W',
    name: 'W-Shape',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    color: '#9d00ff',
    rotations: [],
  },
];

/**
 * 모듈 초기화 (회전 상태 생성)
 */
export function initializeModules(modules: ModuleShape[]): ModuleShape[] {
  return modules.map((module) => ({
    ...module,
    rotations: generateRotations(module.cells),
  }));
}

/**
 * 레벨에 따른 모듈 세트 반환
 */
export function getModuleSetForLevel(level: number): ModuleShape[] {
  const modules = level < 4 ? BASIC_MODULES : [...BASIC_MODULES, ...ADVANCED_MODULES];
  return initializeModules(modules);
}

/**
 * 랜덤 모듈 선택
 */
export function getRandomModule(moduleSet: ModuleShape[]): ModuleShape {
  const index = Math.floor(Math.random() * moduleSet.length);
  return moduleSet[index];
}
