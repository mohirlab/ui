import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import type { IconData } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { Icon } from '../icon';
import * as styles from './feedback.css';

type Length = number | string;
const toLength = (value: Length | undefined) => (typeof value === 'number' ? `${value}px` : value);

export interface SkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** `text` follows the font size, `circle` is for avatars, `block` for images and cards. */
  shape?: styles.SkeletonVariants['shape'];
  /** For `text`: how many lines. The last one is shorter. Default 1. */
  lines?: number;
  width?: Length;
  /** For `block`. */
  height?: Length;
  /** For `circle`: the diameter. */
  size?: Length;
}

/**
 * A placeholder in the shape of content that is still loading. It is hidden from
 * assistive technology: mark the loading region with `aria-busy="true"` and give it a
 * name or a status message, so screen reader users hear that something is loading.
 */
export function Skeleton({
  shape = 'text',
  lines = 1,
  width,
  height,
  size,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const box: CSSProperties = {
    width: toLength(shape === 'circle' ? size : width),
    height: toLength(shape === 'circle' ? undefined : height),
    ...style,
  };
  if (shape === 'circle' && box.width === undefined) box.width = '2.5rem';

  if (shape === 'text' && lines > 1) {
    return (
      <span {...rest} aria-hidden="true" className={cx(styles.skeletonLines, className)} style={box}>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={cx(styles.skeleton({ shape }), i === lines - 1 && styles.lastLine)} />
        ))}
      </span>
    );
  }
  return (
    <span {...rest} aria-hidden="true" className={cx(styles.skeleton({ shape }), className)} style={box} />
  );
}

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Shown in the seal tile above the title. */
  icon?: IconData;
  title: ReactNode;
  /** One or two sentences: why it is empty and what to do next. */
  description?: ReactNode;
  /** Usually one primary `Button`, maybe a secondary one. */
  actions?: ReactNode;
  /** `sm` inside panels and cards, `md` for a whole page or table. */
  size?: styles.EmptyStateVariants['size'];
  /** Dashed edge: for empty panels inside a page and drop zones. */
  framed?: boolean;
  /** Heading level of the title. Default 2. */
  level?: 2 | 3 | 4;
}

/** What a list, table or page shows when there is nothing in it yet, or no results. */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  size,
  framed,
  level = 2,
  className,
  children,
  ...rest
}: EmptyStateProps) {
  const Heading = `h${level}` as const;
  return (
    <div {...rest} className={cx(styles.empty({ size, framed }), className)}>
      {icon && (
        <span className={styles.emptyMark} aria-hidden="true">
          <Icon icon={icon} size={22} />
        </span>
      )}
      <Heading className={styles.emptyTitle}>{title}</Heading>
      {description && <p className={styles.emptyText}>{description}</p>}
      {children}
      {actions && <div className={styles.emptyActions}>{actions}</div>}
    </div>
  );
}
