import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { iconSearch } from '@mohirlab/icons';
import {
  Button,
  Combobox,
  EmptyState,
  Field,
  Menu,
  MenuItem,
  MenuSeparator,
  Pagination,
  Skeleton,
  pageRange,
} from './index';

afterEach(cleanup);

describe('pageRange', () => {
  it('shows every page when they fit', () => {
    expect(pageRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('keeps the same number of slots wherever the current page is', () => {
    expect(pageRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageRange(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageRange(5, 20)).toEqual([1, 'gap', 4, 5, 6, 'gap', 20]);
    expect(pageRange(17, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    expect(pageRange(20, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    for (let page = 1; page <= 30; page++) expect(pageRange(page, 30, 2)).toHaveLength(9);
  });
});

describe('Pagination', () => {
  it('marks the current page, disables Previous on the first page and reports changes', () => {
    const onPageChange = vi.fn<(page: number) => void>();
    render(<Pagination page={1} pageCount={12} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page');
    expect((screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 12' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 1' })); // current: no change
    expect(onPageChange.mock.calls).toEqual([[2], [12]]);
    expect(screen.getByText('Page 1 of 12')).toBeTruthy();
  });

  it('renders links when given href', () => {
    render(<Pagination page={12} pageCount={12} href={(p) => `?page=${p}`} />);
    expect(screen.getByRole('link', { name: 'Page 11' }).getAttribute('href')).toBe('?page=11');
    expect(screen.getByRole('link', { name: 'Previous' }).getAttribute('href')).toBe('?page=11');
    const next = screen.getByRole('link', { name: 'Next' });
    expect(next.getAttribute('href')).toBeNull();
    expect(next.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Skeleton and EmptyState', () => {
  it('hides skeletons from assistive technology', () => {
    const { container } = render(<Skeleton lines={3} />);
    const root = container.firstElementChild!;
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.children).toHaveLength(3);
  });

  it('gives the empty state a heading at the chosen level', () => {
    render(
      <EmptyState
        icon={iconSearch}
        level={3}
        title="No invoices yet"
        description="Invoices you send appear here."
        actions={<Button>New invoice</Button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'No invoices yet' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New invoice' })).toBeTruthy();
  });
});

function renderMenu(onSelect = vi.fn<(item: string) => void>()) {
  render(
    <Menu trigger={<Button>Actions</Button>}>
      <MenuItem onSelect={() => onSelect('rename')}>Rename</MenuItem>
      <MenuItem onSelect={() => onSelect('duplicate')} shortcut="⌘D">
        Duplicate
      </MenuItem>
      <MenuItem disabled onSelect={() => onSelect('move')}>
        Move
      </MenuItem>
      <MenuSeparator />
      <MenuItem tone="danger" onSelect={() => onSelect('delete')}>
        Delete
      </MenuItem>
    </Menu>,
  );
  const trigger = screen.getByRole('button', { name: 'Actions' });
  const menu = screen.getByRole('menu', { hidden: true });
  return { trigger, menu, onSelect };
}

describe('Menu', () => {
  it('wires the trigger to a labelled menu', () => {
    const { trigger, menu } = renderMenu();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('popovertarget')).toBe(menu.id);
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(menu.getAttribute('popover')).toBe('auto');
  });

  it('focuses the first item on open and moves with arrows, End and type-to-find', () => {
    const { menu } = renderMenu();
    act(() => menu.showPopover());
    const items = screen.getAllByRole('menuitem', { hidden: true });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[3]); // "Move" is disabled
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]); // wraps
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(items[3]);
    fireEvent.keyDown(menu, { key: 'd' });
    expect(document.activeElement).toBe(items[1]); // next item starting with "d"
  });

  it('opens at the last item with ArrowUp on the trigger', () => {
    const { trigger } = renderMenu();
    act(() => {
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    });
    expect(document.activeElement?.textContent).toBe('Delete');
  });

  it('runs the action, closes and returns focus to the trigger; disabled items do nothing', () => {
    const { trigger, menu, onSelect } = renderMenu();
    act(() => menu.showPopover());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move', hidden: true }));
    expect(menu.matches(':popover-open')).toBe(true);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate', hidden: true }));
    expect(onSelect.mock.calls).toEqual([['duplicate']]);
    expect(menu.matches(':popover-open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});

const countries = [
  { value: 'uz', label: 'Oʻzbekiston' },
  { value: 'kz', label: 'Qazaqstan' },
  { value: 'kg', label: 'Kyrgyzstan', disabled: true },
  { value: 'tj', label: 'Tojikiston' },
];

describe('Combobox', () => {
  it('is a labelled combobox that filters as you type, ignoring case and apostrophes', () => {
    render(
      <Field label="Country">
        <Combobox options={countries} />
      </Field>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    fireEvent.change(input, { target: { value: "o'zb" } });
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const options = screen.getAllByRole('option', { hidden: true });
    expect(options.map((o) => o.textContent)).toEqual(['Oʻzbekiston']);
    expect(input.getAttribute('aria-activedescendant')).toBe(options[0]!.id);
  });

  it('chooses with the keyboard, skipping disabled options, and submits the value', () => {
    const onValueChange = vi.fn<(v: string) => void>();
    const { container } = render(
      <Combobox aria-label="Country" name="country" options={countries} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('combobox', { name: 'Country' }) as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // opens on the first option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // past disabled Kyrgyzstan
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('tj');
    expect(input.value).toBe('Tojikiston');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('tj');
  });

  it('shows every option when reopened, and marks the chosen one', () => {
    render(<Combobox aria-label="Country" options={countries} defaultValue="kz" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Qazaqstan');
    fireEvent.click(input);
    const options = screen.getAllByRole('option', { hidden: true });
    expect(options).toHaveLength(4);
    expect(options[1]!.getAttribute('aria-selected')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1]!.id);
  });

  it('undoes unmatched text on blur and says when nothing matches', () => {
    const onValueChange = vi.fn<(v: string) => void>();
    render(
      <Combobox aria-label="Country" options={countries} defaultValue="uz" onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('No matches')).toBeTruthy();
    fireEvent.blur(input);
    expect(input.value).toBe('Oʻzbekiston');
    // Typing a full label and leaving counts as choosing it.
    fireEvent.change(input, { target: { value: 'tojikiston' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenCalledWith('tj');
    expect(input.value).toBe('Tojikiston');
  });
});
