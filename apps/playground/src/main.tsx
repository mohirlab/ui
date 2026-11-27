import '@mohirlab/themes/styles.css';
import '@mohirlab/sprinkles/styles.css';
import '@mohirlab/react/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
