# Contributing to Mohirlab

Thanks for helping. This guide covers setup, the workflow, and the rules a change must follow.
Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing tokens, themes or package boundaries.

## Setup

Requirements: Node 24 (see `.nvmrc`; 22 works), pnpm 12 (`corepack enable`).

```sh
pnpm install
pnpm build
pnpm --filter @mohirlab/storybook dev   # http://localhost:6006
```

pnpm runs install scripts only for packages approved in `pnpm-workspace.yaml`, and it waits
for a minimum release age before installing new versions. Don't add exclusions to get
around either: open an issue instead.

## Workflow

1. Open or pick an issue. For anything larger than a bug fix, agree on the approach there first.
2. Branch from `main`: `feat/avatar-status`, `fix/input-focus-ring`, `docs/theming-guide`.
3. Make the change with tests and a story.
4. `pnpm changeset`: choose the packages and bump type, and write the line users will read in the changelog.
5. `pnpm check`: runs formatting, lint, layer boundaries, types, tests and the tarball exports check.
   `pnpm check:consumers` (also in CI) installs the packed packages into clean Vite and
   Next.js apps from `fixtures/` and builds them: it catches packaging and SSR problems.
   Visual tests run in CI on every pull request (Chromium, Firefox, WebKit; light and dark).
   If you changed something visual on purpose, run the **Visual tests** workflow on your branch
   with _update_ ticked: it regenerates the baselines on Linux, checks that they reproduce and
   commits them. Look at every changed image in the pull request before merging. Never commit
   screenshots made on your own machine, because fonts and rendering differ.
   Changes to focus, keyboard handling, overlays or the mobile layout also need the parts of
   [docs/manual-checks.md](docs/manual-checks.md) they touch, with a real screen reader and
   phone: automated tests cannot hear or hold a device.
6. Open a pull request that says `Closes #<issue>`.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
`feat(react): add Avatar status dot`, `fix(tokens): raise dark textSubtle contrast`.

## Rules a change must follow

- **Dependencies point down.** `scripts/check-boundaries.mjs` enforces the layers. Tokens, icons
  and assets never depend on React or Vanilla Extract.
- **Tokens before values.** No raw colors, sizes or durations in component styles. Add a token
  if one is missing.
- **Every style is layered.** Use `componentRecipe()` or `inLayer('components', …)`, and call
  `declareLayers()` at the top of each `.css.ts`.
- **Accessible by default.** Keyboard support, visible focus, correct roles, 44px touch targets
  on coarse pointers, and `prefers-reduced-motion` respected. Storybook's a11y panel must be clean.
- **Mobile is not an afterthought.** Check new UI on the phone viewport.
- **Visual language.** Read the _Visual language_ section of ARCHITECTURE.md. New components
  should look like Mohirlab, not like a generic kit.
- **Breaking changes** (renamed tokens, removed props, changed defaults) need a `major`
  changeset and a migration note.

## Icons

Add an SVG to `packages/foundation/icons/src/svg/` named in kebab-case. Use a 24×24 viewBox,
draw on whole and half pixels, use only `<path>`, `<circle>`, `<rect>` and the like, and don't
set colors. Strokes come from the renderer: 1.75 wide, square caps, mitred joins. Solid
marks use `fill="currentColor" stroke="none"`. The build rejects anything else.

## Releasing (maintainers)

Merging the "Version packages" pull request publishes to npm from GitHub Actions through
trusted publishing (OIDC). Nobody publishes from a laptop except the very first release
of a new package.
