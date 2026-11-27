// Focused DTCG transformer for @mohirlab/tokens.
// Source of truth: src/**/*.json in Design Tokens Community Group format.
// Pure functions only, so they can be unit tested without touching disk.

const ALIAS = /^\{([^{}]+)\}$/;

const VALIDATORS = {
  color: (v) => typeof v === 'string' && /^(#|oklch\(|rgb|hsl|color\()/.test(v),
  dimension: (v) => typeof v === 'string' && /^(0|-?\d*\.?\d+(px|rem|em))$/.test(v),
  fontFamily: (v) => typeof v === 'string' && v.length > 0,
  fontWeight: (v) => typeof v === 'number' && v >= 1 && v <= 1000,
  number: (v) => typeof v === 'number',
  duration: (v) => typeof v === 'string' && /^\d+(ms|s)$/.test(v),
  cubicBezier: (v) => Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number'),
  // DTCG shadows are objects; we accept a CSS shadow string as a documented extension.
  shadow: (v) => typeof v === 'string' && v.length > 0,
};

const isToken = (node) => node !== null && typeof node === 'object' && '$value' in node;
const childKeys = (node) => Object.keys(node).filter((k) => !k.startsWith('$'));

/** Walk every token, yielding { path, token, type } with inherited group $type. */
export function* walk(tree, path = [], inheritedType) {
  const type = tree.$type ?? inheritedType;
  if (isToken(tree)) {
    yield { path, token: tree, type };
    return;
  }
  for (const key of childKeys(tree)) {
    yield* walk(tree[key], [...path, key], type);
  }
}

export function getAt(tree, path) {
  let node = tree;
  for (const key of path) {
    if (node === null || typeof node !== 'object' || !(key in node)) return undefined;
    node = node[key];
  }
  return node;
}

/** Return a list of human-readable problems. Empty means valid. */
export function validate(tree, context = tree) {
  const problems = [];
  for (const { path, token, type } of walk(tree)) {
    const id = path.join('.');
    if (!type) {
      problems.push(`${id}: missing $type (on the token or a parent group)`);
      continue;
    }
    const check = VALIDATORS[type];
    if (!check) {
      problems.push(`${id}: unsupported $type "${type}"`);
      continue;
    }
    const raw = token.$value;
    const alias = typeof raw === 'string' ? raw.match(ALIAS) : null;
    if (alias) {
      const target = getAt(context, alias[1].split('.'));
      if (!isToken(target)) problems.push(`${id}: alias {${alias[1]}} does not point to a token`);
      continue;
    }
    if (!check(raw)) problems.push(`${id}: ${JSON.stringify(raw)} is not a valid ${type}`);
  }
  return problems;
}

/** Resolve a single token value, following alias chains through `context`. */
export function resolveValue(raw, context, seen = []) {
  const alias = typeof raw === 'string' ? raw.match(ALIAS) : null;
  if (!alias) return raw;
  const ref = alias[1];
  if (seen.includes(ref)) throw new Error(`Alias cycle: ${[...seen, ref].join(' -> ')}`);
  const target = getAt(context, ref.split('.'));
  if (!isToken(target)) throw new Error(`Unknown alias {${ref}}`);
  return resolveValue(target.$value, context, [...seen, ref]);
}

/** Convert a resolved DTCG value into something CSS can use directly. */
export function toCssValue(value, type) {
  if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`;
  return value;
}

/** Nested { group: { name: value } } object with aliases resolved. */
export function toValues(tree, context = tree) {
  const out = {};
  for (const { path, token, type } of walk(tree)) {
    let node = out;
    for (const key of path.slice(0, -1)) node = node[key] ??= {};
    node[path.at(-1)] = toCssValue(resolveValue(token.$value, context), type);
  }
  return out;
}

export const cssVarName = (path, prefix = 'ml') => `--${prefix}-${path.join('-').replace(/\./g, '_')}`;

export function toCssBlock(selector, tree, context = tree) {
  const lines = [];
  for (const { path, token, type } of walk(tree)) {
    lines.push(`  ${cssVarName(path)}: ${toCssValue(resolveValue(token.$value, context), type)};`);
  }
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function toFlatJson(tree, context = tree) {
  const out = {};
  for (const { path, token, type } of walk(tree)) {
    out[path.join('.')] = toCssValue(resolveValue(token.$value, context), type);
  }
  return out;
}

/** Render a value as a TypeScript literal type (for generated .d.ts). */
export function toTypeLiteral(value, indent = '') {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return String(value);
  const next = indent + '  ';
  const body = Object.entries(value)
    .map(([k, v]) => `${next}readonly ${JSON.stringify(k)}: ${toTypeLiteral(v, next)};`)
    .join('\n');
  return `{\n${body}\n${indent}}`;
}
