import { globalStyle, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, layers, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

const { color } = vars;

export const card = componentRecipe({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    color: color.text,
    borderRadius: vars.radius.lg,
  },
  variants: {
    elevation: {
      /** A sheet resting on the canvas. */
      raised: { backgroundColor: color.surface, boxShadow: `${vars.shadow.hairline}, ${vars.shadow.raised}` },
      /** Outlined only, for dense layouts. */
      flat: { backgroundColor: color.surface, boxShadow: vars.shadow.hairline },
      /** Pressed into the page: wells, empty states, secondary panels. */
      sunken: {
        backgroundColor: color.surfaceSunken,
        boxShadow: `inset 0 1px 2px color-mix(in oklch, ${color.text} 8%, transparent)`,
      },
      floating: {
        backgroundColor: color.surface,
        boxShadow: `${vars.shadow.hairline}, ${vars.shadow.floating}`,
      },
    },
    padding: {
      none: { padding: 0 },
      sm: { padding: vars.space['4'] },
      md: { padding: vars.space['6'] },
      lg: { padding: vars.space['8'] },
    },
  },
  defaultVariants: { elevation: 'raised', padding: 'md' },
});

export type CardVariants = NonNullable<RecipeVariants<typeof card>>;

/** A header row separated from the body by a hairline that runs edge to edge. */
export const cardHeader = style(
  inLayer('components', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space['3'],
    paddingBottom: vars.space['4'],
    marginBottom: vars.space['4'],
    borderBottom: `1px solid ${color.hairline}`,
  }),
);

/** Media sits inset with its own corners by default: a print on a mount, not a full bleed. */
export const media = style(
  inLayer('components', {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: `calc(${vars.radius.lg} - 3px)`,
    backgroundColor: color.surfaceSunken,
    marginBottom: vars.space['4'],
  }),
);

export const mediaBleed = style(
  inLayer('components', {
    borderRadius: `${vars.radius.lg} ${vars.radius.lg} 0 0`,
  }),
);

export const mediaImage = style(
  inLayer('components', {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
);

export const mediaOverlay = style(
  inLayer('components', {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: vars.space['2'],
    padding: vars.space['3'],
    pointerEvents: 'none',
  }),
);

// The overlay ignores pointers so the image stays clickable; its children opt back in.
globalStyle(`${mediaOverlay} > *`, { '@layer': { [layers.components]: { pointerEvents: 'auto' } } });
