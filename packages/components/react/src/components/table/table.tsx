import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './table.css';

export interface TableProps extends ComponentPropsWithRef<'table'> {
  /** Names the table (and its scroll region). Shown above it unless `hideCaption`. */
  caption: ReactNode;
  hideCaption?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
  /** Keep the header row visible while scrolling; give the table a max height via `maxHeight`. */
  stickyHeader?: boolean;
  maxHeight?: string;
  /** Keep the first column visible while scrolling sideways, e.g. names. */
  stickyFirstColumn?: boolean;
}

/**
 * A semantic `<table>` in a scroll container. When it is wider (or taller) than its
 * space, the container becomes a named, focusable region so keyboard users can scroll it.
 * Write the rows with plain `<thead>`, `<tbody>`, `<tr>`, and `Th`/`Td` for numbers.
 */
export function Table({
  caption,
  hideCaption,
  density = 'standard',
  stickyHeader,
  maxHeight,
  stickyFirstColumn,
  className,
  children,
  ...rest
}: TableProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={wrap}
      className={styles.wrap}
      data-sticky-header={stickyHeader || undefined}
      data-sticky-first={stickyFirstColumn || undefined}
      style={maxHeight ? { maxHeight } : undefined}
      // Only a region (and a tab stop) when there is something to scroll.
      role={scrollable ? 'region' : undefined}
      aria-label={scrollable && typeof caption === 'string' ? caption : undefined}
      tabIndex={scrollable ? 0 : undefined}
    >
      <table {...rest} data-density={density} className={cx(styles.table, className)}>
        <caption className={hideCaption ? styles.captionHidden : undefined}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export interface CellProps {
  /** Right-align with tabular figures, for amounts and counts. */
  numeric?: boolean;
}

export function Th({ numeric, className, scope = 'col', ...rest }: ComponentPropsWithRef<'th'> & CellProps) {
  return <th {...rest} scope={scope} className={cx(numeric && styles.numeric, className)} />;
}

export function Td({ numeric, className, ...rest }: ComponentPropsWithRef<'td'> & CellProps) {
  return <td {...rest} className={cx(numeric && styles.numeric, className)} />;
}
