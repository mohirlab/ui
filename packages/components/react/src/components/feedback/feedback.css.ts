import { keyframes, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color, space, radius, font, motion } = vars;

/** A slow breath rather than the usual shimmer sweep: calmer, and cheap to paint. */
const breathe = keyframes({ '50%': { opacity: 0.45 } }, 'ml-breathe');

export const skeleton = componentRecipe({
  base: {
    display: 'block',
    flexShrink: 0,
    // A tint of ink, not a fixed grey: it reads on canvas, cards and sunken panels alike.
    backgroundColor: `color-mix(in oklch, ${color.text} 9%, transparent)`,
    animation: `${breathe} calc(${motion.duration.slow} * 4) ${motion.easing.standard} infinite`,
    '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
  },
  variants: {
    shape: {
      // One line of text at the current font size, with the line's own spacing around it.
      text: { height: '0.75em', marginBlock: '0.375em', borderRadius: radius.xs },
      circle: { borderRadius: radius.round, aspectRatio: '1' },
      block: { borderRadius: radius.md },
    },
  },
  defaultVariants: { shape: 'text' },
});

export type SkeletonVariants = NonNullable<RecipeVariants<typeof skeleton>>;

export const skeletonLines = style(inLayer('components', { display: 'flex', flexDirection: 'column' }));

/** The last line of a paragraph is shorter, as real text is. */
export const lastLine = style(inLayer('components', { width: '62%' }));

export const empty = componentRecipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: space['3'],
    paddingInline: space['6'],
    color: color.textMuted,
  },
  variants: {
    size: {
      sm: { paddingBlock: space['6'] },
      md: { paddingBlock: space['12'] },
    },
    /** A dashed paper edge, for drop zones and empty panels inside a page. */
    framed: {
      true: { border: `1px dashed ${color.border}`, borderRadius: radius.lg },
      false: {},
    },
  },
  defaultVariants: { size: 'md', framed: false },
});

export type EmptyStateVariants = NonNullable<RecipeVariants<typeof empty>>;

/** The square seal, grown into an icon tile: the Mohirlab mark for "nothing here yet". */
export const emptyMark = style(
  inLayer('components', {
    display: 'grid',
    placeItems: 'center',
    width: '3rem',
    height: '3rem',
    marginBottom: space['1'],
    borderRadius: radius.sm,
    color: color.accentText,
    backgroundColor: color.accentSoft,
    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color.accent} 18%, transparent)`,
  }),
);

export const emptyTitle = style(
  inLayer('components', {
    margin: 0,
    fontSize: font.size.lg,
    fontWeight: font.weight.strong,
    letterSpacing: font.tracking.tight,
    lineHeight: font.leading.snug,
    color: color.text,
    textWrap: 'balance',
  }),
);

export const emptyText = style(
  inLayer('components', {
    margin: 0,
    maxWidth: '26rem',
    fontSize: font.size.md,
    lineHeight: font.leading.normal,
    textWrap: 'pretty',
  }),
);

export const emptyActions = style(
  inLayer('components', {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: space['2'],
    marginTop: space['2'],
  }),
);
