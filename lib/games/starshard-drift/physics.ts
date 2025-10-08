export interface Vector {
  angle: number;
  magnitude: number;
}

export interface ShipState {
  position: { x: number; y: number };
  velocity: Vector;
  boostTimer: number;
}

export interface GravityWaveState {
  direction: number;
  strength: number;
  elapsed: number;
  cycleMs: number;
}

export interface CooldownState {
  boost: number;
  pulse: number;
}

export interface DriftPhysicsState {
  ship: ShipState;
  gravityWave: GravityWaveState;
  cooldowns: CooldownState;
  seed: number;
}

export interface PhysicsConfig {
  seed: number;
}

export interface PhysicsInput {
  thrust: number;
  rotation: number;
  damping: number;
}

export interface BoostOptions {
  boostScale: number;
  durationMs: number;
}

const MODULUS = 2147483647;
const MULTIPLIER = 48271;

export function createPhysicsState(config: PhysicsConfig): DriftPhysicsState {
  const seed = normalizeSeed(config.seed);
  const [waveDir, stateA] = nextRandom(seed);
  const [waveStrength, stateB] = nextRandom(stateA);
  const [velocityRand, nextState] = nextRandom(stateB);

  return {
    ship: {
      position: { x: 0, y: 0 },
      velocity: {
        angle: waveDir * Math.PI * 2,
        magnitude: 6 + velocityRand * 3,
      },
      boostTimer: 0,
    },
    gravityWave: {
      direction: waveDir * Math.PI * 2,
      strength: 0.4 + waveStrength * 0.4,
      elapsed: 0,
      cycleMs: 5200 + waveStrength * 2200,
    },
    cooldowns: {
      boost: 0,
      pulse: 0,
    },
    seed: nextState,
  };
}

export function stepPhysics(
  state: DriftPhysicsState,
  deltaMs: number,
  input: PhysicsInput
): DriftPhysicsState {
  const gravityWave = updateGravityWave(state.gravityWave, deltaMs);

  const rotation = clamp(-1, 1, input.rotation);
  const thrust = clamp(0, 1, input.thrust);
  const damping = clamp(0.6, 0.99, input.damping);

  const driftInfluence = Math.sin(gravityWave.elapsed / gravityWave.cycleMs * Math.PI * 2) * gravityWave.strength;
  const angularVelocity = rotation * 1.9 + driftInfluence * 0.8;

  const velocityAngle = normalizeAngle(state.ship.velocity.angle + angularVelocity * (deltaMs / 1000));
  let velocityMagnitude = state.ship.velocity.magnitude * damping + thrust * 6.4 * (deltaMs / 1000);

  const boostTimer = Math.max(0, state.ship.boostTimer - deltaMs);
  if (state.ship.boostTimer > 0) {
    const boostRatio = Math.min(state.ship.boostTimer, 1200) / 1200;
    velocityMagnitude *= 1 + boostRatio * 0.8;
  }

  const cooldowns: CooldownState = {
    boost: Math.max(0, state.cooldowns.boost - deltaMs),
    pulse: Math.max(0, state.cooldowns.pulse - deltaMs),
  };

  return {
    ...state,
    ship: {
      position: projectPosition(state.ship.position, velocityAngle, velocityMagnitude, deltaMs),
      velocity: {
        angle: velocityAngle,
        magnitude: clamp(0, 18, velocityMagnitude),
      },
      boostTimer,
    },
    gravityWave,
    cooldowns,
  };
}

export function applyBoostPulse(
  state: DriftPhysicsState,
  options: BoostOptions
): DriftPhysicsState {
  if (state.cooldowns.boost > 0) {
    return state;
  }

  const boostScale = Math.max(1, options.boostScale);
  return {
    ...state,
    ship: {
      ...state.ship,
      boostTimer: options.durationMs,
      velocity: {
        angle: state.ship.velocity.angle,
        magnitude: clamp(0, 20, state.ship.velocity.magnitude * boostScale),
      },
    },
    cooldowns: {
      ...state.cooldowns,
      boost: 4200,
    },
  };
}

function projectPosition(
  position: { x: number; y: number },
  angle: number,
  magnitude: number,
  deltaMs: number
): { x: number; y: number } {
  const distance = magnitude * (deltaMs / 1000);
  return {
    x: position.x + Math.cos(angle) * distance,
    y: position.y + Math.sin(angle) * distance,
  };
}

function updateGravityWave(wave: GravityWaveState, deltaMs: number): GravityWaveState {
  const elapsed = (wave.elapsed + deltaMs) % wave.cycleMs;
  const [directionShift, strengthShift] = [
    Math.sin((elapsed / wave.cycleMs) * Math.PI * 2) * 0.3,
    Math.cos((elapsed / wave.cycleMs) * Math.PI * 2) * 0.05,
  ];

  return {
    ...wave,
    elapsed,
    direction: normalizeAngle(wave.direction + directionShift * 0.02),
    strength: clamp(0.25, 0.9, wave.strength + strengthShift),
  };
}

function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  let resulted = angle % twoPi;
  if (resulted < 0) {
    resulted += twoPi;
  }
  return resulted;
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

function nextRandom(state: number): [number, number] {
  const normalized = state <= 0 ? 1 : state;
  const next = (normalized * MULTIPLIER) % MODULUS;
  return [next / MODULUS, next];
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) return 1;
  const normalized = Math.abs(Math.floor(seed)) % MODULUS;
  return normalized === 0 ? 1 : normalized;
}
