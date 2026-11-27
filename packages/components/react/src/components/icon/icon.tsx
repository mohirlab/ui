import { createElement, type SVGProps } from 'react';
import { defaultAttributes, type IconData } from '@mohirlab/icons';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Icon data from `@mohirlab/icons`, e.g. `iconHeart`. Import only what you use. */
  icon: IconData;
  /** Pixel size or any CSS length. Default `1.25em`, so icons follow text size. */
  size?: number | string;
  strokeWidth?: number | string;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
}

// SVG attribute names → React prop names, for the few that differ.
const reactName = (attr: string) => attr.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
const defaults = Object.fromEntries(Object.entries(defaultAttributes).map(([k, v]) => [reactName(k), v]));

export function Icon({ icon, size = '1.25em', strokeWidth, label, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...defaults}
      {...(strokeWidth === undefined ? {} : { strokeWidth })}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-icon={icon.name}
      {...rest}
    >
      {icon.nodes.map(([tag, attrs], i) =>
        createElement(tag, {
          key: i,
          ...Object.fromEntries(Object.entries(attrs).map(([k, v]) => [reactName(k), v])),
        }),
      )}
    </svg>
  );
}
