import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as styles from './navigation.css';

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  idFor: (kind: 'tab' | 'panel', value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab parts must be used inside <Tabs>.');
  return context;
};

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** The selected tab (controlled). */
  value?: string;
  /** The tab selected first (uncontrolled). One of `value` or `defaultValue` is required. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

/**
 * Tabs switch between panels of related content in place. For moving between pages,
 * use links instead. Follows the WAI-ARIA tabs pattern with automatic activation.
 */
export function Tabs({ value, defaultValue = '', onValueChange, children, ...rest }: TabsProps) {
  const base = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const context: TabsContextValue = {
    value: current,
    select: (next) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    idFor: (kind, v) => `${base}-${kind}-${v.replace(/[^\w-]/g, '_')}`,
  };
  return (
    <TabsContext.Provider value={context}>
      <div {...rest}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends ComponentPropsWithRef<'div'> {
  /** Names the set of tabs, e.g. "Invoice views". */
  'aria-label': string;
}

/** The row of tabs. Arrow keys, Home and End move between tabs and select them. */
export function TabList({ className, onKeyDown, ...rest }: TabListProps) {
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    let next: HTMLButtonElement | undefined;
    if (step) next = tabs[(index + step + tabs.length) % tabs.length];
    else if (event.key === 'Home') next = tabs[0];
    else if (event.key === 'End') next = tabs.at(-1);
    if (!next) return;
    event.preventDefault();
    next.focus();
    next.click();
  };
  return (
    // WAI-ARIA tabs pattern: focus lives on the tabs (roving tabindex), not on the list.
    // The list only handles keys that bubble up from the focused tab.
    // oxlint-disable-next-line jsx-a11y/interactive-supports-focus
    <div {...rest} role="tablist" className={cx(styles.tabList, className)} onKeyDown={onKey} />
  );
}

export interface TabProps extends Omit<ComponentPropsWithRef<'button'>, 'value'> {
  value: string;
}

export function Tab({ value, className, onClick, ...rest }: TabProps) {
  const tabs = useTabs();
  const selected = tabs.value === value;
  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={tabs.idFor('tab', value)}
      aria-controls={tabs.idFor('panel', value)}
      aria-selected={selected}
      // Roving tabindex: Tab moves into the list once, arrows move within it.
      tabIndex={selected ? 0 : -1}
      className={cx(styles.tab, className)}
      onClick={(event) => {
        onClick?.(event);
        tabs.select(value);
      }}
    />
  );
}

export interface TabPanelProps extends ComponentPropsWithRef<'div'> {
  value: string;
}

/** Content for one tab. Hidden panels stay in the DOM (state is kept) but are not shown. */
export function TabPanel({ value, className, ...rest }: TabPanelProps) {
  const tabs = useTabs();
  const selected = tabs.value === value;
  return (
    <div
      {...rest}
      role="tabpanel"
      id={tabs.idFor('panel', value)}
      aria-labelledby={tabs.idFor('tab', value)}
      tabIndex={0}
      hidden={!selected}
      className={cx(styles.tabPanel, className)}
    />
  );
}
