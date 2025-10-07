import { describe, expect, it } from 'vitest';

import {
  applyStealthAction,
  createStealthMeter,
  decayThreat,
  getDetectionProbability,
} from '../stealth';

describe('stealth meter', () => {
  it('increases threat when creating noise and decreases when cloaked', () => {
    const meter = createStealthMeter();
    const afterNoise = applyStealthAction(meter, {
      noise: 0.35,
      visibility: 0.2,
    });

    expect(afterNoise.threat).toBeGreaterThan(meter.threat);

    const afterCloak = decayThreat(afterNoise, 1200, { cloaked: true });
    expect(afterCloak.threat).toBeLessThan(afterNoise.threat);
  });

  it('computes higher detection probability for elevated threat/visibility', () => {
    const calm = createStealthMeter();
    const alert = {
      ...calm,
      threat: 0.8,
      visibility: 0.7,
    };

    const calmDetection = getDetectionProbability(calm);
    const alertDetection = getDetectionProbability(alert);

    expect(alertDetection).toBeGreaterThan(calmDetection);
  });
});
