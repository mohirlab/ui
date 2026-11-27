import { color } from '@mohirlab/tokens';

/**
 * Named palettes built from the token ramps, ordered light to dark.
 * Every generated asset draws from these, so imagery always matches the UI.
 * The darkest stop is a mid-tone on purpose: imagery should feel light and airy,
 * never a black hole on the page.
 */
export const palettes = {
  lapis: [color.lapis[50], color.lapis[200], color.lapis[300], color.lapis[500], color.lapis[700]],
  dusk: [color.anor[100], color.lapis[100], color.lapis[300], color.lapis[400], color.lapis[600]],
  saffron: [color.saffron[50], color.saffron[200], color.saffron[400], color.anor[400], color.anor[600]],
  jade: [color.jade[50], color.jade[200], color.jade[300], color.jade[500], color.jade[700]],
  clay: [color.paper, color.ink[100], color.saffron[300], color.anor[400], color.ink[500]],
  ink: [color.ink[50], color.ink[200], color.ink[300], color.ink[400], color.ink[600]],
} as const satisfies Record<string, readonly string[]>;

/** A deep tone per palette for text drawn on its light stops, such as avatar initials. */
export const paletteInk: Record<keyof typeof palettes, string> = {
  lapis: color.lapis[800],
  dusk: color.lapis[800],
  saffron: color.anor[800],
  jade: color.jade[800],
  clay: color.ink[800],
  ink: color.ink[800],
};

export type PaletteName = keyof typeof palettes;
export type Palette = readonly string[];
export const paletteNames = Object.keys(palettes) as PaletteName[];

export function resolvePalette(palette: PaletteName | Palette | undefined, fallback: PaletteName): Palette {
  if (!palette) return palettes[fallback];
  return typeof palette === 'string' ? palettes[palette] : palette;
}
