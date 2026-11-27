import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, transition } from '@mohirlab/recipes';

declareLayers();

const { color, space, font, radius } = vars;
const ring = `0 0 0 2px ${color.canvas}, 0 0 0 4px ${color.focus}`;

/** A label row: control on the left, text on the right; the whole row is the target. */
export const row = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'flex-start',
    gap: space['3'],
    cursor: 'pointer',
    color: color.text,
    WebkitTapHighlightColor: 'transparent',
    selectors: { '&:has(input:disabled)': { cursor: 'not-allowed', opacity: 0.55 } },
    '@media': { '(pointer: coarse)': { minHeight: '2.75rem', alignItems: 'center' } },
  }),
);

/** Row plus its description; the description lines up under the label text. */
export const item = style(inLayer('components', { display: 'grid', gap: space['0.5'] }));
export const label = style(
  inLayer('components', { fontSize: font.size.md, lineHeight: font.leading.snug, paddingTop: '0.0625rem' }),
);
export const description = style(
  inLayer('components', {
    // Indent past the control (1.25rem) and the gap.
    paddingLeft: `calc(1.25rem + ${space['3']})`,
    fontSize: font.size.sm,
    color: color.textMuted,
    lineHeight: font.leading.snug,
    selectors: { [`${item}[data-kind="switch"] &`]: { paddingLeft: `calc(2.25rem + ${space['3']})` } },
  }),
);

/** Holds the native input and the drawn mark on top of it. */
export const box = style(
  inLayer('components', {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    marginTop: '0.0625rem',
  }),
);

const base = compose(transition('background-color', 'border-color', 'box-shadow'), {
  appearance: 'none',
  margin: 0,
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  border: `1.5px solid ${color.border}`,
  backgroundColor: color.surface,
  cursor: 'inherit',
  outline: 'none',
  selectors: {
    '&:hover:not(:disabled)': { borderColor: `color-mix(in oklch, ${color.border}, ${color.text} 30%)` },
    '&:focus-visible': { boxShadow: ring },
    '&:checked, &:indeterminate': { backgroundColor: color.accent, borderColor: color.accent },
    '&[aria-invalid="true"]': { borderColor: color.danger },
  },
});

export const checkbox = style(inLayer('components', compose(base, { borderRadius: radius.xs })));
export const radio = style(inLayer('components', compose(base, { borderRadius: '50%' })));

/** The check or dash, drawn over the box and shown only in the matching state. */
const mark = {
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  pointerEvents: 'none',
  color: color.onAccent,
  opacity: 0,
  transform: 'scale(0.6)',
  transition: `opacity ${vars.motion.duration.quick}, transform ${vars.motion.duration.quick} ${vars.motion.easing.press}`,
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
} as const;

export const check = style(
  inLayer('components', {
    ...mark,
    selectors: { [`${checkbox}:checked:not(:indeterminate) ~ &`]: { opacity: 1, transform: 'none' } },
  }),
);
export const dash = style(
  inLayer('components', {
    ...mark,
    selectors: { [`${checkbox}:indeterminate ~ &`]: { opacity: 1, transform: 'none' } },
  }),
);
export const dot = style(
  inLayer('components', {
    ...mark,
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: color.onAccent,
    selectors: { [`${radio}:checked ~ &`]: { opacity: 1, transform: 'none' } },
  }),
);

/** Switch: a pill track with a sliding thumb. */
export const track = style(
  inLayer(
    'components',
    compose(base, {
      width: '2.25rem',
      height: '1.375rem',
      borderRadius: radius.round,
      borderColor: 'transparent',
      backgroundColor: `color-mix(in oklch, ${color.border}, ${color.text} 12%)`,
      selectors: { '&:checked': { borderColor: 'transparent' } },
    }),
  ),
);
export const thumb = style(
  inLayer('components', {
    position: 'absolute',
    top: '0.1875rem',
    left: '0.1875rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: color.onAccent,
    boxShadow: vars.shadow.control,
    pointerEvents: 'none',
    transition: `transform ${vars.motion.duration.settle} ${vars.motion.easing.press}`,
    selectors: { [`${track}:checked ~ &`]: { transform: 'translateX(0.875rem)' } },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  }),
);

export const group = style(
  inLayer('components', { border: 0, margin: 0, padding: 0, minWidth: 0, display: 'grid', gap: space['2'] }),
);
export const legend = style(
  inLayer('components', {
    padding: 0,
    marginBottom: space['2'],
    fontSize: font.size.sm,
    fontWeight: font.weight.strong,
    color: color.text,
  }),
);
export const options = style(
  inLayer('components', {
    display: 'flex',
    flexDirection: 'column',
    gap: space['3'],
    selectors: {
      '&[data-orientation="horizontal"]': { flexDirection: 'row', flexWrap: 'wrap', gap: space['5'] },
    },
  }),
);
export const groupHint = style(
  inLayer('components', { margin: 0, fontSize: font.size.sm, color: color.textSubtle }),
);
export const groupError = style(
  inLayer('components', {
    margin: 0,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: color.dangerText,
  }),
);
