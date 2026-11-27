import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Field,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderValue,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@mohirlab/react';

const meta: Meta = { title: 'Components/Form controls' };
export default meta;
type Story = StoryObj;

export const Choices: Story = {
  render: function ChoicesStory() {
    const [all, setAll] = useState<boolean | 'some'>('some');
    return (
      <Stack gap="6" style={{ maxWidth: 420 }}>
        <Stack gap="3">
          <Checkbox
            label="Select all files"
            checked={all === true}
            indeterminate={all === 'some'}
            onChange={(e) => setAll(e.target.checked)}
            description="3 of 8 files chosen"
          />
          <Checkbox label="Send me a copy" defaultChecked />
          <Checkbox label="Disabled option" disabled />
          <Checkbox label="I accept the terms" invalid />
        </Stack>
        <Stack gap="3">
          <Switch label="Email receipts" defaultChecked description="One email per paid invoice." />
          <Switch label="Weekly summary" />
          <Switch label="Locked by admin" disabled defaultChecked />
        </Stack>
        <RadioGroup legend="Billing period" defaultValue="year" hint="You can change this any time.">
          <Radio value="month" label="Monthly" description="$12 per month" />
          <Radio value="year" label="Yearly" description="$120 per year, two months free" />
        </RadioGroup>
        <RadioGroup legend="Theme" defaultValue="auto" orientation="horizontal">
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
          <Radio value="auto" label="System" />
        </RadioGroup>
      </Stack>
    );
  },
};

export const SelectTextareaSlider: Story = {
  name: 'Select, Textarea, Slider',
  render: function Fields() {
    const [volume, setVolume] = useState(40);
    return (
      <Stack gap="5" style={{ maxWidth: 420 }}>
        <Field label="Country" hint="Used for tax on invoices.">
          <Select placeholder="Choose a country">
            <option value="uz">Uzbekistan</option>
            <option value="kz">Kazakhstan</option>
            <option value="tr">Türkiye</option>
          </Select>
        </Field>
        <Field label="Currency" error="Pick the currency you invoice in.">
          <Select placeholder="Choose a currency">
            <option>UZS</option>
            <option>USD</option>
          </Select>
        </Field>
        <Field label="About your studio" hint="Grows as you type (in browsers with CSS field-sizing).">
          <Textarea placeholder="We throw, glaze and fire small batches…" />
        </Field>
        <Field
          label={
            <Stack direction="row" justify="space-between" as="span">
              Volume <SliderValue>{volume}%</SliderValue>
            </Stack>
          }
        >
          <Slider value={volume} onValueChange={setVolume} format={(v) => `${v}%`} />
        </Field>
      </Stack>
    );
  },
};

/** A realistic settings card: for visual checks. */
export const SettingsCard: Story = {
  name: 'Open: settings card',
  render: () => (
    <Card style={{ maxWidth: 520 }}>
      <CardHeader>
        <Heading level={2} variant="subheading">
          Notifications
        </Heading>
      </CardHeader>
      <Stack gap="5">
        <Stack gap="3">
          <Switch label="Payment received" defaultChecked description="A short email when a client pays." />
          <Switch label="Invoice overdue" defaultChecked />
          <Switch label="Product news" />
        </Stack>
        <RadioGroup legend="Digest" defaultValue="weekly" orientation="horizontal">
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
          <Radio value="never" label="Never" />
        </RadioGroup>
        <Field label="Send from">
          <Select defaultValue="billing">
            <option value="billing">billing@usta.uz</option>
            <option value="hello">hello@usta.uz</option>
          </Select>
        </Field>
        <Field label="Signature" optional>
          <Textarea defaultValue={'Rahmat,\nUsta Studio'} />
        </Field>
        <Checkbox
          label="Also send to my accountant"
          description="accounts@ledger.uz gets a copy of every invoice."
        />
        <Stack direction="row" justify="flex-end" gap="2">
          <Button appearance="ghost" tone="neutral">
            Cancel
          </Button>
          <Button>Save</Button>
        </Stack>
        <Text variant="small" tone="subtle">
          Switches apply straight away; the rest saves with the button.
        </Text>
      </Stack>
    </Card>
  ),
};
