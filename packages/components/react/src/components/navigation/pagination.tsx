import type { ComponentPropsWithRef, ReactNode } from 'react';
import { iconChevronLeft, iconChevronRight } from '@mohirlab/icons';
import { Icon } from '../icon';
import * as styles from './pagination.css';

/**
 * The pages to show, with `'gap'` for elided runs. The result always has the same
 * length once there are enough pages, so the controls never shift under the pointer.
 */
export function pageRange(page: number, pageCount: number, siblings = 1): (number | 'gap')[] {
  const slots = siblings * 2 + 5; // first, last, current, siblings and two gaps
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const current = Math.min(Math.max(page, 1), pageCount);
  const span = siblings * 2 + 3; // run of numbers next to one gap
  if (current <= span - siblings) {
    return [...Array.from({ length: span }, (_, i) => i + 1), 'gap', pageCount];
  }
  if (current >= pageCount - span + siblings + 1) {
    return [1, 'gap', ...Array.from({ length: span }, (_, i) => pageCount - span + 1 + i)];
  }
  const middle = Array.from({ length: siblings * 2 + 1 }, (_, i) => current - siblings + i);
  return [1, 'gap', ...middle, 'gap', pageCount];
}

export interface PaginationLabels {
  previous: string;
  next: string;
  /** Accessible name of a page number. */
  page: (page: number) => string;
  /** Shown on phones instead of the page numbers. */
  status: (page: number, pageCount: number) => ReactNode;
}

const defaultLabels: PaginationLabels = {
  previous: 'Previous',
  next: 'Next',
  page: (page) => `Page ${page}`,
  status: (page, pageCount) => `Page ${page} of ${pageCount}`,
};

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children' | 'onChange'> {
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  /** Called with the chosen page. Not needed when `href` makes them links. */
  onPageChange?: (page: number) => void;
  /** Give each page a URL and the controls become links, so pages can be opened in tabs. */
  href?: (page: number) => string;
  /** Page numbers on each side of the current one. Default 1. */
  siblings?: number;
  /** Text for other languages. */
  labels?: Partial<PaginationLabels>;
}

/**
 * Moves between pages of a list or table. Below tablet width the numbers give way to
 * "Page 3 of 12" between Previous and Next, which fits any phone.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  href,
  siblings = 1,
  labels: labelsProp,
  className,
  'aria-label': ariaLabel = 'Pagination',
  ...rest
}: PaginationProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const count = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), count);

  const control = (target: number, kind: string, content: ReactNode, props: object = {}) => {
    const disabled = target < 1 || target > count;
    const isCurrent = target === current && kind === styles.page;
    if (href) {
      return (
        <a
          {...props}
          className={kind}
          href={disabled || isCurrent ? undefined : href(target)}
          aria-disabled={disabled || undefined}
          aria-current={isCurrent ? 'page' : undefined}
          role={disabled ? 'link' : undefined}
          onClick={() => !disabled && !isCurrent && onPageChange?.(target)}
        >
          {content}
        </a>
      );
    }
    return (
      <button
        {...props}
        type="button"
        className={kind}
        disabled={disabled}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={() => !isCurrent && onPageChange?.(target)}
      >
        {content}
      </button>
    );
  };

  return (
    <nav {...rest} aria-label={ariaLabel} className={className}>
      <ul className={styles.pagination}>
        <li>
          {control(
            current - 1,
            styles.step,
            <>
              <Icon icon={iconChevronLeft} size={16} />
              {labels.previous}
            </>,
          )}
        </li>
        {pageRange(current, count, siblings).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className={styles.pageItem} aria-hidden="true">
              <span className={styles.gap}>…</span>
            </li>
          ) : (
            <li key={item} className={styles.pageItem}>
              {control(item, styles.page, item, { 'aria-label': labels.page(item) })}
            </li>
          ),
        )}
        <li className={styles.status}>{labels.status(current, count)}</li>
        <li>
          {control(
            current + 1,
            styles.step,
            <>
              {labels.next}
              <Icon icon={iconChevronRight} size={16} />
            </>,
          )}
        </li>
      </ul>
    </nav>
  );
}
