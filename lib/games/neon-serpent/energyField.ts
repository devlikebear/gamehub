import { GridPosition } from './segments';

const keyOf = (pos: GridPosition): string => `${pos.x},${pos.y}`;

export interface HazardField {
  tiles: GridPosition[];
  tileKeys: Set<string>;
}

export function generateHazardField(
  cols: number,
  rows: number,
  hazardCount: number,
  forbiddenKeys: Set<string>,
  rng: () => number
): HazardField {
  const tiles: GridPosition[] = [];
  const tileKeys = new Set<string>();

  let attempts = 0;

  while (tiles.length < hazardCount && attempts < hazardCount * 20) {
    attempts += 1;

    const candidate: GridPosition = {
      x: Math.floor(rng() * cols),
      y: Math.floor(rng() * rows),
    };

    const key = keyOf(candidate);

    if (forbiddenKeys.has(key) || tileKeys.has(key)) {
      continue;
    }

    tiles.push(candidate);
    tileKeys.add(key);
  }

  return { tiles, tileKeys };
}

export function spawnEnergyOrb(
  cols: number,
  rows: number,
  forbiddenKeys: Set<string>,
  rng: () => number,
  maxAttempts: number = 200
): GridPosition | null {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate: GridPosition = {
      x: Math.floor(rng() * cols),
      y: Math.floor(rng() * rows),
    };

    if (forbiddenKeys.has(keyOf(candidate))) {
      continue;
    }

    return candidate;
  }

  return null;
}

export function toKey(pos: GridPosition): string {
  return keyOf(pos);
}
