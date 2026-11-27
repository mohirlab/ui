import { declareLayers, layers, vars } from '@mohirlab/themes';
import {
  createMapValueFn,
  createNormalizeValueFn,
  createSprinkles,
  defineProperties,
} from '@vanilla-extract/sprinkles';
import { responsiveConditions } from './responsive';

declareLayers();

// Deliberately a whitelist with token values. Arbitrary values belong in a
// `style()` call, which is the intentional escape hatch.

const space = vars.space;
const align = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const;
const justify = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const;

const columns = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 12].map((n) => [String(n), `repeat(${n}, minmax(0, 1fr))`]),
) as Record<'1' | '2' | '3' | '4' | '5' | '6' | '12', string>;

const responsiveProperties = defineProperties({
  '@layer': layers.utilities,
  conditions: responsiveConditions,
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop', 'wide'],
  properties: {
    display: ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid'],
    position: ['static', 'relative', 'absolute', 'sticky'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    flexWrap: ['wrap', 'nowrap'],
    alignItems: align,
    alignSelf: align,
    justifyContent: justify,
    gap: space,
    rowGap: space,
    columnGap: space,
    gridTemplateColumns: columns,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: { ...space, auto: 'auto' },
    marginBottom: { ...space, auto: 'auto' },
    marginLeft: { ...space, auto: 'auto' },
    marginRight: { ...space, auto: 'auto' },
    width: { auto: 'auto', full: '100%', fit: 'fit-content' },
    maxWidth: { none: 'none', prose: '68ch', narrow: '36rem', page: '72rem', full: '100%' },
    textAlign: ['start', 'center', 'end'],
    fontSize: vars.font.size,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
  },
});

const { color } = vars;

const colorProperties = defineProperties({
  '@layer': layers.utilities,
  conditions: {
    rest: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus-visible' },
  },
  defaultCondition: 'rest',
  properties: {
    color: {
      text: color.text,
      muted: color.textMuted,
      subtle: color.textSubtle,
      inverse: color.textInverse,
      accent: color.accentText,
      danger: color.dangerText,
      success: color.successText,
      warning: color.warningText,
      inherit: 'inherit',
    },
    background: {
      canvas: color.canvas,
      surface: color.surface,
      sunken: color.surfaceSunken,
      inverse: color.surfaceInverse,
      accent: color.accent,
      accentSoft: color.accentSoft,
      dangerSoft: color.dangerSoft,
      successSoft: color.successSoft,
      warningSoft: color.warningSoft,
      transparent: 'transparent',
    },
    borderColor: {
      hairline: color.hairline,
      border: color.border,
      rule: color.rule,
      accent: color.accent,
      danger: color.danger,
    },
  },
});

const staticProperties = defineProperties({
  '@layer': layers.utilities,
  properties: {
    borderRadius: vars.radius,
    boxShadow: {
      none: 'none',
      hairline: vars.shadow.hairline,
      raised: vars.shadow.raised,
      floating: vars.shadow.floating,
    },
    borderStyle: ['none', 'solid'],
    borderWidth: { '0': '0', '1': '1px', '2': '2px' },
    fontFamily: vars.font.family,
    fontWeight: vars.font.weight,
    lineHeight: vars.font.leading,
    letterSpacing: vars.font.tracking,
    overflow: ['visible', 'hidden', 'auto', 'clip'],
    flexGrow: { '0': '0', '1': '1' },
    flexShrink: { '0': '0', '1': '1' },
    cursor: ['default', 'pointer'],
    pointerEvents: ['none', 'auto'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties, staticProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];

export const normalizeResponsiveValue = createNormalizeValueFn(responsiveProperties);
export const mapResponsiveValue = createMapValueFn(responsiveProperties);
