import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const fill = createVar();
const ink = createVar();
const seal = createVar();
const { color } = vars;

/** Soft pills in sentence case. The square seal is the Mohirlab mark. */
export const badge = componentRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space['1.5'],
    height: '1.375rem',
    paddingInline: '0.5625rem',
    fontSize: vars.font.size.xs,
    fontWeight: vars.font.weight.medium,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    borderRadius: vars.radius.round,
    backgroundColor: fill,
    color: ink,
  },
  variants: {
    tone: {
      neutral: { vars: { [fill]: color.surfaceSunken, [ink]: color.textMuted, [seal]: color.textSubtle } },
      accent: { vars: { [fill]: color.accentSoft, [ink]: color.accentText, [seal]: color.accent } },
      success: { vars: { [fill]: color.successSoft, [ink]: color.successText, [seal]: color.success } },
      warning: { vars: { [fill]: color.warningSoft, [ink]: color.warningText, [seal]: color.warning } },
      danger: { vars: { [fill]: color.dangerSoft, [ink]: color.dangerText, [seal]: color.danger } },
    },
    solid: {
      true: { vars: { [fill]: seal, [ink]: color.onAccent } },
      false: {},
    },
  },
  defaultVariants: { tone: 'neutral', solid: false },
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;

/** The seal: a small square with softened corners. */
export const sealMark = style(
  inLayer('components', {
    width: '0.375rem',
    height: '0.375rem',
    borderRadius: '1.5px',
    backgroundColor: seal,
    flexShrink: 0,
    selectors: {
      [`.${badge.classNames.variants.solid.true} &`]: { backgroundColor: 'currentColor' },
    },
  }),
);
