# Vanilla Extract: contributor reference

A dense reference of what Vanilla Extract (VE) can do, written so contributors
don't have to re-read the upstream docs. Every API, option and behaviour below
was checked against the upstream source. Where the source is silent, this file
says so instead of guessing.

- **Source:** `github.com/vanilla-extract-css/vanilla-extract`, `master`
- **Commit:** `93fb6215de0f7402c3c9cd15af017312aa1e5ef0` (committed 2026-11-25)
- **Read:** `site/docs/**` (all docs), every `packages/*/CHANGELOG.md` and
  README, public source entry points (`packages/*/src`), pending
  `.changeset/*.md`, `fixtures/`, `examples/`, `tests/e2e`.
- **Package versions at that commit:**

| Package                                   | Version | Package                                | Version |
| ----------------------------------------- | ------- | -------------------------------------- | ------- |
| `@vanilla-extract/css`                    | 1.21.3  | `@vanilla-extract/rollup-plugin`       | 1.5.4   |
| `@vanilla-extract/recipes`                | 0.5.7   | `@vanilla-extract/vite-plugin`         | 5.2.6   |
| `@vanilla-extract/sprinkles`              | 1.7.1   | `@vanilla-extract/esbuild-plugin`      | 2.3.22  |
| `@vanilla-extract/dynamic`                | 2.1.5   | `@vanilla-extract/webpack-plugin`      | 2.3.27  |
| `@vanilla-extract/css-utils`              | 0.1.6   | `@vanilla-extract/next-plugin`         | 2.5.2   |
| `@vanilla-extract/integration`            | 8.0.11  | `@vanilla-extract/turbopack-plugin`    | 0.1.4   |
| `@vanilla-extract/compiler`               | 0.7.2   | `@vanilla-extract/parcel-transformer`  | 1.0.21  |
| `@vanilla-extract/jest-transform`         | 1.1.22  | `@vanilla-extract/esbuild-plugin-next` | 0.0.10  |
| `@vanilla-extract/babel-plugin-debug-ids` | 1.2.2   | `@vanilla-extract/private`             | 1.0.9   |

The npm name of the `packages/utils` folder is `@vanilla-extract/css-utils`.

---

## Table of contents

1. [Mental model](#1-mental-model)
2. [Core `@vanilla-extract/css`](#2-core-vanilla-extractcss)
   - 2.1 [Style objects](#21-style-objects)
   - 2.2 [`style`](#22-style)
   - 2.3 [Composition and merging](#23-composition-and-merging)
   - 2.4 [`styleVariants`](#24-stylevariants)
   - 2.5 [`globalStyle`](#25-globalstyle)
   - 2.6 [Selectors and the "target only `&`" rule](#26-selectors-and-the-target-only--rule)
   - 2.7 [At-rules inside styles](#27-at-rules-inside-styles)
   - 2.8 [CSS variables: `vars`, `createVar`, `createGlobalVar`, `fallbackVar`, `assignVars`](#28-css-variables)
   - 2.9 [Themes](#29-themes)
   - 2.10 [Keyframes](#210-keyframes)
   - 2.11 [Font faces](#211-font-faces)
   - 2.12 [Layers](#212-layers)
   - 2.13 [`createContainer`, `createViewTransition`](#213-createcontainer-createviewtransition)
   - 2.14 [Identifiers and debug IDs](#214-identifiers-and-debug-ids)
   - 2.15 [File scope and `.css.ts` rules](#215-file-scope-and-cssts-rules)
   - 2.16 [What can be exported from `.css.ts`](#216-what-can-be-exported-from-cssts)
   - 2.17 [`addFunctionSerializer`](#217-addfunctionserializer)
   - 2.18 [Sub-path entry points](#218-sub-path-entry-points)
   - 2.19 [CSS output order](#219-css-output-order)
3. [`@vanilla-extract/recipes`](#3-vanilla-extractrecipes)
4. [`@vanilla-extract/sprinkles`](#4-vanilla-extractsprinkles)
5. [`@vanilla-extract/dynamic`](#5-vanilla-extractdynamic)
6. [`@vanilla-extract/css-utils`](#6-vanilla-extractcss-utils)
7. [Low-level packages](#7-low-level-packages)
8. [Bundler integrations](#8-bundler-integrations)
9. [Publishing libraries with VE](#9-publishing-libraries-with-ve)
10. [Testing](#10-testing)
11. [SSR and frameworks](#11-ssr-and-frameworks)
12. [Theming patterns](#12-theming-patterns)
13. [Limitations and gotchas](#13-limitations-and-gotchas)
14. [Changelog digest (roughly the last two years)](#14-changelog-digest)
15. [Keyword check: Rolldown, tsdown, Vite 7/8, Turbopack, React Native, SSR](#15-keyword-check)
16. [Implications for Mohirlab](#16-implications-for-mohirlab)

---

## 1. Mental model

- You write styles in `*.css.ts` files (strictly: any file matching
  `/\.css\.(js|cjs|mjs|jsx|ts|tsx)(\?used)?$/`, exported as `cssFileFilter`
  from `@vanilla-extract/integration`).
- At **build time** a bundler plugin evaluates each such file in Node.
  Calls such as `style()` record CSS through an "adapter". The module's exports
  are serialized back to plain JS (strings, objects, arrays). The CSS becomes a
  virtual `*.vanilla.css` import that the bundler handles like any other CSS.
- Result: no CSS-in-JS runtime. The shipped JS holds only class-name strings,
  `var(--x)` strings and, for sprinkles/recipes, a tiny lookup function.
- Everything is locally scoped by default (hashed names). Each local API has a
  `global*` sibling that takes an explicit name.
- `@vanilla-extract/css` has `"sideEffects": true`. Its browser build installs
  a runtime adapter that injects `<style>` tags. That adapter only matters when
  `.css.ts` code actually runs in a browser, as with jsdom tests or the esbuild
  `runtime: true` mode.

---

## 2. Core `@vanilla-extract/css`

Public exports (`src/index.ts`): `style`, `styleVariants`, `globalStyle`,
`composeStyles` (deprecated), `fontFace`, `globalFontFace`, `keyframes`,
`globalKeyframes`, `createVar`, `createGlobalVar`, `fallbackVar`, `assignVars`,
`createThemeContract`, `createGlobalThemeContract`, `createTheme`,
`createGlobalTheme`, `layer`, `globalLayer`, `createContainer`,
`createViewTransition`, `generateIdentifier`, `assertVarName`. Types:
`StyleRule`, `ComplexStyleRule`, `GlobalStyleRule`, `Adapter`, `FileScope`,
`CSSProperties`.

### 2.1 Style objects

```ts
type CSSProperties = {
  [P in keyof csstype.Properties<number | (string & {})>]:
    | Value
    | CSSVarFunction
    | Array<CSSVarFunction | Value>;
};
type CSSPropertiesWithVars = CSSProperties & { vars?: { [key: string]: string } };
// StyleRule = CSS props + vars + simple pseudos + selectors + nested at-rules
type StyleRule = WithQueries<StyleWithSelectors>;
type GlobalStyleRule = WithQueries<CSSPropertiesWithVars>; // no pseudos, no selectors
type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;
type ClassNames = string | Array<ClassNames>;
```

- **camelCase** properties. Vendor prefixes are PascalCase without the leading
  dash: `WebkitTapHighlightColor`.
- **Numbers get `px`** appended, except for unitless properties. The
  `UNITLESS` list in `transformCss.ts` includes `animationIterationCount`,
  `borderImage*`, `boxFlex`, `boxFlexGroup`, `boxOrdinalGroup`, `columnCount`,
  `columns`, `flex`, `flexGrow`, `flexShrink`, `fontWeight`, `gridArea`,
  `gridColumn*`, `gridRow*`, `initialLetter`, `lineClamp`, `lineHeight`,
  `maxLines`, `opacity`, `order`, `orphans`, `scale`, `tabSize` and more.
- **Fallback values** use an array, which renders the declaration twice:
  `overflow: ['auto', 'overlay']`.
- **Custom properties** must go in the `vars` key, never at the top level
  (this keeps the typing precise). Keys can be raw names (`'--x'`) or
  `createVar()` references.
- Types come from `csstype` `^3.2.3`, which includes the container
  properties.

### 2.2 `style`

```ts
function style(rule: ComplexStyleRule, debugId?: string): string;
```

```ts
// button.css.ts
import { style, createVar } from '@vanilla-extract/css';
const accent = createVar();
export const button = style({
  display: 'flex',
  padding: 10, // -> 10px
  vars: { [accent]: 'blue', '--global-x': '1' },
  ':hover': { color: accent }, // simple pseudo
  selectors: { '&:nth-child(2n)': { background: '#fafafa' } },
  '@media': { 'screen and (min-width: 768px)': { padding: 16 } },
  '@supports': { '(display: grid)': { display: 'grid' } },
});
```

Returns a locally scoped class name. Passing an array composes and merges
([2.3](#23-composition-and-merging)).

### 2.3 Composition and merging

```ts
const base = style({ padding: 12 });
const primary = style([base, { background: 'blue' }]);
// primary === 'styles_base__x0 styles_primary__x1'
```

- In an array, **strings and nested arrays are class names**, objects are style
  rules. All style objects are **deep-merged** into a single class using
  `deepmerge-ts` with `mergeArrays: false`, so arrays are replaced, not
  concatenated. Later objects win, including inside `@media`.
- The return value is a **class list**: a new identifier plus the composed
  classes. Inside VE selectors (and `globalStyle` selectors) a composed class
  list acts as **one class**. Internally VE swaps the list for its unique
  identifier class.
- If a composition is never used in a selector and has no own styles, its
  identifier is stripped from the exported strings at build time
  ("unused compositions").
- Nested class-name arrays work: `style([[a, b], {...}, [c]])` (fixed in 1.19.1).
- `composeStyles(...classNames)` is **deprecated**. Use `style([...])`.
- `style([''])` (what recipes produce for empty values) composes nothing
  (fix #1745).

Merging lets you build style helpers:

```ts
const responsive = ({ tablet, desktop }) => ({
  '@media': { 'screen and (min-width: 768px)': tablet, 'screen and (min-width: 1024px)': desktop },
});
export const container = style([
  { display: 'flex' },
  responsive({ tablet: { flex: 1 }, desktop: { flexDirection: 'row' } }),
]);
```

### 2.4 `styleVariants`

```ts
function styleVariants<StyleMap extends Record<string | number, ComplexStyleRule>>(
  styleMap: StyleMap,
  debugId?: string,
): Record<keyof StyleMap, string>;
function styleVariants<Data extends Record<string | number, unknown>, Key extends keyof Data>(
  data: Data,
  mapData: (value: Data[Key], key: Key) => ComplexStyleRule,
  debugId?: string,
): Record<keyof Data, string>;
```

```ts
export const background = styleVariants({
  primary: { background: 'blue' },
  secondary: [base, { background: 'aqua' }], // composition allowed
});
export const tone = styleVariants({ primary: 'blue', secondary: 'aqua' }, (color, key) => [
  base,
  { background: color },
]);
// <button className={background[props.variant]}>
```

Each entry calls `style()` with the debug id `${debugId}_${key}` (or just
`key`).

### 2.5 `globalStyle`

```ts
function globalStyle(selector: string, rule: GlobalStyleRule): void;
```

```ts
globalStyle('html, body', { margin: 0 });
export const parent = style({});
globalStyle(`${parent} > a`, { color: 'pink' }); // scoped classes allowed in selector
```

- **No simple pseudos and no `selectors` key.** The transformer throws
  `Simple pseudos are not valid in "globalStyle"` and
  `Selectors are not allowed within "globalStyle"`. Put the pseudo in the
  selector string instead.
- `vars`, `@media`, `@supports`, `@container`, `@layer` and `@scope` (1.21.0+)
  are allowed.
- `globalStyle` is the escape hatch for styling descendants: `& a[href]` is
  invalid in `style`, but `globalStyle(\`${parent} a[href]\`, …)` works.

### 2.6 Selectors and the "target only `&`" rule

**Simple pseudos** are parameterless pseudo-classes/elements that sit at the
top level of a style. The full list is in `src/simplePseudos.ts`: `:hover`,
`:focus`, `:focus-visible`, `:focus-within`, `:active`, `:checked`,
`:disabled`, `:first-child`, `::before`, `::after`, `::placeholder`,
`::selection`, `::backdrop`, `::marker`, `::file-selector-button`,
`::view-transition*`, many `-webkit-` / `-moz-` / `-ms-` ones (including
`::-webkit-calendar-picker-indicator`, added in 1.16.0), and more. A pseudo
block may hold **only CSS properties and `vars`**. It can't nest selectors or
at-rules.

**Complex selectors** go in `selectors`. Every selector must **target the
current element**, which `&` stands for:

```ts
export const parent = style({});
export const link = style({
  selectors: {
    '&:hover:not(:active)': { border: '2px solid aquamarine' },
    'nav li > &': { textDecoration: 'underline' },
    [`${parent}:focus &`]: { background: '#fafafa' },
    ':is(h1 > &, h2 > &)': { color: 'blue' }, // 1.20.0+: every branch must target &
  },
});
```

How validation works (`validateSelector.ts`): the selector is parsed with
`css-what`. For each comma-separated part, the walk goes right to left from
the end of the selector, and the **last compound** must contain the current
class. If a combinator (descendant, child, sibling, adjacent, parent) shows up
first, the selector is rejected. `:is()` and `:where()` count only if **every**
argument targets `&`. Invalid:

```ts
selectors: {
  '& a[href]': {},              // targets a[href]
  '& ~ div > .otherClass': {},  // targets .otherClass
  [`& ${child}`]: {},           // targets child: put `${parent} &` on child instead
  ':is(h1 > &, h2)': {},        // one branch doesn't target &
}
```

- Inside `selectors`, a block can't contain another `selectors` key or simple
  pseudos. It can contain `@media`, `@supports`, `@container` (fixed in
  1.17.1), `@layer`, `@scope` and `@starting-style`.
- **Circular references:** use a getter so that a later export can be referenced.

```ts
export const child = style({
  get selectors() {
    return { [`${parent} &`]: { color: 'red' } };
  },
});
export const parent = style({ selectors: { [`&:has(${child})`]: { padding: 10 } } });
```

### 2.7 At-rules inside styles

Every key below nests inside `style`, inside `globalStyle` (apart from the
exceptions noted), and inside each other, in any combination
(`WithQueries<T>`):

| Key               | Shape                   | Notes                                                                                                                                                                          |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@media`          | `{ [query]: rule }`     | Queries are validated with `media-query-parser`. An empty query throws. **Always rendered after unconditional rules**, so it wins on order.                                    |
| `@supports`       | `{ [condition]: rule }` |                                                                                                                                                                                |
| `@container`      | `{ [query]: rule }`     | Use `createContainer()` names: `` `${sidebar} (min-width: 768px)` ``. Not polyfilled.                                                                                          |
| `@layer`          | `{ [layerName]: rule }` | The name can come from `layer()` / `globalLayer()` or be any string.                                                                                                           |
| `@scope`          | `{ [bounds]: rule }`    | **1.21.0+**, for `style` and `globalStyle`. Bounds look like `'(body)'` or `` `(${root}) to (${limit})` ``. A `&` in the bounds (outside quotes) becomes the current selector. |
| `@starting-style` | `rule` (no query key)   | **1.18.0+**, typed for `style`. **Nested at-rules inside it throw** (`Nested at-rules … are not allowed inside @starting-style`). It _can_ sit inside `@media` and the like.   |

```ts
export const fadeIn = style({
  opacity: 1,
  transition: 'opacity .3s',
  '@starting-style': { opacity: 0 },
});
export const scoped = style({
  '@scope': { '(body)': { ':after': { content: '"Scoped to body"' } } },
});
```

When it's safe, VE merges identical `@media`, `@supports` and `@container`
blocks to keep the output small.

### 2.8 CSS variables

```ts
type VarDeclaration =
  | { syntax: '*'; inherits: boolean; initialValue?: string }
  | { syntax: Exclude<PropertySyntax, '*'> | Array<PropertySyntax>; inherits: boolean; initialValue: string };

function createVar(debugId?: string): CSSVarFunction; // 'var(--name__hash)'
function createVar(declaration: VarDeclaration, debugId?: string): CSSVarFunction; // + @property
function createGlobalVar(name: string): CSSVarFunction; // 'var(--name)'
function createGlobalVar(name: string, declaration: VarDeclaration): CSSVarFunction;
function fallbackVar(...values: [string, ...string[]]): CSSVarFunction;
function assignVars<C extends Contract>(
  contract: C,
  tokens: MapLeafNodes<C, string>,
): Record<CSSVarFunction, string>;
function assertVarName(value: unknown): asserts value is `var(--${string})`;
```

- `createVar()` emits no CSS. It only returns a reference. Set the value with
  `vars: { [myVar]: 'blue' }`, which also works inside `@media`, selectors and
  similar blocks.
- `createVar({ syntax, inherits, initialValue })` also emits an `@property`
  rule (1.17.0+). `PropertySyntax` suggests `<color>`, `<length>`, `<angle>`,
  `<number>` and so on, but accepts any string. An array is joined with `|`.
- `createGlobalVar('opacity')` and `createGlobalVar('--opacity')` both give
  `var(--opacity)`. The leading `--` is trimmed (1.21.0+).
- `fallbackVar(a, b, 'blue')` gives `var(--a, var(--b, blue))`. Every argument
  except the last must be a `var(--…)` string, or it throws `Invalid variable
  name`. An empty-string fallback gives `var(--x, )` (fixed in 1.21.0).
- `assignVars(contract, tokens)` returns a `vars` object. The contract can be
  a **sub-tree** (`assignVars(vars.space, {...})`). It throws `Tokens don't
  match contract` when the shape differs.

```ts
export const responsiveTheme = style({
  vars: assignVars(vars, { space: { small: '4px', large: '16px' } }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.space, { small: '8px', large: '32px' }),
    },
  },
});
```

`@vanilla-extract/dynamic` covers runtime (inline) assignment
([section 5](#5-vanilla-extractdynamic)).

### 2.9 Themes

```ts
type Tokens = { [key: string]: string | Tokens };
type NullableTokens = { [key: string]: string | NullableTokens | null };
type ThemeVars<T> = MapLeafNodes<T, CSSVarFunction>;

function createThemeContract<T extends NullableTokens>(tokens: T): ThemeVars<T>;
function createGlobalThemeContract<T extends Tokens>(tokens: T): ThemeVars<T>;
function createGlobalThemeContract<T extends NullableTokens>(
  tokens: T,
  mapFn: (value: string | null, path: string[]) => string,
): ThemeVars<T>;

function createTheme<T extends Tokens>(
  tokens: T & { '@layer'?: string },
  debugId?: string,
): [className: string, vars: ThemeVars<T>];
function createTheme<C extends Contract>(
  contract: C,
  tokens: MapLeafNodes<C, string> & { '@layer'?: string },
  debugId?: string,
): string;

function createGlobalTheme<T extends Tokens>(
  selector: string,
  tokens: T & { '@layer'?: string },
): ThemeVars<T>;
function createGlobalTheme<C extends Contract>(
  selector: string,
  contract: C,
  tokens: MapLeafNodes<C, string> & { '@layer'?: string },
): void;
```

- `createThemeContract` gives scoped var names (`--color-brand__hash`, built from
  the path joined with `-` and used as the debug id). **Leaf values are
  ignored**, so `null`, `''` or real values all work. It emits **no CSS**.
- `createGlobalThemeContract` gives **unhashed** names from the leaf strings,
  or from `mapFn(value, path)`. A leading `--` is trimmed. Names must be valid
  CSS identifiers or it throws `Invalid variable name for "a.b"`. Use it when
  non-JS consumers need stable names, or when names must stay identical
  across builds and packages.
- `createTheme(tokens)` creates a hashed class plus a new contract.
  `createTheme(contract, tokens)` creates a class that assigns an existing
  contract. All leaves are required: a missing one is a type error and a
  runtime throw.
- `createGlobalTheme(':root', …)` assigns the vars on a global selector.
  Import the file for its side effect.
- **`'@layer': name`** at the top level of the tokens wraps the declarations
  in that layer (1.17.0+).
- `createTheme`'s debug id names the class. The babel plugin also handles
  array-destructured `createTheme`.

### 2.10 Keyframes

```ts
function keyframes(rule: CSSKeyframes, debugId?: string): string; // scoped name
function globalKeyframes(name: string, rule: CSSKeyframes): void;
interface CSSKeyframes {
  [time: string]: CSSPropertiesWithVars;
} // steps may set vars (1.17.0+)
```

```ts
const rotate = keyframes({ '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } });
export const spin = style({ animation: `${rotate} 3s` });

const angle = createVar({ syntax: '<angle>', inherits: false, initialValue: '0deg' });
const spinVar = keyframes({ '0%': { vars: { [angle]: '0deg' } }, '100%': { vars: { [angle]: '360deg' } } });
```

### 2.11 Font faces

```ts
type GlobalFontFaceRule = csstype.AtRule.FontFaceFallback & { src: required };
type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;
function fontFace(rule: FontFaceRule | FontFaceRule[], debugId?: string): string; // returns '"hashedFamily"'
function globalFontFace(fontFamily: string, rule: FontFaceRule | FontFaceRule[]): void;
```

- `fontFace` returns a quoted, hashed family name. Passing `fontFamily` in
  the rule **throws**.
- An array registers several `@font-face` rules (weights, styles) under one
  family. Arrays work in `fontFace` since 1.12 and in `globalFontFace` since
  1.15.

### 2.12 Layers

```ts
type LayerOptions = { parent?: string };
function layer(debugId?: string): string; // scoped name
function layer(options: LayerOptions, debugId?: string): string; // 'parent.child'
function globalLayer(name: string): string;
function globalLayer(options: LayerOptions, name: string): string;
```

```ts
// layers.css.ts
export const reset = globalLayer('reset');
export const framework = globalLayer('framework');
export const typography = globalLayer({ parent: framework }, 'typography'); // 'framework.typography'

// text.css.ts
import { typography } from './layers.css';
export const standard = style({ '@layer': { [typography]: { fontSize: '1rem' } } });
```

- Each `layer()` / `globalLayer()` call emits a `@layer name;` statement.
  **Using** a layer in `'@layer': {…}` also registers that statement. The
  per-file `Map` keeps the order in which layers were first seen, so the
  first layer touched in a file is the first one declared there.
- Rules in the same layer within one file are merged if precedence allows. A
  rule in a later-declared layer can therefore show up later in the output
  than its source order suggests.
- The `fixtures/layers` example shows the browser rule that the **first**
  `@layer` statement fixes the order: a layer used only under `@media` and
  declared later ends up last.
- Sprinkles `defineProperties({ '@layer': … })` and themes
  (`'@layer'` key) assign whole sets to a layer.
- Not polyfilled.

### 2.13 `createContainer`, `createViewTransition`

```ts
const createContainer: (debugId?: string) => string;       // scoped container-name
const createViewTransition: (debugId?: string) => string;  // 1.16.0+, scoped view-transition-name
```

```ts
export const sidebar = createContainer();
export const shell = style({ containerName: sidebar, containerType: 'inline-size' });
export const nav = style({ '@container': { [`${sidebar} (min-width: 400px)`]: { display: 'flex' } } });

export const titleVT = createViewTransition();
export const title = style({ viewTransitionName: titleVT });
```

Both are aliases of `generateIdentifier` and emit no CSS.

### 2.14 Identifiers and debug IDs

Every bundler plugin takes `identifiers`:

```ts
type IdentifierOption =
  | 'short'
  | 'debug'
  | ((p: { hash: string; filePath: string; debugId?: string; packageName?: string }) => string);
```

- **`short`:** the hash is `hash(packageName + filePath)` (via `@emotion/hash`)
  plus a per-file counter in base 36, for example `hnw5tz3`. A leading digit
  gets a `_` prefix.
- **`debug`:** `${fileName}_${debugId}__${hash}`, for example
  `button_primary__hnw5tz3`. The file name is the base name before `.css`.
  `index.css.ts` uses its directory name instead. Dots become `_` (1.21.2).
  Whitespace in a debug id becomes `_`. `createVar` debug names leave out the
  file name.
- **Custom function:** the result must match `/^[A-Z_][0-9A-Z_-]+$/i`, or VE
  throws `Identifier function returned invalid indentifier`. Hyphens are
  allowed (1.14.1).
- **Defaults** depend on the bundler: Vite uses `config.mode === 'production'`
  → short. Rollup uses `process.env.NODE_ENV === 'production'` → short.
  esbuild uses `minify`. webpack uses `mode`. Parcel uses
  `mode === 'development'` → debug. The Jest transform always uses debug. The
  browser runtime adapter uses `NODE_ENV`.
- **Automatic debug IDs:** integrations run
  `@vanilla-extract/babel-plugin-debug-ids` **only when the resolved ident
  option is the string `'debug'`** (`integration/src/transform.ts`). The plugin
  appends the variable name as the last argument to calls imported from
  `@vanilla-extract/css` or `@vanilla-extract/recipes`: `style`,
  `createTheme`, `styleVariants`, `fontFace`, `keyframes`, `createVar`
  (including the `@property` form), `recipe`, `createContainer`,
  `createViewTransition` and `layer`. Wrapper functions from other modules get
  nothing.
- **So with `short` or a custom function, `debugId` is only set when code
  passes one explicitly.** Examples: `style(rule, 'x')`; `styleVariants`
  keys; sprinkles' `${prop}_${value}_${condition}`; recipe variant names.
- Identifiers are stable when the package name, the path relative to the
  plugin `cwd`/root and the call order within the file all stay the same.
  Reordering `style()` calls changes the counter suffixes.

### 2.15 File scope and `.css.ts` rules

- Plugins wrap each VE file with
  `setFileScope(relativePosixPath, packageName)` … `endFileScope()` from
  `@vanilla-extract/css/fileScope` (`integration/src/addFileScope.ts`). This
  works for both ESM and CJS. If the source **already contains** a
  `@vanilla-extract/css/fileScope` import, the existing `setFileScope(...)`
  arguments are **rewritten** to the current path and package. That's how
  pre-scoped library files (`unstable_injectFilescopes`) get re-scoped by the
  consumer.
- `packageName` comes from the nearest `package.json` that has a `name`,
  searching up from the plugin's `cwd`/root. It isn't taken per file.
- Calling a style API with no active file scope throws:
  `Styles were unable to be assigned to a file … You may have created styles
  outside of a '.css.ts' context`.
- **Helpers outside `.css.ts` are fine** as long as they're _called_ while a
  `.css.ts` file is being evaluated. For example, a `layers.ts` that calls
  `globalLayer` inside a function the `.css.ts` invokes. A top-level
  `style()` in a plain `.ts` module throws when that module is imported
  from runtime code.
- `.css.ts` files can import other `.css.ts` files. Each keeps its own scope
  and CSS file.
- During evaluation `process.env.NODE_ENV` is reset to its value at startup,
  to work around Vite changing it.

### 2.16 What can be exported from `.css.ts`

From `serializeVanillaModule` / `stringifyExports` in
`integration/src/processVanillaFile.ts`:

- Allowed: strings, numbers, booleans, `null`, `undefined`, arrays, **plain
  objects** (prototype `Object` or `null`), circular references, and objects
  with `Symbol.toStringTag` such as module namespaces (the tag is dropped).
- Allowed: **functions annotated with `addFunctionSerializer`** (how recipes
  and sprinkles survive).
- Everything else, such as class instances, `Map`/`Set`, `Date` or plain
  functions, throws `Invalid exports. You can only export plain objects,
  arrays, strings, numbers and null/undefined.`
- When the same object is exported under two names, the output reuses it by
  reference instead of duplicating it. Exports are topologically sorted.
- The output module is: CSS imports, then function-serializer imports
  (`import { createRuntimeFn as _abc12 } from '@vanilla-extract/recipes/createRuntimeFn'`),
  then `export var name = <literal>;`.
- Non-exported code is **discarded**. Side effects don't survive into the
  runtime JS, apart from the CSS they produced.

### 2.17 `addFunctionSerializer`

```ts
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
function addFunctionSerializer<T extends object>(
  target: T,
  config: {
    importPath: string; // runtime module path, must be importable by consumers
    importName: string;
    args: ReadonlyArray<Serializable>; // primitives / plain objects / arrays (arrays of primitives OK since 1.17.3)
  },
): T;
```

Pattern for library authors: split a runtime module that doesn't import
`@vanilla-extract/css` and expose it as its own package entry point. In the
build-time function, call the runtime function with serializable arguments
and annotate the result:

```ts
export function styledDiv(styles) {
  const className = style(styles);
  const Component = runtimeStyledDiv(className);
  return addFunctionSerializer(Component, {
    importPath: 'my-lib/runtime',
    importName: 'runtimeStyledDiv',
    args: [className],
  });
}
```

The property it sets is `__recipe__`, kept for backwards compatibility.
`addRecipe` from `@vanilla-extract/css/recipe` is a deprecated alias.

### 2.18 Sub-path entry points

`@vanilla-extract/css` exports `.`, `./recipe`, `./functionSerializer`,
`./adapter` (`setAdapter`, `removeAdapter`, `mockAdapter`…), `./transformCss`,
`./fileScope` (`setFileScope`, `endFileScope`, `hasFileScope`, `getFileScope`),
`./injectStyles`, `./disableRuntimeStyles` (installs the mock adapter, so no
styles are injected) and `./vanilla.virtual.css?*` (1.19.0, Turbopack). Each
has `browser`, `module` and `default` conditions.

### 2.19 CSS output order

Within one file's CSS (`transformCss.ts` `toCss()`): all `@font-face` →
`@property` → `@keyframes` → `@layer` statements → unconditional rules in
call order → conditional rules (`@media` / `@supports` / `@container` /
`@layer` / `@scope` / `@starting-style` blocks). Across files, the order is
whatever import order the bundler produces.

---

## 3. `@vanilla-extract/recipes`

Stitches-style multi-variant styles. Built entirely on public VE APIs and
the function serializer.

```ts
function recipe<V extends VariantGroups>(
  options: {
    base?: ComplexStyleRule | string;
    variants?: V; // Record<group, Record<value, ComplexStyleRule | string>>
    defaultVariants?: VariantSelection<V>;
    compoundVariants?: Array<{ variants: VariantSelection<V>; style: ComplexStyleRule | string }>;
  },
  debugId?: string,
): RuntimeFn<V>;

type RuntimeFn<V> = ((options?: VariantSelection<V>) => string) & {
  variants: () => (keyof V)[];
  classNames: { base: string; variants: { [G in keyof V]: { [K in keyof V[G]]: string } } };
};
type RecipeVariants<R extends RuntimeFn<any>> = Parameters<R>[0]; // resolved
```

```ts
export const button = recipe({
  base: [reset, sprinkles({ borderRadius: 'round' })], // classes, sprinkles, style objects
  variants: {
    color: { neutral: { background: 'whitesmoke' }, brand: 'existing-class' },
    size: { small: { padding: 12 }, large: { padding: 24 } },
    rounded: { true: { borderRadius: 999 }, false: {} }, // boolean variant
  },
  compoundVariants: [{ variants: { color: 'neutral', size: 'large' }, style: { background: 'ghostwhite' } }],
  defaultVariants: { color: 'neutral', size: 'small' },
});
export type ButtonVariants = RecipeVariants<typeof button>;
// runtime:
button({ color: 'brand', rounded: true });
button.variants(); // ['color', 'size', 'rounded']
button.classNames.base; // base class (always created, even with no base styles)
button.classNames.variants.size.small;
```

- **Boolean variants:** use `true` / `false` keys. The prop type maps them to
  `boolean`. A missing boolean variant doesn't add an `'undefined'` class.
- Passing `undefined` for a variant uses the default. This also works under
  `exactOptionalPropertyTypes`.
- Compound variants compare against `selection ?? default`.
- A variant value can be a string class name. Strings are wrapped as
  `[string]`, which is a composition.
- Output JS:
  `import { createRuntimeFn } from '@vanilla-extract/recipes/createRuntimeFn'`
  plus an inline config of class names. **`@vanilla-extract/recipes` is
  therefore a runtime dependency of anything that ships compiled recipes.**
- Debug ids: the base uses `debugId`, groups use `${debugId}_${group}`, and
  compounds use `${debugId}_compound_${n}`. If no debugId was given, this
  produces the literal string `undefined_compound_0`.
- Exports: `recipe`, `RecipeVariants`, `RuntimeFn`. Sub-path:
  `./createRuntimeFn`.

---

## 4. `@vanilla-extract/sprinkles`

A zero-runtime atomic CSS generator. At build time `defineProperties`
creates one class per property × value × condition. `createSprinkles`
returns a type-safe lookup function that works in `.css.ts` (composition)
and at runtime (string lookup, under 0.5 KB gzip).

```ts
type ConditionKey = '@media' | '@scope' | '@supports' | '@container' | 'selector';
type Condition = Partial<Record<ConditionKey, string>>;

defineProperties({
  '@layer'?: string,
  conditions?: { [name: string]: Condition },
  defaultCondition?: keyof Conditions | Array<keyof Conditions> | false,  // required with conditions
  responsiveArray?: readonly [cond, cond, ...cond[]],
  properties: { [cssProp]: ReadonlyArray<value> | Record<name, value | StyleRuleWithoutConditions> }
            | { [customName]: Record<name, StyleRuleWithoutConditions> },
  shorthands?: { [name: string]: Array<keyof properties> },
});
createSprinkles(...defined: SprinklesProperties[]): SprinklesFn & { properties: Set<string> };
createMapValueFn(defined);       // (value, fn) => mapped conditional value
createNormalizeValueFn(defined); // value => { cond: value }
type ConditionalValue<typeof defined, Value>;
type RequiredConditionalValue<typeof defined, Value>;
// also exported: ResponsiveArray, SprinklesProperties; deprecated aliases createAtomicStyles, createAtomsFn
```

```ts
// sprinkles.css.ts
const responsive = defineProperties({
  '@layer': utilitiesLayer,
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['none', 'flex', 'block'],
    paddingTop: vars.space,
    paddingBottom: vars.space, // theme vars as values
    background: { red: { vars: { [alpha]: '1' }, background: `rgba(255,0,0,${alpha})` } }, // style objects
  },
  shorthands: { paddingY: ['paddingTop', 'paddingBottom'] },
});
const interactive = defineProperties({
  conditions: { base: {}, hover: { selector: '&:hover' }, focus: { selector: '&:focus' } },
  defaultCondition: 'base',
  properties: { color: vars.color },
});
export const sprinkles = createSprinkles(responsive, interactive);
export type Sprinkles = Parameters<typeof sprinkles>[0];
export const mapResponsiveValue = createMapValueFn(responsive);
export const normalizeResponsiveValue = createNormalizeValueFn(responsive);
export type ResponsiveValue<V extends string | number> = ConditionalValue<typeof responsive, V>;

// usage
sprinkles({ display: 'flex', paddingY: 'small', flexDirection: { mobile: 'column', desktop: 'row' } });
sprinkles({ display: ['none', null, 'flex'] }); // responsive array
style([sprinkles({ padding: 'small' }), { ':hover': { outline: '2px solid' } }]);
globalStyle(`${sprinkles({ padding: 'small' })} *`, { boxSizing: 'border-box' }); // acts as one class
sprinkles.properties.has('paddingX'); // filter Box props
mapResponsiveValue({ mobile: 'center', desktop: 'left' } as const, (v) => alignMap[v]);
normalizeResponsiveValue(['none', null, 'block']); // { mobile: 'none', desktop: 'block' }
```

Semantics, from the source:

- How a condition wraps a value, inside to outside: `@supports` →
  `@container` → `@media` → `@scope` → `selector` → `@layer`. A condition can
  combine several keys.
- Each class has the debug id `${prop}_${valueName}_${conditionName}`, or
  `${prop}_${valueName}` without conditions.
- `defaultCondition` can be an array for mutually exclusive conditions
  (light/dark). `false` forces the caller to name a condition explicitly.
- Properties and shorthands are created and applied **in config order**. Put
  the less specific ones first (`padding` before `paddingX`).
- `@scope` conditions arrived in 1.7.0. The type cap of 8 conditions was
  removed in 1.7.1. `@layer` arrived in 1.4.0 and container conditions in
  1.3.0.
- **Declare each `defineProperties` result as a variable before passing it to
  `createSprinkles`.** Inlining the call breaks type inference.
- Runtime validation (unknown property or value, wrong condition) throws
  `SprinklesError`, but only when `process.env.NODE_ENV !== 'production'`.
  Consumer bundlers have to define `process.env.NODE_ENV`.
- Output JS:
  `import { createSprinkles } from '@vanilla-extract/sprinkles/createRuntimeSprinkles'`,
  with the **entire config (every class name map) inlined as arguments**.
  Large configs mean large JS. `@vanilla-extract/sprinkles` is a **runtime
  dependency**.
- Outside a file scope (for example in a Jest runtime), `createSprinkles`
  falls back to plain class-list joining.
- Sub-paths: `./createRuntimeSprinkles`, `./createUtils`.

Alternatives mentioned in the docs: Rainbow Sprinkles (Wayfair).

---

## 5. `@vanilla-extract/dynamic`

A runtime under 1 KB that assigns VE variables at runtime with no CSS
generation.

```ts
function assignInlineVars(vars: Record<string, string | undefined | null>): Styles;
function assignInlineVars<C extends Contract>(contract: C, tokens: MapLeafNodes<C, string>): Styles;
function setElementVars(el: HTMLElement, vars: Record<string, string | undefined | null>): void;
function setElementVars<C extends Contract>(
  el: HTMLElement,
  contract: C,
  tokens: MapLeafNodes<C, string>,
): void;
// Styles = { [cssVarName: string]: string } with a toString() -> 'a: b;' string
```

```tsx
<section className={container}
  style={assignInlineVars({ [brandColor]: 'pink', [textColor]: tone === 'critical' ? 'red' : null })} />
<section style={assignInlineVars(themeVars, { color: { brand }, font: { body } })} />  // full contract required
document.write(`<div style="${assignInlineVars({ [brandColor]: 'pink' })}">`);       // toString
setElementVars(el, themeVars, { color: { brand: 'pink' }, font: { body: 'Arial' } });
```

- It removes the `var()` wrapper for you, producing keys like
  `--brandColor__8uideo0`.
- `null`/`undefined` values are **skipped**, but only in the form without a
  contract. With a contract, every leaf is required (type error otherwise).

---

## 6. `@vanilla-extract/css-utils`

`npm i @vanilla-extract/css-utils`. Works with any CSS-in-JS library.

```ts
type Operand = string | number | CalcChain;
calc.add(...ops) / calc.subtract / calc.multiply / calc.divide  // -> 'calc(a + b)'
calc.negate(x)                                                  // -> 'calc(x * -1)'
calc(x).add(...).subtract(...).multiply(...).divide(...).negate().toString()
```

```ts
height: calc.multiply('var(--grid-unit)', 2),
marginTop: calc(vars.space.large).divide(2).negate().toString(),
calc('10px').add(calc('20px').subtract('4px'))   // nesting OK, inner 'calc' text is stripped
```

`calc` is the only export.

---

## 7. Low-level packages

| Package                                   | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@vanilla-extract/integration`            | Shared plugin internals: `cssFileFilter`, `virtualCssFileFilter` (`/\.vanilla\.css\?source=.*$/`), `compile` (esbuild child build, `@vanilla-extract/*` external), `processVanillaFile`, `serializeVanillaModule`, `transform` / `transformSync` (debug IDs + file scope), `addFileScope`, `normalizePath`, `getPackageInfo`, `serializeCss` / `deserializeCss` (base64url since 8.0.7), `getSourceFromVirtualCssFile`, `hash`, `vanillaExtractTransformPlugin`. In 8.0.0 `createCompiler` moved out to `@vanilla-extract/compiler` (breaking). In 8.0.11 `packageName`/path are escaped in `addFileScope` to prevent code injection. esbuild range now goes up to `~0.28`. |
| `@vanilla-extract/compiler`               | Vite and vite-node based compiler, used by the Vite and Turbopack plugins. `createCompiler({ root, identifiers?, enableFileWatcher? = true, cssImportSpecifier?(filePath, css), unstable_splitCssPerRule?, viteConfig?, viteResolve? (deprecated), vitePlugins? (deprecated) })` returns `{ processVanillaFile(path, { outputCss? }), getCssForFile, getAllCss, findImporterTree, unstable_invalidateAllModules, close }`. Its internal Vite server uses `ssr.noExternal: true` and externalizes only `@vanilla-extract/*`, **resolved relative to the importing file**.                                                                                                    |
| `@vanilla-extract/babel-plugin-debug-ids` | The Babel plugin that adds debug ids (see 2.14). It's invoked by the integrations. No user setup has been needed since webpack/next plugin 2.1 (the old `@vanilla-extract/babel-plugin` should be removed).                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `@vanilla-extract/jest-transform`         | Jest transformer. See [Testing](#10-testing).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `@vanilla-extract/private`                | Internal types and utilities (`walkObject`, `get`, `getVarName`, `CSSVarFunction`, `Contract`, `MapLeafNodes`). Not a public API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@vanilla-extract/esbuild-plugin-next`    | Experimental esbuild plugin that uses the vite-node compiler. Undocumented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `@vanilla-extract/turbopack-plugin`       | Turbopack loader. It's wired up by `next-plugin`'s `unstable_turbopack` and isn't meant for direct use. It has `next/font` support code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Custom adapter interface (`Adapter`) for anyone writing their own
integration:

```ts
interface Adapter {
  appendCss(css: CSS, fileScope: FileScope): void;
  registerClassName(className: string, fileScope: FileScope): void;
  registerComposition(c: { identifier: string; classList: string }, fileScope: FileScope): void;
  markCompositionUsed(identifier: string): void;
  onBeginFileScope?(fileScope: FileScope): void;
  onEndFileScope(fileScope: FileScope): void;
  getIdentOption(): 'short' | 'debug' | CustomIdentFunction;
}
```

---

## 8. Bundler integrations

All plugins share `identifiers` ([2.14](#214-identifiers-and-debug-ids)).
Officially documented: Vite, esbuild, webpack, Next.js, Parcel, Rollup (also
"compatible with Rolldown"), Gatsby (third party), Astro and Remix (both via
Vite). **There's no Rspack plugin, no dedicated Rolldown or tsdown plugin, and
no React Native support.** None of these appear anywhere in the repo, apart
from the Rolldown note on the Rollup plugin.

### 8.1 Vite: `@vanilla-extract/vite-plugin` 5.2.6

```ts
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
export default { plugins: [vanillaExtractPlugin({
  identifiers?: IdentifierOption,
  unstable_pluginFilter?: ({ name, mode }) => boolean,  // which user Vite plugins reach the VE compiler
  unstable_mode?: 'emitCss' | 'transform' | 'inlineCssInDev',  // default 'emitCss'
})] };
```

- Returns `Plugin[]`. The plugin name has been `vite-plugin-vanilla-extract`
  since 5.0.
- Uses `@vanilla-extract/compiler` (vite-node). `esbuildOptions` and
  `emitCssInSsr` were removed in 4.0. CSS is emitted as virtual
  `*.vanilla.css` modules and goes through Vite's own CSS pipeline (PostCSS,
  `build.assetsInlineLimit` since 5.1.4).
- Since 5.0, **user Vite plugins are not forwarded** to the compiler except
  `vite-tsconfig-paths`. If you supply `unstable_pluginFilter`, it replaces
  that default.
- `unstable_mode: 'transform'` only adds file scopes (no compiler: styles get
  injected at runtime). `'inlineCssInDev'` (5.1.0) puts all VE CSS in a
  `<style>` in the head during `serve`, to avoid a flash of unstyled content
  with SSR. Production isn't affected.
- Watching and invalidation are skipped in build and during SSR (5.0.7).
- **Peer range in the repo is `vite ^8.0.0`.** A pending changeset
  (`drop-vite-below-8-vite-plugin`, major) drops Vite below 8. The compiler
  moves to `vite ^8` and `vite-node ^6`. The released 5.x lines support Vite
  5, 6, 7 (5.1.1) and 8 (5.2.0).
- **The docs say building libraries with the Vite plugin isn't supported**
  (no filescope injection or single-CSS output, untested). Use the Rollup
  plugin for libraries.
- Notable fixes: `No CSS for file` with pnpm workspaces on Windows (`@id/C:/…`
  ids, 5.2.3); untransformed `.css.ts` with module federation (5.2.3); HMR in
  Astro, Nuxt and Qwik (5.2.1); empty CSS files no longer emitted (5.2.4/5).

### 8.2 Rollup and Rolldown: `@vanilla-extract/rollup-plugin` 1.5.4

```ts
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
vanillaExtractPlugin({
  identifiers?: IdentifierOption,      // default: NODE_ENV === 'production' ? 'short' : 'debug'
  cwd?: string,                        // default process.cwd(); root for relative file paths + package name
  esbuildOptions?: Pick<BuildOptions, 'plugins' | 'external' | 'define' | 'loader' | 'tsconfig' | 'conditions'>,
  extract?: false | { name?: string /* 'bundle.css' */; sourcemap?: boolean /* false */ },
  unstable_injectFilescopes?: boolean, // default false; preserveModules only
});
```

Peer dependency: `rollup ^2 || ^3 || ^4`. The plugin name is
`vanilla-extract`. The docs say it's **"useful for library development but
not suitable for application bundles"**, and point apps to Vite.

How it works (`src/index.ts`):

1. `transform`: for ids matching `cssFileFilter`, it runs `compile()`, an
   **esbuild bundle of the file with only `@vanilla-extract*` (plus
   `esbuildOptions.external`) external**, on `platform: 'node'`. Then
   `processVanillaFile` evaluates it and produces the JS plus virtual CSS
   imports. Every input of that esbuild bundle gets `addWatchFile`. The
   returned sourcemap is empty (`{ mappings: '' }`).
2. `resolveId`: virtual `*.vanilla.css?source=…` ids become external modules
   with `meta.css`.
3. Without `extract`, `renderChunk` emits one CSS asset per VE file (for
   example `Button.css.ts.vanilla.css`, placed under `assets/` by default)
   and rewrites the import to a relative path. So the **output JS keeps
   `import './x.css.ts.vanilla.css'`**.
4. With `extract`, `buildEnd` concatenates every VE module's CSS into one asset
   (MagicString bundle, optional map with `includeContent`). The order comes
   from tracing each VE module's import chain back to the entry
   (`importers.at(-1)`), with a warning on circular imports. Then
   `generateBundle` **strips the side-effect `import`/`require` of those CSS
   ids** from `.js`, `.mjs` and `.cjs` chunks (`.mjs`/`.cjs` and `require` were
   fixed in 1.5.3).
5. `unstable_injectFilescopes`: no CSS at all. It only runs `transform()`
   (debug IDs if `'debug'`, plus `setFileScope`). The output modules keep
   their VE calls and **must stay named `*.css.js`** so the consumer's VE
   plugin evaluates them. `@vanilla-extract/css` and
   `@vanilla-extract/css/fileScope` must be external.

Recommended `preserveModules` setup from the docs:

```js
export default {
  plugins: [vanillaExtractPlugin()],
  output: {
    preserveModules: true,
    assetFileNames({ name }) {
      return name?.replace(/^src\//, '') ?? '';
    },
  },
};
```

**Rolldown:** `rolldown` `^1.2.16` is a devDependency. The test suite runs
the same cases on Rolldown: no `preserveModules`, `preserveModules`,
`preserveModules` + `assetFileNames`, inject filescopes, sourcemaps,
`extract`, and third-party deps with a nested `cwd`. Rolldown fixes: 1.4.2
"allow plugin to work in rolldown"; 1.5.4 fixed failures when emitted CSS
asset names contained relative paths. Directory prefixes are no longer
included in emitted CSS file names, so output paths can change. In the
Rolldown `extract` snapshot, VE modules that only produce CSS
(`styles/reset.css.js`) are emitted as **empty files that are still
imported**. That's harmless.

Known error, quoted in the docs: if a consumer's VE plugin sees an
already-built `Button.css.ts.vanilla.css` beside a `*.css.js`, you can get
`Cannot import ".../Button.css.ts.vanilla.css" into a JavaScript file
without an output path configured`. Use `extract` or rename the outputs.

### 8.3 esbuild: `@vanilla-extract/esbuild-plugin` 2.3.22

```js
const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');
vanillaExtractPlugin({
  identifiers?,                 // default from esbuild `minify`
  processCss?: (css: string) => Promise<string>,  // e.g. postcss+autoprefixer, esbuild can't post-process CSS
  esbuildOptions?,              // same subset as Rollup
  outputCss?: boolean,
  runtime?: boolean,            // true → only add filescopes; styles injected at runtime
  externals?: string[],         // deprecated → esbuildOptions.external
});
```

`esbuild` is an optional peer dependency. With `bundle: true`, the
generated CSS is resolved from the virtual namespace.

### 8.4 webpack: `@vanilla-extract/webpack-plugin` 2.3.27

```js
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
new VanillaExtractPlugin({
  test?: RuleSetRule['test'],   // default cssFileFilter
  identifiers?,                 // default from webpack `mode`
  outputCss?: boolean,          // default true
  externals?: any,              // webpack ExternalItem[]; 'any' until next major
  allowRuntime?: boolean,       // deprecated
});
```

You must handle CSS yourself. The documented rule:
`{ test: /\.vanilla\.css$/i, use: [MiniCssExtractPlugin.loader, { loader: require.resolve('css-loader'), options: { url: false } }] }`.
Add `exclude: /\.vanilla\.css$/i` to any existing css-loader rule. The
plugin marks `*.vanilla.css` and `vanilla.virtual.css` as side effects. It
uses a child compiler. Paths containing webpack template strings (`[id]`,
`[slug]`) are handled. **Pending majors:** drop webpack 4 (peer `^5.73.0`),
make `webpack` an optional peer, and fix assets from the persistent cache.

### 8.5 Next.js: `@vanilla-extract/next-plugin` 2.5.2

```ts
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin({
  identifiers?, externals?,      // webpack plugin options
  unstable_turbopack?: {
    mode?: 'off' | 'auto' | 'on',  // default 'off' (webpack)
    glob?: string[],               // default ['**/*.css.{js,cjs,mjs,jsx,ts,tsx}']
  },
});
export default withVanillaExtract(nextConfig);  // composable with other plugins
```

- **The docs say only Next.js 16 and later is supported.** The pending
  changeset `drop-nextjs-below-16` makes `next ^16` the minimum for
  next-plugin and turbopack-plugin and removes version sniffing. With that,
  `'auto'` always enables Turbopack.
- Turbopack is **experimental** (2.5.0). If you already define
  `turbopack.rules` for the same globs, the plugin throws. Set
  `mode: 'off'` and configure it by hand. Use the latest
  `@vanilla-extract/css` (it needs the `vanilla.virtual.css` entry).
- Pages router: `next-style-loader` in dev, CSS output in SSR (2.4.0).
- **Libraries that ship uncompiled `.css.ts` must be listed in
  `transpilePackages`**. Otherwise they come out unstyled or throw runtime VE
  errors.
- An e2e test checks that a shared `globalStyle` shows up exactly once in both
  webpack and Turbopack production builds.

### 8.6 Parcel: `@vanilla-extract/parcel-transformer` 1.0.21

```json
// .parcelrc
{ "transformers": { "*.css.ts": ["@vanilla-extract/parcel-transformer"] } }
```

Parcel 2.x only. There are no options: identifiers are `debug` in development
and `short` otherwise.

### 8.7 Others

- **Astro:** add the Vite plugin under `vite.plugins` in `astro.config`.
  Import `.css` (without `.ts`) in `.astro` frontmatter, as the docs show.
- **Remix:** built-in classic compiler support, or the Vite plugin with
  `remix()` in Vite mode.
- **Gatsby:** `gatsby-plugin-vanilla-extract` (third party) plus
  `@vanilla-extract/webpack-plugin`.
- **Qwik, SolidStart:** experimental support through the Vite plugin
  (changelog 3.5 and 3.7). **React Server Components:** "experimental support"
  in the Vite plugin since 3.3.0, and Next App Router via next-plugin.
- **Rspack, Turbopack outside Next, React Native:** nothing in the source.

---

## 9. Publishing libraries with VE

What the source and docs actually say, plus the trade-offs that follow from
it.

### 9.1 Options

| Strategy                                             | How                                                                            | Consumer needs                                                               | Notes                                                                                                                                                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Ship compiled JS + CSS files** (default Rollup) | `vanillaExtractPlugin()` + `preserveModules`                                   | A bundler that handles `import './x.css.ts.vanilla.css'` side-effect imports | Per-module CSS, so CSS is tree-shaken with the JS. **Gotcha:** the output keeps `x.css.js` names plus `.css.ts.vanilla.css` assets. A consumer's VE plugin matches `*.css.js` and re-processes them. See the error in 8.2.                              |
| **B. Ship compiled JS + one CSS bundle**             | `extract: { name: 'styles.css' }`                                              | Import `pkg/styles.css` once (for example via an `exports` entry)            | No CSS imports left in JS, so it works with any bundler and in SSR without CSS loaders. All CSS loads whether used or not. Order inside the file follows import chains from the entry.                                                                  |
| **C. Ship pre-scoped sources**                       | `unstable_injectFilescopes: true` + `preserveModules` (Rollup)                 | A VE plugin in the consumer's build. Next: `transpilePackages`               | Outputs stay `*.css.js` with live VE calls. The consumer's plugin rewrites `setFileScope` to its own path and package and generates CSS, so it dedupes with the app, tree-shakes per module, and honours the consumer's `identifiers`. `unstable` flag. |
| **D. Ship raw `.css.ts` / `.css.mjs` sources**       | No VE build step (`fixtures/thirdparty/thirdparty-dep` ships `styles.css.mjs`) | A VE plugin. Next needs `transpilePackages`, and TS sources need transpiling | All bundler plugins process `node_modules` files that match `cssFileFilter`. The Rollup third-party test builds such deps.                                                                                                                              |

### 9.2 Pros and cons, compiled vs sources

- **Compiled (A or B):** consumers need no VE tooling. Class names are fixed
  at library build time. They can't be re-themed through `identifiers`, but
  they're deterministic. You have to ship the runtimes the serialized
  functions import (`@vanilla-extract/recipes`, `@vanilla-extract/sprinkles`,
  `@vanilla-extract/dynamic`) as **dependencies**. `@vanilla-extract/css` is
  only needed at runtime if non-`.css.ts` code calls VE APIs, or if consumers
  author `.css.ts` against your contracts. If two copies of a library are
  installed, their CSS duplicates.
- **Sources (C or D):** CSS merges with the app's and dedupes. Debug names
  are possible. But it forces VE onto every consumer, couples them to VE
  version compatibility, slows their builds (each file is evaluated with
  vite-node or esbuild), and breaks in tools without a VE plugin (plain
  Node SSR, Jest without the transform, Storybook without config).
- The Vite plugin docs explicitly refuse library builds. The Rollup plugin
  is the supported library path.

### 9.3 The `*.css.js` gotcha

`cssFileFilter = /\.css\.(js|cjs|mjs|jsx|ts|tsx)(\?used)?$/`. Every VE
integration uses it, and none of them exclude `node_modules`. Any **compiled**
module named `x.css.js` in a published package gets evaluated again by the
consumer's VE plugin. That's harmless for pure exports. It breaks when the
module still imports `./x.css.ts.vanilla.css`. It's wasted work in every
case. Fixes: rename the compiled outputs (for example `x.styles.js`), or use
`extract` so no CSS import is left. With strategy C, keeping `.css.js` is
the mechanism itself, so don't rename.

### 9.4 Cross-package imports at build time

In the Rollup plugin, `compile()` **bundles everything** a `.css.ts` imports,
except `@vanilla-extract/*`, into the evaluation. When `@scope/themes` is
imported from another package's `.css.ts`:

- If it resolves to **compiled** JS (`dist/*.js`, not `*.css.js`), it's just
  strings. Correct and cheap.
- If it resolves to **source** `.css.ts` (via TS paths, a `source` or
  `development` export condition, or an `exports` entry pointing at `src`),
  those files are re-evaluated **under the importing package's
  `packageName` and a different relative path**. Scoped names
  (`createThemeContract`, `createVar`, `style`) **get different hashes than
  in the owning package's build**, and their CSS is emitted again into the
  importer's output. `createGlobalThemeContract` names don't change.

### 9.5 SSR

- Compiled output (A/B) is plain JS. SSR only needs CSS handling, and B needs
  none at all.
- In the Vite dev server with SSR, use `unstable_mode: 'inlineCssInDev'` to
  avoid a flash of unstyled content.
- The Vite plugin marks `@vanilla-extract/css`, `/fileScope` and `/adapter` as
  `ssr.external`.
- Next: see 8.5.

---

## 10. Testing

**Vitest:** with an existing Vite config, nothing to do. Otherwise:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
export default defineConfig({ plugins: [vanillaExtractPlugin()] });
```

(The vite-plugin peer range is Vite 8 in the repo. Vitest must sit on a
matching Vite.)

**Jest:**

```json
{ "transform": { "\\.css\\.ts$": "@vanilla-extract/jest-transform" } }
```

- The transform runs `transformSync` (debug idents + file scope), then
  esbuild (`esm` if `supportsStaticESM`, else `cjs`, target `es2018`). Styles
  are then created at runtime. Under jsdom, the browser adapter injects real
  `<style>` tags.
- Remove `"\\.css$"` mocks from `moduleNameMapper`. They catch `.css.ts`
  too. Scope them to a folder or a custom extension instead. Plain `.css`
  files that reach the transformer become `module.exports = "<basename>"`.
- Set `NODE_ENV` sensibly: the runtime adapter picks short or debug from it.

**Speed-up:** `import '@vanilla-extract/css/disableRuntimeStyles'` in setup
installs the mock adapter, so no CSS is generated or injected. Class names
are still returned.

**Testing compiled libraries:** compiled output needs no VE tooling. Jest
or Vitest only need to ignore or handle the `.css` imports, and strategy B
leaves none.

---

## 11. SSR and frameworks

- **Vite SSR:** 4.0 turned "emit CSS in SSR" on by default (the CSS is
  processed by Vite). `inlineCssInDev` covers dev without a flash of unstyled
  content (5.1.0). SSR skips watching and invalidation, which prevents double
  evaluation of singletons such as React context (5.0.7).
- **Next.js:** App and Pages routers, with webpack or experimental Turbopack.
  Next 16 and later only.
- **Remix, Astro, Qwik, SolidStart, Nuxt** (HMR fix in 5.2.1): all via the
  Vite plugin.
- **RSC:** marked experimental in Vite plugin 3.3.0. Next 13+ Windows CSS
  fixes landed in 2.3.x.
- **Plain Node SSR of uncompiled `.css.ts`:** no file scope means a throw.
  Always compile.

---

## 12. Theming patterns

1. **Single theme, quick start:** `const [themeClass, vars] = createTheme({...})`.
   Alternates: `createTheme(vars, {...})`. Downside: alternates import the
   first theme's CSS, so CSS can't be split.
2. **Contract-first (code-splittable):** `contract.css.ts` has
   `createThemeContract` (no CSS). Each theme file does
   `createTheme(vars, {...})` or `createGlobalTheme(sel, vars, {...})`.
   Importing one theme pulls in only its CSS.
3. **Global or stable names:**
   `createGlobalThemeContract(tokens, (_v, path) => \`ml-${path.join('-')}\`)`plus`createGlobalTheme(':root', vars, light)`and`createGlobalTheme('[data-theme="dark"]', vars, dark)`. The names are
   readable from plain CSS and from other packages, and stay stable across
   builds.
4. **Nested themes:** themes are just classes that set custom properties, so
   nesting follows normal inheritance. `<div class=${dark}>…<div class=${light}>`
   flips back. The `fixtures/themed` example nests root → alt → root →
   inline → responsive.
5. **Responsive or partial themes:** `style({ vars: assignVars(vars, …),
   '@media': { … : { vars: assignVars(vars.space, …) } } })`.
6. **Runtime theme switching:** toggle a class or attribute between
   pre-built theme classes (zero JS cost). For arbitrary runtime values,
   `assignInlineVars(contract, tokens)` or
   `setElementVars(el, contract, tokens)`. No CSS is generated at runtime.
7. **Dynamic single values:** `createVar()` plus `assignInlineVars({ [v]: value })`.
8. **Color-scheme media:** set vars inside `'@media': { '(prefers-color-scheme: dark)': { vars: … } }`,
   or use sprinkles conditions with `defaultCondition: ['light', 'dark']`.
9. **Layered themes:** `'@layer': themeLayer` in theme tokens.
10. **Animated tokens:** `createVar({ syntax: '<angle>', inherits: false, initialValue: '0deg' })`
    plus keyframes that set `vars`.

---

## 13. Limitations and gotchas

- **Build step required.** Every API throws outside a file scope. Running
  `.css.ts` at runtime only works through the Jest transform, the esbuild
  `runtime` mode or the Vite `transform` mode, all of which inject styles
  at runtime.
- **Exports:** only serializable values or serializer-annotated functions.
  Non-exported side effects only produce CSS. Never rely on mutable state
  across `.css.ts` files at runtime.
- **Selectors:** you can only target `&`. Children need `globalStyle`. No
  nested `selectors`, and simple pseudos hold only properties and `vars`.
  `globalStyle` can't take pseudos or `selectors`.
- **`@starting-style`** can't contain nested at-rules.
- **Media queries always come last** in a file and beat same-specificity
  base rules. Ordering across files depends on the bundler's import order.
- **No polyfills** for layers, container queries, `@scope`,
  `@starting-style`, view transitions or `@property`. No autoprefixer
  either: add PostCSS yourself (`processCss` in esbuild, Vite's own PostCSS,
  webpack loaders). The Rollup plugin has no hook for processing CSS.
- **The `.css.js` filter catches compiled files** ([9.3](#93-the-cssjs-gotcha)).
- **Jest `\.css$` mocks** swallow `.css.ts`.
- **Webpack** needs `css-loader` `url: false` for `.vanilla.css`, and existing
  CSS rules must exclude it.
- **Vite plugin:** not for library builds. User plugins aren't forwarded
  (5.0+). Vite 8+ only on `master`.
- **Next:** 16+ only. Turbopack is experimental. Uncompiled VE dependencies
  need `transpilePackages`.
- **Identifier stability** depends on package name, relative path and call
  order. A custom identifier function only gets `debugId` from explicit
  arguments.
- **Type inference:** declare sprinkles `defineProperties` results as
  variables. `createVar` overload order was swapped in 1.18 for
  `VarDeclaration` inference.
- **Rollup plugin sourcemaps** for compiled `.css.ts` modules are empty.
- **Global singletons:** VE keeps file scopes and the adapter in
  module-level state. Two physical copies of `@vanilla-extract/css` in one
  evaluation means the copy calling `style()` may have no scope, and you get
  the "Styles were unable to be assigned to a file" error. The compiler
  resolves `@vanilla-extract/*` **relative to the importing file**, so a
  dependency's nested copy is a real risk under pnpm.
- **ESM entry points:** the "Improve ESM package entrypoints" change (#1597)
  was **reverted** in late patches across all packages because of
  `Named export not found` errors. Packages still ship dual CJS/ESM with
  `browser` conditions.

---

## 14. Changelog digest

Changelogs carry no dates, so this lists roughly the last two years of
releases, newest first, as they appear. The "pending" lines come from
unreleased `.changeset` files at the reference commit.

**Pending (next majors):**

- vite-plugin: **drop Vite < 8**. compiler: `vite ^8`, `vite-node ^6` (minor
  but breaking).
- next-plugin and turbopack-plugin: **drop Next < 16**, remove `semver`,
  `'auto'` means on.
- webpack-plugin: **drop webpack 4** (`^5.73.0`), optional `webpack` peer,
  fix assets from the persistent cache.
- turbopack-plugin: Next 16.4+ image imports from `.css.ts`
  (`getImageSize is not a function`).

**css:**

- 1.21.3: switched to `deepmerge-ts`, lazy class index (perf).
- 1.21.2: dots become `_` in debug ids.
- 1.21.1: composition substitution fix, `boxOrdinalGroup` unitless.
- 1.21.0: **`@scope`** in `style` and `globalStyle`; `createGlobalVar`
  trims `--`; regex-escape fix for class lists; `fallbackVar('')`.
- 1.20.0: **`:is()` / `:where()`** allowed in `selectors` when every branch
  targets `&`.
- 1.19.1: nested composition arrays.
- 1.19.0: `./vanilla.virtual.css?*` entry (Turbopack).
- 1.18.0: **`@starting-style`**; container property types come from
  csstype.
- 1.17.x: ESM revert, `addFunctionSerializer` args type, type-check perf,
  `@container` inside `selectors`.
- 1.17.0: **keyframe `vars`**, **themes in `@layer`**, **`createVar` with
  `@property`**.
- 1.16.0: **`createViewTransition`**, `::-webkit-calendar-picker-indicator`.
- 1.15.x: arrays in `globalFontFace`, `export { type T }`, `types` field.

**recipes 0.5.x:** ESM revert, `undefined` variants under
`exactOptionalPropertyTypes`, `classNames` (0.5.0), `variants()` (0.4.0).

**sprinkles:** 1.7.1 removed the cap of 8 conditions; 1.7.0 added **`@scope`
conditions**; 1.6.x added the ESM revert and the `SprinklesProperties`
export.

**dynamic 2.1.x:** ESM revert, `types` field. `null` support arrived
earlier.

**integration:** 8.0.0 moved `createCompiler` out (breaking). Since then:
`serializeVanillaModule` export, esbuild up to 0.28, base64url, a race fix,
and code-injection escaping (8.0.11).

**compiler 0.1–0.7:** `enableFileWatcher`, `getAllCss`,
`unstable_splitCssPerRule`, `unstable_invalidateAllModules`, `cssImportSpecifier(filePath, css)`,
Vite 7 and 8 support, `findImporterTree`, and skipping CSS imports for empty modules.

**vite-plugin:** 4.0 (vite-node compiler, `emitCssInSsr` default, no
`esbuildOptions`, Vite ≥ 4) → 5.0 (renamed, Vite 5/6, plugins not
forwarded, `unstable_pluginFilter`) → 5.1 (`inlineCssInDev`, Vite 7) → 5.2
(Vite 8) → 5.2.1–5.2.6 (HMR and Windows fixes).

**rollup-plugin:** 1.4.0 `extract`; 1.4.1 map content; 1.4.2 **Rolldown**;
1.5.0 `unstable_injectFilescopes`; 1.5.3 strip `require` and `.mjs`/`.cjs`
imports; 1.5.4 **Rolldown asset-name fix** (emitted CSS file names lose
directory prefixes).

**next-plugin:** 2.4.0 pages router SSR CSS; 2.4.13 `createRequire` for ESM;
2.5.0 **experimental Turbopack (Next ≥ 16)**; 2.5.2 `externals` fix.

**turbopack-plugin:** 0.1.0 initial; 0.1.4 build perf.

**Minimums today:** node per `.nvmrc` = `lts/krypton` (Node 24) for
developing VE itself. Packages declare no `engines` except Parcel 2.x.
Rollup 2–4. Vite 8 (on `master`). Next 16. esbuild ≤ 0.28 for the
integration and Jest.

---

## 15. Keyword check

| Topic              | Mentioned? | Where                                                                                                                                                                                         |
| ------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rolldown**       | Yes        | Rollup docs: "also compatible with Rolldown". rollup-plugin 1.4.2 and 1.5.4. The full Rollup test matrix runs on `rolldown ^1.2.16`. The Rollup docs say Vite "uses Rolldown under the hood". |
| **tsdown**         | **No**     | Not in the docs, source, tests or changelogs. Support is only implied, through Rolldown running the Rollup plugin.                                                                            |
| **Vite 7**         | Yes        | vite-plugin 5.1.1 and compiler 0.3.1 added `^7.0.0`.                                                                                                                                          |
| **Vite 8**         | Yes        | vite-plugin 5.2.0 and compiler 0.5.0. Pending: Vite 8 becomes the minimum.                                                                                                                    |
| **Turbopack**      | Yes        | next-plugin `unstable_turbopack` (experimental), turbopack-plugin, css `vanilla.virtual.css`, compiler `unstable_splitCssPerRule`.                                                            |
| **React Native**   | **No**     | Nothing anywhere. VE produces web CSS only.                                                                                                                                                   |
| **SSR frameworks** | Yes        | Next (App and Pages), Remix, Astro, Qwik, SolidStart, Nuxt (HMR fix), RSC (experimental), Vite `inlineCssInDev`.                                                                              |
| **Rspack**         | **No**     |                                                                                                                                                                                               |

---

## 16. Implications for Mohirlab

Our setup: a pnpm monorepo with `tokens`, `themes`, `sprinkles`, `recipes`
and `react`. Libraries are built with `@vanilla-extract/rollup-plugin` and
`extract: { name: 'styles.css' }`, with one module per source file. Compiled
`x.css.ts` is renamed to `x.styles.js`. Cascade layers: `ml-reset`,
`ml-theme`, `ml-components`, `ml-utilities`. **Note:** the repo has already
moved the library build to **tsdown** (`scripts/tsdown-library.mjs`), which
runs the same Rollup plugin on Rolldown with `unbundle: true`. The points
below cover both the original Rollup plan and the tsdown build.

### 16.1 What the source confirms we got right

1. **Renaming `*.css.js` → `*.styles.js` is necessary** with any compiled
   output. `cssFileFilter` doesn't exclude `node_modules`, so consumers' VE
   plugins would re-evaluate `x.css.js` ([9.3](#93-the-cssjs-gotcha)). Keep
   it. Don't combine it with `unstable_injectFilescopes`: that mode needs the
   `.css.js` name.
2. **`extract` plus one `styles.css` per package is the most portable
   choice.** No CSS imports stay in the JS (`generateBundle` strips them),
   so consumers need no VE plugin and no CSS loader for JS. SSR works, and
   the `*.css.ts.vanilla.css` double-processing error can't happen. The cost
   is that all of a package's CSS loads, with no per-component CSS
   tree-shaking. That's fine for a design system, given atomic sprinkles and
   recipes.
3. **Rolldown is a tested target** of the Rollup plugin. That covers
   `preserveModules`, `extract` with sourcemaps, inject filescopes and
   third-party deps. **tsdown is never mentioned upstream**, so our support
   rests on tsdown passing Rollup plugin hooks through to Rolldown
   unchanged. The plugin uses `transform`, `resolveId`, `renderChunk`,
   `buildEnd`, `generateBundle`, `emitFile`, `getModuleInfo`, `getModuleIds`,
   `addWatchFile` and `warn`. We rely on tsdown's `unbundle` behaving like
   `preserveModules`.

### 16.2 Risks and concrete recommendations

1. **Raise the plugin floor to `^1.5.4`.** Root `package.json` has
   `@vanilla-extract/rollup-plugin: ^1.5.0`. 1.5.3 fixed stripping
   side-effect imports in `.mjs`/`.cjs` and `require`. 1.5.4 fixed Rolldown
   failures when CSS asset names contain relative paths, which happens with
   nested or dependency `.css.ts`. Also keep the Rolldown version tsdown
   pulls in at or above the `^1.2.16` that VE tests against.
2. **Never let one package's build evaluate another package's `.css.ts`
   source.** The Rollup plugin's `compile()` bundles everything except
   `@vanilla-extract/*` into the evaluation. Our tsdown `deps.neverBundle`
   **does not apply** to that inner esbuild step. If `@mohirlab/themes`
   resolved to `src/*.css.ts` (TS `paths`, a `source` or `development`
   export condition, `exports` → `src`), sprinkles and recipes would
   re-create the contract under their own package name and path. They'd get
   **different var hashes** than themes' own `styles.css`, and duplicate CSS.
   Today `exports` points at `dist`, which is correct. Keep it that way, keep
   Turbo's `^build` ordering, and avoid adding a source condition. If that
   ever becomes necessary, switch the contract to `createGlobalThemeContract`
   (stable names), or pass `esbuildOptions: { external: ['@mohirlab/*'] }` to
   the plugin. (Whether `external` resolves correctly in the eval context is
   untested upstream, so verify it.)
3. **Make `@vanilla-extract/css` a `peerDependency`, or at least keep one
   version, for any package whose runtime code calls VE APIs.**
   `@mohirlab/themes` exports `declareLayers()`, which calls `globalLayer`
   from a plain `layers.ts`. That's legal, because it's called inside the
   consumer's `.css.ts` evaluation. But VE's file scope and adapter are
   module singletons. The Vite compiler resolves `@vanilla-extract/*` relative
   to the **importing file** (`compiler.ts`, plugin
   `vanilla-extract-externalize`). Under pnpm, a consumer with a different
   `@vanilla-extract/css` version would get themes' nested copy, which has no
   active file scope. Result: `Styles were unable to be assigned to a file`.
   A peer dependency (`^1.17.0` or higher, for themes `@layer` and
   `@property`; `^1.21.0` if we use `@scope`) makes pnpm dedupe it.
   `@mohirlab/sprinkles` currently lists `@vanilla-extract/css` only as a
   devDependency. That's fine for its compiled runtime, but not if it
   re-exports anything that calls VE at build time in consumers.
4. **Runtime deps of the compiled output:** sprinkles output imports
   `@vanilla-extract/sprinkles/createRuntimeSprinkles`, and recipes output
   imports `@vanilla-extract/recipes/createRuntimeFn`. Both must be
   `dependencies`, never devDependencies. That's already true for both
   packages. Also, the **whole sprinkles config (every class map) is
   inlined into the JS**. Watch the bundle size as properties, values and
   conditions multiply (property × value × condition classes). The
   `SprinklesError` checks depend on `process.env.NODE_ENV`, which every
   consumer bundler has to define.
5. **The custom `identifiers` function never receives automatic debug
   IDs.** The Babel debug-id pass only runs when `identifiers === 'debug'`.
   With our function, `debugId` is set only where code passes one: sprinkles
   (`prop_value_condition`), `styleVariants` keys, recipe group names and
   explicit `style(rule, 'name')`. Expect plain `ml_<hash>` for most
   `style()` calls. For readable names, pass debug ids explicitly or use
   `'debug'` in dev builds. The returned value must match
   `/^[A-Z_][0-9A-Z_-]+$/i`, which our sanitizer guarantees.
6. **Layer order:** a `@layer x;` statement is emitted both by `globalLayer()`
   and by **every use** of `'@layer': { x: … }`. Within a file, layers are
   declared in first-touch order. So `declareLayers()` must run **before any
   `style()` or `defineProperties()` in every emitting `.css.ts`**. Today it
   runs right after the imports in `sprinkles.css.ts`, which is correct.
   Importing compiled `@mohirlab/*` modules emits no CSS, so nothing sneaks
   in first. Across packages, the first `@layer` statement the browser sees
   fixes the order. Because every package's `styles.css` starts with the same
   four statements, consumer import order is safe. Keep a test that asserts
   each `dist/styles.css` begins with
   `@layer ml-reset; @layer ml-theme; @layer ml-components; @layer ml-utilities;`.
7. **Identifier stability across releases:** hashes come from
   `packageName + path relative to cwd + call order`. Renaming a package,
   moving a `.css.ts` or reordering `style()` calls changes every class and
   var name. That's fine for consumers who use our exports, but it breaks
   anyone who hard-codes class names or `--var` names. Give public CSS
   variables stable names with `createGlobalThemeContract` (prefix `ml-`) if
   we want them to be a documented API.
8. **Sourcemaps:** the plugin returns `{ mappings: '' }` for compiled
   `.css.ts`, so `*.styles.js.map` files hold nothing useful. Consider
   leaving them out to keep the tarball smaller.
9. **Don't use `@vanilla-extract/vite-plugin` for library builds**, even
   though tsdown and Vite share Rolldown. The docs call this unsupported, and
   on `master` the plugin requires Vite 8. Use the Vite plugin only for the
   docs app, playground or tests, with Vitest on a Vite 8-compatible version.
10. **Consumers:** document that apps import `@mohirlab/<pkg>/styles.css`
    (themes first by convention, though the layers make order irrelevant).
    No VE plugin is needed unless an app writes its own `.css.ts` against
    `@mohirlab/themes` `vars`. In that case it needs a VE plugin, and on
    Next.js 16+ webpack is the stable path, with Turbopack experimental.
    `transpilePackages` is **not** needed for our compiled packages. It's
    only for libraries that ship uncompiled `.css.ts`.
11. **No React Native path:** VE has no React Native support. If
    `@mohirlab/react` ever targets native, tokens must be consumed from
    `@mohirlab/tokens` directly, not through VE outputs.
12. **If we ever want per-component CSS tree-shaking:** the upstream options
    are (a) no `extract`, with per-module `.css.ts.vanilla.css` assets
    imported from JS. That needs consumer CSS handling, and the `.css.js`
    rename doesn't touch the CSS asset names. Or (b)
    `unstable_injectFilescopes`, shipping pre-scoped `.css.js` sources. That
    needs a VE plugin in every consumer and keeps the `.css.js` names. Both
    are worse for portability than what we have now.
