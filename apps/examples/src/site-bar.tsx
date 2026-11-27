import type { ReactNode } from 'react';
import { iconArrowLeft, iconMoon, iconSun } from '@mohirlab/icons';
import { Button, Icon, Tooltip } from '@mohirlab/react';
import { useMode } from './mode';
import * as s from './shell.css';

export function ThemeToggle() {
  const { mode, toggle } = useMode();
  const label = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  return (
    <Tooltip content={label} placement="bottom">
      <Button appearance="ghost" tone="neutral" iconOnly aria-label={label} onClick={toggle}>
        <Icon icon={mode === 'light' ? iconMoon : iconSun} />
      </Button>
    </Tooltip>
  );
}

/** A sticky top bar: brand, optional nav, actions, and a way back to the gallery. */
export function SiteBar({ name, nav, actions }: { name: string; nav?: ReactNode; actions?: ReactNode }) {
  return (
    <header className={s.topbar}>
      <div className={`${s.container} ${s.topbarInner}`}>
        <a href="#/" className={s.navLink} aria-label="All examples">
          <Icon icon={iconArrowLeft} />
        </a>
        <a href={`#/${name.toLowerCase().split(' ')[0]}`} className={s.brand}>
          <span className={s.mark} aria-hidden="true" />
          {name}
        </a>
        <nav aria-label="Main" className={s.hideOnMobile} style={{ gap: 4 }}>
          {nav}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
