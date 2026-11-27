import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
// Imported first so the panel rules below come after the popover's in the stylesheet.
import { popover } from '../popover/popover.css';
import { input } from '../input/input.css';

declareLayers();

const { color, space, font, radius } = vars;

export { input, popover };

export const wrap = style(inLayer('components', { position: 'relative', display: 'block', minWidth: 0 }));

/** Room for the chevron button on the right. */
export const field = style(inLayer('components', { paddingRight: space['10'], textOverflow: 'ellipsis' }));

export const toggle = style(
  inLayer('components', {
    position: 'absolute',
    insetBlock: 0,
    right: 0,
    display: 'grid',
    placeItems: 'center',
    width: space['10'],
    padding: 0,
    color: color.textSubtle,
    background: 'none',
    border: 0,
    cursor: 'pointer',
    selectors: { '&:disabled': { cursor: 'not-allowed' } },
  }),
);

/** As wide as the field at least, never taller than about seven options. */
export const panel = style(
  inLayer('components', {
    minWidth: 'anchor-size(width)',
    maxHeight: 'min(18rem, 50vh)',
    margin: `${space['1']} 0`,
    padding: space['1'],
    overflowY: 'auto',
    overscrollBehavior: 'contain',
  }),
);

export const listbox = style(inLayer('components', { display: 'flex', flexDirection: 'column' }));

export const option = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
    minHeight: '2.25rem',
    paddingBlock: space['1.5'],
    paddingInline: space['2'],
    fontSize: font.size.sm,
    lineHeight: font.leading.snug,
    color: color.text,
    borderRadius: radius.xs,
    cursor: 'pointer',
    '@media': { '(pointer: coarse)': { minHeight: '2.75rem' } },
    selectors: {
      // The active option (keyboard) and the hovered one look the same.
      '&[data-active], &:hover:not([aria-disabled="true"])': { backgroundColor: color.surfaceSunken },
      '&[data-active]': { boxShadow: `inset 2px 0 0 ${color.accent}` },
      '&[aria-selected="true"]': { fontWeight: font.weight.medium },
      '&[aria-disabled="true"]': { cursor: 'not-allowed', color: color.textSubtle },
    },
  }),
);

export const optionText = style(
  inLayer('components', { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }),
);

export const optionDescription = style(
  inLayer('components', { fontSize: font.size.xs, fontWeight: font.weight.regular, color: color.textMuted }),
);

export const check = style(
  inLayer('components', {
    flexShrink: 0,
    color: color.accentText,
    visibility: 'hidden',
    selectors: { [`${option}[aria-selected="true"] &`]: { visibility: 'visible' } },
  }),
);

/** The matched part of a label. */
export const match = style(
  inLayer('components', {
    color: 'inherit',
    backgroundColor: 'transparent',
    fontWeight: font.weight.strong,
    textDecoration: 'underline',
    textDecorationColor: color.accent,
    textDecorationThickness: '2px',
    textUnderlineOffset: '0.18em',
  }),
);

export const empty = style(
  inLayer('components', {
    padding: `${space['3']} ${space['2']}`,
    fontSize: font.size.sm,
    color: color.textMuted,
    selectors: { '&:empty': { display: 'none' } },
  }),
);
