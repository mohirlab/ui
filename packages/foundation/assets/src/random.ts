/** FNV-1a: stable 32-bit hash of a seed string. */
export function hashSeed(seed: string | number): number {
  let h = 0x811c9dc5;
  for (const ch of String(seed)) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: small, fast, deterministic PRNG. Same seed, same sequence, everywhere. */
export function createRandom(seed: string | number) {
  let a = hashSeed(seed);
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min: number, max: number) => min + next() * (max - min),
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]!,
  };
}

export type Random = ReturnType<typeof createRandom>;

/** Round to 2 decimals to keep generated SVG small. */
export const r2 = (n: number) => Math.round(n * 100) / 100;
