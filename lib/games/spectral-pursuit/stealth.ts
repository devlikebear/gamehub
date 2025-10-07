export interface StealthMeter {
  threat: number;
  visibility: number;
  heat: number;
}

export interface StealthAction {
  noise: number;
  visibility: number;
}

export interface DecayOptions {
  cloaked: boolean;
}

export function createStealthMeter(): StealthMeter {
  return {
    threat: 0.12,
    visibility: 0.25,
    heat: 0,
  };
}

export function applyStealthAction(
  meter: StealthMeter,
  action: StealthAction
): StealthMeter {
  const noiseContribution = action.noise * 0.65;
  const visibilityContribution = action.visibility * 0.45;
  const threat = clamp(
    0,
    1,
    meter.threat + noiseContribution + visibilityContribution * 0.6
  );

  const visibility = clamp(
    0,
    1,
    meter.visibility * 0.7 + action.visibility * 0.3
  );

  const heat = clamp(
    0,
    1,
    meter.heat + action.noise * 0.5 + action.visibility * 0.15
  );

  return {
    threat,
    visibility,
    heat,
  };
}

export function decayThreat(
  meter: StealthMeter,
  deltaMs: number,
  options: DecayOptions
): StealthMeter {
  const rate = options.cloaked ? 0.00145 : 0.0006;
  const heatRate = options.cloaked ? 0.001 : 0.0004;

  const newThreat = clamp(0, 1, meter.threat - rate * deltaMs);
  const newHeat = clamp(0, 1, meter.heat - heatRate * deltaMs);

  const adjustedVisibility = options.cloaked
    ? clamp(0, 1, meter.visibility * 0.92)
    : clamp(0, 1, meter.visibility * 0.98);

  return {
    threat: newThreat,
    heat: newHeat,
    visibility: adjustedVisibility,
  };
}

export function getDetectionProbability(meter: StealthMeter): number {
  const composite =
    meter.threat * 0.5 + meter.visibility * 0.35 + meter.heat * 0.25;
  return clamp(0, 1, composite);
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
