export interface PolarPosition {
  radius: number;
  angle: number;
}

export interface ShooterShipState {
  position: PolarPosition;
  heading: number;
  velocity: number;
  dashTimer: number;
}

export interface ShooterCooldowns {
  dash: number;
  pulse: number;
}

export interface ShooterPhysicsState {
  ship: ShooterShipState;
  coreRotation: number;
  cooldowns: ShooterCooldowns;
  seed: number;
}

export interface ShooterPhysicsConfig {
  seed: number;
}

export interface ShooterControls {
  thrust: number;
  rotation: number;
  brake: boolean;
}

export interface FluxDashOptions {
  strength: number;
  durationMs: number;
}

const MODULUS = 2147483647;
const MULTIPLIER = 48271;

export function createShooterPhysics(config: ShooterPhysicsConfig): ShooterPhysicsState {
  const seed = normalizeSeed(config.seed);
  const [angleSeed, stateA] = nextRandom(seed);
  const [radiusSeed, stateB] = nextRandom(stateA);

  return {
    ship: {
      position: {
        radius: 12 + radiusSeed * 6,
        angle: angleSeed * Math.PI * 2,
      },
      heading: angleSeed * Math.PI * 2,
      velocity: 0,
      dashTimer: 0,
    },
    coreRotation: 0,
    cooldowns: {
      dash: 0,
      pulse: 0,
    },
    seed: stateB,
  };
}

export function stepShooterPhysics(
  state: ShooterPhysicsState,
  deltaMs: number,
  controls: ShooterControls
): ShooterPhysicsState {
  const dt = deltaMs / 1000;

  const heading = normalizeAngle(
    state.ship.heading + clamp(-1, 1, controls.rotation) * dt * 3.2
  );

  let velocity = state.ship.velocity;
  velocity += clamp(0, 1, controls.thrust) * 24 * dt;

  if (controls.brake) {
    velocity *= 1 - Math.min(0.9, dt * 3.4);
  } else {
    velocity *= 1 - Math.min(0.25, dt * 0.9);
  }

  velocity = clamp(0, 42, velocity);

  const positionCartesian = polarToCartesian(state.ship.position);
  positionCartesian.x += Math.cos(heading) * velocity * dt;
  positionCartesian.y += Math.sin(heading) * velocity * dt;

  const maxRadius = 26;
  const clampedPosition = cartesianToPolar(positionCartesian);
  clampedPosition.radius = clamp(6, maxRadius, clampedPosition.radius);

  const dashTimer = Math.max(0, state.ship.dashTimer - deltaMs);

  return {
    ...state,
    ship: {
      position: clampedPosition,
      heading,
      velocity,
      dashTimer,
    },
    coreRotation: normalizeAngle(state.coreRotation + dt * 0.8),
    cooldowns: {
      dash: Math.max(0, state.cooldowns.dash - deltaMs),
      pulse: Math.max(0, state.cooldowns.pulse - deltaMs),
    },
  };
}

export function applyFluxDash(
  state: ShooterPhysicsState,
  options: FluxDashOptions
): ShooterPhysicsState {
  if (state.cooldowns.dash > 0) {
    return state;
  }

  const strength = Math.max(1, options.strength);
  const duration = Math.max(0, options.durationMs);

  return {
    ...state,
    ship: {
      ...state.ship,
      velocity: clamp(0, 54, state.ship.velocity * strength + 18),
      dashTimer: duration,
    },
    cooldowns: {
      ...state.cooldowns,
      dash: 2800 + duration,
    },
  };
}

function polarToCartesian(position: PolarPosition): { x: number; y: number } {
  return {
    x: Math.cos(position.angle) * position.radius,
    y: Math.sin(position.angle) * position.radius,
  };
}

function cartesianToPolar(point: { x: number; y: number }): PolarPosition {
  return {
    radius: Math.sqrt(point.x * point.x + point.y * point.y),
    angle: normalizeAngle(Math.atan2(point.y, point.x)),
  };
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

function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  let result = angle % twoPi;
  if (result < 0) {
    result += twoPi;
  }
  return result;
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}
