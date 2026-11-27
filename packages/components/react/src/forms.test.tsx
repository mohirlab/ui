import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox, Field, Radio, RadioGroup, Select, Slider, Switch, Textarea } from './index';

afterEach(cleanup);

describe('Select and Textarea inside Field', () => {
  it('pick up the label, hint, error and required state', () => {
    render(
      <>
        <Field label="Country" hint="Where you pay tax." error="Choose one." required>
          <Select placeholder="Choose a country">
            <option value="uz">Uzbekistan</option>
          </Select>
        </Field>
        <Field label="Bio">
          <Textarea />
        </Field>
      </>,
    );
    const select = screen.getByLabelText('Country') as HTMLSelectElement;
    expect(select.required).toBe(true);
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.getAttribute('aria-describedby')!.split(' ')).toHaveLength(2);
    expect(select.value).toBe('');
    expect((select.options[0] as HTMLOptionElement).disabled).toBe(true);
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA');
  });
});

describe('Checkbox', () => {
  it('is a labelled native checkbox and reflects indeterminate', () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate description="3 of 8 chosen" />);
    const box = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(document.getElementById(box.getAttribute('aria-describedby')!)!.textContent).toBe('3 of 8 chosen');
    rerender(<Checkbox label="Select all" />);
    expect(box.indeterminate).toBe(false);
    fireEvent.click(screen.getByText('Select all'));
    expect(box.checked).toBe(true);
  });
});

describe('Switch', () => {
  it('is announced as a switch and toggles from its label', () => {
    const onChange = vi.fn<() => void>();
    render(<Switch label="Email receipts" onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: 'Email receipts' }) as HTMLInputElement;
    fireEvent.click(screen.getByText('Email receipts'));
    expect(toggle.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('RadioGroup', () => {
  it('names the group, shares a name and reports the chosen value', () => {
    const onValueChange = vi.fn<(value: string) => void>();
    render(
      <RadioGroup legend="Plan" defaultValue="usta" onValueChange={onValueChange} error="Pick a plan">
        <Radio value="starter" label="Starter" />
        <Radio value="usta" label="Usta" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group.getAttribute('aria-describedby')).toBeTruthy();
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const [starter, usta] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(starter!.name).toBe(usta!.name);
    expect(usta!.checked).toBe(true);
    fireEvent.click(screen.getByText('Starter'));
    expect(onValueChange).toHaveBeenCalledWith('starter');
  });
});

describe('Slider', () => {
  it('fills the track to its value and reports changes with a text value', () => {
    const onValueChange = vi.fn<(value: number) => void>();
    render(
      <Slider aria-label="Volume" defaultValue={25} onValueChange={onValueChange} format={(v) => `${v}%`} />,
    );
    const slider = screen.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
    expect(slider.getAttribute('aria-valuetext')).toBe('25%');
    expect(slider.getAttribute('style')).toContain('25%');
    fireEvent.change(slider, { target: { value: '60' } });
    expect(onValueChange).toHaveBeenCalledWith(60);
    expect(slider.getAttribute('aria-valuetext')).toBe('60%');
  });
});
