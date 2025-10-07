const BASE_RADIUS = 220;
const RADIUS_STEP = 58;
const BASE_ANGULAR_SPEED = 0.92; // radians per second for the innermost lane
const ANGULAR_STEP = 0.08;
const BASE_SPAWN_INTERVAL = 1800;
const SPAWN_INTERVAL_STEP = 160;
const ROUND_INTERVAL_ACCEL = 70;
const MIN_SPAWN_INTERVAL = 900;
const MIN_ELLIPSE_RATIO = 0.75;

export interface OrbitLaneState {
  id: string;
  radius: number;
  angularSpeed: number;
  spawnInterval: number;
  ellipseRatio: number;
  spawnProgress: number;
  direction: 1 | -1;
}

export interface OrbitState {
  round: number;
  lanes: OrbitLaneState[];
}

export interface StepOrbitOptions {
  timeScale: number;
}

export interface StepOrbitResult {
  ready: OrbitLaneState[];
}

export function createOrbitState(params: { round: number }): OrbitState {
  const round = Math.max(1, Math.floor(params.round));
  const laneCount = Math.min(5, 1 + round); // round 1 => 2 lanes

  const lanes: OrbitLaneState[] = Array.from({ length: laneCount }, (_, index) => {
    const radius = BASE_RADIUS + index * RADIUS_STEP;
    const angularSpeed = Math.max(0.35, BASE_ANGULAR_SPEED - index * ANGULAR_STEP + round * 0.03);
    const intervalReduction = index * SPAWN_INTERVAL_STEP + (round - 1) * ROUND_INTERVAL_ACCEL;
    const spawnInterval = Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL - intervalReduction);
    const ellipseRatio = clamp(
      MIN_ELLIPSE_RATIO,
      1,
      index % 2 === 0 ? 1 : 0.82 - index * 0.04
    );
    const direction: 1 | -1 = index % 2 === 0 ? 1 : -1;

    return {
      id: `orbit-${index}`,
      radius,
      angularSpeed,
      spawnInterval,
      ellipseRatio,
      spawnProgress: 0,
      direction,
    };
  });

  return {
    round,
    lanes,
  };
}

export function computeOrbitPosition(lane: OrbitLaneState, angle: number): { x: number; y: number } {
  const x = Math.cos(angle) * lane.radius;
  const y = Math.sin(angle) * lane.radius * lane.ellipseRatio;
  return { x, y };
}

export function stepOrbitState(state: OrbitState, deltaMs: number, options: StepOrbitOptions): StepOrbitResult {
  const clampedScale = Math.max(0, options.timeScale);
  const effectiveDelta = deltaMs * clampedScale;
  const ready: OrbitLaneState[] = [];

  if (effectiveDelta <= 0) {
    return { ready };
  }

  for (const lane of state.lanes) {
    lane.spawnProgress += effectiveDelta;

    if (lane.spawnProgress >= lane.spawnInterval) {
      while (lane.spawnProgress >= lane.spawnInterval) {
        lane.spawnProgress -= lane.spawnInterval;
        ready.push(lane);
      }
    }
  }

  return { ready };
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
