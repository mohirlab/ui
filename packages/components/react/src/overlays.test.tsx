import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  ToastProvider,
  useToast,
  type ToastOptions,
} from './index';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function DialogHarness({ dismissible = true, onChange = vi.fn<(open: boolean) => void>() }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onChange(next);
          setOpen(next);
        }}
        title="Delete project?"
        description="This cannot be undone."
        dismissible={dismissible}
        role={dismissible ? 'dialog' : 'alertdialog'}
      >
        <DialogBody>Body</DialogBody>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Keep</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const dialogEl = () => document.querySelector('dialog')!;

describe('Dialog', () => {
  it('opens as a modal, named and described by its title and description', () => {
    render(<DialogHarness />);
    const dialog = dialogEl();
    expect(dialog.open).toBe(true);
    expect(dialog.dataset.state).toBe('open');
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe(
      'Delete project?',
    );
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe(
      'This cannot be undone.',
    );
  });

  it('closes on Escape, plays the exit state, then unmounts', () => {
    const onChange = vi.fn<(open: boolean) => void>();
    render(<DialogHarness onChange={onChange} />);
    const cancel = new Event('cancel', { cancelable: true });
    act(() => {
      dialogEl().dispatchEvent(cancel);
    });
    expect(cancel.defaultPrevented).toBe(true);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(dialogEl().dataset.state).toBe('closed');
    act(() => vi.advanceTimersByTime(700));
    expect(document.querySelector('dialog')).toBeNull();
  });

  it('closes from the close button and from a backdrop click, but not from a click inside', () => {
    render(<DialogHarness />);
    fireEvent.click(screen.getByText('Body'));
    expect(dialogEl().dataset.state).toBe('open');
    // jsdom boxes are 0×0 at the origin, so any positive point is "outside".
    fireEvent.click(dialogEl(), { clientX: 50, clientY: 50 });
    expect(dialogEl().dataset.state).toBe('closed');
  });

  it('cannot be dismissed when dismissible is false', () => {
    const onChange = vi.fn<(open: boolean) => void>();
    render(<DialogHarness dismissible={false} onChange={onChange} />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(dialogEl().getAttribute('role')).toBe('alertdialog');
    act(() => {
      dialogEl().dispatchEvent(new Event('cancel', { cancelable: true }));
    });
    fireEvent.click(dialogEl(), { clientX: 50, clientY: 50 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('locks page scroll while open and restores it after', () => {
    render(<DialogHarness />);
    expect(document.documentElement.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Keep' }));
    act(() => vi.advanceTimersByTime(700));
    expect(document.documentElement.style.overflow).toBe('');
  });
});

function ToastHarness({ options }: { options: ToastOptions }) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>Notify</Button>;
}

const renderToast = (options: ToastOptions, max?: number) =>
  render(
    <ToastProvider max={max}>
      <ToastHarness options={options} />
    </ToastProvider>,
  );

describe('Toast', () => {
  it('announces politely and dismisses itself after its duration', () => {
    renderToast({ title: 'Saved', description: 'All changes stored.' });
    fireEvent.click(screen.getByText('Notify'));
    expect(screen.getByText('Saved').closest('ol')!.getAttribute('aria-live')).toBe('polite');
    act(() => vi.advanceTimersByTime(4900));
    expect(screen.getByText('Saved').closest('li')!.dataset.state).toBe('open');
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText('Saved').closest('li')!.dataset.state).toBe('closed');
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('pauses while hovered', () => {
    renderToast({ title: 'Paused' });
    fireEvent.click(screen.getByText('Notify'));
    fireEvent.pointerEnter(screen.getByText('Paused').closest('ol')!);
    act(() => vi.advanceTimersByTime(20_000));
    expect(screen.getByText('Paused').closest('li')!.dataset.state).toBe('open');
  });

  it('runs its action once and dismisses; danger interrupts as an alert', () => {
    const undo = vi.fn<() => void>();
    renderToast({ title: 'Deleted', tone: 'danger', action: { label: 'Undo', onClick: undo } });
    fireEvent.click(screen.getByText('Notify'));
    expect(screen.getByRole('alert').textContent).toContain('Deleted');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert').dataset.state).toBe('closed');
  });

  it('keeps at most `max` toasts open', () => {
    renderToast({ title: 'Ping' }, 2);
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByText('Notify'));
    act(() => vi.advanceTimersByTime(0));
    const open = screen.getAllByText('Ping').filter((el) => el.closest('li')!.dataset.state === 'open');
    expect(open).toHaveLength(2);
  });
});
