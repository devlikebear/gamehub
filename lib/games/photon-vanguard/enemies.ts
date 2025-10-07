import type { OrbitLaneState } from './orbits';

export enum EnemyType {
  Scout = 'scout',
  Splitter = 'splitter',
  Fragment = 'fragment',
  Charger = 'charger',
}

type OrbitLaneSnapshot = Pick<OrbitLaneState, 'id' | 'radius' | 'angularSpeed' | 'ellipseRatio' | 'direction'>;

interface EnemyBlueprint {
  baseHp: number;
  speedScale: number;
  radialSpeed: number;
  score: number;
  splitCount?: number;
  fragmentSpread?: number;
  chargeThreshold?: number;
  chargeBoost?: number;
}

const ENEMY_BLUEPRINTS: Record<EnemyType, EnemyBlueprint> = {
  [EnemyType.Scout]: {
    baseHp: 1,
    speedScale: 1.05,
    radialSpeed: 0.24,
    score: 110,
  },
  [EnemyType.Splitter]: {
    baseHp: 2,
    speedScale: 0.96,
    radialSpeed: 0.21,
    score: 180,
    splitCount: 2,
    fragmentSpread: 0.45,
  },
  [EnemyType.Fragment]: {
    baseHp: 1,
    speedScale: 1.35,
    radialSpeed: 0.32,
    score: 45,
  },
  [EnemyType.Charger]: {
    baseHp: 2,
    speedScale: 1.18,
    radialSpeed: 0.26,
    score: 210,
    chargeThreshold: 0.52,
    chargeBoost: 1.6,
  },
};

export interface EnemyInstance {
  id: number;
  type: EnemyType;
  angle: number;
  angularVelocity: number;
  radialProgress: number;
  radialVelocity: number;
  hp: number;
  scoreValue: number;
  chargeState: number;
  splitCount?: number;
  fragmentSpread?: number;
  chargeThreshold?: number;
  chargeBoost?: number;
  lane: OrbitLaneSnapshot;
  round: number;
}

export interface AdvanceOptions {
  lane?: OrbitLaneState;
  timeScale: number;
}

export interface AdvanceResult {
  enemy: EnemyInstance;
  enteredCore: boolean;
}

export interface DamageResult {
  enemy: EnemyInstance | null;
  destroyed: boolean;
  spawned: EnemyInstance[];
}

interface CreateEnemyParams {
  id: number;
  type: EnemyType;
  lane: OrbitLaneState;
  round: number;
  angle: number;
}

export function createEnemyInstance(params: CreateEnemyParams): EnemyInstance {
  const { id, type, lane, round, angle } = params;
  const blueprint = ENEMY_BLUEPRINTS[type];

  if (!blueprint) {
    throw new Error(`Unknown enemy type: ${type}`);
  }

  const laneSnapshot: OrbitLaneSnapshot = {
    id: lane.id,
    radius: lane.radius,
    angularSpeed: lane.angularSpeed,
    ellipseRatio: lane.ellipseRatio,
    direction: lane.direction,
  };

  const roundScale = 1 + Math.max(0, round - 1) * 0.08;
  const vitalityScale = 1 + Math.max(0, round - 1) * 0.05;

  const hp = Math.max(1, Math.round(blueprint.baseHp * vitalityScale));
  const angularVelocity = lane.angularSpeed * blueprint.speedScale * roundScale;
  const radialVelocity = blueprint.radialSpeed * roundScale * 0.5;
  const scoreValue = Math.round(blueprint.score * roundScale);

  return {
    id,
    type,
    angle,
    angularVelocity,
    radialProgress: 0,
    radialVelocity,
    hp,
    scoreValue,
    chargeState: 0,
    splitCount: blueprint.splitCount,
    fragmentSpread: blueprint.fragmentSpread,
    chargeThreshold: blueprint.chargeThreshold,
    chargeBoost: blueprint.chargeBoost,
    lane: laneSnapshot,
    round,
  };
}

export function advanceEnemyInstance(enemy: EnemyInstance, deltaMs: number, options: AdvanceOptions): AdvanceResult {
  const lane = options.lane
    ? ({
        id: options.lane.id,
        radius: options.lane.radius,
        angularSpeed: options.lane.angularSpeed,
        ellipseRatio: options.lane.ellipseRatio,
        direction: options.lane.direction,
      } satisfies OrbitLaneSnapshot)
    : enemy.lane;

  const clampedScale = Math.max(0, options.timeScale);
  const deltaSeconds = (deltaMs * clampedScale) / 1000;

  const updated: EnemyInstance = { ...enemy, lane };

  if (deltaSeconds <= 0) {
    return { enemy: updated, enteredCore: updated.radialProgress >= 1 };
  }

  let angularVelocity = updated.angularVelocity;
  let radialVelocity = updated.radialVelocity;

  if (updated.chargeThreshold !== undefined && updated.radialProgress >= updated.chargeThreshold) {
    const boost = updated.chargeBoost ?? 1.4;
    angularVelocity *= boost;
    radialVelocity *= Math.max(1.1, boost * 0.8);
    updated.chargeState = Math.min(1, updated.chargeState + deltaSeconds);
  } else {
    updated.chargeState = Math.max(0, updated.chargeState - deltaSeconds * 0.6);
  }

  updated.angle = normalizeAngle(
    updated.angle + angularVelocity * deltaSeconds * (lane.direction === -1 ? -1 : 1)
  );

  updated.radialProgress = Math.min(1, updated.radialProgress + radialVelocity * deltaSeconds);

  const enteredCore = updated.radialProgress >= 1;

  return { enemy: updated, enteredCore };
}

export function applyWaveDamage(enemy: EnemyInstance, damage: number): DamageResult {
  const updated: EnemyInstance = { ...enemy, hp: enemy.hp - damage };

  if (updated.hp > 0) {
    return {
      enemy: updated,
      destroyed: false,
      spawned: [],
    };
  }

  const spawned: EnemyInstance[] = [];

  if (enemy.splitCount && enemy.splitCount > 0) {
    for (let i = 0; i < enemy.splitCount; i += 1) {
      const offsetIndex = i - (enemy.splitCount - 1) / 2;
      const offset = (enemy.fragmentSpread ?? 0.35) * offsetIndex;
      const fragment = createEnemyInstance({
        id: enemy.id * 10 + (i + 1),
        type: EnemyType.Fragment,
        lane: {
          ...enemy.lane,
          spawnInterval: 0,
          spawnProgress: 0,
        } as OrbitLaneState,
        round: enemy.round,
        angle: normalizeAngle(enemy.angle + offset),
      });
      fragment.radialProgress = Math.min(0.95, Math.max(0, enemy.radialProgress - 0.1 + offsetIndex * 0.04));
      spawned.push(fragment);
    }
  }

  return {
    enemy: null,
    destroyed: true,
    spawned,
  };
}

function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  let result = angle % twoPi;
  if (result < 0) {
    result += twoPi;
  }
  return result;
}
