import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { iconCheck, iconMinus } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { Icon } from '../icon';
import * as styles from './choice.css';

type NativeInput = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'>;

interface ChoiceText {
  /** Visible label. The whole row is clickable. */
  label: ReactNode;
  /** Secondary text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  invalid?: boolean;
}

function Row({
  control,
  label,
  description,
  descriptionId,
  className,
  kind,
}: {
  control: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  descriptionId: string;
  className?: string;
  kind?: 'switch';
}) {
  // The description stays outside the <label>: inside, it would become part of the
  // accessible name. It is linked with aria-describedby instead.
  return (
    <div className={cx(styles.item, className)} data-kind={kind}>
      <label className={styles.row}>
        {control}
        <span className={styles.label}>{label}</span>
      </label>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
    </div>
  );
}

export interface CheckboxProps extends NativeInput, ChoiceText {
  /** Mixed state, e.g. "some items selected". Shown as a dash; clicking resolves it. */
  indeterminate?: boolean;
}

/** A native checkbox, drawn in the Mohirlab style. */
export function Checkbox({
  label,
  description,
  invalid,
  indeterminate = false,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const descriptionId = useId();
  const inner = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <Row
      className={className}
      label={label}
      description={description}
      descriptionId={descriptionId}
      control={
        <span className={styles.box}>
          <input
            {...rest}
            ref={(el) => {
              inner.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }}
            type="checkbox"
            className={styles.checkbox}
            aria-invalid={invalid || undefined}
            aria-describedby={description ? descriptionId : rest['aria-describedby']}
          />
          <Icon icon={iconCheck} size={14} strokeWidth={2.25} className={styles.check} />
          <Icon icon={iconMinus} size={14} strokeWidth={2.25} className={styles.dash} />
        </span>
      }
    />
  );
}

export interface SwitchProps extends NativeInput, ChoiceText {}

/**
 * An on/off setting that applies immediately (no Save button). A native checkbox with
 * `role="switch"`, so it is announced as a switch and submits with forms.
 */
export function Switch({ label, description, invalid, className, ...rest }: SwitchProps) {
  const descriptionId = useId();
  return (
    <Row
      kind="switch"
      className={className}
      label={label}
      description={description}
      descriptionId={descriptionId}
      control={
        <span className={styles.box}>
          <input
            {...rest}
            type="checkbox"
            // The browser exposes a native checkbox's checked state to the switch role;
            // a hand-set aria-checked could only drift out of sync.
            // oxlint-disable-next-line jsx-a11y/role-has-required-aria-props
            role="switch"
            className={styles.track}
            aria-invalid={invalid || undefined}
            aria-describedby={description ? descriptionId : rest['aria-describedby']}
          />
          <span className={styles.thumb} aria-hidden="true" />
        </span>
      }
    />
  );
}

interface RadioGroupContextValue {
  name: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'defaultValue'
> {
  /** Names the group for assistive technology. */
  legend: ReactNode;
  /** Shared `name`; generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  children: ReactNode;
}

/**
 * A `<fieldset>` of radios: arrow keys move between options natively, the legend names
 * the group, and hint and error are linked to it.
 */
export function RadioGroup({
  legend,
  name,
  value,
  defaultValue,
  onValueChange,
  hint,
  error,
  orientation = 'vertical',
  disabled,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const generated = useId();
  const hintId = useId();
  const errorId = useId();
  const legendId = useId();
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;
  return (
    // role="radiogroup" (rather than the fieldset's implicit "group") is what carries
    // aria-invalid for the whole set; individual radios cannot.
    <fieldset
      {...rest}
      role="radiogroup"
      disabled={disabled}
      aria-labelledby={legendId}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={cx(styles.group, className)}
    >
      <legend id={legendId} className={styles.legend}>
        {legend}
      </legend>
      <RadioGroupContext.Provider
        value={{
          name: name ?? `ml-radio-${generated}`,
          value,
          defaultValue,
          disabled,
          invalid: Boolean(error),
          onChange: onValueChange ? (event) => onValueChange(event.target.value) : undefined,
        }}
      >
        <div className={styles.options} data-orientation={orientation}>
          {children}
        </div>
      </RadioGroupContext.Provider>
      {error && (
        <p id={errorId} className={styles.groupError}>
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className={styles.groupHint}>
          {hint}
        </p>
      )}
    </fieldset>
  );
}

export interface RadioProps extends Omit<NativeInput, 'name'>, Omit<ChoiceText, 'invalid'> {
  value: string;
}

/** One option of a `RadioGroup`. */
export function Radio({ label, description, value, className, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const descriptionId = useId();
  if (!group) throw new Error('<Radio> must be used inside <RadioGroup>.');
  const controlled = group.value !== undefined;
  return (
    <Row
      className={className}
      label={label}
      description={description}
      descriptionId={descriptionId}
      control={
        <span className={styles.box}>
          <input
            {...rest}
            type="radio"
            name={group.name}
            value={value}
            checked={controlled ? group.value === value : undefined}
            defaultChecked={
              !controlled && group.defaultValue !== undefined ? group.defaultValue === value : undefined
            }
            onChange={(event) => {
              rest.onChange?.(event);
              group.onChange?.(event);
            }}
            className={styles.radio}
            aria-describedby={description ? descriptionId : undefined}
          />
          <span className={styles.dot} aria-hidden="true" />
        </span>
      }
    />
  );
}
