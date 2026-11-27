# Working in this repository

Mohirlab is a public, open-source design system (pnpm monorepo, Vanilla Extract). Before
changing code, know these files:

- [ARCHITECTURE.md](ARCHITECTURE.md): layers, tokens, theming, cascade layers, visual language,
  toolchain decisions, build and publish rules.
- [docs/knowledge/vanilla-extract.md](docs/knowledge/vanilla-extract.md): the complete Vanilla
  Extract reference (APIs, integrations, library publishing, gotchas), pinned to an upstream
  commit. Read the relevant section instead of fetching VE docs or source again. Update it when
  VE releases something we adopt.
- [CONTRIBUTING.md](CONTRIBUTING.md): workflow and the rules every change must follow.

Hard rules:

- Run `pnpm check` before calling work done. Visual changes: build Storybook and look at the
  affected stories in light, dark and a phone viewport.
- Never ship a compiled style module named `*.css.js` (VE plugins would recompile it).
- Every `.css.ts` that emits CSS calls `declareLayers()` first, and every rule is layered.
- No raw design values in components: add or use a token.
- Don't add `minimumReleaseAgeExclude` entries or approve new install scripts without asking.
