import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { iconClose } from '@mohirlab/icons';
import { mq } from '@mohirlab/sprinkles';
import { usePresence } from '../../hooks/use-presence';
import { cx } from '../../utils/cx';
import { Button } from '../button';
import { Icon } from '../icon';
import * as styles from './dialog.css';

export interface DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'role'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required: names the dialog for assistive technology. */
  title: ReactNode;
  description?: ReactNode;
  /** `auto` (default): bottom sheet on phones, centered from tablet up. */
  placement?: styles.DialogVariants['placement'];
  size?: styles.DialogVariants['size'];
  /**
   * Whether Escape, the backdrop and the close button may dismiss it. Turn off for
   * decisions the user must make; pair with `role="alertdialog"`.
   */
  dismissible?: boolean;
  role?: 'dialog' | 'alertdialog';
  /** Label of the close button, for localisation. */
  closeLabel?: string;
  children?: ReactNode;
}

const DISMISS_DISTANCE = 0.3; // fraction of the sheet's height
const DISMISS_VELOCITY = 0.6; // px per ms

/**
 * A modal dialog on the native `<dialog>` element: the browser traps focus, makes the
 * rest of the page inert, handles Escape and returns focus when it closes.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  placement = 'auto',
  size,
  dismissible = true,
  role = 'dialog',
  closeLabel = 'Close',
  className,
  children,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { mounted, state } = usePresence(open, ref, {
    onExitComplete: () => ref.current?.open && ref.current.close(),
  });

  // Open as a modal as soon as the element exists.
  useLayoutEffect(() => {
    const el = ref.current;
    if (mounted && open && el && !el.open) el.showModal();
  }, [mounted, open]);

  // The page behind must not scroll while a modal is open.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [mounted]);

  const requestClose = () => {
    if (dismissible) onOpenChange(false);
  };

  // --- Drag a sheet down to dismiss it --------------------------------------------
  const drag = useRef<{ startY: number; startTime: number; dy: number } | null>(null);
  const isSheetNow = () =>
    placement === 'sheet' || (placement === 'auto' && !window.matchMedia(mq('tablet')).matches);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dismissible || !isSheetNow() || (event.target as Element).closest('button, a, input')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startTime: performance.now(), dy: 0 };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!drag.current || !el) return;
    drag.current.dy = Math.max(0, event.clientY - drag.current.startY);
    el.style.transition = 'none';
    el.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onPointerUp = () => {
    const el = ref.current;
    const current = drag.current;
    drag.current = null;
    if (!current || !el) return;
    const velocity = current.dy / Math.max(1, performance.now() - current.startTime);
    if (current.dy > el.offsetHeight * DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
      // The exit animation continues from where the finger let go.
      onOpenChange(false);
      return;
    }
    el.style.transition = '';
    el.style.transform = '';
  };

  // Reset any drag offset once the sheet has gone.
  useEffect(() => {
    if (!mounted && ref.current) {
      ref.current.style.transform = '';
      ref.current.style.transition = '';
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Escape is the keyboard equivalent
    <dialog
      {...rest}
      ref={ref}
      role={role === 'alertdialog' ? 'alertdialog' : undefined}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-state={state}
      data-placement={placement}
      className={cx(styles.dialog({ placement, size }), className)}
      onCancel={(event) => {
        // Escape: we close through state so the exit animation can run.
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        // Closed by the browser or a <form method="dialog">: keep state in sync.
        if (open) onOpenChange(false);
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> itself, outside its box.
        if (event.target !== ref.current) return;
        const box = ref.current.getBoundingClientRect();
        const inside =
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom;
        if (!inside) requestClose();
      }}
    >
      <div
        className={styles.dragArea}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
      {/* Last in tab order, so focus starts in the content; shown top-right. */}
      {dismissible && (
        <span className={styles.close}>
          <Button
            appearance="ghost"
            tone="neutral"
            size="sm"
            iconOnly
            aria-label={closeLabel}
            onClick={requestClose}
          >
            <Icon icon={iconClose} />
          </Button>
        </span>
      )}
    </dialog>
  );
}

/** Scrollable content area of a dialog. */
export function DialogBody({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={cx(styles.body, className)} />;
}

/**
 * The dialog's buttons. Put the primary action last: it lands on the right of a
 * centered dialog and on top of the full-width stack in a sheet.
 */
export function DialogActions({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={cx(styles.actions, className)} />;
}
