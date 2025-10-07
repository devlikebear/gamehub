/**
 * Cascade Blocks - Type Definitions
 * 가변 필드 낙하 퍼즐 게임의 타입 정의
 */

/** 셀 좌표 */
export interface CellPosition {
  x: number;
  y: number;
}

/** 에너지 모듈(블록) 형태 */
export interface ModuleShape {
  id: string;
  name: string;
  cells: CellPosition[]; // 모듈을 구성하는 셀들의 상대 좌표
  color: string;
  rotations: CellPosition[][]; // 회전 상태별 셀 좌표
}

/** 활성 모듈 (현재 낙하 중인 블록) */
export interface ActiveModule {
  shape: ModuleShape;
  position: CellPosition; // 기준점(pivot) 위치
  rotationIndex: number; // 현재 회전 상태 (0-3)
}

/** 보드 셀 상태 */
export interface BoardCell {
  filled: boolean;
  color: string | null;
  energy: boolean; // 에너지 루프의 일부인지 여부
}

/** 게임 보드 */
export interface GameBoard {
  width: number; // 가로 셀 개수
  height: number; // 세로 셀 개수
  cells: BoardCell[][];
}

/** 라운드 설정 */
export interface RoundConfig {
  level: number;
  boardWidth: number;
  boardHeight: number;
  targetZones: CellPosition[]; // 목표 영역 (에너지 루프를 만들어야 하는 위치)
  colorPalette: string[]; // 이번 라운드의 색상 팔레트
  moduleSet: ModuleShape[]; // 사용 가능한 모듈 세트
}

/** 에너지 루프 */
export interface EnergyLoop {
  cells: CellPosition[]; // 루프를 구성하는 셀들
  size: number; // 루프의 크기 (셀 개수)
  color: string; // 루프의 색상
}

/** 게임 통계 */
export interface GameStats {
  score: number;
  level: number;
  linesCleared: number;
  loopsCompleted: number;
  modulesPlaced: number;
}
