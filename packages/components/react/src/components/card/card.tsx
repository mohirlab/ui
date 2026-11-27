import type { ComponentPropsWithRef, ElementType } from 'react';
import { cx } from '../../utils/cx';
import { card, cardHeader, type CardVariants } from './card.css';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  elevation?: CardVariants['elevation'];
  padding?: CardVariants['padding'];
  /** Render as another element, such as `section` or `article`. */
  as?: ElementType;
}

export function Card({ elevation, padding, as: Component = 'div', className, ...rest }: CardProps) {
  return <Component {...rest} className={cx(card({ elevation, padding }), className)} />;
}

export function CardHeader({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={cx(cardHeader, className)} />;
}
