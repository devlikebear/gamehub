export interface SpeedZone {
  /** 시작 지점 (0~1 비율) */
  start: number;
  /** 종료 지점 (0~1 비율) */
  end: number;
  /** 속도 배율 (1이 기본) */
  multiplier: number;
  /** UI 표시용 라벨 */
  label: string;
  /** 네온 컬러 */
  color: string;
}

export interface ArenaPattern {
  name: string;
  description: string;
  zones: SpeedZone[];
}

const PATTERN_POOL: ArenaPattern[] = [
  {
    name: '듀얼 펄스',
    description: '중앙의 쌍둥이 펄스가 공의 속도를 가속시킵니다.',
    zones: [
      { start: 0.35, end: 0.45, multiplier: 1.25, label: 'PULSE', color: '#ff10f0' },
      { start: 0.55, end: 0.65, multiplier: 1.25, label: 'PULSE', color: '#ff10f0' },
    ],
  },
  {
    name: '브레이크 라이너',
    description: '골대 앞 감속 존이 생겨 정밀한 컨트롤이 필요합니다.',
    zones: [
      { start: 0.05, end: 0.13, multiplier: 0.8, label: 'DRIFT', color: '#00f0ff' },
      { start: 0.87, end: 0.95, multiplier: 0.8, label: 'DRIFT', color: '#00f0ff' },
    ],
  },
  {
    name: '스파이럴 플럭스',
    description: '중앙 와류가 곡선을 강화시킵니다.',
    zones: [
      { start: 0.48, end: 0.52, multiplier: 1.4, label: 'FLUX', color: '#ffd966' },
    ],
  },
  {
    name: '네온 코리더',
    description: '길게 이어진 네온 복도가 속도를 유지해줍니다.',
    zones: [
      { start: 0.25, end: 0.4, multiplier: 1.1, label: 'FLOW', color: '#9d00ff' },
      { start: 0.6, end: 0.75, multiplier: 1.1, label: 'FLOW', color: '#9d00ff' },
    ],
  },
];

export function pickRandomPattern(rng: () => number = Math.random): ArenaPattern {
  const index = Math.floor(rng() * PATTERN_POOL.length);
  return PATTERN_POOL[index] ?? PATTERN_POOL[0];
}
