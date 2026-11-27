import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, layers, vars } from '@mohirlab/themes';
import { compose, focusRing, srOnly } from '@mohirlab/recipes';

declareLayers();

const { color, space, font, radius } = vars;
const cellY = createVar();
const cellX = createVar();

/** Scroll container: wide tables scroll sideways on phones instead of squashing. */
export const wrap = style(
  inLayer(
    'components',
    compose(focusRing, {
      position: 'relative',
      overflowX: 'auto',
      maxWidth: '100%',
      borderRadius: radius.lg,
      backgroundColor: color.surface,
      boxShadow: vars.shadow.hairline,
      selectors: { '&[data-sticky-header]': { overflowY: 'auto' } },
    }),
  ),
);

export const table = style(
  inLayer('components', {
    vars: { [cellY]: space['3'], [cellX]: space['4'] },
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: font.size.sm,
    color: color.text,
    selectors: {
      '&[data-density="compact"]': { vars: { [cellY]: space['2'], [cellX]: space['3'] } },
      '&[data-density="comfortable"]': { vars: { [cellY]: space['4'], [cellX]: space['5'] } },
    },
  }),
);

const inComponents = (rule: Parameters<typeof globalStyle>[1]) => ({
  '@layer': { [layers.components]: rule },
});

globalStyle(
  `${table} caption`,
  inComponents({
    captionSide: 'top',
    textAlign: 'start',
    padding: `${space['4']} ${space['4']} ${space['2']}`,
    fontWeight: font.weight.strong,
    fontSize: font.size.md,
  }),
);
globalStyle(
  `${table} th, ${table} td`,
  inComponents({
    padding: `${cellY} ${cellX}`,
    textAlign: 'start',
    verticalAlign: 'middle',
    borderBottom: `1px solid ${color.hairline}`,
    whiteSpace: 'nowrap',
  }),
);
globalStyle(
  `${table} thead th`,
  inComponents({
    fontSize: font.size.xs,
    fontWeight: font.weight.strong,
    letterSpacing: font.tracking.label,
    textTransform: 'uppercase',
    color: color.textSubtle,
    backgroundColor: color.surface,
  }),
);
globalStyle(`${table} tbody tr:last-child > *`, inComponents({ borderBottom: 0 }));
globalStyle(
  `${table} tbody tr:hover > *`,
  inComponents({
    backgroundColor: `color-mix(in oklch, ${color.surface}, ${color.text} 3%)`,
  }),
);
globalStyle(`${wrap}[data-sticky-header] thead th`, inComponents({ position: 'sticky', top: 0, zIndex: 1 }));
globalStyle(
  `${wrap}[data-sticky-first] tr > :first-child`,
  inComponents({
    position: 'sticky',
    insetInlineStart: 0,
    zIndex: 1,
    backgroundColor: color.surface,
    boxShadow: `1px 0 0 ${color.hairline}`,
  }),
);

/** Numbers: right-aligned with tabular figures so digits line up. */
export const numeric = style(inLayer('components', { textAlign: 'end', fontVariantNumeric: 'tabular-nums' }));
globalStyle(`${table} th${numeric}, ${table} td${numeric}`, inComponents({ textAlign: 'end' }));

/** A caption that names the table for assistive technology without being shown. */
export const captionHidden = style(inLayer('components', srOnly));
