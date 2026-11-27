import type { StyleRule } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';
import * as k from './keyframes.css';

export type MotionPreset = 'fade' | 'rise' | 'scale' | 'sheet' | 'slide-end';

const pairs: Record<MotionPreset, { in: string; out: string }> = {
  fade: { in: k.fadeIn, out: k.fadeOut },
  rise: { in: k.riseIn, out: k.riseOut },
  scale: { in: k.scaleIn, out: k.scaleOut },
  sheet: { in: k.sheetIn, out: k.sheetOut },
  'slide-end': { in: k.slideInEnd, out: k.slideOutEnd },
};

export interface MotionOptions {
  /** Enter duration. Default `settle` (240ms); sheets default to `slow`. */
  enter?: string;
  /** Exit duration. Default `quick` (140ms): leaving should be faster than arriving. */
  exit?: string;
  /** Selector suffix to animate instead of the element itself, e.g. `::backdrop`. */
  part?: string;
}

const OPEN = '[data-state="open"]';
const CLOSED = '[data-state="closed"]';

/**
 * Enter and exit animation for an element whose `data-state` is `open` or `closed`.
 * Under `prefers-reduced-motion` the movement is replaced by a short crossfade, so
 * the change of state stays visible without anything travelling across the screen.
 *
 * Use inside a `.css.ts` file and spread into a style (or `compose()` it).
 */
export function motion(preset: MotionPreset, options: MotionOptions = {}): StyleRule {
  const { in: enterName, out: exitName } = pairs[preset];
  const { duration, easing } = vars.motion;
  const enter = options.enter ?? (preset === 'sheet' ? duration.slow : duration.settle);
  const exit = options.exit ?? (preset === 'sheet' ? duration.settle : duration.quick);
  const part = options.part ?? '';

  return {
    selectors: {
      [`&${OPEN}${part}`]: { animation: `${enterName} ${enter} ${easing.enter} both` },
      [`&${CLOSED}${part}`]: { animation: `${exitName} ${exit} ${easing.exit} both` },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        selectors: {
          [`&${OPEN}${part}`]: { animation: `${k.fadeIn} ${duration.quick} linear both` },
          [`&${CLOSED}${part}`]: { animation: `${k.fadeOut} ${duration.instant} linear both` },
        },
      },
    },
  };
}

/** The motion tokens, for transitions that are not enter/exit. */
export const motionTokens = vars.motion;
