import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import { fadeIn, riseIn } from '@mohirlab/motion';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color, space, radius, font, motion } = vars;

/**
 * Where the panel sits relative to its trigger, as CSS `position-area` values.
 * `start`/`end` are logical, so they follow right-to-left text.
 */
const areas = {
  top: 'block-start',
  'top-start': 'block-start span-inline-end',
  'top-end': 'block-start span-inline-start',
  bottom: 'block-end',
  'bottom-start': 'block-end span-inline-end',
  'bottom-end': 'block-end span-inline-start',
  start: 'inline-start',
  end: 'inline-end',
} as const;

export type Placement = keyof typeof areas;

const placement = Object.fromEntries(
  Object.entries(areas).map(([name, area]) => [name, { positionArea: area } as const]),
) as Record<Placement, { positionArea: string }>;

/** Shared by Popover and Tooltip: anchored, flipped at viewport edges, animated in. */
const anchored = {
  position: 'fixed',
  // Undo the UA's centred-popover defaults; position-area does the placing.
  inset: 'auto',
  margin: space['2'],
  positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
  overflow: 'visible',
  selectors: {
    '&:popover-open': { animation: `${riseIn} ${motion.duration.quick} ${motion.easing.enter} both` },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: { '&:popover-open': { animation: `${fadeIn} ${motion.duration.instant} linear both` } },
    },
  },
} as const;

/** A sheet of paper beside its trigger: hairline edge, floating shadow, no arrow. */
export const popover = componentRecipe({
  base: {
    ...anchored,
    padding: `${space['3']} ${space['4']}`,
    maxWidth: 'min(20rem, calc(100vw - 2rem))',
    color: color.text,
    backgroundColor: color.surface,
    border: 0,
    borderRadius: radius.md,
    boxShadow: `${vars.shadow.hairline}, ${vars.shadow.floating}`,
    fontSize: font.size.sm,
    lineHeight: font.leading.snug,
  },
  variants: { placement },
  defaultVariants: { placement: 'bottom-start' },
});

export type PopoverVariants = NonNullable<RecipeVariants<typeof popover>>;

/** The workshop label: mono, uppercase, tracked, so it reads apart from field labels below it. */
export const popoverTitle = style(
  inLayer('components', {
    margin: `0 0 ${space['3']}`,
    fontFamily: font.family.mono,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
    letterSpacing: font.tracking.label,
    textTransform: 'uppercase',
    color: color.textSubtle,
  }),
);

/** Tooltips use the toast's slip: inverse, small, quiet. */
export const tooltip = componentRecipe({
  base: {
    ...anchored,
    margin: space['1.5'],
    padding: `${space['1']} ${space['2']}`,
    maxWidth: 'min(16rem, calc(100vw - 2rem))',
    color: color.textInverse,
    backgroundColor: color.surfaceInverse,
    border: 0,
    borderRadius: radius.sm,
    boxShadow: vars.shadow.raised,
    fontSize: font.size.xs,
    lineHeight: font.leading.snug,
    pointerEvents: 'none',
  },
  variants: { placement },
  defaultVariants: { placement: 'top' },
});
