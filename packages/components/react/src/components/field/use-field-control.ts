import { useField } from './field-context';

interface ControlProps {
  id?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  'aria-describedby'?: string;
}

/**
 * Props a form control takes from the surrounding `<Field>`: id (for the label),
 * required, disabled, invalid state and the hint/error description. Anything set
 * on the control itself wins; descriptions are merged.
 */
export function useFieldControl({
  id,
  required,
  disabled,
  invalid,
  'aria-describedby': describedBy,
}: ControlProps) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return {
    id: id ?? field?.id,
    required: required ?? field?.required,
    disabled: disabled ?? field?.disabled,
    'aria-invalid': isInvalid || undefined,
    'aria-describedby': [field?.describedBy, describedBy].filter(Boolean).join(' ') || undefined,
  } as const;
}
