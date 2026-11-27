import type { ComponentPropsWithRef, ElementType } from 'react';
import { themes, type ThemeMode } from '@mohirlab/themes';
import { cx } from '../../utils/cx';

export interface ThemeScopeProps extends ComponentPropsWithRef<'div'> {
  /** A built-in mode. Ignored when `theme` is given. */
  mode?: ThemeMode;
  /** Any theme class made with `createTheme(vars, ...)`, such as a brand theme. */
  theme?: string;
  as?: ElementType;
}

/**
 * Applies a theme to its subtree. Scopes nest: a dark panel inside a light
 * page, or a brand-themed widget inside someone else's app.
 */
export function ThemeScope({
  mode = 'light',
  theme,
  as: Component = 'div',
  className,
  ...rest
}: ThemeScopeProps) {
  return (
    <Component
      {...rest}
      data-ml-mode={theme ? undefined : mode}
      className={cx(theme ?? themes[mode], className)}
    />
  );
}
