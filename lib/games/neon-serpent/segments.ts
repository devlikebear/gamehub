export interface GridPosition {
  x: number;
  y: number;
}

export interface SerpentSegment extends GridPosition {
  /**
   * age는 세그먼트가 머리에서 얼마나 떨어져 있는지 나타내며
   * 화면 연출(글로우 등)에 활용됩니다.
   */
  age: number;
}

export function createInitialSerpent(start: GridPosition, length: number): SerpentSegment[] {
  const segments: SerpentSegment[] = [];

  for (let i = 0; i < length; i += 1) {
    segments.push({
      x: start.x - i,
      y: start.y,
      age: i,
    });
  }

  return segments;
}

export function updateSegmentAges(segments: SerpentSegment[]): void {
  for (let i = 0; i < segments.length; i += 1) {
    segments[i].age = i;
  }
}
