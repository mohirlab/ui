import type { ComponentPropsWithRef, ElementType } from 'react';
import { sprinkles, type Sprinkles } from '@mohirlab/sprinkles';
import { cx } from '../../utils/cx';

export type BoxProps = Omit<ComponentPropsWithRef<'div'>, keyof Sprinkles> &
  Sprinkles & {
    as?: ElementType;
  };

/** Split props into sprinkles (style) props and everything else. */
export function splitSprinkles<T extends Record<string, unknown>>(props: T) {
  const style: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) style[key] = value;
    else rest[key] = value;
  }
  return { style: style as Sprinkles, rest: rest as Omit<T, keyof Sprinkles> };
}

/**
 * The layout primitive. Every sprinkles property is a prop, with responsive
 * values: `<Box padding={{ mobile: '3', desktop: '6' }} />`.
 */
export function Box({ as: Component = 'div', className, ...props }: BoxProps) {
  const { style, rest } = splitSprinkles(props);
  return <Component {...rest} className={cx(sprinkles(style), className)} />;
}
