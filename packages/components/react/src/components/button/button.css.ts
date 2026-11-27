import { createVar, keyframes, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import {
  compose,
  componentRecipe,
  controlSize,
  disabled,
  focusRing,
  pressable,
  touchTarget,
  transition,
} from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

// Each tone fills these in; each appearance decides how to use them.
// That keeps tone x appearance at 3 + 4 rules instead of 12 compound variants.
const main = createVar();
const mainHover = createVar();
const mainPressed = createVar();
const soft = createVar();
const onMain = createVar();
const ink = createVar();

const { color } = vars;

export const button = componentRecipe({
  base: compose(
    {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      margin: 0,
      border: '1px solid transparent',
      borderRadius: vars.radius.md,
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.strong,
      letterSpacing: '-0.005em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
    },
    transition('background-color', 'border-color', 'box-shadow', 'color', 'transform'),
    focusRing,
    touchTarget,
    disabled,
  ),
  variants: {
    tone: {
      accent: {
        vars: {
          [main]: color.accent,
          [mainHover]: color.accentHover,
          [mainPressed]: color.accentPressed,
          [soft]: color.accentSoft,
          [onMain]: color.onAccent,
          [ink]: color.accentText,
        },
      },
      neutral: {
        vars: {
          [main]: color.surfaceInverse,
          [mainHover]: `color-mix(in oklch, ${color.surfaceInverse} 86%, ${color.canvas})`,
          [mainPressed]: `color-mix(in oklch, ${color.surfaceInverse} 76%, ${color.canvas})`,
          [soft]: color.surfaceSunken,
          [onMain]: color.textInverse,
          [ink]: color.text,
        },
      },
      danger: {
        vars: {
          [main]: color.danger,
          [mainHover]: color.dangerHover,
          [mainPressed]: color.dangerHover,
          [soft]: color.dangerSoft,
          [onMain]: color.onDanger,
          [ink]: color.dangerText,
        },
      },
    },
    appearance: {
      solid: compose(pressable, {
        backgroundColor: main,
        color: onMain,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': { backgroundColor: mainHover },
          '&:active:not(:disabled):not([aria-disabled="true"])': { backgroundColor: mainPressed },
        },
      }),
      soft: {
        backgroundColor: soft,
        color: ink,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': {
            backgroundColor: `color-mix(in oklch, ${soft}, ${main} 12%)`,
          },
          '&:active:not(:disabled):not([aria-disabled="true"])': {
            backgroundColor: `color-mix(in oklch, ${soft}, ${main} 20%)`,
          },
        },
      },
      // A hairline box with a soft lift; the border warms toward the tone on hover.
      outline: {
        backgroundColor: color.surface,
        color: ink,
        borderColor: color.border,
        boxShadow: vars.shadow.raised,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': {
            borderColor: `color-mix(in oklch, ${color.border}, ${main} 35%)`,
            backgroundColor: `color-mix(in oklch, ${color.surface}, ${main} 4%)`,
          },
          '&:active:not(:disabled):not([aria-disabled="true"])': {
            backgroundColor: `color-mix(in oklch, ${color.surface}, ${main} 10%)`,
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: ink,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': {
            backgroundColor: `color-mix(in oklch, transparent, ${main} 9%)`,
          },
          '&:active:not(:disabled):not([aria-disabled="true"])': {
            backgroundColor: `color-mix(in oklch, transparent, ${main} 15%)`,
          },
        },
      },
    },
    size: controlSize,
    iconOnly: {
      true: { paddingInline: 0, aspectRatio: '1' },
      false: {},
    },
    fullWidth: {
      // Fill the row or column; in a flex row, take the space left by siblings instead of overflowing.
      true: { width: '100%', flexShrink: 1, minWidth: 0 },
      false: {},
    },
  },
  defaultVariants: {
    tone: 'accent',
    appearance: 'solid',
    size: 'md',
    iconOnly: false,
    fullWidth: false,
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

const spin = keyframes({ to: { transform: 'rotate(1turn)' } });

/** A notched ring: three quarters ink, one quarter gap. */
export const spinner = style(
  inLayer('components', {
    display: 'inline-block',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    border: '2px solid currentColor',
    borderInlineEndColor: 'transparent',
    animation: `${spin} 0.7s linear infinite`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animationDuration: '2.4s' },
    },
  }),
);

/** While loading the label keeps its width but hides, so the button never jumps. */
export const hiddenLabel = style(inLayer('components', { visibility: 'hidden' }));

export const spinnerOverlay = style(
  inLayer('components', {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
  }),
);

export const slot = style(
  inLayer('components', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'inherit',
  }),
);
