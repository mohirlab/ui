export { artwork, artworkKinds, type ArtworkKind, type ArtworkOptions } from './artwork';
export { avatar, initialsOf, type AvatarOptions } from './avatar';
export { palettes, paletteNames, paletteInk, type Palette, type PaletteName } from './palettes';
export { createRandom, hashSeed, type Random } from './random';

/** Turn an SVG string into a URL usable in `src`, `background-image` or `<img>`. */
export function toDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
