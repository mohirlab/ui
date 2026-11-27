import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { iconCheck, iconChevronDown } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/use-field-control';
import { Icon } from '../icon';
import type { InputVariants } from '../input/input.css';
import { useAnchorName } from '../popover/popover';
import * as styles from './combobox.css';

export interface ComboboxOption {
  value: string;
  label: string;
  /** A second, quieter line. Also searched. */
  description?: string;
  disabled?: boolean;
}

/** Case- and accent-insensitive, so "o'zbek" finds "Oʻzbek" and "e" finds "é". */
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯʻʼ'’`]/g, '')
    .toLowerCase();

export const defaultFilter = (option: ComboboxOption, query: string) => {
  const q = fold(query.trim());
  return !q || fold(option.label).includes(q) || fold(option.description ?? '').includes(q);
};

/** The label with the first match of the query marked. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = fold(query.trim());
  if (!q) return <>{text}</>;
  // fold() can change lengths (combining marks), so map positions character by character.
  const folded = [...text].map((c) => fold(c));
  let start = -1;
  for (let i = 0; i < folded.length && start < 0; i++) {
    let joined = '';
    for (let j = i; j < folded.length && joined.length < q.length; j++) joined += folded[j];
    if (joined.startsWith(q)) start = i;
  }
  if (start < 0) return <>{text}</>;
  const chars = [...text];
  let end = start;
  for (let length = 0; end < chars.length && length < q.length; end++) length += folded[end]!.length;
  return (
    <>
      {chars.slice(0, start).join('')}
      <mark className={styles.match}>{chars.slice(start, end).join('')}</mark>
      {chars.slice(end).join('')}
    </>
  );
}

export interface ComboboxProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'children'
> {
  options: ComboboxOption[];
  /** The chosen option's value; `''` for none. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: InputVariants['size'];
  invalid?: boolean;
  /** Shown when nothing matches. */
  emptyText?: ReactNode;
  /** Decide which options match what was typed. Default: label or description contains it. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Accessible name of the open/close button. */
  toggleLabel?: string;
}

/**
 * A select you can type into: for long lists such as countries, people or tags.
 * Follows the WAI-ARIA combobox pattern (list autocomplete): focus stays in the field,
 * arrows move through the matches, Enter chooses, Escape closes. With `name` it submits
 * the chosen value, not the typed text. For short lists, prefer `Select`.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  size,
  invalid,
  emptyText = 'No matches',
  filter = defaultFilter,
  toggleLabel = 'Show options',
  name,
  placeholder,
  className,
  style,
  id,
  required,
  disabled,
  onKeyDown,
  onBlur,
  ...rest
}: ComboboxProps) {
  const control = useFieldControl({
    id,
    required,
    disabled,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });
  const listId = useId();
  const optionId = useId();
  const anchor = useAnchorName();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = valueProp ?? innerValue;
  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = useState(selected?.label ?? '');
  /** False right after opening: show every option, not only those matching the current label. */
  const [filtering, setFiltering] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Keep the text in step when the value changes from outside.
  const [shownValue, setShownValue] = useState(value);
  if (shownValue !== value) {
    setShownValue(value);
    setQuery(selected?.label ?? '');
  }

  const visible = useMemo(
    () => (filtering ? options.filter((o) => filter(o, query)) : options),
    [options, filter, query, filtering],
  );
  const enabled = (index: number) => index >= 0 && index < visible.length && !visible[index]!.disabled;
  const firstEnabled = (from: number, step: 1 | -1) => {
    for (let i = from; i >= 0 && i < visible.length; i += step) if (enabled(i)) return i;
    return -1;
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || panel.matches(':popover-open') === open) return;
    if (open) panel.showPopover();
    else panel.hidePopover();
  }, [open]);

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${optionId}-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, optionId]);

  const show = (at: 'selected' | 'first' | 'last' = 'selected') => {
    setFiltering(false);
    setOpen(true);
    const current = options.findIndex((o) => o.value === value);
    if (at === 'last') setActive(lastEnabledOf(options));
    else setActive(at === 'selected' && current >= 0 ? current : firstEnabledOf(options));
  };
  const hide = () => {
    setOpen(false);
    setActive(-1);
  };
  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (valueProp === undefined) setInnerValue(option.value);
    setShownValue(option.value);
    setQuery(option.label);
    if (option.value !== value) onValueChange?.(option.value);
    hide();
  };
  /** Leaving the field: an exact label match counts as a choice, anything else is undone. */
  const settle = () => {
    const exact = options.find((o) => !o.disabled && fold(o.label) === fold(query.trim()));
    if (exact) choose(exact);
    else if (!query.trim() && value) {
      if (valueProp === undefined) setInnerValue('');
      setShownValue('');
      onValueChange?.('');
    } else setQuery(selected?.label ?? '');
    hide();
  };

  const onFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowDown':
        if (event.altKey || !open) show(event.altKey ? 'selected' : 'first');
        else setActive((i) => (firstEnabled(i + 1, 1) >= 0 ? firstEnabled(i + 1, 1) : firstEnabled(0, 1)));
        break;
      case 'ArrowUp':
        if (!open) show('last');
        else
          setActive((i) =>
            firstEnabled(i - 1, -1) >= 0 ? firstEnabled(i - 1, -1) : firstEnabled(visible.length - 1, -1),
          );
        break;
      case 'Enter':
        if (!open) return;
        if (enabled(active)) choose(visible[active]!);
        break;
      case 'Escape':
        if (open) {
          setQuery(selected?.label ?? '');
          hide();
        } else if (query) {
          setQuery('');
        } else return;
        break;
      case 'Home':
      case 'End':
        // In the text field these move the caret, as users expect.
        return;
      default:
        return;
    }
    event.preventDefault();
  };

  const activeId = open && active >= 0 ? `${optionId}-${active}` : undefined;

  return (
    <span className={cx(styles.wrap, className)} style={style}>
      <input
        {...rest}
        {...control}
        ref={inputRef}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        placeholder={placeholder}
        value={query}
        className={cx(styles.input({ size }), styles.field)}
        style={{ anchorName: anchor } as CSSProperties}
        onChange={(event) => {
          setQuery(event.target.value);
          setFiltering(true);
          setOpen(true);
          const matches = options.filter((o) => filter(o, event.target.value));
          setActive(firstEnabledOf(matches));
        }}
        onKeyDown={onFieldKeyDown}
        onBlur={(event) => {
          onBlur?.(event);
          settle();
        }}
        onClick={() => !open && show()}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={toggleLabel}
        aria-expanded={open}
        aria-controls={listId}
        className={styles.toggle}
        disabled={control.disabled}
        // Keep focus in the field.
        onPointerDown={(event) => event.preventDefault()}
        onClick={() => {
          if (open) hide();
          else show();
          inputRef.current?.focus();
        }}
      >
        <Icon icon={iconChevronDown} size={18} />
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      <div
        ref={panelRef}
        popover="manual"
        className={cx(styles.popover({ placement: 'bottom-start' }), styles.panel)}
        style={{ positionAnchor: anchor } as CSSProperties}
        // Clicks inside must not blur the field.
        onPointerDown={(event) => event.preventDefault()}
      >
        {/* The combobox pattern needs ARIA listbox and option roles: focus stays in the field
            and aria-activedescendant points at the active option. A native <select> or
            <datalist> can be neither styled nor filtered like this. */}
        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
        <div id={listId} role="listbox" className={styles.listbox} aria-label={rest['aria-label']}>
          {visible.map((option, index) => (
            // Options are chosen with the keyboard from the field (see onFieldKeyDown), so they
            // take no focus and no key handlers of their own.
            // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
            <div
              key={option.value}
              id={`${optionId}-${index}`}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              data-active={index === active ? '' : undefined}
              className={styles.option}
              onPointerMove={() => enabled(index) && index !== active && setActive(index)}
              onClick={() => choose(option)}
            >
              <span className={styles.optionText}>
                <span>{filtering ? <Highlight text={option.label} query={query} /> : option.label}</span>
                {option.description && (
                  <span className={styles.optionDescription}>
                    {filtering ? <Highlight text={option.description} query={query} /> : option.description}
                  </span>
                )}
              </span>
              <Icon icon={iconCheck} size={16} className={styles.check} />
            </div>
          ))}
        </div>
        {/* Always present, so screen readers announce the text when it appears. */}
        <output className={styles.empty}>{visible.length === 0 ? emptyText : null}</output>
      </div>
    </span>
  );
}

function firstEnabledOf(list: ComboboxOption[]) {
  return list.findIndex((o) => !o.disabled);
}
function lastEnabledOf(list: ComboboxOption[]) {
  return list.findLastIndex((o) => !o.disabled);
}
