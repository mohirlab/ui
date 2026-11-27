import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, safeArea, vars } from '@mohirlab/themes';
import { compose, componentRecipe, focusRing, transition } from '@mohirlab/recipes';
import { motion } from '@mohirlab/motion';
import { mq } from '@mohirlab/sprinkles';

declareLayers();

const { color, space, radius, font } = vars;

/** Fixed region: bottom-center on phones (above the home indicator), bottom-end from tablet up. */
export const region = style(
  inLayer('components', {
    position: 'fixed',
    zIndex: 2147483000,
    insetInline: space['4'],
    bottom: `max(${space['4']}, ${safeArea.bottom})`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: space['2'],
    margin: 0,
    padding: 0,
    listStyle: 'none',
    pointerEvents: 'none',
    '@media': {
      [mq('tablet')]: {
        insetInline: 'auto',
        right: space['6'],
        bottom: space['6'],
        alignItems: 'flex-end',
      },
    },
  }),
);

const seal = createVar();

/** The slip: inverse paper, a square seal in the tone's color, mono label. */
export const toast = componentRecipe({
  base: compose(motion('rise'), {
    '@media': { [mq('tablet')]: motion('slide-end') },
    pointerEvents: 'auto',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'start',
    gap: `${space['1']} ${space['3']}`,
    width: 'min(24rem, 100%)',
    padding: `${space['3']} ${space['3']} ${space['3']} ${space['4']}`,
    borderRadius: radius.md,
    backgroundColor: color.surfaceInverse,
    color: color.textInverse,
    boxShadow: vars.shadow.floating,
    fontSize: font.size.sm,
    lineHeight: font.leading.snug,
  }),
  variants: {
    tone: {
      neutral: { vars: { [seal]: 'transparent' } },
      accent: { vars: { [seal]: color.accent } },
      success: { vars: { [seal]: color.success } },
      warning: { vars: { [seal]: color.warning } },
      danger: { vars: { [seal]: color.danger } },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const sealMark = style(
  inLayer('components', {
    width: '0.5rem',
    height: '0.5rem',
    marginTop: '0.35rem',
    backgroundColor: seal,
  }),
);

export const content = style(inLayer('components', { display: 'grid', gap: space['0.5'], minWidth: 0 }));

export const title = style(inLayer('components', { fontWeight: font.weight.strong }));

export const description = style(inLayer('components', { opacity: 0.78 }));

const inverseButton = compose(focusRing, transition('background-color', 'opacity'), {
  appearance: 'none',
  border: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderRadius: radius.sm,
  selectors: {
    '&:hover': { backgroundColor: `color-mix(in oklch, currentColor 12%, transparent)` },
    // The focus ring gap must match the slip, not the page canvas.
    '&:focus-visible': { boxShadow: `0 0 0 2px ${color.surfaceInverse}, 0 0 0 4px ${color.focus}` },
  },
});

export const action = style(
  inLayer(
    'components',
    compose(inverseButton, {
      justifySelf: 'start',
      marginTop: space['1'],
      padding: `${space['0.5']} ${space['1']}`,
      marginLeft: `calc(-1 * ${space['1']})`,
      fontSize: font.size.sm,
      fontWeight: font.weight.strong,
      textDecoration: 'underline',
      textUnderlineOffset: '0.25em',
    }),
  ),
);

export const dismiss = style(
  inLayer(
    'components',
    compose(inverseButton, {
      display: 'grid',
      placeItems: 'center',
      width: '1.75rem',
      height: '1.75rem',
      marginTop: '-0.125rem',
      opacity: 0.7,
      selectors: { '&:hover': { opacity: 1 } },
    }),
  ),
);
