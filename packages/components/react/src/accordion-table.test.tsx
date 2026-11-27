import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Accordion, AccordionItem, Table, Td, Th } from './index';

afterEach(cleanup);

describe('Accordion', () => {
  it('is native details/summary; single mode shares one name, multiple does not', () => {
    const { container, rerender } = render(
      <Accordion type="single">
        <AccordionItem title="Can I cancel?" defaultOpen>
          Any time.
        </AccordionItem>
        <AccordionItem title="Do I keep my work?">Always.</AccordionItem>
      </Accordion>,
    );
    const items = [...container.querySelectorAll('details')];
    expect(items).toHaveLength(2);
    expect(items[0]!.open).toBe(true);
    expect(items[0]!.getAttribute('name')).toBeTruthy();
    expect(items[0]!.getAttribute('name')).toBe(items[1]!.getAttribute('name'));
    expect(screen.getByText('Can I cancel?').closest('summary')).toBeTruthy();
    rerender(
      <Accordion>
        <AccordionItem title="A">a</AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector('details')!.hasAttribute('name')).toBe(false);
  });
});

describe('Table', () => {
  it('names the table with its caption, scopes headers and aligns numbers', () => {
    render(
      <Table caption="Invoices" hideCaption>
        <thead>
          <tr>
            <Th>Client</Th>
            <Th numeric>Amount</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Usta Atelier</Td>
            <Td numeric>$3,480</Td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Invoices' })).toBeTruthy();
    const amount = screen.getByRole('columnheader', { name: 'Amount' });
    expect(amount.getAttribute('scope')).toBe('col');
    expect(amount.className).toBe(screen.getByRole('cell', { name: '$3,480' }).className);
    // Nothing to scroll in jsdom, so no extra tab stop or region.
    expect(screen.queryByRole('region')).toBeNull();
  });
});
