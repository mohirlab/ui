# @mohirlab/motion

Enter and exit motion for Mohirlab: keyframes and `data-state` presets built on the motion tokens, with reduced-motion fallbacks.

Part of [Mohirlab](https://github.com/mohirlab/ui), an open-source design system built on Vanilla Extract.

```sh
pnpm add @mohirlab/motion
```

```ts
// panel.css.ts
import { style } from '@vanilla-extract/css';
import { motion } from '@mohirlab/motion';

// Animates when the element's data-state switches between "open" and "closed".
export const panel = style(motion('rise'));
```

```ts
import '@mohirlab/motion/styles.css'; // the keyframes
```

Under `prefers-reduced-motion` movement becomes a short crossfade. MIT licensed.
