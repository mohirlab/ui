import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input, Stack } from '@mohirlab/react';

const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    label: 'Email',
    hint: 'We’ll send a sign-in link.',
    error: '',
    optional: false,
    disabled: false,
    children: null,
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Field {...args} error={args.error || undefined}>
        <Input type="email" placeholder="name@domain.uz" />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="5" style={{ maxWidth: 360 }}>
      <Field label="Default">
        <Input placeholder="Placeholder" />
      </Field>
      <Field label="Invalid" error="Enter a full address, like name@domain.uz.">
        <Input defaultValue="usta@" />
      </Field>
      <Field label="Optional" optional hint="Shown on your public profile.">
        <Input />
      </Field>
      <Field label="Read only">
        <Input readOnly defaultValue="mohirlab" />
      </Field>
      <Field label="Disabled" disabled>
        <Input defaultValue="Not editable" />
      </Field>
      <Stack direction="row" gap="2" align="flex-end">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Field key={size} label={size}>
            <Input size={size} placeholder={size} />
          </Field>
        ))}
      </Stack>
    </Stack>
  ),
};
