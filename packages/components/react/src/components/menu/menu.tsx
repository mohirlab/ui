import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { IconData } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { Icon } from '../icon';
import { useAnchorName } from '../popover/popover';
import type { Placement } from '../popover/popover.css';
import * as styles from './menu.css';

type TriggerProps = {
  id?: string;
  style?: CSSProperties;
  popoverTarget?: string;
  'aria-haspopup'?: 'menu';
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

const ITEM = '[role="menuitem"]:not([aria-disabled="true"])';

const items = (menu: HTMLElement) => [...menu.querySelectorAll<HTMLElement>(ITEM)];

export interface MenuProps extends Omit<ComponentPropsWithRef<'div'>, 'popover'> {
  /** The button that opens it: usually a `Button`. It must be a `<button>`. */
  trigger: ReactElement<TriggerProps>;
  placement?: Placement;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * A list of actions behind a button: "More", row actions, account menus.
 * The Popover API gives light dismiss, Escape and the top layer; the keyboard follows the
 * WAI-ARIA menu button pattern: arrows, Home, End and type-to-find. For choosing a value
 * use `Select` or `Combobox`, and for navigation use links.
 */
export function Menu({
  trigger,
  placement = 'bottom-start',
  onOpenChange,
  className,
  style,
  children,
  ...rest
}: MenuProps) {
  const menuId = useId();
  const triggerId = useId();
  const anchor = useAnchorName();
  const ref = useRef<HTMLDivElement>(null);
  /** Which item to focus when the menu opens: first, or last after ArrowUp on the trigger. */
  const focusOnOpen = useRef<'first' | 'last'>('first');
  const typed = useRef({ text: '', at: 0 });
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const onToggle = (event: Event) => {
      const open = (event as ToggleEvent).newState === 'open';
      if (open) {
        const list = items(menu);
        (focusOnOpen.current === 'last' ? list.at(-1) : list[0])?.focus();
        focusOnOpen.current = 'first';
      }
      onOpenChangeRef.current?.(open);
    };
    menu.addEventListener('toggle', onToggle);
    return () => menu.removeEventListener('toggle', onToggle);
  }, []);

  const triggerEl = () => document.getElementById(trigger.props.id ?? triggerId);

  const close = () => {
    const menu = ref.current;
    if (menu?.matches(':popover-open')) menu.hidePopover();
    triggerEl()?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menu = event.currentTarget;
    const list = items(menu);
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => list[(to + list.length) % list.length]?.focus();
    switch (event.key) {
      case 'ArrowDown':
        move(index + 1);
        break;
      case 'ArrowUp':
        move(index < 0 ? -1 : index - 1);
        break;
      case 'Home':
        move(0);
        break;
      case 'End':
        move(-1);
        break;
      case 'Escape':
        close();
        break;
      case 'Tab':
        // Leave the menu: close it and let Tab move on from the trigger.
        menu.hidePopover();
        return;
      default: {
        // Type to find: jump to the next item starting with what was typed.
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
        const now = Date.now();
        typed.current.text =
          (now - typed.current.at > 500 ? '' : typed.current.text) + event.key.toLowerCase();
        typed.current.at = now;
        const text = typed.current.text;
        const ordered = [...list.slice(index + 1), ...list.slice(0, index + 1)];
        const repeat = text.length > 1 && [...text].every((c) => c === text[0]);
        const match = ordered.find((el) =>
          (el.textContent ?? '')
            .trim()
            .toLowerCase()
            .startsWith(repeat ? text[0]! : text),
        );
        match?.focus();
      }
    }
    event.preventDefault();
  };

  const props = trigger.props;
  // The handlers below read refs only when the events fire; the rule cannot see that
  // through cloneElement.
  // oxlint-disable-next-line react/refs
  const wiredTrigger = cloneElement(trigger, {
    id: props.id ?? triggerId,
    popoverTarget: menuId,
    'aria-haspopup': 'menu',
    style: { ...props.style, anchorName: anchor } as CSSProperties,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      props.onKeyDown?.(event);
      // Arrow keys on the trigger open the menu at the first or last item.
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      focusOnOpen.current = event.key === 'ArrowUp' ? 'last' : 'first';
      ref.current?.showPopover();
    },
  });

  return (
    <>
      {wiredTrigger}
      <div
        {...rest}
        ref={ref}
        id={menuId}
        popover="auto"
        role="menu"
        aria-labelledby={props.id ?? triggerId}
        tabIndex={-1}
        className={cx(styles.popover({ placement }), styles.menu, className)}
        style={{ ...style, positionAnchor: anchor } as CSSProperties}
        onKeyDown={onMenuKeyDown}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          // An item was chosen: close, and put focus back on the trigger.
          const target = (event.target as HTMLElement).closest('[role="menuitem"]');
          if (target && target.getAttribute('aria-disabled') !== 'true' && !event.defaultPrevented) close();
        }}
      >
        {children}
      </div>
    </>
  );
}

export interface MenuItemProps extends Omit<ComponentPropsWithRef<'button'>, 'onSelect'> {
  icon?: IconData;
  /** Keyboard shortcut hint, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: string;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
  /**
   * Called when the item is chosen by click, Enter or Space. The menu then closes;
   * call `event.preventDefault()` to keep it open.
   */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function MenuItem({
  icon,
  shortcut,
  tone = 'neutral',
  onSelect,
  onClick,
  disabled,
  className,
  children,
  ...rest
}: MenuItemProps) {
  return (
    <button
      {...rest}
      type="button"
      role="menuitem"
      tabIndex={-1}
      // aria-disabled, not disabled: disabled items stay reachable with the arrow keys.
      aria-disabled={disabled || undefined}
      data-tone={tone === 'danger' ? 'danger' : undefined}
      className={cx(styles.item, className)}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        onSelect?.(event);
      }}
    >
      {icon && <Icon icon={icon} size={18} className={styles.itemIcon} />}
      <span className={styles.itemLabel}>{children}</span>
      {shortcut && (
        <kbd className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

/** A hairline between groups of items. */
export function MenuSeparator({ className, ...rest }: ComponentPropsWithRef<'hr'>) {
  return <hr {...rest} className={cx(styles.separator, className)} />;
}

export interface MenuGroupProps extends ComponentPropsWithRef<'div'> {
  /** A short heading for the group, e.g. "Sort by". */
  label: ReactNode;
}

/** Related items under a small heading. */
export function MenuGroup({ label, className, children, ...rest }: MenuGroupProps) {
  const id = useId();
  return (
    // A <fieldset> is a form grouping; inside a menu the ARIA pattern asks for role=group.
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div {...rest} role="group" aria-labelledby={id} className={className}>
      <div id={id} className={styles.groupLabel} aria-hidden="true">
        {label}
      </div>
      {children}
    </div>
  );
}
