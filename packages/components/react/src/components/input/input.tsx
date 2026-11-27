import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import { useField } from '../field/field-context';
import { input, type InputVariants } from './input.css';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: InputVariants['size'];
  /** Mark as invalid. Inside a `<Field error>` this is set for you. */
  invalid?: boolean;
}

export function Input({ size, invalid, className, id, required, disabled, ...rest }: InputProps) {
  const field = useField();
  const describedBy = [field?.describedBy, rest['aria-describedby']].filter(Boolean).join(' ') || undefined;
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <input
      {...rest}
      id={id ?? field?.id}
      required={required ?? field?.required}
      disabled={disabled ?? field?.disabled}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      className={cx(input({ size }), className)}
    />
  );
}
