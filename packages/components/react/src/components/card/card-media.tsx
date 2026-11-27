import { useMemo, type ComponentPropsWithRef, type ReactNode } from 'react';
import { artwork, toDataUri, type ArtworkOptions } from '@mohirlab/assets';
import { cx } from '../../utils/cx';
import * as styles from './card.css';

export interface CardMediaProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Image URL. */
  src?: string;
  /** Alt text for `src`. Use "" for decorative images. */
  alt?: string;
  /** Without `src`: seed for generated artwork, so placeholders stay stable. */
  seed?: string;
  artwork?: Omit<ArtworkOptions, 'width' | 'height'>;
  /** Width / height. Default 16 / 10. */
  ratio?: number;
  /** Bleed to the card edges instead of sitting inset with its own corners. */
  bleed?: boolean;
  /** Overlay content, such as a badge or a bookmark button, pinned to a corner. */
  children?: ReactNode;
}

export function CardMedia({
  src,
  alt = '',
  seed = 'mohirlab',
  artwork: artworkOptions,
  ratio = 16 / 10,
  bleed = false,
  className,
  style,
  children,
  ...rest
}: CardMediaProps) {
  const generated = useMemo(
    () =>
      src
        ? undefined
        : toDataUri(artwork(seed, { ...artworkOptions, width: 640, height: Math.round(640 / ratio) })),
    [src, seed, artworkOptions, ratio],
  );

  return (
    <div
      {...rest}
      className={cx(styles.media, bleed && styles.mediaBleed, className)}
      style={{ aspectRatio: String(ratio), ...style }}
    >
      <img
        className={styles.mediaImage}
        src={src ?? generated}
        alt={src ? alt : ''}
        loading="lazy"
        decoding="async"
      />
      {children && <div className={styles.mediaOverlay}>{children}</div>}
    </div>
  );
}
