import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { button, hiddenLabel, slot, spinner, spinnerOverlay, type ButtonVariants } from './button.css';

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'color'> {
  /** Color role. */
  tone?: ButtonVariants['tone'];
  /** How much visual weight the button carries. */
  appearance?: ButtonVariants['appearance'];
  size?: ButtonVariants['size'];
  fullWidth?: boolean;
  /** Content before the label, usually an icon. */
  start?: ReactNode;
  /** Content after the label. */
  end?: ReactNode;
  /** Square button for a single icon. Give it an `aria-label`. */
  iconOnly?: boolean;
  /** Shows a spinner, keeps the width, and blocks activation. */
  loading?: boolean;
}

export function Button({
  tone,
  appearance,
  size,
  fullWidth,
  iconOnly,
  start,
  end,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(button({ tone, appearance, size, fullWidth, iconOnly }), className)}
      disabled={disabled}
      // Loading keeps the button focusable (so focus is not lost) but inert.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? (event) => event.preventDefault() : onClick}
    >
      <span className={cx(slot, loading && hiddenLabel)}>
        {start}
        {children}
        {end}
      </span>
      {loading && (
        <span className={spinnerOverlay} aria-hidden="true">
          <span className={spinner} />
        </span>
      )}
    </button>
  );
}
