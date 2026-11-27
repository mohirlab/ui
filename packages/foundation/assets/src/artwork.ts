import { paletteNames, resolvePalette, type Palette, type PaletteName } from './palettes';
import { createRandom, hashSeed, r2, type Random } from './random';

export type ArtworkKind = 'dunes' | 'aurora' | 'horizon' | 'tiles';
export const artworkKinds: readonly ArtworkKind[] = ['dunes', 'aurora', 'horizon', 'tiles'];

export interface ArtworkOptions {
  /** Default: picked from the seed. */
  kind?: ArtworkKind;
  /** A named palette or 5 colors, light to dark. Default: picked from the seed. */
  palette?: PaletteName | Palette;
  width?: number;
  height?: number;
  /** Film grain strength, 0 to 1. Default 0.35. */
  grain?: number;
  /** Accessible description. Without it the image is decorative (aria-hidden). */
  title?: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function wave(rand: Random, w: number, y: number, amplitude: number) {
  const points = rand.int(2, 4);
  const step = w / points;
  let d = `M0 ${r2(y + rand.range(-amplitude, amplitude))}`;
  for (let i = 1; i <= points; i++) {
    const x = i * step;
    const yy = y + rand.range(-amplitude, amplitude);
    d += ` S${r2(x - step / 2)} ${r2(yy + rand.range(-amplitude, amplitude))} ${r2(x)} ${r2(yy)}`;
  }
  return d;
}

function dunes(rand: Random, p: Palette, w: number, h: number, id: string) {
  let defs = `<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#${id}s)"/>`;
  const layers = 4;
  for (let i = 0; i < layers; i++) {
    const y = h * (0.35 + (i / layers) * 0.55);
    const top = p[Math.min(i + 1, 4)]!;
    const bottom = p[Math.min(i + 2, 4)]!;
    defs += `<linearGradient id="${id}d${i}" x1="0" y1="0" x2="${r2(rand.range(0.2, 0.8))}" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;
    body += `<path d="${wave(rand, w, y, h * 0.08)} L${w} ${h} L0 ${h}Z" fill="url(#${id}d${i})" opacity="${r2(0.75 + i * 0.08)}"/>`;
  }
  return { defs, body };
}

function aurora(rand: Random, p: Palette, w: number, h: number, id: string) {
  const defs = `<filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${r2(Math.min(w, h) * 0.12)}"/></filter>`;
  let blobs = '';
  for (let i = 0; i < 6; i++) {
    blobs += `<ellipse cx="${r2(rand.range(0, w))}" cy="${r2(rand.range(0, h))}" rx="${r2(rand.range(w * 0.2, w * 0.45))}" ry="${r2(rand.range(h * 0.2, h * 0.45))}" fill="${rand.pick(p.slice(1, 4))}" opacity="${r2(rand.range(0.55, 0.95))}"/>`;
  }
  return {
    defs,
    body: `<rect width="${w}" height="${h}" fill="${p[0]}"/><g filter="url(#${id}b)">${blobs}</g>`,
  };
}

function horizon(rand: Random, p: Palette, w: number, h: number, id: string) {
  const defs = `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[2]}"/><stop offset=".7" stop-color="${p[0]}"/></linearGradient>`;
  const sunR = Math.min(w, h) * rand.range(0.1, 0.18);
  let body = `<rect width="${w}" height="${h}" fill="url(#${id}h)"/><circle cx="${r2(rand.range(w * 0.2, w * 0.8))}" cy="${r2(h * rand.range(0.35, 0.5))}" r="${r2(sunR)}" fill="${p[0]}" opacity=".9"/>`;
  for (let i = 0; i < 3; i++) {
    const base = h * (0.55 + i * 0.14);
    let d = `M0 ${r2(base)}`;
    const peaks = rand.int(3, 6);
    for (let k = 1; k <= peaks; k++) {
      d += ` L${r2((w / peaks) * (k - 0.5))} ${r2(base - rand.range(h * 0.05, h * 0.22))} L${r2((w / peaks) * k)} ${r2(base - rand.range(0, h * 0.06))}`;
    }
    body += `<path d="${d} L${w} ${h} L0 ${h}Z" fill="${p[Math.min(i + 2, 4)]}"/>`;
  }
  return { defs, body };
}

/** An 8-point star (girih), as two squares rotated 45 degrees apart. */
export function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.62;
    pts.push(`${r2(cx + rr * Math.cos(a))},${r2(cy + rr * Math.sin(a))}`);
  }
  return `<polygon points="${pts.join(' ')}"/>`;
}

function tiles(rand: Random, p: Palette, w: number, h: number) {
  const size = Math.max(w, h) / rand.int(4, 7);
  let body = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`;
  for (let y = 0; y < h + size; y += size) {
    for (let x = 0; x < w + size; x += size) {
      body += `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(size)}" height="${r2(size)}" fill="${rand.pick([p[3], p[4], p[2]])}"/>`;
      body += `<g fill="${rand.pick([p[0], p[1]])}">${star(x + size / 2, y + size / 2, size * 0.42)}</g>`;
      body += `<rect x="${r2(x + size / 2 - size * 0.08)}" y="${r2(y + size / 2 - size * 0.08)}" width="${r2(size * 0.16)}" height="${r2(size * 0.16)}" fill="${p[3]}" transform="rotate(45 ${r2(x + size / 2)} ${r2(y + size / 2)})"/>`;
    }
  }
  return { defs: '', body };
}

/**
 * Generative artwork for media slots: deterministic for a seed, sized to fit,
 * colored from Mohirlab palettes. Returns an SVG string.
 */
export function artwork(seed: string | number, options: ArtworkOptions = {}): string {
  const rand = createRandom(seed);
  const { width: w = 640, height: h = 400, grain = 0.35, title } = options;
  const kind = options.kind ?? rand.pick(artworkKinds);
  const palette = resolvePalette(options.palette, rand.pick(paletteNames));
  // Ids must be unique when several artworks share a page.
  const id = `ml${hashSeed(`${seed}|${kind}|${w}x${h}`).toString(36)}`;

  const scene =
    kind === 'dunes'
      ? dunes(rand, palette, w, h, id)
      : kind === 'aurora'
        ? aurora(rand, palette, w, h, id)
        : kind === 'horizon'
          ? horizon(rand, palette, w, h, id)
          : tiles(rand, palette, w, h);

  const grainDefs =
    grain > 0
      ? `<filter id="${id}g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${hashSeed(seed) % 1000}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${r2(grain * 0.5)} 0"/></filter>`
      : '';
  const grainLayer = grain > 0 ? `<rect width="${w}" height="${h}" filter="url(#${id}g)"/>` : '';
  const a11y = title ? ` role="img" aria-label="${esc(title)}"` : ' aria-hidden="true"';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"${a11y}>${title ? `<title>${esc(title)}</title>` : ''}<defs>${scene.defs}${grainDefs}</defs>${scene.body}${grainLayer}</svg>`;
}
