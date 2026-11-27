import { declareLayers, vars } from '@mohirlab/themes';
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
        '&:read-only:not(:disabled)': { backgroundColor: color.surfaceSunken, boxShadow: 'none' },
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
