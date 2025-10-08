/**
 * Cascade Blocks - Energy Modules
 * 네온 에너지 모듈 정의 (테트로미노와 다른 독창적 형태)
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

/**
 * 모듈 초기화 (회전 상태 생성)
 */
function initializeModules(modules: Omit<ModuleShape, 'rotations'>[]): ModuleShape[] {
  return modules.map((module) => ({
    ...module,
    rotations: generateRotations(module.cells),
  }));
}

const FOUNDATION_MODULES = initializeModules([
  {
    id: 'COLUMN',
    name: 'Column',
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ],
    color: '#00d5ff',
  },
  {
    id: 'SLAB',
    name: 'Slab',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    color: '#ffe66b',
  },
  {
    id: 'ANGLE',
    name: 'Angle',
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    color: '#8d7bff',
  },
  {
    id: 'BRIDGE',
    name: 'Bridge',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#64ff9c',
  },
]);

const CORE_MODULES = initializeModules([
  {
    id: 'SPIRE',
    name: 'Spire',
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: -1, y: 1 },
    ],
    color: '#00d5ff',
  },
  {
    id: 'GLYPH',
    name: 'Glyph',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    color: '#ff6bf3',
  },
  {
    id: 'PRISM',
    name: 'Prism',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: 0, y: 2 },
    ],
    color: '#ffe66b',
  },
  {
    id: 'WAVE',
    name: 'Wave',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    color: '#8d7bff',
  },
  {
    id: 'TORCH',
    name: 'Torch',
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
    ],
    color: '#64ff9c',
  },
]);

const EXPANDED_MODULES = initializeModules([
  {
    id: 'NEXUS',
    name: 'Nexus',
    cells: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#ff8a5c',
  },
  {
    id: 'ARC',
    name: 'Arc',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#3ac6ff',
  },
  {
    id: 'HALO',
    name: 'Halo',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    color: '#f5c2ff',
  },
]);

const ASCENDANT_MODULES = initializeModules([
  {
    id: 'ORBIT',
    name: 'Orbit',
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: -1, y: 2 },
    ],
    color: '#00f0c8',
  },
  {
    id: 'SINGULAR',
    name: 'Singular',
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    color: '#ffa64d',
  },
]);

/**
 * 레벨에 따른 모듈 세트 반환
 */
export function getModuleSetForLevel(level: number): ModuleShape[] {
  if (level < 2) {
    return FOUNDATION_MODULES;
  }

  if (level < 4) {
    return [...FOUNDATION_MODULES, ...CORE_MODULES];
  }

  if (level < 5) {
    return [...FOUNDATION_MODULES, ...CORE_MODULES, ...EXPANDED_MODULES];
  }

  return [...FOUNDATION_MODULES, ...CORE_MODULES, ...EXPANDED_MODULES, ...ASCENDANT_MODULES];
}

/**
 * 랜덤 모듈 선택
 */
export function getRandomModule(moduleSet: ModuleShape[]): ModuleShape {
  const index = Math.floor(Math.random() * moduleSet.length);
  return moduleSet[index];
}
