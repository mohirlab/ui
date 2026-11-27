import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/use-field-control';
import * as styles from './slider.css';

export interface SliderProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'value' | 'defaultValue' | 'size'
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Format the value for `aria-valuetext` and for `SliderValue`, e.g. `(v) => \`${v}%\``. */
  format?: (value: number) => string;
}

/** A native range input with a filled track. Arrow keys, Page Up/Down, Home and End work natively. */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  format,
  className,
  style,
  id,
  required,
  disabled,
  onChange,
  ...rest
}: SliderProps) {
  const control = useFieldControl({ id, required, disabled, 'aria-describedby': rest['aria-describedby'] });
  const [internal, setInternal] = useState(defaultValue ?? (min + max) / 2);
  const current = value ?? internal;
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;
  return (
    <input
      {...rest}
      {...control}
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      aria-valuetext={format?.(current)}
      onChange={(event) => {
        onChange?.(event);
        const next = Number(event.target.value);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }}
      className={cx(styles.slider, className)}
      style={{ ...style, ...assignInlineVars({ [styles.fill]: `${percent}%` }) }}
    />
  );
}

/** Label row for a slider inside a `Field`: puts the current value at the end. */
export function SliderValue({ children }: { children: ReactNode }) {
  return <output className={styles.output}>{children}</output>;
}
