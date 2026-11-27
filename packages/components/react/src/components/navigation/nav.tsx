import { useId, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { iconArrowLeft, iconChevronRight, type IconData } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { Icon } from '../icon';
import * as styles from './navigation.css';

/* ---------------------------------------------------- Segmented control */

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: IconData;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange' | 'children'
> {
  /** Names the choice, e.g. "View". */
  'aria-label': string;
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  /** Stretch to the container width, segments sharing it equally. */
  fullWidth?: boolean;
}

/**
 * One choice from two to five short options, such as a view or a time range. Native
 * radios underneath: arrow keys move the choice, and it submits with forms.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  fullWidth,
  className,
  ...rest
}: SegmentedControlProps) {
  const generated = useId();
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? internal;
  return (
    <div
      {...rest}
      role="radiogroup"
      data-full-width={fullWidth || undefined}
      className={cx(styles.segmented, className)}
    >
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            className={styles.segmentInput}
            name={name ?? `ml-seg-${generated}`}
            value={option.value}
            checked={current === option.value}
            disabled={option.disabled}
            onChange={() => {
              if (value === undefined) setInternal(option.value);
              onValueChange?.(option.value);
            }}
          />
          <span className={styles.segmentLabel}>
            {option.icon && <Icon icon={option.icon} size={16} />}
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- Bottom nav */

export interface BottomNavProps extends ComponentPropsWithRef<'nav'> {
  /** Names the navigation, e.g. "Main". */
  'aria-label': string;
  /** Hide from this breakpoint up, where a sidebar or top bar takes over. Default tablet. */
  hideFrom?: 'tablet' | 'desktop' | 'never';
}

/**
 * The phone tab bar: three to five top-level destinations, fixed to the bottom and
 * clear of the home indicator. Add a `BottomNavSpacer` at the end of the page so
 * content can scroll past it.
 */
export function BottomNav({ hideFrom = 'tablet', className, ...rest }: BottomNavProps) {
  return <nav {...rest} data-hide-from={hideFrom} className={cx(styles.bottomNav, className)} />;
}

type BottomNavItemProps = {
  icon: IconData;
  label: string;
  /** Marks the current destination (`aria-current="page"`). */
  current?: boolean;
  /** A count such as unread messages; announced with the label. */
  badge?: number;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentPropsWithRef<'a'>, 'children'>)
  | ({ href?: undefined } & Omit<ComponentPropsWithRef<'button'>, 'children'>)
);

export function BottomNavItem({ icon, label, current, badge, className, ...rest }: BottomNavItemProps) {
  const content = (
    <>
      <Icon icon={icon} size={22} />
      <span>{label}</span>
      {badge ? (
        <span className={styles.bottomBadge} aria-hidden="true">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </>
  );
  const shared = {
    className: cx(styles.bottomItem, className),
    'aria-current': current ? ('page' as const) : undefined,
    // The visual badge is hidden; the count is part of the accessible name instead.
    'aria-label': badge ? `${label}, ${badge}` : undefined,
  };
  if (rest.href !== undefined) {
    return (
      <a {...(rest as ComponentPropsWithRef<'a'>)} {...shared}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as ComponentPropsWithRef<'button'>)} {...shared}>
      {content}
    </button>
  );
}

/** Reserves room under the page content for the bottom nav (on the same breakpoints). */
export function BottomNavSpacer({ hideFrom = 'tablet' }: Pick<BottomNavProps, 'hideFrom'>) {
  return <div aria-hidden="true" data-hide-from={hideFrom} className={styles.bottomNavSpacer} />;
}

/* --------------------------------------------------------- Breadcrumbs */

export interface Crumb {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** From the top level down to the current page (last, not linked). */
  items: Crumb[];
}

/**
 * Where the current page sits in the hierarchy. On phones it collapses to a single
 * "← Parent" back link, the thing people actually use a trail for on a small screen.
 */
export function Breadcrumbs({
  items,
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...rest
}: BreadcrumbsProps) {
  const parent = items.length > 1 ? items[items.length - 2] : undefined;
  return (
    <nav {...rest} aria-label={ariaLabel} className={className}>
      <ol className={styles.crumbs}>
        {parent?.href && (
          <li className={styles.crumbBack}>
            <a className={styles.crumbLink} href={parent.href}>
              <Icon icon={iconArrowLeft} size={16} /> {parent.label}
            </a>
          </li>
        )}
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={index} className={styles.crumb}>
              {last || !item.href ? (
                <span className={styles.crumbCurrent} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className={styles.crumbLink} href={item.href}>
                  {item.label}
                </a>
              )}
              {!last && <Icon icon={iconChevronRight} size={14} className={styles.crumbSeparator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
