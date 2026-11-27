import { useEffect, useState, type ReactNode } from 'react';
import { ThemeScope, ToastProvider } from '@mohirlab/react';
import type { ThemeMode } from '@mohirlab/themes';
import { Home } from './home';
import { ModeContext } from './mode';
import { Academy } from './sites/academy';
import { Daftar } from './sites/daftar';
import { Karvon } from './sites/karvon';
import * as s from './shell.css';

const routes: Record<string, () => ReactNode> = {
  '': Home,
  karvon: Karvon,
  academy: Academy,
  daftar: Daftar,
};

const readRoute = () => window.location.hash.replace(/^#\/?/, '').split('/')[0] ?? '';

/** Hash routing keeps the static build working at any path (e.g. /ui/examples/ on Pages). */
function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function App() {
  const route = useRoute();
  const [mode, setMode] = useState<ThemeMode>(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const Page = routes[route] ?? Home;

  // The page background follows the theme too, beyond the scope's own box.
  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }}>
      <ThemeScope mode={mode} className={s.page}>
        <ToastProvider>
          <Page />
        </ToastProvider>
      </ThemeScope>
    </ModeContext.Provider>
  );
}
