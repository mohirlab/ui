import { style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';
import { mq } from '@mohirlab/sprinkles';

const { color, space, radius, font } = vars;

export const layout = style({
  display: 'grid',
  gap: space['6'],
  paddingBlock: space['6'],
  '@media': {
    [mq('tablet')]: { gridTemplateColumns: '13rem minmax(0, 1fr)' },
    [mq('desktop')]: { gridTemplateColumns: '13rem minmax(0, 1fr) 18rem' },
  },
});

export const sidebar = style({
  display: 'none',
  '@media': {
    [mq('tablet')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: space['1'],
      position: 'sticky',
      top: '5rem',
      alignSelf: 'start',
    },
  },
});

export const rail = style({
  display: 'none',
  '@media': {
    [mq('desktop')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: space['5'],
      position: 'sticky',
      top: '5rem',
      alignSelf: 'start',
    },
  },
});

export const sideLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['3'],
  padding: `${space['2']} ${space['3']}`,
  borderRadius: radius.md,
  color: color.textMuted,
  fontWeight: font.weight.medium,
  textDecoration: 'none',
  selectors: {
    '&:hover': { backgroundColor: color.surfaceSunken, color: color.text },
    '&[aria-current="page"]': { backgroundColor: color.accentSoft, color: color.accentText },
  },
});

export const feed = style({ display: 'flex', flexDirection: 'column', gap: space['5'], minWidth: 0 });

export const composer = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['3'],
  padding: space['3'],
  borderRadius: radius.lg,
  backgroundColor: color.surface,
  boxShadow: `${vars.shadow.hairline}, ${vars.shadow.raised}`,
});

export const composerPrompt = style({
  flex: 1,
  textAlign: 'start',
  padding: `0.625rem ${space['4']}`,
  border: 0,
  borderRadius: radius.round,
  backgroundColor: color.surfaceSunken,
  color: color.textSubtle,
  font: 'inherit',
  cursor: 'text',
  selectors: { '&:hover': { color: color.textMuted } },
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['1'],
  marginInline: `calc(-1 * ${space['2']})`,
});
