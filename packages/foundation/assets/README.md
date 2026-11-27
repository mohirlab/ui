# @mohirlab/assets

Generative, seed-stable artwork and avatars in Mohirlab palettes. No stock photos, no network.

Part of [Mohirlab](https://github.com/mohirlab/ui), an open-source design system built on Vanilla Extract.

```sh
pnpm add @mohirlab/assets
```

```ts
import { artwork, avatar, toDataUri } from '@mohirlab/assets';
const src = toDataUri(artwork('post-42', { kind: 'dunes', palette: 'lapis' }));
```

See the [documentation and Storybook](https://github.com/mohirlab/ui#readme). MIT licensed.
