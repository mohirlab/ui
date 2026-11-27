import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, componentRecipe } from '@mohirlab/recipes';
import { motion } from '@mohirlab/motion';
import { mq } from '@mohirlab/sprinkles';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color, radius, space, shadow } = vars;

const dialogWidth = createVar();

const center = compose(motion('scale'), motion('fade', { part: '::backdrop' }), {
  margin: 'auto',
  width: `min(${dialogWidth}, calc(100vw - 2rem))`,
  maxHeight: 'calc(100dvh - 4rem)',
  borderRadius: radius.lg,
});

const sheet = compose(motion('sheet'), motion('fade', { part: '::backdrop' }), {
  margin: 'auto 0 0',
  width: '100%',
  maxWidth: '100%',
  maxHeight: '92dvh',
  borderRadius: `${radius.xl} ${radius.xl} 0 0`,
  // Keep actions clear of the home indicator on phones.
  paddingBottom: 'env(safe-area-inset-bottom)',
});

export const dialog = componentRecipe({
  base: {
    padding: 0,
    border: 0,
    color: color.text,
    backgroundColor: color.surface,
    boxShadow: `${shadow.hairline}, ${shadow.floating}`,
    overflow: 'hidden',
    overscrollBehavior: 'contain',
    vars: { [dialogWidth]: '30rem' },
    selectors: {
      // The UA hides a closed <dialog>; only lay out an open one.
      '&[open]': { display: 'flex', flexDirection: 'column' },
      '&::backdrop': {
        backgroundColor: color.scrim,
        backdropFilter: 'blur(2px)',
      },
      '&:focus-visible': { outline: 'none' },
    },
  },
  variants: {
    placement: {
      center,
      sheet,
      /** A bottom sheet on phones, a centered dialog from tablet up. */
      auto: compose(sheet, { '@media': { [mq('tablet')]: center } }),
    },
    size: {
      sm: { vars: { [dialogWidth]: '24rem' } },
      md: { vars: { [dialogWidth]: '30rem' } },
      lg: { vars: { [dialogWidth]: '42rem' } },
    },
  },
  defaultVariants: { placement: 'auto', size: 'md' },
});

export type DialogVariants = NonNullable<RecipeVariants<typeof dialog>>;

/**
 * The grab handle: a double ledger rule instead of the usual pill. Shown on sheets;
 * hidden for centered dialogs (including `auto` from tablet up).
 */
export const handle = style(
  inLayer('components', {
    display: 'none',
    alignSelf: 'center',
    width: '2.5rem',
    height: '6px',
    marginTop: space['3'],
    borderBlock: `1.5px solid ${color.rule}`,
    opacity: 0.7,
    flexShrink: 0,
    selectors: {
      [`.${dialog.classNames.variants.placement.sheet} &`]: { display: 'block' },
      [`.${dialog.classNames.variants.placement.auto} &`]: { display: 'block' },
    },
    '@media': {
      [mq('tablet')]: {
        selectors: { [`.${dialog.classNames.variants.placement.auto} &`]: { display: 'none' } },
      },
    },
  }),
);

/** The drag area of a sheet: handle and header. Touch-action keeps vertical drags ours. */
export const dragArea = style(
  inLayer('components', {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    touchAction: 'none',
    cursor: 'grab',
    selectors: {
      [`.${dialog.classNames.variants.placement.center} &`]: { touchAction: 'auto', cursor: 'auto' },
    },
    '@media': {
      [mq('tablet')]: {
        selectors: {
          [`.${dialog.classNames.variants.placement.auto} &`]: { touchAction: 'auto', cursor: 'auto' },
        },
      },
    },
  }),
);

export const header = style(
  inLayer('components', {
    display: 'grid',
    gap: space['1'],
    // Room on the right for the close button, which is positioned over the header.
    padding: `${space['5']} ${space['12']} ${space['3']} ${space['5']}`,
  }),
);

export const title = style(
  inLayer('components', {
    margin: 0,
    fontSize: vars.font.size.lg,
    fontWeight: vars.font.weight.strong,
    lineHeight: vars.font.leading.snug,
    letterSpacing: vars.font.tracking.tight,
    textWrap: 'balance',
  }),
);

export const description = style(
  inLayer('components', {
    margin: 0,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.leading.snug,
    color: color.textMuted,
  }),
);

export const close = style(
  inLayer('components', {
    position: 'absolute',
    top: space['4'],
    right: space['4'],
    selectors: {
      // Below the sheet handle.
      [`.${dialog.classNames.variants.placement.sheet} &`]: { top: space['6'] },
      [`.${dialog.classNames.variants.placement.auto} &`]: { top: space['6'] },
    },
    '@media': {
      [mq('tablet')]: {
        selectors: { [`.${dialog.classNames.variants.placement.auto} &`]: { top: space['4'] } },
      },
    },
  }),
);

export const body = style(
  inLayer('components', {
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    padding: `${space['2']} ${space['5']} ${space['5']}`,
    fontSize: vars.font.size.md,
    lineHeight: vars.font.leading.normal,
  }),
);

/**
 * Actions sit on a hairline, right-aligned. On sheets they stack full-width, primary on
 * top and the way out underneath, like native action sheets.
 */
export const actions = style(
  inLayer('components', {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: space['2'],
    flexShrink: 0,
    padding: `${space['4']} ${space['5']}`,
    borderTop: `1px solid ${color.hairline}`,
    selectors: {
      [`.${dialog.classNames.variants.placement.sheet} &`]: { flexDirection: 'column-reverse' },
      [`.${dialog.classNames.variants.placement.auto} &`]: { flexDirection: 'column-reverse' },
    },
    '@media': {
      [mq('tablet')]: {
        selectors: { [`.${dialog.classNames.variants.placement.auto} &`]: { flexDirection: 'row' } },
      },
    },
  }),
);
