export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  spinCharge: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseSpeed: number;
}

export function createPaddle(x: number, y: number, width: number, height: number, speed: number): Paddle {
  return {
    x,
    y,
    width,
    height,
    speed,
    spinCharge: 0,
  };
}

export function createBall(x: number, y: number, radius: number, baseSpeed: number): Ball {
  return {
    x,
    y,
    radius,
    vx: 0,
    vy: 0,
    baseSpeed,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
