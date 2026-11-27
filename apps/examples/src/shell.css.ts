// Layout for the example sites. Apps compose these from tokens; nothing here is in the library.
import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@mohirlab/themes';
import { mq } from '@mohirlab/sprinkles';

const { color, space, radius, font } = vars;

globalStyle('body', { margin: 0 });

export const page = style({ minHeight: '100dvh' });

export const container = style({
  width: '100%',
  maxWidth: '72rem',
  marginInline: 'auto',
  paddingInline: space['4'],
  '@media': { [mq('tablet')]: { paddingInline: space['6'] } },
});

export const topbar = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: `color-mix(in oklch, ${color.canvas} 82%, transparent)`,
  backdropFilter: 'saturate(1.4) blur(12px)',
  borderBottom: `1px solid ${color.hairline}`,
});

export const topbarInner = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['4'],
  height: '3.75rem',
});

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space['2'],
  fontWeight: font.weight.heavy,
  fontSize: font.size.lg,
  letterSpacing: font.tracking.tight,
  color: color.text,
  textDecoration: 'none',
});

/** The brand mark: the Mohirlab seal, a square with soft corners. */
export const mark = style({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: '6px',
  backgroundColor: color.accent,
  // The seal: a soft square with a smaller paper square inside.
  backgroundImage: `linear-gradient(${color.onAccent}, ${color.onAccent})`,
  backgroundSize: '40% 40%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

export const navLink = style({
  color: color.textMuted,
  textDecoration: 'none',
  fontSize: font.size.sm,
  fontWeight: font.weight.medium,
  padding: `${space['1.5']} ${space['2']}`,
  borderRadius: radius.sm,
  selectors: {
    '&:hover': { color: color.text, backgroundColor: color.surfaceSunken },
    '&[aria-current="page"]': { color: color.text },
  },
});

export const hideOnMobile = style({
  display: 'none',
  '@media': { [mq('tablet')]: { display: 'flex' } },
});

export const hideFromTablet = style({
  '@media': { [mq('tablet')]: { display: 'none' } },
});

export const art = style({ display: 'block', width: '100%', height: '100%', objectFit: 'cover' });

export const rule = style({ border: 0, borderTop: `1px solid ${color.hairline}`, margin: 0 });
