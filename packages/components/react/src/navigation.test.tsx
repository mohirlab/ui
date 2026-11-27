import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { iconBell, iconHome } from '@mohirlab/icons';
import {
  BottomNav,
  BottomNavItem,
  Breadcrumbs,
  SegmentedControl,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from './index';

afterEach(cleanup);

const setup = (onValueChange = vi.fn<(v: string) => void>()) =>
  render(
    <Tabs defaultValue="all" onValueChange={onValueChange}>
      <TabList aria-label="Invoices">
        <Tab value="all">All</Tab>
        <Tab value="paid">Paid</Tab>
        <Tab value="draft" disabled>
          Draft
        </Tab>
        <Tab value="overdue">Overdue</Tab>
      </TabList>
      <TabPanel value="all">All invoices</TabPanel>
      <TabPanel value="paid">Paid invoices</TabPanel>
      <TabPanel value="overdue">Overdue invoices</TabPanel>
    </Tabs>,
  );

describe('Tabs', () => {
  it('links tabs and panels both ways and shows only the selected panel', () => {
    setup();
    const all = screen.getByRole('tab', { name: 'All' });
    const panel = screen.getByRole('tabpanel', { name: 'All' });
    expect(all.getAttribute('aria-selected')).toBe('true');
    expect(all.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.textContent).toBe('All invoices');
    expect(screen.queryByRole('tabpanel', { name: 'Paid' })).toBeNull();
  });

  it('uses a roving tabindex and moves with arrows, Home and End, skipping disabled tabs', () => {
    const onValueChange = vi.fn<(v: string) => void>();
    setup(onValueChange);
    const [all, paid, , overdue] = screen.getAllByRole('tab');
    expect([all, paid, overdue].map((t) => t!.tabIndex)).toEqual([0, -1, -1]);
    all!.focus();
    fireEvent.keyDown(all!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(paid);
    expect(paid!.getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(paid!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(overdue); // "Draft" is disabled
    fireEvent.keyDown(overdue!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(all); // wraps
    fireEvent.keyDown(all!, { key: 'End' });
    expect(document.activeElement).toBe(overdue);
    fireEvent.keyDown(overdue!, { key: 'Home' });
    expect(document.activeElement).toBe(all);
    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(['paid', 'overdue', 'all', 'overdue', 'all']);
  });
});

describe('SegmentedControl', () => {
  it('is a named radio group of native radios', () => {
    const onValueChange = vi.fn<(v: string) => void>();
    render(
      <SegmentedControl
        aria-label="View"
        defaultValue="grid"
        onValueChange={onValueChange}
        options={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
        ]}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeTruthy();
    const list = screen.getByRole('radio', { name: 'List' }) as HTMLInputElement;
    fireEvent.click(list);
    expect(list.checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith('list');
  });
});

describe('BottomNav', () => {
  it('marks the current item and puts the badge count in the name', () => {
    render(
      <BottomNav aria-label="Main">
        <BottomNavItem icon={iconHome} label="Home" href="#home" current />
        <BottomNavItem icon={iconBell} label="Alerts" badge={3} onClick={() => {}} />
      </BottomNav>,
    );
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Alerts, 3' })).toBeTruthy();
  });
});

describe('Breadcrumbs', () => {
  it('links the trail, marks the current page and offers a back link to the parent', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: 'Usta Atelier', href: '/clients/usta' },
          { label: 'Invoice #2042' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.querySelector('[aria-current="page"]')!.textContent).toBe('Invoice #2042');
    const parentLinks = screen.getAllByRole('link', { name: /Usta Atelier/ });
    expect(parentLinks.map((a) => a.getAttribute('href'))).toEqual(['/clients/usta', '/clients/usta']);
  });
});
