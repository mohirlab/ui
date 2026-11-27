import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, focusRing } from '@mohirlab/recipes';

declareLayers();

const { color, space, font, radius, motion } = vars;

export const accordion = style(
  inLayer('components', {
    display: 'flex',
    flexDirection: 'column',
    borderTop: `1px solid ${color.hairline}`,
  }),
);

export const item = style(inLayer('components', { borderBottom: `1px solid ${color.hairline}` }));

export const summary = style(
  inLayer(
    'components',
    compose(focusRing, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: space['4'],
      minHeight: '3rem',
      paddingBlock: space['3'],
      listStyle: 'none',
      cursor: 'pointer',
      fontSize: font.size.md,
      fontWeight: font.weight.strong,
      color: color.text,
      borderRadius: radius.sm,
      selectors: {
        // Hide the UA disclosure triangle everywhere.
        '&::-webkit-details-marker': { display: 'none' },
        '&::marker': { content: '""' },
        '&:hover': { color: color.accentText },
      },
    }),
  ),
);

export const chevron = style(
  inLayer('components', {
    flexShrink: 0,
    color: color.textSubtle,
    transition: `transform ${motion.duration.settle} ${motion.easing.standard}`,
    selectors: { [`${item}[open] &`]: { transform: 'rotate(180deg)' } },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  }),
);

export const content = style(
  inLayer('components', {
    paddingBottom: space['4'],
    paddingRight: space['8'],
    fontSize: font.size.md,
    lineHeight: font.leading.normal,
    color: color.textMuted,
  }),
);
