import { declareLayers, vars } from '@mohirlab/themes';
import { compose, componentRecipe, controlSize, transition } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color, radius } = vars;

/**
 * The ledger input: a quiet hairline box sitting on a heavier ruled line,
 * with the lower corners squared off where the rule runs. Focus thickens the
 * rule in the accent color and warms the field slightly.
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
      borderBottom: `2px solid ${color.rule}`,
      borderRadius: `${radius.md} ${radius.md} ${radius.xs} ${radius.xs}`,
      outline: 'none',
      selectors: {
        '&::placeholder': { color: color.textSubtle, opacity: 1 },
        '&:hover:not(:disabled):not(:focus)': { borderColor: color.rule },
        '&:focus': {
          borderColor: color.border,
          borderBottomColor: color.accent,
          backgroundColor: `color-mix(in oklch, ${color.surface}, ${color.accent} 4%)`,
          boxShadow: `inset 0 -1px 0 ${color.accent}`,
        },
        '&:focus-visible': {
          boxShadow: `inset 0 -1px 0 ${color.accent}, 0 0 0 3px color-mix(in oklch, transparent, ${color.focus} 22%)`,
        },
        '&[aria-invalid="true"]': {
          borderBottomColor: color.danger,
          backgroundColor: `color-mix(in oklch, ${color.surface}, ${color.danger} 4%)`,
        },
        '&[aria-invalid="true"]:focus': {
          boxShadow: `inset 0 -1px 0 ${color.danger}`,
        },
        '&:disabled': {
          cursor: 'not-allowed',
          color: color.textSubtle,
          backgroundColor: color.surfaceSunken,
          borderBottomStyle: 'dashed',
        },
        '&:read-only:not(:disabled)': {
          backgroundColor: color.surfaceSunken,
          borderBottomStyle: 'dotted',
        },
      },
    },
    transition('border-color', 'background-color', 'box-shadow'),
  ),
  variants: {
    size: {
      sm: compose(controlSize.sm, { paddingInline: vars.space['2'] }),
      md: compose(controlSize.md, { paddingInline: vars.space['3'] }),
      lg: compose(controlSize.lg, { paddingInline: vars.space['4'] }),
    },
  },
  defaultVariants: { size: 'md' },
});

export type InputVariants = NonNullable<RecipeVariants<typeof input>>;
