import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, componentRecipe, controlSize, transition } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color, radius } = vars;

/** A soft halo in a tone's color, used for focus and invalid states. */
const halo = (tone: string) => `0 0 0 3px color-mix(in oklch, ${tone} 20%, transparent)`;

/**
 * A calm field: hairline border, soft lift, rounded corners. Focus turns the border
 * to the accent and adds a soft halo; invalid does the same in the danger tone.
 */
export const input = componentRecipe({
  base: compose(
    {
      appearance: 'none',
      display: 'block',
      width: '100%',
      minWidth: 0,
      margin: 0,
      fontFamily: 'inherit',
      color: color.text,
      backgroundColor: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      boxShadow: vars.shadow.raised,
      outline: 'none',
      selectors: {
        '&::placeholder': { color: color.textSubtle, opacity: 1 },
        '&:hover:not(:disabled):not(:focus)': {
          borderColor: `color-mix(in oklch, ${color.border}, ${color.text} 18%)`,
        },
        '&:focus': { borderColor: color.accent, boxShadow: halo(color.accent) },
        '&[aria-invalid="true"]': { borderColor: color.danger },
        '&[aria-invalid="true"]:focus': { boxShadow: halo(color.danger) },
        '&:disabled': {
          cursor: 'not-allowed',
          color: color.textSubtle,
          backgroundColor: color.surfaceSunken,
          boxShadow: 'none',
        },
        // <select> also matches :read-only in browsers; only real read-only text fields go sunken.
        '&:read-only:not(:disabled):not(select)': { backgroundColor: color.surfaceSunken, boxShadow: 'none' },
      },
    },
    transition('border-color', 'background-color', 'box-shadow'),
  ),
  variants: {
    size: {
      sm: compose(controlSize.sm, { paddingInline: vars.space['2'], borderRadius: radius.sm }),
      md: compose(controlSize.md, { paddingInline: vars.space['3'] }),
      lg: compose(controlSize.lg, { paddingInline: vars.space['4'] }),
    },
  },
  defaultVariants: { size: 'md' },
});

export type InputVariants = NonNullable<RecipeVariants<typeof input>>;

export const maxRows = createVar();

/** Textarea on top of the input look: multi-line padding, vertical resize, optional auto-grow. */
export const textarea = style(
  inLayer('components', {
    height: 'auto',
    minHeight: '5rem',
    paddingBlock: vars.space['2'],
    lineHeight: vars.font.leading.normal,
    resize: 'vertical',
    selectors: {
      '&[data-autogrow]': {
        fieldSizing: 'content',
        maxHeight: `calc(${maxRows} * 1lh + 2 * ${vars.space['2']} + 2px)`,
      },
    },
  }),
);
