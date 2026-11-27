import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as styles from './popover.css';

type TriggerProps = {
  style?: CSSProperties;
  popoverTarget?: string;
  'aria-describedby'?: string;
  onPointerEnter?: (event: never) => void;
  onPointerLeave?: (event: never) => void;
  onFocus?: (event: never) => void;
  onBlur?: (event: never) => void;
  onKeyDown?: (event: never) => void;
};

/** A unique, CSS-safe anchor name per instance. */
function useAnchorName() {
  return `--ml-anchor-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export interface PopoverProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'popover'> {
  /** The element that toggles it: usually a `Button`. It must be a `<button>`. */
  trigger: ReactElement<TriggerProps>;
  /** Optional heading; it also names the popover. */
  title?: ReactNode;
  placement?: styles.Placement;
  /** Called when it opens or closes, including light dismiss and Escape. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Non-modal content next to its trigger: filters, details, small forms.
 * Built on the Popover API: the browser handles light dismiss, Escape and top layer,
 * and `popovertarget` exposes the expanded state. CSS anchor positioning places it.
 */
export function Popover({
  trigger,
  title,
  placement,
  onOpenChange,
  className,
  style,
  children,
  ...rest
}: PopoverProps) {
  const id = useId();
  const titleId = useId();
  const anchor = useAnchorName();
  const ref = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onToggle = (event: Event) => onOpenChangeRef.current?.((event as ToggleEvent).newState === 'open');
    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, []);

  const wiredTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        popoverTarget: id,
        style: { ...trigger.props.style, anchorName: anchor } as CSSProperties,
      })
    : trigger;

  return (
    <>
      {wiredTrigger}
      <div
        {...rest}
        ref={ref}
        id={id}
        popover="auto"
        // A <dialog> shown through the Popover API is unreliable across browsers, so the
        // panel stays a <div> and the role names it.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="dialog"
        aria-labelledby={title ? titleId : undefined}
        className={cx(styles.popover({ placement }), className)}
        style={{ ...style, positionAnchor: anchor } as CSSProperties}
      >
        {title && (
          <p id={titleId} className={styles.popoverTitle}>
            {title}
          </p>
        )}
        {children}
      </div>
    </>
  );
}

export interface TooltipProps {
  /** Short, plain text. Tooltips must never hold links, buttons or other controls. */
  content: ReactNode;
  /** The described element. It must be focusable, so keyboard users get the tooltip too. */
  children: ReactElement<TriggerProps>;
  placement?: styles.Placement;
  /** Hover delay before showing, in ms. Focus shows it straight away. Default 400. */
  delay?: number;
}

/**
 * A short description of a control, shown on hover (after a delay) and on focus,
 * hidden on leave, blur and Escape. Linked with `aria-describedby`.
 * Touch screens have no hover, so never put essential information only in a tooltip.
 */
export function Tooltip({ content, children, placement, delay = 400 }: TooltipProps) {
  const id = useId();
  const anchor = useAnchorName();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = (after = 0) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (el && !el.matches(':popover-open')) el.showPopover();
    }, after);
  };
  const hide = () => {
    clearTimeout(timer.current);
    const el = ref.current;
    if (el?.matches(':popover-open')) el.hidePopover();
  };
  useEffect(() => {
    const pending = timer;
    return () => clearTimeout(pending.current);
  }, [timer]);

  const props = children.props;
  // The handlers below read refs only when the events fire; the rule cannot see that
  // through cloneElement.
  // oxlint-disable-next-line react/refs
  const trigger = cloneElement(children, {
    'aria-describedby': [props['aria-describedby'], id].filter(Boolean).join(' '),
    style: { ...props.style, anchorName: anchor } as CSSProperties,
    onPointerEnter: (event: never) => {
      props.onPointerEnter?.(event);
      show(delay);
    },
    onPointerLeave: (event: never) => {
      props.onPointerLeave?.(event);
      hide();
    },
    onFocus: (event: never) => {
      props.onFocus?.(event);
      show(0);
    },
    onBlur: (event: never) => {
      props.onBlur?.(event);
      hide();
    },
    onKeyDown: (event: never) => {
      props.onKeyDown?.(event);
      if ((event as KeyboardEvent).key === 'Escape') hide();
    },
  });

  return (
    <>
      {trigger}
      <div
        ref={ref}
        id={id}
        popover="manual"
        role="tooltip"
        className={styles.tooltip({ placement })}
        style={{ positionAnchor: anchor } as CSSProperties}
      >
        {content}
      </div>
    </>
  );
}
