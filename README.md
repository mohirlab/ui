# Mohirlab

An open-source design system built on [Vanilla Extract](https://vanilla-extract.style), published
under `@mohirlab`. _Mohir_ is Uzbek for a master craftsman, and the visual language follows
from that: warm paper and ink, a deep lapis accent, calm surfaces, a square seal that marks state,
square-capped icons and imagery generated from tilework geometry.

| Package                                             | What it is                                                 |
| --------------------------------------------------- | ---------------------------------------------------------- |
| [`@mohirlab/tokens`](packages/foundation/tokens)    | DTCG design tokens → JS, types, CSS variables, JSON        |
| [`@mohirlab/icons`](packages/foundation/icons)      | Line icons as framework-free data, SVG files and a sprite  |
| [`@mohirlab/assets`](packages/foundation/assets)    | Seeded generative artwork and avatars in Mohirlab palettes |
| [`@mohirlab/themes`](packages/foundation/themes)    | Theme contract, light and dark themes, cascade layers      |
| [`@mohirlab/sprinkles`](packages/styling/sprinkles) | Type-safe, token-bound responsive utilities                |
| [`@mohirlab/recipes`](packages/styling/recipes)     | Variant recipes and conventions for your own components    |
| [`@mohirlab/motion`](packages/styling/motion)       | Enter/exit motion presets with reduced-motion fallbacks    |
| [`@mohirlab/react`](packages/components/react)      | React components                                           |

## Use it

```sh
pnpm add @mohirlab/react @mohirlab/themes @mohirlab/sprinkles @mohirlab/motion @mohirlab/icons @vanilla-extract/css
```

```tsx
import '@mohirlab/themes/styles.css';
import '@mohirlab/sprinkles/styles.css';
import '@mohirlab/motion/styles.css';
import '@mohirlab/react/styles.css';

import { iconArrowRight } from '@mohirlab/icons';
import { Button, Field, Icon, Input, Stack, ThemeScope } from '@mohirlab/react';

export function App() {
  return (
    <ThemeScope mode="light">
      <Stack gap={{ mobile: '3', desktop: '5' }} padding="6">
        <Field label="Email" hint="We'll send a sign-in link.">
          <Input type="email" />
        </Field>
        <Button end={<Icon icon={iconArrowRight} />}>Continue</Button>
      </Stack>
    </ThemeScope>
  );
}
```

Write your own styles against the same tokens in any `.css.ts` file:

```ts
import { style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';

export const panel = style({ background: vars.color.surface, borderRadius: vars.radius.lg });
```

Supported browsers: Chrome/Edge 125+, Safari 26+ (macOS and iOS), Firefox 147+. See
[ARCHITECTURE.md](ARCHITECTURE.md#browser-support).

Fonts are not bundled. The tokens ask for Geologica and Martian Mono and fall back to
system fonts.

## Develop

Requires Node 24 (22 works) and pnpm 12.

```sh
pnpm install
pnpm build                               # every package, in dependency order
pnpm --filter @mohirlab/storybook dev    # the showcase, http://localhost:6006
pnpm --filter @mohirlab/examples dev     # the example websites
pnpm check                               # format, lint, boundaries, types, tests, tarballs
```

**See it live:** [Storybook](https://mohirlab.github.io/ui/) and [example websites](https://mohirlab.github.io/ui/examples/) (a community app, a marketing site and a SaaS dashboard, all built only from Mohirlab).

Storybook is organised as **Foundations** (colors, type, spacing, elevation, icons, imagery),
**Components** (live controls and variant grids) and **Patterns** (real cards, mobile-first).
The toolbar switches light and dark mode and phone and tablet viewports, and every story
runs accessibility checks.

Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started and [ARCHITECTURE.md](ARCHITECTURE.md) for the
decisions behind the system.

## Release

1. `pnpm changeset` in the pull request that makes the change.
2. Merging to `main` opens a "Version packages" pull request.
3. Merging that publishes to npm from GitHub Actions through trusted publishing (OIDC),
   with provenance. No npm tokens exist.

Maintainer setup (GitHub account, npm first publish, trusted publishing): [docs/maintainers.md](docs/maintainers.md).

## License

[MIT](LICENSE)
