// Consumer-authored styles: proves the published `vars` and layers work in an app build.
import { style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';

export const page = style({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '1fr',
  '@media': {
    'screen and (min-width: 1100px)': { gridTemplateColumns: '1fr 1fr' },
  },
});

export const pane = style({
  padding: `${vars.space['10']} ${vars.space['8']}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['8'],
});

export const swatchRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(11, 1fr)',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  boxShadow: vars.shadow.hairline,
});

export const swatch = style({ height: '2rem' });

export const rule = style({
  border: 0,
  borderTop: `1px solid ${vars.color.hairline}`,
  margin: 0,
});
