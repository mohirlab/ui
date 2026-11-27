import { useId, useMemo, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldContext } from './field-context';
import * as styles from './field.css';

export interface FieldProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  label: ReactNode;
  /** Help text under the control. Linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error message. Marks the control `aria-invalid` and replaces nothing: the hint stays. */
  error?: ReactNode;
  /** Shows an "Optional" tag. Mohirlab marks optional fields, not required ones. */
  optional?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Override the generated control id. */
  id?: string;
  /** Text shown for optional fields, for localisation. */
  optionalLabel?: ReactNode;
  children: ReactNode;
}

export function Field({
  label,
  hint,
  error,
  optional = false,
  required = false,
  disabled = false,
  id,
  optionalLabel = 'Optional',
  className,
  children,
  ...rest
}: FieldProps) {
  const generated = useId();
  const controlId = id ?? `ml-field-${generated}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const context = useMemo(
    () => ({ id: controlId, describedBy, invalid: Boolean(error), required, disabled }),
    [controlId, describedBy, error, required, disabled],
  );

  return (
    <div {...rest} className={cx(styles.field, className)}>
      <div className={styles.labelRow}>
        <label htmlFor={controlId} className={styles.label}>
          {label}
        </label>
        {optional && <span className={styles.optionalTag}>{optionalLabel}</span>}
      </div>
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
      {error && (
        <p id={errorId} className={styles.error}>
          <span className={styles.errorMark} aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
