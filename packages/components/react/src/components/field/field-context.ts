import { createContext, useContext } from 'react';

export interface FieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Read the surrounding `<Field>`, if any. Controls use it to wire up ARIA. */
export const useField = () => useContext(FieldContext);
