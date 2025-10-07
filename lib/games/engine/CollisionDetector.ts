export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface CollisionResult {
  collide: boolean;
  depth?: number;
  normal?: { x: number; y: number };
  point?: { x: number; y: number };
}

export class CollisionDetector {
  static aabbVsAabb(a: Rect, b: Rect): CollisionResult {
    const dx = a.x + a.width / 2 - (b.x + b.width / 2);
    const dy = a.y + a.height / 2 - (b.y + b.height / 2);
    const overlapX = a.width / 2 + b.width / 2 - Math.abs(dx);
    const overlapY = a.height / 2 + b.height / 2 - Math.abs(dy);

    if (overlapX <= 0 || overlapY <= 0) {
      return { collide: false };
    }

    if (overlapX < overlapY) {
      return {
        collide: true,
        depth: overlapX,
        normal: { x: Math.sign(dx), y: 0 },
      };
    }

    return {
      collide: true,
      depth: overlapY,
      normal: { x: 0, y: Math.sign(dy) },
    };
  }

  static circleVsCircle(a: Circle, b: Circle): CollisionResult {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distSq = dx * dx + dy * dy;
    const combined = a.radius + b.radius;

    if (distSq >= combined * combined) {
      return { collide: false };
    }

    const dist = Math.sqrt(distSq) || 0.0001;
    return {
      collide: true,
      depth: combined - dist,
      normal: { x: dx / dist, y: dy / dist },
      point: { x: a.x + (dx / dist) * a.radius, y: a.y + (dy / dist) * a.radius },
    };
  }

  static aabbVsCircle(rect: Rect, circle: Circle): CollisionResult {
    const nearestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const nearestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;
    const distSq = dx * dx + dy * dy;

    if (distSq > circle.radius * circle.radius) {
      return { collide: false };
    }

    const dist = Math.sqrt(distSq) || 0.0001;
    return {
      collide: true,
      depth: circle.radius - dist,
      normal: { x: dx / dist, y: dy / dist },
      point: { x: nearestX, y: nearestY },
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
