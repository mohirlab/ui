import { style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';
import { mq } from '@mohirlab/sprinkles';

const { color, space, radius, font } = vars;

export const layout = style({
  display: 'grid',
  gap: space['6'],
  paddingBlock: space['6'],
  // Room for the bottom navigation on phones.
  paddingBottom: `calc(${space['20']} + env(safe-area-inset-bottom))`,
  '@media': {
    [mq('tablet')]: { gridTemplateColumns: '13rem minmax(0, 1fr)', paddingBottom: space['10'] },
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

/** Phone navigation: fixed to the bottom, above the home indicator. */
export const bottomNav = style({
  position: 'fixed',
  insetInline: 0,
  bottom: 0,
  zIndex: 10,
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  backgroundColor: `color-mix(in oklch, ${color.surface} 88%, transparent)`,
  backdropFilter: 'saturate(1.4) blur(14px)',
  borderTop: `1px solid ${color.hairline}`,
  '@media': { [mq('tablet')]: { display: 'none' } },
});

export const bottomLink = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.2rem',
  minHeight: '3.5rem',
  justifyContent: 'center',
  fontSize: '0.6875rem',
  fontWeight: font.weight.medium,
  color: color.textSubtle,
  textDecoration: 'none',
  selectors: { '&[aria-current="page"]': { color: color.accentText } },
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['1'],
  marginInline: `calc(-1 * ${space['2']})`,
});
