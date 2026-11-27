import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import { badge, sealMark, type BadgeVariants } from './badge.css';

export interface BadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'color'> {
  tone?: BadgeVariants['tone'];
  /** Filled stamp instead of tinted. */
  solid?: boolean;
  /** Leading square seal. */
  seal?: boolean;
}

export function Badge({ tone, solid, seal = false, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx(badge({ tone, solid }), className)}>
      {seal && <span className={sealMark} aria-hidden="true" />}
      {children}
    </span>
  );
}
