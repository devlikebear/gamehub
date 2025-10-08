import { describe, expect, it } from 'vitest';

import {
  EnemyWaveController,
  createEnemyWaveController,
  stepEnemyWaveController,
} from '../waves';

describe('createEnemyWaveController', () => {
  it('initialises wave cadence and threat level', () => {
    const controller = createEnemyWaveController({ seed: 5 });

    expect(controller.threatLevel).toBeGreaterThan(0);
    expect(controller.spawnTimer).toBeGreaterThan(0);
    expect(controller.activeEnemies.length).toBe(0);
  });
});

describe('stepEnemyWaveController', () => {
  it('spawns enemies when spawn timer elapses', () => {
    let controller: EnemyWaveController = createEnemyWaveController({ seed: 8 });

    controller = stepEnemyWaveController(controller, 500, { difficultyScale: 1 });
    expect(controller.activeEnemies.length).toBeGreaterThanOrEqual(0);

    controller = stepEnemyWaveController(controller, 5000, { difficultyScale: 1 });
    expect(controller.activeEnemies.length).toBeGreaterThan(0);
  });

  it('escalates threat level over time', () => {
    let controller = createEnemyWaveController({ seed: 8 });
    const initialThreat = controller.threatLevel;

    controller = stepEnemyWaveController(controller, 60000, { difficultyScale: 1.2 });
    expect(controller.threatLevel).toBeGreaterThan(initialThreat);
  });
});
