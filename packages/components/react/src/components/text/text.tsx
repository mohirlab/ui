import type { ComponentPropsWithRef, ElementType } from 'react';
import { sprinkles, type Sprinkles } from '@mohirlab/sprinkles';
import { cx } from '../../utils/cx';
import { text, type TextVariants } from './text.css';

/** Token-bound outer spacing, so text can sit in a layout without custom CSS. */
export type MarginProps = Pick<
  Sprinkles,
  'margin' | 'marginX' | 'marginY' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'
>;
const marginKeys = [
  'margin',
  'marginX',
  'marginY',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
] as const;

export interface TextProps extends Omit<ComponentPropsWithRef<'p'>, 'color'>, MarginProps {
  variant?: TextVariants['variant'];
  tone?: TextVariants['tone'];
  /** Tabular figures, for numbers that should line up. */
  numeric?: boolean;
  as?: ElementType;
}

const defaultElement: Partial<Record<NonNullable<TextVariants['variant']>, ElementType>> = {
  label: 'span',
  code: 'code',
};

export function Text({ variant = 'body', tone, numeric, as, className, ...props }: TextProps) {
  const Component = as ?? defaultElement[variant] ?? 'p';
  const margins: MarginProps = {};
  const rest: Record<string, unknown> = { ...props };
  for (const key of marginKeys) {
    if (key in rest) {
      (margins as Record<string, unknown>)[key] = rest[key];
      delete rest[key];
    }
  }
  return (
    <Component
      {...rest}
      className={cx(
        text({ variant, tone, numeric }),
        Object.keys(margins).length > 0 && sprinkles(margins),
        className,
      )}
    />
  );
}

export interface HeadingProps extends Omit<TextProps, 'as' | 'variant'> {
  /** Document outline level. Visual size follows it unless `variant` is set. */
  level?: 1 | 2 | 3 | 4;
  variant?: Extract<TextVariants['variant'], 'display' | 'title' | 'heading' | 'subheading'>;
}

const variantForLevel = { 1: 'title', 2: 'heading', 3: 'subheading', 4: 'subheading' } as const;

/** Heading level (semantics) and size (visuals) are separate on purpose. */
export function Heading({ level = 2, variant, tone = 'default', ...rest }: HeadingProps) {
  return <Text {...rest} as={`h${level}`} variant={variant ?? variantForLevel[level]} tone={tone} />;
}
