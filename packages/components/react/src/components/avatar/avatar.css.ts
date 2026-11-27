import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';
import { componentRecipe } from '@mohirlab/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';

declareLayers();

export const avatarSize = createVar();

export const avatar = componentRecipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    width: avatarSize,
    height: avatarSize,
    overflow: 'hidden',
    backgroundColor: vars.color.surfaceSunken,
    // A hairline inner edge keeps light photos from melting into light surfaces.
    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${vars.color.text} 10%, transparent)`,
    verticalAlign: 'middle',
    userSelect: 'none',
  },
  variants: {
    size: {
      xs: { vars: { [avatarSize]: '1.5rem' } },
      sm: { vars: { [avatarSize]: '2rem' } },
      md: { vars: { [avatarSize]: '2.5rem' } },
      lg: { vars: { [avatarSize]: '3.5rem' } },
      xl: { vars: { [avatarSize]: '5rem' } },
    },
    /** Circles for people, rounded squares for teams, products and organisations. */
    shape: {
      circle: { borderRadius: '50%' },
      square: { borderRadius: vars.radius.md },
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
});

export type AvatarVariants = NonNullable<RecipeVariants<typeof avatar>>;

export const image = style(
  inLayer('components', {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }),
);

export const group = style(
  inLayer('components', {
    display: 'inline-flex',
    alignItems: 'center',
    isolation: 'isolate',
  }),
);

export const groupItem = style(
  inLayer('components', {
    // Each avatar is cut out of the one before it with a ring in the surface color.
    boxShadow: `0 0 0 2px ${vars.color.surface}`,
    selectors: {
      '&:not(:first-child)': { marginInlineStart: `calc(${avatarSize} * -0.3)` },
    },
  }),
);

export const overflow = style(
  inLayer('components', {
    marginInlineStart: vars.space['2'],
    fontFamily: vars.font.family.mono,
    fontSize: vars.font.size.xs,
    letterSpacing: vars.font.tracking.label,
    color: vars.color.textMuted,
    whiteSpace: 'nowrap',
  }),
);
