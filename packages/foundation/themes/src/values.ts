import { breakpoint, font, modes, motion, radius, space, type ModeName } from '@mohirlab/tokens';

type Stringify<T> = { [K in keyof T]: T[K] extends object ? Stringify<T[K]> : string };

const stringify = <T extends object>(obj: T): Stringify<T> =>
  JSON.parse(JSON.stringify(obj, (_key, v) => (typeof v === 'number' ? String(v) : v)));

/** Values every mode shares. Brand themes may still override them. */
const shared = stringify({ space, radius, font, motion });

function modeValues(mode: ModeName) {
  const { color, shadow } = modes[mode];
  return { color: stringify(color), shadow: stringify(shadow), ...shared };
}

export type ThemeValues = ReturnType<typeof modeValues>;

export const lightValues: ThemeValues = modeValues('light');
export const darkValues: ThemeValues = modeValues('dark');

export { breakpoint };

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

/**
 * Start a brand theme from a base mode and override only what differs.
 *
 * @example
 *   // brand.css.ts
 *   export const sunset = createTheme(vars, mergeThemeValues(lightValues, {
 *     color: { accent: 'oklch(0.6 0.17 40)' },
 *     radius: { md: '2px' },
 *   }));
 */
export function mergeThemeValues(base: ThemeValues, overrides: DeepPartial<ThemeValues>): ThemeValues {
  const merge = (a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = { ...a };
    for (const [key, value] of Object.entries(b)) {
      if (value === undefined) continue;
      out[key] =
        value !== null && typeof value === 'object'
          ? merge((a[key] ?? {}) as Record<string, unknown>, value as Record<string, unknown>)
          : value;
    }
    return out;
  };
  return merge(base, overrides) as ThemeValues;
}
