import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, focusRing, transition } from '@mohirlab/recipes';
import { mq } from '@mohirlab/sprinkles';

declareLayers();

const { color, space, font, radius } = vars;

const belowTablet = `not ${mq('tablet')}`;

export const pagination = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'center',
    gap: space['1'],
    margin: 0,
    padding: 0,
    listStyle: 'none',
    fontSize: font.size.sm,
    fontVariantNumeric: 'tabular-nums',
    '@media': { [belowTablet]: { justifyContent: 'space-between' } },
  }),
);

/** Page numbers and gaps: hidden on phones, where "Page 3 of 12" replaces them. */
export const pageItem = style(
  inLayer('components', { display: 'flex', '@media': { [belowTablet]: { display: 'none' } } }),
);

export const status = style(
  inLayer('components', {
    display: 'none',
    color: color.textMuted,
    '@media': { [belowTablet]: { display: 'block' } },
  }),
);

const control = compose(focusRing, transition('background-color', 'color', 'box-shadow'), {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space['1'],
  minWidth: '2.25rem',
  height: '2.25rem',
  paddingInline: space['2'],
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: font.weight.medium,
  color: color.textMuted,
  textDecoration: 'none',
  background: 'none',
  border: 0,
  borderRadius: radius.sm,
  cursor: 'pointer',
  '@media': { '(pointer: coarse)': { minWidth: '2.75rem', height: '2.75rem' } },
  selectors: {
    '&:hover:not([aria-disabled="true"]):not(:disabled):not([aria-current="page"])': {
      color: color.text,
      backgroundColor: color.surfaceSunken,
    },
    '&:disabled, &[aria-disabled="true"]': { cursor: 'not-allowed', color: color.textSubtle, opacity: 0.6 },
  },
});

export const page = style(
  inLayer(
    'components',
    compose(control, {
      selectors: {
        // The current page is an ink tile: the same weight as printed page numbers.
        '&[aria-current="page"]': {
          color: color.canvas,
          backgroundColor: color.text,
          cursor: 'default',
        },
      },
    }),
  ),
);

export const step = style(inLayer('components', compose(control, { paddingInline: space['3'] })));

export const gap = style(
  inLayer('components', {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '1.5rem',
    height: '2.25rem',
    color: color.textSubtle,
    userSelect: 'none',
  }),
);
