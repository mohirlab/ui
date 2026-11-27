import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, safeArea, vars } from '@mohirlab/themes';
import { compose, focusRing, transition } from '@mohirlab/recipes';
import { mq } from '@mohirlab/sprinkles';

declareLayers();

const { color, space, font, radius, motion } = vars;

/** Phones only: everything below the tablet breakpoint. */
const belowTablet = `not ${mq('tablet')}`;

/* ---------------------------------------------------------------- Tabs */

export const tabList = style(
  inLayer('components', {
    display: 'flex',
    gap: space['1'],
    borderBottom: `1px solid ${color.hairline}`,
    // Phones: tabs scroll sideways instead of wrapping.
    overflowX: 'auto',
    scrollbarWidth: 'none',
    scrollSnapType: 'x proximity',
    selectors: { '&::-webkit-scrollbar': { display: 'none' } },
  }),
);

export const tab = style(
  inLayer(
    'components',
    compose(focusRing, transition('color', 'background-color'), {
      position: 'relative',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      appearance: 'none',
      border: 0,
      margin: 0,
      paddingInline: space['3'],
      paddingBlock: '0.625rem',
      minHeight: '2.75rem',
      background: 'none',
      font: 'inherit',
      fontSize: font.size.sm,
      fontWeight: font.weight.medium,
      color: color.textMuted,
      cursor: 'pointer',
      borderRadius: `${radius.sm} ${radius.sm} 0 0`,
      selectors: {
        '&:hover': { color: color.text },
        '&[aria-selected="true"]': { color: color.text },
        // The indicator: an accent bar that grows in from the centre.
        '&::after': {
          content: '""',
          position: 'absolute',
          insetInline: space['3'],
          bottom: '-1px',
          height: '2px',
          borderRadius: radius.round,
          backgroundColor: color.accent,
          transform: 'scaleX(0)',
          transition: `transform ${motion.duration.settle} ${motion.easing.standard}`,
        },
        '&[aria-selected="true"]::after': { transform: 'scaleX(1)' },
        '&:disabled': { cursor: 'not-allowed', opacity: 0.45 },
      },
      '@media': {
        '(prefers-reduced-motion: reduce)': { selectors: { '&::after': { transition: 'none' } } },
      },
    }),
  ),
);

export const tabPanel = style(
  inLayer('components', compose(focusRing, { paddingTop: space['4'], borderRadius: radius.sm })),
);

/* ---------------------------------------------------- Segmented control */

export const segmented = style(
  inLayer('components', {
    display: 'inline-flex',
    gap: '0.125rem',
    padding: '0.1875rem',
    border: 0,
    margin: 0,
    minWidth: 0,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    selectors: { '&[data-full-width]': { display: 'flex' } },
  }),
);

export const segment = style(
  inLayer('components', {
    position: 'relative',
    flex: '1 1 0',
    display: 'flex',
    selectors: { [`${segmented}[data-full-width] &`]: { minWidth: 0 } },
  }),
);

/** The native radio, invisible but focusable and clickable over the whole segment. */
export const segmentInput = style(
  inLayer('components', {
    position: 'absolute',
    inset: 0,
    margin: 0,
    opacity: 0,
    cursor: 'pointer',
    selectors: { '&:disabled': { cursor: 'not-allowed' } },
  }),
);

export const segmentLabel = style(
  inLayer(
    'components',
    compose(transition('background-color', 'color', 'box-shadow'), {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space['1.5'],
      minHeight: '2rem',
      paddingInline: space['3'],
      borderRadius: `calc(${radius.md} - 3px)`,
      fontSize: font.size.sm,
      fontWeight: font.weight.medium,
      color: color.textMuted,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      selectors: {
        [`${segmentInput}:hover ~ &`]: { color: color.text },
        [`${segmentInput}:checked ~ &`]: {
          color: color.text,
          backgroundColor: color.surface,
          boxShadow: `${vars.shadow.hairline}, ${vars.shadow.control}`,
        },
        [`${segmentInput}:focus-visible ~ &`]: { boxShadow: `0 0 0 2px ${color.focus}` },
        [`${segmentInput}:disabled ~ &`]: { opacity: 0.45 },
      },
      '@media': { '(pointer: coarse)': { minHeight: '2.5rem' } },
    }),
  ),
);

/* ---------------------------------------------------------- Bottom nav */

export const bottomNav = style(
  inLayer('components', {
    position: 'fixed',
    insetInline: 0,
    bottom: 0,
    zIndex: 100,
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    paddingBottom: safeArea.bottom,
    paddingInline: `max(${space['1']}, ${safeArea.left}) max(${space['1']}, ${safeArea.right})`,
    backgroundColor: `color-mix(in oklch, ${color.surface} 88%, transparent)`,
    backdropFilter: 'saturate(1.4) blur(14px)',
    borderTop: `1px solid ${color.hairline}`,
    '@media': {
      [mq('tablet')]: { selectors: { '&[data-hide-from="tablet"]': { display: 'none' } } },
      [mq('desktop')]: { selectors: { '&[data-hide-from="desktop"]': { display: 'none' } } },
    },
  }),
);

export const bottomItem = style(
  inLayer(
    'components',
    compose(focusRing, {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.1875rem',
      minHeight: '3.5rem',
      paddingBlock: space['1.5'],
      border: 0,
      background: 'none',
      fontFamily: 'inherit',
      fontSize: '0.6875rem',
      fontWeight: font.weight.medium,
      color: color.textSubtle,
      textDecoration: 'none',
      cursor: 'pointer',
      borderRadius: radius.md,
      WebkitTapHighlightColor: 'transparent',
      selectors: {
        '&[aria-current="page"]': { color: color.accentText },
        '&:active': { backgroundColor: color.surfaceSunken },
      },
    }),
  ),
);

/** A small count on an item, e.g. unread messages. */
export const bottomBadge = style(
  inLayer('components', {
    position: 'absolute',
    top: space['1'],
    left: 'calc(50% + 0.5rem)',
    minWidth: '1.125rem',
    height: '1.125rem',
    paddingInline: '0.3125rem',
    borderRadius: radius.round,
    backgroundColor: color.danger,
    color: color.onDanger,
    fontSize: '0.625rem',
    fontWeight: font.weight.strong,
    lineHeight: '1.125rem',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
    boxShadow: `0 0 0 2px ${color.surface}`,
  }),
);

/** Space at the bottom of a page so content can scroll clear of the bottom nav. */
export const bottomNavSpacer = style(
  inLayer('components', {
    height: `calc(3.5rem + ${space['3']} + ${safeArea.bottom})`,
    '@media': {
      [mq('tablet')]: { selectors: { '&[data-hide-from="tablet"]': { display: 'none' } } },
      [mq('desktop')]: { selectors: { '&[data-hide-from="desktop"]': { display: 'none' } } },
    },
  }),
);

/* --------------------------------------------------------- Breadcrumbs */

export const crumbs = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space['1'],
    margin: 0,
    padding: 0,
    listStyle: 'none',
    fontSize: font.size.sm,
    color: color.textMuted,
  }),
);

export const crumb = style(
  inLayer('components', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space['1'],
    minWidth: 0,
    // Phones: only the parent, as a back link (see crumbBack).
    '@media': { [belowTablet]: { display: 'none' } },
  }),
);

export const crumbLink = style(
  inLayer(
    'components',
    compose(focusRing, {
      color: 'inherit',
      textDecoration: 'none',
      borderRadius: radius.xs,
      selectors: {
        '&:hover': { color: color.text, textDecoration: 'underline', textUnderlineOffset: '0.2em' },
      },
    }),
  ),
);

export const crumbCurrent = style(
  inLayer('components', {
    color: color.text,
    fontWeight: font.weight.medium,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
);

export const crumbSeparator = style(inLayer('components', { color: color.textSubtle, flexShrink: 0 }));

export const crumbBack = style(
  inLayer('components', {
    display: 'none',
    '@media': { [belowTablet]: { display: 'inline-flex', alignItems: 'center', gap: space['1'] } },
  }),
);
