import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { iconClose } from '@mohirlab/icons';
import { Icon } from '../icon';
import * as styles from './toast.css';

export type ToastTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** One follow-up action, e.g. Undo. Toasts must never be the only way to do something. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before it dismisses itself. Default 5000 (8000 for danger). `Infinity` keeps it. */
  duration?: number;
  /** Reuse an id to replace a toast instead of stacking a new one. */
  id?: string;
}

interface ToastItem extends ToastOptions {
  id: string;
  closing: boolean;
}

interface ToastApi {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Show and dismiss toasts. Needs a `<ToastProvider>` above. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() must be used inside <ToastProvider>.');
  return api;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Most toasts on screen at once; older ones are dismissed. Default 3. */
  max?: number;
  /** Accessible name of the notifications region, for localisation. */
  label?: string;
  dismissLabel?: string;
}

let counter = 0;
const EXIT_MS = 400;

/**
 * Renders the notification region in place (so it inherits the surrounding theme) and
 * provides `useToast()`. Put it once near the root, inside your `ThemeScope`.
 */
export function ToastProvider({
  children,
  max = 3,
  label = 'Notifications',
  dismissLabel = 'Dismiss',
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [paused, setPaused] = useState(false);

  // Closing toasts stay for their exit animation, then this sweep removes them.
  const sweep = useCallback(() => {
    setTimeout(() => setItems((list) => list.filter((t) => !t.closing)), EXIT_MS);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      setItems((list) => list.map((t) => (t.id === id ? { ...t, closing: true } : t)));
      sweep();
    },
    [sweep],
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `ml-toast-${++counter}`;
      setItems((list) => {
        const next = [...list.filter((t) => t.id !== id), { ...options, id, closing: false }];
        // Over the limit: the oldest open toasts start leaving.
        const overflow = new Set(
          next
            .filter((t) => !t.closing)
            .slice(0, -max)
            .map((t) => t.id),
        );
        return overflow.size ? next.map((t) => (overflow.has(t.id) ? { ...t, closing: true } : t)) : next;
      });
      sweep();
      return id;
    },
    [max, sweep],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section aria-label={label}>
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- hover and focus only pause the timers; nothing is activated */}
        <ol
          className={styles.region}
          aria-live="polite"
          aria-relevant="additions"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          {items.map((item) => (
            <ToastSlip
              key={item.id}
              item={item}
              paused={paused}
              dismissLabel={dismissLabel}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

function ToastSlip({
  item,
  paused,
  dismissLabel,
  onDismiss,
}: {
  item: ToastItem;
  paused: boolean;
  dismissLabel: string;
  onDismiss: () => void;
}) {
  const tone = item.tone ?? 'neutral';
  const duration = item.duration ?? (tone === 'danger' ? 8000 : 5000);
  const remaining = useRef(duration);

  // Count down only while nothing is hovered or focused; resume where it stopped.
  useEffect(() => {
    if (item.closing || paused || !Number.isFinite(remaining.current)) return;
    const started = Date.now();
    const timer = setTimeout(onDismiss, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [item.closing, paused, onDismiss]);

  return (
    <li
      className={styles.toast({ tone })}
      data-state={item.closing ? 'closed' : 'open'}
      // Danger interrupts; everything else waits its turn in the polite region.
      role={tone === 'danger' ? 'alert' : undefined}
      aria-atomic="true"
    >
      <span className={styles.sealMark} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.title}>{item.title}</span>
        {item.description && <span className={styles.description}>{item.description}</span>}
        {item.action && (
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              item.action!.onClick();
              onDismiss();
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button type="button" className={styles.dismiss} aria-label={dismissLabel} onClick={onDismiss}>
        <Icon icon={iconClose} size={16} />
      </button>
    </li>
  );
}
