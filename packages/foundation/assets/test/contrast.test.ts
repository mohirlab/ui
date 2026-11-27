import { describe, expect, it } from 'vitest';
import { paletteInk, paletteNames, palettes } from '../src/index';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

// OKLCH → linear sRGB (Björn Ottosson's reference matrices), then WCAG 2 contrast.
function oklchToLinearRgb(css: string): [number, number, number] {
  const m = css.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) throw new Error(`not oklch: ${css}`);
  const [L, C, h] = [Number(m[1]), Number(m[2]), (Number(m[3]) * Math.PI) / 180];
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s),
  ];
}
const luminance = ([r, g, b]: [number, number, number]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const contrast = (x: [number, number, number], y: [number, number, number]) => {
  const [hi, lo] = [luminance(x), luminance(y)].toSorted((p, q) => q - p) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};
// The star texture is painted at 55% over the tile.
const mix = (top: [number, number, number], under: [number, number, number], alpha: number) =>
  top.map((v, i) => v * alpha + under[i]! * (1 - alpha)) as [number, number, number];

describe('initials avatars', () => {
  it.each(paletteNames)('%s: letters reach WCAG AA (4.5:1) on the tile and on the star', (name) => {
    const p = palettes[name].map(oklchToLinearRgb);
    const [tile, star, text] = [p[1]!, mix(p[2]!, p[1]!, 0.55), oklchToLinearRgb(paletteInk[name])];
    expect(contrast(text, tile)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(text, star)).toBeGreaterThanOrEqual(4.5);
  });
});
