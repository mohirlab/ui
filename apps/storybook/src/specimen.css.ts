// Styles for the showcase itself (not part of the design system).
import { style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';

export const grid = style({
  display: 'grid',
  gap: vars.space['3'],
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
});

export const ramp = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  boxShadow: vars.shadow.hairline,
});

export const chip = style({
  height: '3.25rem',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '0.3rem 0.4rem',
  fontFamily: vars.font.family.mono,
  fontSize: '0.625rem',
});

export const tile = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['2'],
  padding: vars.space['3'],
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  boxShadow: vars.shadow.hairline,
  minWidth: 0,
});

export const swatch = style({
  height: '3rem',
  borderRadius: vars.radius.sm,
  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${vars.color.text} 12%, transparent)`,
});

export const mono = style({
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  overflowWrap: 'anywhere',
});

export const iconCell = style([
  tile,
  {
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'copy',
    border: 0,
    font: 'inherit',
    color: vars.color.text,
    selectors: { '&:hover': { boxShadow: `0 0 0 1px ${vars.color.accent}` } },
  },
]);

export const search = style({ maxWidth: '22rem', marginBottom: vars.space['5'] });

export const art = style({
  width: '100%',
  aspectRatio: '16 / 10',
  borderRadius: vars.radius.md,
  display: 'block',
});
