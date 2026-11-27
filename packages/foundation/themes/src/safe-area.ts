/**
 * The device's safe-area insets: the space taken by notches, rounded corners and the
 * home indicator. They come from the device at runtime, so they are CSS env() values,
 * not design tokens. Each falls back to 0px where the browser has no safe area.
 * Apps need `viewport-fit=cover` in their viewport meta tag for these to be non-zero.
 */
export const safeArea = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
} as const;

/** A length plus the inset on one side, e.g. padding that clears the home indicator. */
export const withSafeArea = (side: keyof typeof safeArea, length: string) =>
  `calc(${length} + ${safeArea[side]})`;
