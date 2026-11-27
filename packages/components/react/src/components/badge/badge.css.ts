import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const fill = createVar();
const ink = createVar();
const seal = createVar();
const { color } = vars;

/**
 * Badges are stamps: monospaced, uppercase, tracked out, with a hard edge.
 * They read as labels on a specimen drawer, not as candy pills.
 */
export const badge = componentRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space['1.5'],
    height: '1.375rem',
    paddingInline: vars.space['2'],
    fontFamily: vars.font.family.mono,
    fontSize: '0.6875rem',
    fontWeight: vars.font.weight.medium,
    letterSpacing: vars.font.tracking.label,
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    borderRadius: vars.radius.xs,
    backgroundColor: fill,
    color: ink,
    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ink} 22%, transparent)`,
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
      true: { vars: { [fill]: seal, [ink]: color.onAccent }, boxShadow: 'none' },
      false: {},
    },
  },
  defaultVariants: { tone: 'neutral', solid: false },
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;

/** The seal: a small square, not a dot. */
export const sealMark = style(
  inLayer('components', {
    width: '0.375rem',
    height: '0.375rem',
    backgroundColor: seal,
    flexShrink: 0,
    selectors: {
      [`.${badge.classNames.variants.solid.true} &`]: { backgroundColor: 'currentColor' },
    },
  }),
);
