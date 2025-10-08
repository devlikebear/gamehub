const ADJECTIVES = [
  'Neon',
  'Quantum',
  'Hyper',
  'Pixel',
  'Nova',
  'Retro',
  'Stellar',
  'Turbo',
  'Azure',
  'Solar',
  'Chrome',
  'Cosmic',
  'Lunar',
  'Arc',
  'Volt',
  'Electro',
];

const NOUNS = [
  'Rider',
  'Sentinel',
  'Drifter',
  'Comet',
  'Guardian',
  'Pilot',
  'Runner',
  'Striker',
  'Nomad',
  'Phantom',
  'Ranger',
  'Circuit',
  'Echo',
  'Cipher',
  'Spark',
  'Vector',
];

const MAX_LENGTH = 18;

export function generateNickname(seed?: number): string {
  const random = seededRandom(seed ?? Date.now());
  const adjective = ADJECTIVES[Math.floor(random() * ADJECTIVES.length) % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(random() * NOUNS.length) % NOUNS.length];
  return `${adjective} ${noun}`.slice(0, MAX_LENGTH);
}

export function sanitizeNickname(input: string): string {
  return input
    .replace(/[^A-Za-z0-9 _-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_LENGTH) || generateNickname();
}

function seededRandom(seed: number): () => number {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
