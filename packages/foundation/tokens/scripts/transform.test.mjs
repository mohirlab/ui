import { describe, expect, it } from 'vitest';
import { resolveValue, toCssBlock, toValues, validate } from './transform.mjs';

const tree = {
  color: {
    $type: 'color',
    base: { $value: 'oklch(0.5 0.1 200)' },
    alias: { $value: '{color.base}' },
    chain: { $value: '{color.alias}' },
  },
  ease: { $type: 'cubicBezier', out: { $value: [0, 0, 0.2, 1] } },
};

describe('validate', () => {
  it('accepts a well-formed tree', () => {
    expect(validate(tree)).toEqual([]);
  });

  it('reports missing types, bad values and dangling aliases', () => {
    const bad = {
      a: { $value: '1px' },
      size: { $type: 'dimension', b: { $value: 'big' }, c: { $value: '{size.nope}' } },
    };
    expect(validate(bad)).toEqual([
      'a: missing $type (on the token or a parent group)',
      'size.b: "big" is not a valid dimension',
      'size.c: alias {size.nope} does not point to a token',
    ]);
  });
});

describe('resolveValue', () => {
  it('follows alias chains', () => {
    expect(resolveValue('{color.chain}', tree)).toBe('oklch(0.5 0.1 200)');
  });

  it('detects cycles', () => {
    const cyclic = { c: { $type: 'color', a: { $value: '{c.b}' }, b: { $value: '{c.a}' } } };
    expect(() => resolveValue('{c.a}', cyclic)).toThrow(/cycle/);
  });
});

describe('outputs', () => {
  it('builds nested values with CSS-ready easing', () => {
    expect(toValues(tree)).toEqual({
      color: { base: 'oklch(0.5 0.1 200)', alias: 'oklch(0.5 0.1 200)', chain: 'oklch(0.5 0.1 200)' },
      ease: { out: 'cubic-bezier(0, 0, 0.2, 1)' },
    });
  });

  it('emits prefixed custom properties', () => {
    expect(toCssBlock(':root', { space: { $type: 'dimension', 0.5: { $value: '2px' } } })).toBe(
      ':root {\n  --ml-space-0_5: 2px;\n}\n',
    );
  });
});
