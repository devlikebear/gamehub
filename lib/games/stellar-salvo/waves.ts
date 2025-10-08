export interface EnemyEntity {
  id: string;
  angle: number;
  radius: number;
  speed: number;
  hp: number;
  archetype: 'skirmisher' | 'rupture' | 'spire';
}

export interface EnemyWaveController {
  activeEnemies: EnemyEntity[];
  spawnTimer: number;
  threatLevel: number;
  seed: number;
}

export interface WaveControllerConfig {
  seed: number;
}

export interface WaveStepOptions {
  difficultyScale: number;
}

const MODULUS = 2147483647;
const MULTIPLIER = 16807;

export function createEnemyWaveController(config: WaveControllerConfig): EnemyWaveController {
  const seed = normalizeSeed(config.seed);
  const [timerSeed, nextState] = nextRandom(seed);

  return {
    activeEnemies: [],
    spawnTimer: 1800 + timerSeed * 1200,
    threatLevel: 1,
    seed: nextState,
  };
}

export function stepEnemyWaveController(
  controller: EnemyWaveController,
  deltaMs: number,
  options: WaveStepOptions
): EnemyWaveController {
  const difficulty = Math.max(0.6, options.difficultyScale);
  let spawnTimer = controller.spawnTimer - deltaMs;
  let seed = controller.seed;
  const enemies = [...controller.activeEnemies].filter((enemy) => enemy.hp > 0);

  while (spawnTimer <= 0) {
    const spawnCount = 1 + Math.floor(controller.threatLevel);
    for (let i = 0; i < spawnCount; i += 1) {
      const [angleRand, stateA] = nextRandom(seed);
      const [radiusRand, stateB] = nextRandom(stateA);
      const [typeRand, stateC] = nextRandom(stateB);
      seed = stateC;

      const archetype: EnemyEntity['archetype'] =
        typeRand > 0.75 ? 'spire' : typeRand > 0.4 ? 'rupture' : 'skirmisher';
      const baseSpeed = archetype === 'skirmisher' ? 5.5 : archetype === 'rupture' ? 4.2 : 3.6;
      const hp = archetype === 'spire' ? 3 : archetype === 'rupture' ? 2 : 1;

      enemies.push({
        id: `enemy-${Date.now()}-${enemies.length}-${Math.floor(typeRand * 1000)}`,
        angle: angleRand * Math.PI * 2,
        radius: 36 + radiusRand * 12,
        speed: baseSpeed * difficulty,
        hp,
        archetype,
      });
    }
    spawnTimer += 2000 / Math.max(1, controller.threatLevel);
  }

  const threatLevel = controller.threatLevel + deltaMs * 0.00012 * difficulty;

  return {
    activeEnemies: enemies,
    spawnTimer,
    threatLevel,
    seed,
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
