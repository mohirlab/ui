import type { StyleRule } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';

/**
 * Shared variant vocabulary. Components pick the dimensions they need;
 * nobody gets one universal recipe.
 */
export type Size = 'sm' | 'md' | 'lg';
export type Tone = 'accent' | 'neutral' | 'danger' | 'success' | 'warning';
export type Appearance = 'solid' | 'soft' | 'outline' | 'ghost';

/** Control heights are a little off the usual 32/40/48 grid on purpose. */
export const controlSize: Record<Size, StyleRule> = {
  sm: {
    height: '1.875rem',
    paddingInline: vars.space['3'],
    fontSize: vars.font.size.sm,
    gap: vars.space['1.5'],
  },
  md: {
    height: '2.375rem',
    paddingInline: vars.space['4'],
    fontSize: vars.font.size.md,
    gap: vars.space['2'],
  },
  lg: {
    height: '2.875rem',
    paddingInline: vars.space['5'],
    fontSize: vars.font.size.lg,
    gap: vars.space['2'],
  },
};

export const transition = (...properties: string[]): StyleRule => ({
  transitionProperty: properties.join(', '),
  transitionDuration: vars.motion.duration.quick,
  transitionTimingFunction: vars.motion.easing.standard,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transitionDuration: '1ms' },
  },
});

/**
 * Focus ring: an offset ring in the focus color with a canvas-colored gap,
 * so it stays visible on any surface, including solid accent buttons.
 */
export const focusRing: StyleRule = {
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${vars.color.canvas}, 0 0 0 4px ${vars.color.focus}`,
    },
  },
};

/**
 * The keycap: solid controls carry a lit top edge and a darker bottom lip.
 * Pressing compresses the lip and drops the cap by one pixel.
 */
export const keycap: StyleRule = {
  boxShadow: vars.shadow.lip,
  selectors: {
    '&:active:not(:disabled):not([aria-disabled="true"])': {
      boxShadow: vars.shadow.lipPressed,
      transform: 'translateY(1px)',
    },
    '&:focus-visible': {
      boxShadow: `${vars.shadow.lip}, 0 0 0 2px ${vars.color.canvas}, 0 0 0 4px ${vars.color.focus}`,
    },
  },
};

export const disabled: StyleRule = {
  selectors: {
    '&:disabled, &[aria-disabled="true"]:not([aria-busy="true"])': {
      cursor: 'not-allowed',
      opacity: 0.48,
      boxShadow: 'none',
      transform: 'none',
    },
  },
};

/**
 * Mobile web: on touch screens, grow the hit area to at least 44px without
 * changing what the control looks like. The element must not clip overflow.
 */
export const touchTarget: StyleRule = {
  '@media': {
    '(pointer: coarse)': {
      selectors: {
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '50% 50%',
          minWidth: '2.75rem',
          minHeight: '2.75rem',
          width: 'calc(100% + 0.5rem)',
          height: '100%',
          transform: 'translate(-50%, -50%)',
        },
      },
    },
  },
};

/** Visually hidden but available to assistive technology. */
export const srOnly: StyleRule = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
