import { createContext, useContext } from 'react';
import type { ThemeMode } from '@mohirlab/themes';

export const ModeContext = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: 'light',
  toggle: () => {},
});

/** The example sites' light/dark switch. */
export const useMode = () => useContext(ModeContext);
