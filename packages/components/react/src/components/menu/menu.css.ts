import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { compose, transition } from '@mohirlab/recipes';
// Imported first so the panel rules below come after the popover's in the stylesheet.
import { popover } from '../popover/popover.css';

declareLayers();

const { color, space, font, radius } = vars;

export { popover };

/** Tighter than a popover: a column of rows, each the full width. */
export const menu = style(
  inLayer('components', {
    flexDirection: 'column',
    minWidth: '12rem',
    padding: space['1'],
    // Only while open: an author `display` would override the browser's hiding of a
    // closed popover, and every menu on the page would show.
    selectors: { '&:popover-open': { display: 'flex' } },
  }),
);

export const item = style(
  inLayer(
    'components',
    compose(transition('background-color', 'color'), {
      display: 'flex',
      alignItems: 'center',
      gap: space['2'],
      width: '100%',
      minHeight: '2.25rem',
      paddingInline: space['2'],
      fontFamily: 'inherit',
      fontSize: font.size.sm,
      lineHeight: font.leading.snug,
      textAlign: 'start',
      color: color.text,
      background: 'none',
      border: 0,
      borderRadius: radius.xs,
      outline: 'none',
      cursor: 'pointer',
      '@media': { '(pointer: coarse)': { minHeight: '2.75rem' } },
      selectors: {
        // One highlight for pointer and keyboard: the focused row is the active one.
        '&:focus-visible, &:hover:not([aria-disabled="true"])': { backgroundColor: color.surfaceSunken },
        '&:focus-visible': { boxShadow: `inset 2px 0 0 ${color.accent}` },
        '&[data-tone="danger"]': { color: color.dangerText },
        '&[data-tone="danger"]:focus-visible, &[data-tone="danger"]:hover:not([aria-disabled="true"])': {
          backgroundColor: color.dangerSoft,
        },
        '&[data-tone="danger"]:focus-visible': { boxShadow: `inset 2px 0 0 ${color.danger}` },
        '&[aria-disabled="true"]': { cursor: 'not-allowed', color: color.textSubtle },
      },
    }),
  ),
);

export const itemIcon = style(
  inLayer('components', {
    flexShrink: 0,
    color: color.textMuted,
    selectors: {
      [`${item}[data-tone="danger"] &`]: { color: 'inherit' },
      [`${item}[aria-disabled="true"] &`]: { color: 'inherit' },
    },
  }),
);

export const itemLabel = style(inLayer('components', { flex: 1, minWidth: 0 }));

export const shortcut = style(
  inLayer('components', {
    marginInlineStart: space['4'],
    fontSize: font.size.xs,
    color: color.textSubtle,
    letterSpacing: font.tracking.label,
  }),
);

export const separator = style(
  inLayer('components', {
    height: '1px',
    marginBlock: space['1'],
    marginInline: `calc(-1 * ${space['1']})`,
    border: 0,
    backgroundColor: color.hairline,
  }),
);

export const groupLabel = style(
  inLayer('components', {
    padding: `${space['2']} ${space['2']} ${space['1']}`,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
    letterSpacing: font.tracking.label,
    textTransform: 'uppercase',
    color: color.textSubtle,
  }),
);
