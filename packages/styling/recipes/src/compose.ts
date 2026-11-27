import type { StyleRule } from '@vanilla-extract/css';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => v !== null && typeof v === 'object' && !Array.isArray(v);

function merge(a: Obj, b: Obj): Obj {
  const out: Obj = { ...a };
  for (const [key, value] of Object.entries(b)) {
    out[key] = isObj(value) && isObj(out[key]) ? merge(out[key] as Obj, value) : value;
  }
  return out;
}

/**
 * Deep-merge style rules. Unlike object spread, nested `selectors`, `@media`
 * and `@layer` blocks from different fragments are combined, not overwritten.
 */
export function compose(...rules: Array<StyleRule | false | null | undefined>): StyleRule {
  return rules.reduce<Obj>((acc, rule) => (rule ? merge(acc, rule as Obj) : acc), {}) as StyleRule;
}
