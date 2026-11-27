# @mohirlab/icons

Mohirlab icons: square-capped 24px line icons as framework-free data, SVG files and a sprite.

Part of [Mohirlab](https://github.com/mohirlab/ui), an open-source design system built on Vanilla Extract.

```sh
pnpm add @mohirlab/icons
```

```ts
import { iconHeart, toSvg } from '@mohirlab/icons';
const svg = toSvg(iconHeart, { size: 20, title: 'Like' });
// React: <Icon icon={iconHeart} /> from @mohirlab/react
```

See the [documentation and Storybook](https://github.com/mohirlab/ui#readme). MIT licensed.
