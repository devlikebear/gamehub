import type { CellCoordinate } from './labyrinth';

export enum HunterArchetype {
  Stalker = 'stalker',
  Seeker = 'seeker',
  Warden = 'warden',
}

export interface HunterState {
  id: string;
  archetype: HunterArchetype;
  position: CellCoordinate;
  path: CellCoordinate[];
  pathIndex: number;
  awareness: number;
  patrolRadius: number;
  detectionRadius: number;
  speed: number;
  awarenessRate: number;
  awarenessDecay: number;
}

export interface CreateHunterParams {
  id: string;
  archetype: HunterArchetype;
  path: CellCoordinate[];
}

export interface StepHunterOptions {
  timeScale: number;
  target: CellCoordinate;
}

export interface AwarenessUpdateInput {
  playerPosition: CellCoordinate;
  threatLevel: number;
  deltaTime: number;
}

export function createHunter(_params: CreateHunterParams): HunterState {
  const config = HUNTER_ARCHETYPES[_params.archetype];
  const path = _params.path.length > 0 ? _params.path : [{ x: 0, y: 0 }];

  return {
    id: _params.id,
    archetype: _params.archetype,
    position: { ...path[0] },
    path,
    pathIndex: 0,
    awareness: 0,
    patrolRadius: config.patrolRadius,
    detectionRadius: config.detectionRadius,
    speed: config.speed,
    awarenessRate: config.awarenessRate,
    awarenessDecay: config.awarenessDecay,
  };
}

export function stepHunter(
  hunter: HunterState,
  deltaMs: number,
  options: StepHunterOptions
): HunterState {
  if (hunter.path.length === 0) {
    return hunter;
  }

  const stepDistance = hunter.speed * (deltaMs / 1000) * clamp(options.timeScale, 0.1, 1.5);
  let remaining = stepDistance;
  let pathIndex = hunter.pathIndex;
  let position = { ...hunter.position };

  while (remaining > 0) {
    const nextIndex = (pathIndex + 1) % hunter.path.length;
    const target = hunter.path[nextIndex];
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 0.0001) {
      pathIndex = nextIndex;
      position = { ...target };
      continue;
    }

    if (distance <= remaining) {
      position = { ...target };
      pathIndex = nextIndex;
      remaining -= distance;
    } else {
      const ratio = remaining / distance;
      position = {
        x: position.x + dx * ratio,
        y: position.y + dy * ratio,
      };
      remaining = 0;
    }
  }

  // Investigate towards target when awareness is high
  if (hunter.awareness > 0.6) {
    const vector = {
      x: options.target.x - position.x,
      y: options.target.y - position.y,
    };
    const length = Math.hypot(vector.x, vector.y);
    if (length > 0.0001) {
      const pursuitStep = Math.min(stepDistance * 0.35, length);
      position = {
        x: position.x + (vector.x / length) * pursuitStep,
        y: position.y + (vector.y / length) * pursuitStep,
      };
    }
  }

  return {
    ...hunter,
    position,
    pathIndex,
  };
}

export function updateHunterAwareness(
  hunter: HunterState,
  input: AwarenessUpdateInput
): HunterState {
  const distance = Math.hypot(
    hunter.position.x - input.playerPosition.x,
    hunter.position.y - input.playerPosition.y
  );

  const withinDetection = distance <= hunter.detectionRadius;
  let awareness = hunter.awareness;

  if (withinDetection) {
    const proximityFactor = clamp(0.2, 1.4, 1 - distance / (hunter.detectionRadius + 0.0001));
    awareness += input.threatLevel * hunter.awarenessRate * (input.deltaTime / 1000) * proximityFactor;
  } else {
    awareness -= hunter.awarenessDecay * (input.deltaTime / 1000);
  }

  return {
    ...hunter,
    awareness: clamp(0, 1, awareness),
  };
}

const HUNTER_ARCHETYPES: Record<HunterArchetype, {
  speed: number;
  detectionRadius: number;
  patrolRadius: number;
  awarenessRate: number;
  awarenessDecay: number;
}> = {
  [HunterArchetype.Stalker]: {
    speed: 6.2,
    detectionRadius: 3.4,
    patrolRadius: 7,
    awarenessRate: 1.4,
    awarenessDecay: 0.55,
  },
  [HunterArchetype.Seeker]: {
    speed: 7.1,
    detectionRadius: 5.2,
    patrolRadius: 9,
    awarenessRate: 1.6,
    awarenessDecay: 0.48,
  },
  [HunterArchetype.Warden]: {
    speed: 5.4,
    detectionRadius: 5,
    patrolRadius: 10,
    awarenessRate: 1.2,
    awarenessDecay: 0.6,
  },
};

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
