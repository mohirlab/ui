import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, Avatar, Badge, Stack, Table, Td, Text, Th } from '@mohirlab/react';

const meta: Meta = { title: 'Components/Accordion & Table' };
export default meta;
type Story = StoryObj;

export const AccordionStory: Story = {
  name: 'Accordion',
  render: () => (
    <Stack gap="2" style={{ maxWidth: 560 }}>
      <Accordion type="single">
        <AccordionItem title="Can I cancel any time?" defaultOpen>
          Yes. Your plan runs to the end of the period you paid for, then stops. No questions.
        </AccordionItem>
        <AccordionItem title="Do I keep what I made?">
          Always. Projects, downloads and certificates stay yours after you cancel.
        </AccordionItem>
        <AccordionItem title="Is there a discount for students?">
          Half price with a valid student email.
        </AccordionItem>
      </Accordion>
      <Text variant="small" tone="subtle">
        type=&quot;single&quot;: opening one closes the others. Find-in-page (Ctrl+F) opens a matching item.
      </Text>
    </Stack>
  ),
};

const rows = [
  {
    id: '#2041',
    client: 'Madina Karimova',
    date: 'Nov 24',
    amount: '$1,200.00',
    status: ['Paid', 'success'],
  },
  { id: '#2042', client: 'Usta Atelier', date: 'Nov 25', amount: '$3,480.00', status: ['Sent', 'accent'] },
  { id: '#2036', client: 'Jerome Bell', date: 'Nov 15', amount: '$640.00', status: ['Overdue', 'danger'] },
  { id: '#2043', client: 'Ali Valiyev', date: 'Nov 26', amount: '$910.00', status: ['Draft', 'neutral'] },
] as const;

export const TableStory: Story = {
  name: 'Table',
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <Table caption="Invoices" stickyFirstColumn>
        <thead>
          <tr>
            <Th>Invoice</Th>
            <Th>Client</Th>
            <Th>Issued</Th>
            <Th>Status</Th>
            <Th numeric>Amount</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td style={{ fontWeight: 600 }}>{row.id}</Td>
              <Td>
                <Stack direction="row" gap="2" align="center" as="span">
                  <Avatar name={row.client} size="xs" />
                  {row.client}
                </Stack>
              </Td>
              <Td>{row.date}</Td>
              <Td>
                <Badge tone={row.status[1]} seal>
                  {row.status[0]}
                </Badge>
              </Td>
              <Td numeric>{row.amount}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ),
};
