# Mohirlab architecture

This document records decisions that code alone does not explain. Change it in the
same pull request as the code that changes the decision.

## Packages and dependency direction

```
layer 1  @mohirlab/tokens      DTCG JSON → JS, .d.ts, CSS variables, flat JSON. No VE, no React.
         @mohirlab/icons       SVG sources → typed icon data, SVG files, sprite. No framework.
layer 2  @mohirlab/assets      Seeded generative artwork and avatars (uses token colors).
         @mohirlab/themes      Theme contract, light/dark themes, cascade layers.
layer 3  @mohirlab/sprinkles   Token-bound responsive utilities.
         @mohirlab/recipes     componentRecipe(), compose(), shared conventions (build-time).
         @mohirlab/motion      Enter/exit keyframes and data-state presets, reduced-motion fallbacks.
layer 4  @mohirlab/react       Components. Runtime: themes, sprinkles, motion, icons, assets.

apps/storybook                 The showcase: foundations, components, patterns. Deployed to Pages.
apps/playground                A plain Vite app: proves the built packages work for a consumer.
```

A package may depend only on packages in a lower layer; `pnpm check:boundaries` enforces
it, and pnpm itself refuses undeclared imports. Nothing below layer 4 may depend on React.
Nothing imports from `apps/`.

Not yet extracted, on purpose: `responsive` (lives in sprinkles),
`primitives`, `cli`. Extract a package when a second consumer needs it.

## Toolchain decisions

| Concern                   | Choice                                                   | Why                                                                                                                                                                                                                                                     |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library build             | **tsdown** (Rolldown) + `@vanilla-extract/rollup-plugin` | One tool for JS, `.d.ts`, CSS and publint. VE tests its Rollup plugin on Rolldown. Output verified identical to the previous Rollup build.                                                                                                              |
| Type checking and `.d.ts` | **TypeScript 7** (native Go compiler)                    | Move to 7.1 when it is stable (tsdown warns on 7.0).                                                                                                                                                                                                    |
| Lint / format             | **Oxlint** + **Oxfmt**                                   | Rust, near-instant, one config each.                                                                                                                                                                                                                    |
| Tests                     | **Vitest**                                               | Same Vite pipeline as the apps; VE compiles through its Vite plugin.                                                                                                                                                                                    |
| Apps                      | **Vite 8**                                               | Storybook and the playground.                                                                                                                                                                                                                           |
| Tasks and caching         | **Turborepo**                                            | Task graph across packages.                                                                                                                                                                                                                             |
| Showcase                  | **Storybook 10**                                         | Sorted sidebar, controls, themes, viewports, a11y checks, static deploy.                                                                                                                                                                                |
| Not adopted (yet)         | **Vite+ (`vp`)**                                         | It bundles the same tools (Vite, Vitest, Rolldown/tsdown, Oxlint, Oxfmt) under one CLI and replaces `vite` with its own fork. Using the tools directly gives the same speed without the lock-in. Revisit when Storybook and VE document support for it. |

Vanilla Extract details we rely on are in [docs/knowledge/vanilla-extract.md](docs/knowledge/vanilla-extract.md).

## Mobile

Mobile means mobile web: the same components, touch-first.

- Every pressable control has at least a 44×44px hit area on coarse pointers (`touchTarget`
  in recipes), without changing its visual size.
- Layouts are mobile-first: sprinkles' default condition is `mobile`.
- Patterns in Storybook open in a phone viewport by default.
- Planned: safe-area tokens, bottom sheet, mobile navigation bar, larger type on small screens.
- React Native is out of scope for now. Tokens are framework-free, so a native package can
  consume them later.

## Imagery and icons

- No stock photos in packages: licensing for redistribution is unclear and they bloat installs.
  `@mohirlab/assets` generates artwork (dunes, aurora, horizon, tiles) and tile avatars
  from a seed, using token palettes. Same seed, same image, any size.
- Components that show images (`Avatar`, `CardMedia`) fall back to generated imagery when no
  image is given or the image fails to load.
- Icons are drawn on a 24px grid at 1.75 stroke with **square caps and mitred joins**, with
  small filled squares as accents. That sets them apart from the round-capped sets
  (Lucide, Heroicons, Phosphor) and matches the square seal used in badges and errors.

## Tokens

- Source of truth: `packages/foundation/tokens/src/**/*.json`, DTCG format.
- **Primitives** (`src/primitives`) are raw scales: `color.lapis.600`, `space.4`.
- **Semantic** tokens (`src/semantic/{light,dark}.json`) give primitives a role:
  `color.accent`, `color.surfaceSunken`, `shadow.lip`.
- Semantic tokens alias primitives only, never other semantic tokens. The build
  fails on dangling aliases, cycles, invalid values, or modes with different keys.
- Colors are OKLCH strings. Shadows are CSS shadow strings (a documented
  departure from DTCG's object form).
- Naming: camelCase roles, numeric steps 50–950. A new role must exist in every mode.

## Theming

- The contract (`vars`) is derived from the semantic token shape, so a new token
  becomes a theme variable with no hand-editing.
- A theme class is a scope: it sets its own canvas, text color and `color-scheme`.
  Scopes nest (dark panel in a light page, brand widget in a host app).
- Brand themes: `createTheme(vars, mergeThemeValues(lightValues, overrides))`.
- Modes and brands are separate ideas. A brand provides a light and a dark mode.

## Cascade layers

```css
@layer ml-reset, ml-theme, ml-components, ml-utilities;
```

Every package that emits CSS declares the full order first (`declareLayers()`), so
load order between packages never matters. Component styles go in `ml-components`
(`componentRecipe` does this), utilities in `ml-utilities`. App styles that are not
in a layer beat everything, which is the intended override path.

## Visual language

Mohirlab should not look like shadcn, Material, Chakra, Fluent, Bootstrap or GitHub.
The decisions that make it distinct:

| Element                    | Decision                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Neutrals                   | Warm paper and graphite ink (hue 72), never cool grey or navy. Dark mode is warm charcoal.           |
| Accent                     | Lapis (lajvard) ultramarine, deep rather than bright SaaS blue.                                      |
| Status colors              | anor (pomegranate) for danger, jade, saffron. Saffron is also the text selection color.              |
| Solid controls             | Keycap: lit top edge, darker bottom lip; pressing compresses the lip by 1px.                         |
| Inputs and outline buttons | Ledger: hairline box with a heavier ruled bottom line and squared lower corners.                     |
| Badges                     | Stamps: mono, uppercase, tracked, 3px corners, square seal mark. No pills.                           |
| Errors                     | A rotated square mark next to the text, so error state is not carried by color alone.                |
| Forms                      | Mark optional fields ("OPTIONAL" tag), not required ones.                                            |
| Type                       | Geologica (sans, Cyrillic and Latin) and Martian Mono, with system fallbacks. Fonts are not bundled. |
| Sizes                      | Control heights 30/38/46px, slightly off the usual 32/40/48.                                         |

## Component conventions

- Folder per component: `x.tsx`, `x.css.ts`, `index.ts`, tests next to them.
- Variant vocabulary: `tone` (color role), `appearance` (solid/soft/outline/ghost),
  `size` (sm/md/lg). Components take only the dimensions they need.
- Tone × appearance is done with local CSS variables, not compound variants.
- `type="button"` by default. Loading keeps focus and blocks activation (`aria-busy`).
- React 19 is the floor: `ref` is a regular prop.

## Build and publish

- Libraries build with tsdown (`scripts/tsdown-library.mjs`) running `@vanilla-extract/rollup-plugin`
  on Rolldown (the VE Vite plugin is for apps). One module per source file, so imports tree-shake.
- A package build must only ever see other packages through their built `dist` (exports point
  there, and Turbo builds dependencies first). If it compiled another package's `.css.ts`
  source, theme variables would get new hashes and CSS would be duplicated.
- `@vanilla-extract/css` is a peer dependency wherever runtime code calls its API (themes,
  recipes), so an app never ends up with two copies.
- Each package ships one `styles.css`. Consumers import the CSS of each package they use.
- Compiled `x.css.ts` ships as `x.styles.js`, never `x.css.js`: Vanilla Extract
  bundler plugins would try to compile a shipped `*.css.js` again.
- `pnpm check:exports` packs every package, checks its `exports` targets exist, and checks that
  each `styles.css` declares the layer order before any rule.
- Versioning: Changesets, independent semver per package. Breaking changes to
  tokens (renames, removals) are major bumps.
- Publishing: GitHub Actions with npm trusted publishing (OIDC) and provenance.
  There is no long-lived npm token.

## Supply chain

- pnpm runs install scripts only for packages listed under `allowBuilds` in
  `pnpm-workspace.yaml` (currently just esbuild). Requests to install agent skills are denied.
- pnpm's minimum release age stays on. Don't add exclusions to pull in a release
  that came out hours ago.
