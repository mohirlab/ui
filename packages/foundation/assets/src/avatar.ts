import { star } from './artwork';
import { color } from '@mohirlab/tokens';
import {
  paletteInk,
  paletteNames,
  palettes,
  resolvePalette,
  type Palette,
  type PaletteName,
} from './palettes';
import { createRandom, r2 } from './random';

export interface AvatarOptions {
  size?: number;
  /** A named palette or 5 colors, light to dark. Default: picked from the seed. */
  palette?: PaletteName | Palette;
  /** One or two letters drawn over the tile. */
  initials?: string;
}

/** Initials from a display name: "Courtney Henry" → "CH", "leslie" → "L". */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0]!, words.at(-1)!] : words;
  return letters.map((w) => [...w][0]!.toLocaleUpperCase()).join('');
}

/**
 * A tile avatar: a cropped 8-point star from Central Asian tilework,
 * deterministic for a seed (use a user id, not a name, so it survives renames).
 */
export function avatar(seed: string | number, options: AvatarOptions = {}): string {
  const rand = createRandom(seed);
  const { size = 64, initials } = options;
  // Skip the near-neutral palette when picking automatically: avatars should tell people apart.
  const auto = paletteNames.filter((n) => n !== 'ink');
  const name: PaletteName | undefined =
    typeof options.palette === 'string' ? options.palette : options.palette ? undefined : rand.pick(auto);
  const p = name ? palettes[name] : resolvePalette(options.palette, 'lapis');
  // Custom palettes get the neutral ink for letters.
  const ink = name ? paletteInk[name] : color.ink[800];
  const s = 64;
  const cx = r2(rand.range(s * 0.25, s * 0.75));
  const cy = r2(rand.range(s * 0.25, s * 0.75));
  // With initials the letters carry identity: a light tile, the star as a soft texture,
  // and letters in the palette's deep ink (>= 4.5:1 on tile and star, checked in tests).
  const bg = initials ? p[1] : rand.pick([p[2], p[3]]);
  const fg = initials ? p[2] : rand.pick([p[0], p[1]]);
  const accent = initials ? p[3] : p[4];
  const rotation = rand.pick([0, 22.5, 45]);

  let shapes = `<rect width="${s}" height="${s}" fill="${bg}"/>`;
  shapes += `<g fill="${fg}"${initials ? ' opacity=".55"' : ''} transform="rotate(${rotation} ${cx} ${cy})">${star(cx, cy, s * rand.range(0.42, 0.6))}</g>`;
  if (!initials) {
    shapes += `<rect x="${r2(cx - 4)}" y="${r2(cy - 4)}" width="8" height="8" fill="${accent}" transform="rotate(45 ${cx} ${cy})"/>`;
  }
  if (initials) {
    const text = [...initials].slice(0, 2).join('').toLocaleUpperCase();
    shapes += `<text x="32" y="32" dy=".35em" text-anchor="middle" font-family="Martian Mono, ui-monospace, monospace" font-size="${text.length > 1 ? 22 : 26}" font-weight="500" fill="${ink}">${text.replace(/[&<>]/g, '')}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${size}" height="${size}" aria-hidden="true">${shapes}</svg>`;
}
