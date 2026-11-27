import { declareLayers, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { font } = vars;

export const text = componentRecipe({
  base: { margin: 0 },
  variants: {
    variant: {
      display: {
        fontSize: `clamp(${font.size['3xl']}, 4vw + 1rem, ${font.size['4xl']})`,
        fontWeight: font.weight.heavy,
        lineHeight: font.leading.tight,
        letterSpacing: '-0.03em',
        textWrap: 'balance',
      },
      title: {
        fontSize: font.size['2xl'],
        fontWeight: font.weight.heavy,
        lineHeight: font.leading.tight,
        letterSpacing: font.tracking.tight,
        textWrap: 'balance',
      },
      heading: {
        fontSize: font.size.xl,
        fontWeight: font.weight.strong,
        lineHeight: font.leading.snug,
        letterSpacing: font.tracking.tight,
      },
      subheading: {
        fontSize: font.size.lg,
        fontWeight: font.weight.strong,
        lineHeight: font.leading.snug,
      },
      body: { fontSize: font.size.md, lineHeight: font.leading.normal, textWrap: 'pretty' },
      small: { fontSize: font.size.sm, lineHeight: font.leading.snug },
      /** The eyebrow: small, uppercase, tracked. */
      label: {
        fontSize: font.size.xs,
        fontWeight: font.weight.strong,
        letterSpacing: font.tracking.label,
        textTransform: 'uppercase',
        lineHeight: font.leading.snug,
      },
      code: { fontFamily: font.family.mono, fontSize: '0.9em' },
    },
    tone: {
      default: { color: vars.color.text },
      muted: { color: vars.color.textMuted },
      subtle: { color: vars.color.textSubtle },
      accent: { color: vars.color.accentText },
      danger: { color: vars.color.dangerText },
      success: { color: vars.color.successText },
      inherit: { color: 'inherit' },
    },
    numeric: {
      true: { fontVariantNumeric: 'tabular-nums' },
      false: {},
    },
  },
  defaultVariants: { variant: 'body', tone: 'inherit', numeric: false },
});

export type TextVariants = NonNullable<RecipeVariants<typeof text>>;
