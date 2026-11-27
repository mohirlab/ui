import { color } from '@mohirlab/tokens';

/**
 * Named palettes built from the token ramps, ordered light to dark.
 * Every generated asset draws from these, so imagery always matches the UI.
 */
export const palettes = {
  lapis: [color.lapis[100], color.lapis[300], color.lapis[500], color.lapis[700], color.lapis[900]],
  dusk: [color.anor[100], color.lapis[200], color.lapis[400], color.lapis[600], color.ink[900]],
  saffron: [color.saffron[100], color.saffron[300], color.anor[400], color.anor[600], color.anor[900]],
  jade: [color.jade[100], color.jade[300], color.jade[500], color.jade[700], color.ink[900]],
  clay: [color.paper, color.ink[200], color.saffron[400], color.anor[600], color.ink[800]],
  ink: [color.ink[100], color.ink[300], color.ink[500], color.ink[700], color.ink[950]],
} as const satisfies Record<string, readonly string[]>;

export type PaletteName = keyof typeof palettes;
export type Palette = readonly string[];
export const paletteNames = Object.keys(palettes) as PaletteName[];

export function resolvePalette(palette: PaletteName | Palette | undefined, fallback: PaletteName): Palette {
  if (!palette) return palettes[fallback];
  return typeof palette === 'string' ? palettes[palette] : palette;
}
