import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { avatar as generateAvatar, initialsOf, toDataUri } from '@mohirlab/assets';
import { cx } from '../../utils/cx';
import * as styles from './avatar.css';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Photo URL. When missing or broken, a generated tile avatar is shown. */
  src?: string;
  /** Person or entity name: the accessible label and the source of initials. */
  name: string;
  /** Stable id for the generated fallback (a user id survives renames). Defaults to `name`. */
  seed?: string;
  /** Draw initials on the fallback tile. Default true. */
  initials?: boolean;
  size?: styles.AvatarVariants['size'];
  shape?: styles.AvatarVariants['shape'];
}

export function Avatar({ src, name, seed, initials = true, size, shape, className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const fallback = useMemo(
    () =>
      toDataUri(
        generateAvatar(seed ?? name, { size: 96, initials: initials ? initialsOf(name) : undefined }),
      ),
    [seed, name, initials],
  );
  const showPhoto = src && failed !== src;

  return (
    <span {...rest} className={cx(styles.avatar({ size, shape }), className)}>
      <img
        className={styles.image}
        src={showPhoto ? src : fallback}
        alt={name}
        draggable={false}
        onError={showPhoto ? () => setFailed(src) : undefined}
      />
    </span>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithRef<'div'> {
  /** Show at most this many avatars. */
  max?: number;
  /** Total people, when larger than the avatars you pass (e.g. 2,140 going). */
  total?: number;
  /** Text after the stack. Default: "+N" for the people not shown. */
  overflowLabel?: (hidden: number) => ReactNode;
  size?: styles.AvatarVariants['size'];
  children: ReactNode;
}

const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

export function AvatarGroup({
  max = 4,
  total,
  overflowLabel = (n) => `+${compact.format(n)}`,
  size = 'sm',
  className,
  children,
  ...rest
}: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const shown = items.slice(0, max);
  const hidden = Math.max((total ?? items.length) - shown.length, 0);

  return (
    <div {...rest} className={cx(styles.group, className)}>
      {shown.map((child) => (
        <Avatar
          key={child.key}
          {...(child.props as AvatarProps)}
          size={size}
          className={cx(styles.groupItem, (child.props as AvatarProps).className)}
        />
      ))}
      {hidden > 0 && <span className={styles.overflow}>{overflowLabel(hidden)}</span>}
    </div>
  );
}
