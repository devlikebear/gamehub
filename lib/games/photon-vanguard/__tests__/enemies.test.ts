import { describe, expect, it } from 'vitest';

import type { OrbitLaneState } from '../orbits';
import {
  advanceEnemyInstance,
  applyWaveDamage,
  createEnemyInstance,
  EnemyType,
} from '../enemies';

const baseLane: OrbitLaneState = {
  id: 'lane-alpha',
  radius: 140,
  angularSpeed: 0.85, // radians per second
  spawnInterval: 1800,
  ellipseRatio: 1,
  spawnProgress: 0,
  direction: 1,
};

describe('createEnemyInstance', () => {
  it('derives angular velocity from lane speed and enemy type', () => {
    const enemy = createEnemyInstance({
      id: 1,
      type: EnemyType.Splitter,
      lane: baseLane,
      round: 3,
      angle: 0,
    });

    expect(enemy.angularVelocity).toBeGreaterThan(baseLane.angularSpeed * 0.9);
    expect(enemy.hp).toBeGreaterThan(1);
  });
});

describe('advanceEnemyInstance', () => {
  it('moves enemies slower when time scale is reduced', () => {
    const seedEnemy = createEnemyInstance({
      id: 1,
      type: EnemyType.Scout,
      lane: baseLane,
      round: 1,
      angle: 0,
    });

    const normal = advanceEnemyInstance(seedEnemy, 1000, {
      lane: baseLane,
      timeScale: 1,
    });
    const dilated = advanceEnemyInstance(seedEnemy, 1000, {
      lane: baseLane,
      timeScale: 0.4,
    });

    expect(dilated.enemy.angle).toBeLessThan(normal.enemy.angle);
    expect(dilated.enemy.radialProgress).toBeLessThan(normal.enemy.radialProgress);
  });
});

describe('applyWaveDamage', () => {
  it('splits splitter enemies into fragments when destroyed', () => {
    const splitter = createEnemyInstance({
      id: 42,
      type: EnemyType.Splitter,
      lane: baseLane,
      round: 4,
      angle: Math.PI / 3,
    });

    const result = applyWaveDamage(splitter, 3);

    expect(result.destroyed).toBe(true);
    expect(result.spawned).toHaveLength(2);
    expect(result.spawned.every((fragment) => fragment.type === EnemyType.Fragment)).toBe(true);
  });
});
