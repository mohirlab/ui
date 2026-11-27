import type { ComponentPropsWithRef } from 'react';
import { iconChevronDown } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/use-field-control';
import { Icon } from '../icon';
import { input, type InputVariants } from '../input/input.css';
import * as styles from './select.css';

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  size?: InputVariants['size'];
  invalid?: boolean;
  /** Shown first and not selectable again once a choice is made, e.g. "Choose a country". */
  placeholder?: string;
}

/**
 * The native `<select>`, styled like `Input`. Phones get the system picker, keyboards
 * and screen readers get native behaviour, and forms submit it as is.
 */
export function Select({
  size,
  invalid,
  placeholder,
  className,
  id,
  required,
  disabled,
  children,
  defaultValue,
  value,
  ...rest
}: SelectProps) {
  const control = useFieldControl({
    id,
    required,
    disabled,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });
  // With a placeholder and no value given, start on the placeholder option.
  const initial = placeholder && value === undefined && defaultValue === undefined ? '' : defaultValue;
  return (
    <span className={styles.wrap}>
      <select
        {...rest}
        {...control}
        value={value}
        defaultValue={initial}
        className={cx(input({ size }), styles.select, className)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <Icon icon={iconChevronDown} className={styles.chevron} size={18} />
    </span>
  );
}
