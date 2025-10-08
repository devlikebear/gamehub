import { describe, expect, it } from 'vitest';

import {
  DriftPhysicsState,
  applyBoostPulse,
  createPhysicsState,
  stepPhysics,
} from '../physics';

describe('createPhysicsState', () => {
  it('initializes gravity wave direction and base drift speed', () => {
    const physics = createPhysicsState({ seed: 17 });

    expect(physics.gravityWave.direction).toBeDefined();
    expect(physics.ship.velocity.magnitude).toBeGreaterThan(0);
  });
});

describe('stepPhysics', () => {
  it('modulates ship drift angle based on gravity wave over time', () => {
    const physics = createPhysicsState({ seed: 11 });
    const initialAngle = physics.ship.velocity.angle;

    const updated = stepPhysics(physics, 1800, {
      thrust: 0.5,
      rotation: 0.2,
      damping: 0.92,
    });

    expect(updated.ship.velocity.angle).not.toBeCloseTo(initialAngle, 5);
    expect(updated.gravityWave.elapsed).toBeGreaterThan(physics.gravityWave.elapsed);
  });
});

describe('applyBoostPulse', () => {
  it('applies temporary burst speed and records cooldown', () => {
    const physics: DriftPhysicsState = createPhysicsState({ seed: 5 });
    const withBoost = applyBoostPulse(physics, { boostScale: 1.4, durationMs: 600 });

    expect(withBoost.ship.boostTimer).toBeGreaterThan(0);
    expect(withBoost.ship.velocity.magnitude).toBeGreaterThan(physics.ship.velocity.magnitude);
    expect(withBoost.cooldowns.boost).toBeGreaterThan(0);
  });
});
