import { describe, expect, it } from 'vitest';

import {
  HunterArchetype,
  createHunter,
  stepHunter,
  updateHunterAwareness,
} from '../hunters';

const samplePath = [
  { x: 2, y: 2 },
  { x: 8, y: 2 },
  { x: 8, y: 8 },
];

describe('stepHunter', () => {
  it('slows movement when time dilation factor is applied', () => {
    const baseHunter = createHunter({
      id: 'alpha',
      archetype: HunterArchetype.Stalker,
      path: samplePath,
    });

    const fast = stepHunter(baseHunter, 500, { timeScale: 1, target: { x: 10, y: 10 } });
    const slow = stepHunter(baseHunter, 500, { timeScale: 0.4, target: { x: 10, y: 10 } });

    expect(slow.position.x).toBeLessThanOrEqual(fast.position.x);
    expect(slow.position.y).toBeLessThanOrEqual(fast.position.y);
  });
});

describe('updateHunterAwareness', () => {
  it('raises awareness when player stays inside detection radius', () => {
    const hunter = createHunter({
      id: 'beta',
      archetype: HunterArchetype.Seeker,
      path: samplePath,
    });

    const engaged = updateHunterAwareness(hunter, {
      playerPosition: { x: 5, y: 5 },
      threatLevel: 0.7,
      deltaTime: 600,
    });

    expect(engaged.awareness).toBeGreaterThan(hunter.awareness);
  });
});
