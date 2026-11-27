import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Popover, Tooltip } from './index';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Popover', () => {
  it('wires the trigger to the popover and anchors one to the other', () => {
    render(
      <Popover trigger={<Button>Filters</Button>} title="Filter posts">
        Body
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Filters' });
    const panel = document.getElementById(trigger.getAttribute('popovertarget')!)!;
    expect(panel.getAttribute('popover')).toBe('auto');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(document.getElementById(panel.getAttribute('aria-labelledby')!)!.textContent).toBe('Filter posts');
    // Same anchor name on both ends, unique per instance.
    const name = trigger.style.getPropertyValue('anchor-name');
    expect(name).toMatch(/^--ml-anchor-/);
    expect(panel.style.getPropertyValue('position-anchor')).toBe(name);
  });

  it('reports opening and closing, including light dismiss', () => {
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(
      <Popover trigger={<Button>Info</Button>} onOpenChange={onOpenChange}>
        Body
      </Popover>,
    );
    const panel = screen.getByText('Body');
    act(() => panel.showPopover());
    act(() => panel.hidePopover());
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });
});

const setup = () =>
  render(
    <Tooltip content="Copy the link">
      <Button iconOnly aria-label="Copy">
        C
      </Button>
    </Tooltip>,
  );

describe('Tooltip', () => {
  it('describes its trigger and shows on focus straight away', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Copy' });
    const tip = screen.getByRole('tooltip', { hidden: true });
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id);
    fireEvent.focus(trigger);
    act(() => vi.advanceTimersByTime(0));
    expect(tip.matches(':popover-open')).toBe(true);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(tip.matches(':popover-open')).toBe(false);
  });

  it('waits for the hover delay and cancels when the pointer leaves first', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Copy' });
    const tip = screen.getByRole('tooltip', { hidden: true });
    fireEvent.pointerEnter(trigger);
    act(() => vi.advanceTimersByTime(300));
    fireEvent.pointerLeave(trigger);
    act(() => vi.advanceTimersByTime(500));
    expect(tip.matches(':popover-open')).toBe(false);
    fireEvent.pointerEnter(trigger);
    act(() => vi.advanceTimersByTime(400));
    expect(tip.matches(':popover-open')).toBe(true);
  });
});
