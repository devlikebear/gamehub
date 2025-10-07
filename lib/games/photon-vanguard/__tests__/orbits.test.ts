import { describe, expect, it } from 'vitest';

import { computeOrbitPosition, createOrbitState, stepOrbitState } from '../orbits';

describe('createOrbitState', () => {
  it('scales orbit lane count with the current round', () => {
    const roundOne = createOrbitState({ round: 1 });
    const roundThree = createOrbitState({ round: 3 });

    expect(roundOne.lanes).toHaveLength(2);
    expect(roundThree.lanes.length).toBeGreaterThan(roundOne.lanes.length);
  });
});

describe('computeOrbitPosition', () => {
  it('applies elliptical factor to the y component', () => {
    const state = createOrbitState({ round: 1 });
    const ellipticalLane = {
      ...state.lanes[0],
      ellipseRatio: 0.65,
    };
    const angle = Math.PI / 2; // 90 degrees, should align on positive Y axis
    const position = computeOrbitPosition(ellipticalLane, angle);

    expect(position.x).toBeCloseTo(0, 5);
    expect(position.y).toBeCloseTo(ellipticalLane.radius * ellipticalLane.ellipseRatio, 5);
  });
});

describe('stepOrbitState', () => {
  it('produces spawn-ready lanes when enough time has elapsed', () => {
    const state = createOrbitState({ round: 1 });
    const result = stepOrbitState(state, 1900, { timeScale: 1 });
    const laneIds = result.ready.map((lane) => lane.id);

    expect(laneIds).toContain(state.lanes[0].id);
  });

  it('respects time dilation by delaying spawns', () => {
    const fastState = createOrbitState({ round: 1 });
    const fastResult = stepOrbitState(fastState, 1900, { timeScale: 1 });
    expect(fastResult.ready.length).toBeGreaterThan(0);

    const slowState = createOrbitState({ round: 1 });
    const slowResult = stepOrbitState(slowState, 1900, { timeScale: 0.4 });
    expect(slowResult.ready.length).toBe(0);

    const secondSlow = stepOrbitState(slowState, 3000, { timeScale: 0.4 });
    const laneIds = secondSlow.ready.map((lane) => lane.id);
    expect(laneIds).toContain(slowState.lanes[0].id);
  });
});
