import { createThemeContract } from '@vanilla-extract/css';
import { lightValues, type ThemeValues } from './values';

type Blank<T> = { [K in keyof T]: T[K] extends object ? Blank<T[K]> : null };

const blank = <T extends object>(obj: T): Blank<T> =>
  JSON.parse(JSON.stringify(obj, (_key, v) => (typeof v === 'string' ? null : v)));

/**
 * The theme contract. Its shape comes from the semantic tokens, so adding a
 * token to `@mohirlab/tokens` adds a variable here with no hand-editing.
 */
export const vars = createThemeContract(blank<ThemeValues>(lightValues));
