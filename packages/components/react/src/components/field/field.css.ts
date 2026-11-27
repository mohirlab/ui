import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';

declareLayers();

export const field = style(
  inLayer('components', {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space['1.5'],
    minWidth: 0,
  }),
);

export const labelRow = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: vars.space['3'],
  }),
);

export const label = style(
  inLayer('components', {
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.strong,
    color: vars.color.text,
    lineHeight: vars.font.leading.snug,
  }),
);

/** "Optional" is set as a small mono tag rather than marking required fields with asterisks. */
export const optionalTag = style(
  inLayer('components', {
    fontFamily: vars.font.family.mono,
    fontSize: '0.6875rem',
    letterSpacing: vars.font.tracking.label,
    textTransform: 'uppercase',
    color: vars.color.textSubtle,
  }),
);

export const hint = style(
  inLayer('components', {
    margin: 0,
    fontSize: vars.font.size.sm,
    color: vars.color.textSubtle,
    lineHeight: vars.font.leading.snug,
  }),
);

export const error = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'baseline',
    gap: vars.space['1.5'],
    margin: 0,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    color: vars.color.dangerText,
    lineHeight: vars.font.leading.snug,
  }),
);

/** A small square mark. Shape, not just color, signals the error. */
export const errorMark = style(
  inLayer('components', {
    flexShrink: 0,
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: vars.color.danger,
    transform: 'translateY(-0.05em) rotate(45deg)',
  }),
);
