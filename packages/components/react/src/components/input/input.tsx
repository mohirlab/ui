import type { ComponentPropsWithRef } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/use-field-control';
import { input, maxRows as maxRowsVar, textarea, type InputVariants } from './input.css';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: InputVariants['size'];
  /** Mark as invalid. Inside a `<Field error>` this is set for you. */
  invalid?: boolean;
}

export function Input({ size, invalid, className, id, required, disabled, ...rest }: InputProps) {
  const control = useFieldControl({
    id,
    required,
    disabled,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });
  return <input {...rest} {...control} className={cx(input({ size }), className)} />;
}

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  invalid?: boolean;
  /**
   * Grow with the content up to `maxRows`, where the browser supports CSS
   * `field-sizing` (Chrome 123, Safari 26.2, Firefox 152). Elsewhere the user can
   * resize it. Default true.
   */
  autoGrow?: boolean;
  /** Upper bound for auto-grow, in lines. Default 10. */
  maxRows?: number;
}

export function Textarea({
  invalid,
  autoGrow = true,
  rows = 3,
  maxRows = 10,
  className,
  style,
  id,
  required,
  disabled,
  ...rest
}: TextareaProps) {
  const control = useFieldControl({
    id,
    required,
    disabled,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });
  return (
    <textarea
      {...rest}
      {...control}
      rows={rows}
      data-autogrow={autoGrow || undefined}
      className={cx(input({ size: 'md' }), textarea, className)}
      style={{ ...style, ...assignInlineVars({ [maxRowsVar]: String(maxRows) }) }}
    />
  );
}
