import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './visually-hidden.css';

export interface VisuallyHiddenProps extends ComponentPropsWithRef<'span'> {
  /** Show it while it, or something inside it, has focus: for skip links. */
  focusable?: boolean;
}

/**
 * Text for screen readers only: a column header over icon buttons, the full name behind an
 * abbreviation, a "Skip to content" link (with `focusable`). Never hide interactive
 * controls this way without `focusable`, or keyboard users meet something invisible.
 */
export function VisuallyHidden({ focusable = false, className, ...rest }: VisuallyHiddenProps) {
  return (
    <span {...rest} className={cx(styles.visuallyHidden, focusable && styles.untilFocused, className)} />
  );
}
