import { describe, expect, it } from 'vitest';

import {
  FluxDashOptions,
  ShooterControls,
  ShooterPhysicsState,
  applyFluxDash,
  createShooterPhysics,
  stepShooterPhysics,
} from '../physics';

describe('createShooterPhysics', () => {
  it('initialises ship heading and energy core tether', () => {
    const state = createShooterPhysics({ seed: 99 });

    expect(state.ship.heading).toBeDefined();
    expect(state.ship.position.radius).toBeGreaterThan(0);
    expect(state.cooldowns.dash).toBeGreaterThanOrEqual(0);
  });
});

describe('stepShooterPhysics', () => {
  it('applies thrust and rotation to ship velocity', () => {
    const controls: ShooterControls = {
      thrust: 1,
      rotation: 0.4,
      brake: false,
    };
    const before = createShooterPhysics({ seed: 12 });
    const after = stepShooterPhysics(before, 160, controls);

    expect(after.ship.heading).not.toBeCloseTo(before.ship.heading);
    expect(after.ship.velocity).toBeGreaterThan(before.ship.velocity);
  });

  it('brakes velocity when brake control is engaged', () => {
    const state = createShooterPhysics({ seed: 31 });
    const accelerated = stepShooterPhysics(state, 200, { thrust: 1, rotation: 0, brake: false });
    const slowed = stepShooterPhysics(accelerated, 200, { thrust: 0, rotation: 0, brake: true });

    expect(slowed.ship.velocity).toBeLessThan(accelerated.ship.velocity);
  });
});

describe('applyFluxDash', () => {
  it('boosts velocity and sets dash cooldown', () => {
    const state: ShooterPhysicsState = createShooterPhysics({ seed: 77 });
    const options: FluxDashOptions = { strength: 2.1, durationMs: 280 };
    const dashed = applyFluxDash(state, options);

    expect(dashed.ship.velocity).toBeGreaterThan(state.ship.velocity);
    expect(dashed.ship.dashTimer).toBeGreaterThan(0);
    expect(dashed.cooldowns.dash).toBeGreaterThan(state.cooldowns.dash);
  });
});
