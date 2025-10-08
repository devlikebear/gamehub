export type ShardState = 'stable' | 'resonant' | 'overload';

export interface ShardEntity {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  resonance: number;
  stability: number;
  state: ShardState;
}

export interface ResonanceObjective {
  requiredCores: number;
  timeLimitMs: number;
  currentTime: number;
}

export interface ResonanceFieldState {
  shards: ShardEntity[];
  stabilizedCores: number;
  objective: ResonanceObjective;
  seed: number;
}

export interface FieldConfig {
  shardCount: number;
  seed: number;
}

export interface FieldStepOptions {
  stabilization: number;
}

export interface CollisionResult {
  updatedField: ResonanceFieldState;
  spawnedFragments: ShardEntity[];
}

const MODULUS = 2147483647;
const MULTIPLIER = 1103515245;

export function createResonanceField(config: FieldConfig): ResonanceFieldState {
  let randomState = normalizeSeed(config.seed);
  const shards: ShardEntity[] = [];

  for (let index = 0; index < config.shardCount; index += 1) {
    const [angleRand, stateA] = nextRandom(randomState);
    const [speedRand, stateB] = nextRandom(stateA);
    randomState = stateB;

    shards.push({
      id: `shard-${index}`,
      position: {
        x: Math.cos(angleRand * Math.PI * 2) * (6 + speedRand * 4),
        y: Math.sin(angleRand * Math.PI * 2) * (6 + speedRand * 4),
      },
      velocity: {
        x: Math.cos(angleRand * Math.PI * 2 + Math.PI / 2) * (1.4 + speedRand * 0.6),
        y: Math.sin(angleRand * Math.PI * 2 + Math.PI / 2) * (1.4 + speedRand * 0.6),
      },
      resonance: speedRand * 0.4,
      stability: 1,
      state: 'stable',
    });
  }

  const [objectiveRand, nextState] = nextRandom(randomState);

  return {
    shards,
    stabilizedCores: 0,
    objective: {
      requiredCores: Math.max(2, Math.round(config.shardCount * 0.4)),
      timeLimitMs: 90000 + objectiveRand * 30000,
      currentTime: 0,
    },
    seed: nextState,
  };
}

export function stepResonanceField(
  state: ResonanceFieldState,
  deltaMs: number,
  options: FieldStepOptions
): ResonanceFieldState {
  const nextShards: ShardEntity[] = [];
  let stabilizedCores = state.stabilizedCores;
  const stabilization = clamp(0, 1, options.stabilization);

  for (const shard of state.shards) {
    let resonance = shard.resonance;
    let stability = shard.stability;
    let shardState: ShardState = shard.state;

    resonance += 0.0008 * deltaMs;
    stability = clamp(0, 1, stability - resonance * 0.0006 * deltaMs + stabilization * 0.0009 * deltaMs);

    if (stability <= 0.3 && shardState === 'stable') {
      shardState = 'resonant';
    }
    if (resonance >= 1 && shardState !== 'overload') {
      shardState = 'overload';
    }

    const position = {
      x: shard.position.x + shard.velocity.x * (deltaMs / 1000),
      y: shard.position.y + shard.velocity.y * (deltaMs / 1000),
    };

    nextShards.push({
      ...shard,
      resonance,
      stability,
      state: shardState,
      position,
    });

    if (stability >= 0.95 && shardState === 'resonant') {
      shardState = 'stable';
      stabilizedCores += 1;
    }
  }

  const objective = {
    ...state.objective,
    currentTime: state.objective.currentTime + deltaMs,
  };

  return {
    ...state,
    shards: nextShards,
    stabilizedCores,
    objective,
  };
}

export function applyResonanceCollision(
  state: ResonanceFieldState,
  payload: { shardId: string }
): CollisionResult {
  const shard = state.shards.find((candidate) => candidate.id === payload.shardId);
  if (!shard) {
    return {
      updatedField: state,
      spawnedFragments: [],
    };
  }

  const fragments: ShardEntity[] = [];
  let randomState = state.seed;

  if (shard.state === 'overload') {
    for (let i = 0; i < 3; i += 1) {
      const [angleRand, stateA] = nextRandom(randomState);
      const [speedRand, stateB] = nextRandom(stateA);
      randomState = stateB;

      fragments.push({
        id: `${shard.id}-fragment-${i}`,
        position: { ...shard.position },
        velocity: {
          x: Math.cos(angleRand * Math.PI * 2) * (2 + speedRand * 1.3),
          y: Math.sin(angleRand * Math.PI * 2) * (2 + speedRand * 1.3),
        },
        resonance: Math.max(0.2, shard.resonance * 0.4),
        stability: clamp(0.3, 0.7, shard.stability * 0.6),
        state: 'resonant',
      });
    }
  }

  const shards = state.shards
    .filter((candidate) => candidate.id !== payload.shardId)
    .concat(fragments);

  return {
    updatedField: {
      ...state,
      shards,
      seed: randomState,
    },
    spawnedFragments: fragments,
  };
}

function nextRandom(state: number): [number, number] {
  const normalized = state <= 0 ? 1 : state;
  const next = (normalized * MULTIPLIER + 12345) % MODULUS;
  return [next / MODULUS, next];
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) return 1;
  const normalized = Math.abs(Math.floor(seed)) % MODULUS;
  return normalized === 0 ? 1 : normalized;
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
