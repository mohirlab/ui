import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { iconCopy, iconEdit, iconLink, iconMoreHorizontal, iconShare, iconTrash } from '@mohirlab/icons';
import {
  Button,
  Combobox,
  Field,
  Icon,
  Menu,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  Stack,
  Text,
  type ComboboxOption,
} from '@mohirlab/react';

const meta: Meta = { title: 'Components/Menu & Combobox' };
export default meta;
type Story = StoryObj;

function RowActions({ openOnLoad = false }: { openOnLoad?: boolean }) {
  useEffect(() => {
    if (openOnLoad) document.querySelector<HTMLElement>('[role="menu"]')?.showPopover();
  }, [openOnLoad]);
  return (
    <Menu
      trigger={
        <Button appearance="outline" tone="neutral" end={<Icon icon={iconMoreHorizontal} />}>
          Actions
        </Button>
      }
    >
      <MenuItem icon={iconEdit} shortcut="R">
        Rename
      </MenuItem>
      <MenuItem icon={iconCopy} shortcut="⌘D">
        Duplicate
      </MenuItem>
      <MenuItem icon={iconLink}>Copy link</MenuItem>
      <MenuItem icon={iconShare} disabled>
        Share (owners only)
      </MenuItem>
      <MenuSeparator />
      <MenuGroup label="Danger zone">
        <MenuItem icon={iconTrash} tone="danger">
          Delete
        </MenuItem>
      </MenuGroup>
    </Menu>
  );
}

export const MenuStory: Story = {
  name: 'Menu',
  render: () => (
    <Stack gap="4">
      <Text variant="small" tone="muted">
        Arrow keys move, Home and End jump, typing a letter finds an item. Escape closes and returns focus.
      </Text>
      <RowActions />
    </Stack>
  ),
};

/** Opens on load: for visual checks. */
export const OpenMenu: Story = {
  name: 'Open: menu',
  render: () => (
    <div style={{ paddingTop: 24, paddingLeft: 120, minHeight: 360 }}>
      <RowActions openOnLoad />
    </div>
  ),
};

const people: ComboboxOption[] = [
  { value: 'madina', label: 'Madina Karimova', description: 'Design' },
  { value: 'jerome', label: 'Jerome Bell', description: 'Engineering' },
  { value: 'ali', label: 'Ali Valiyev', description: 'Finance' },
  { value: 'oybek', label: 'Oʻybek Toshmatov', description: 'Engineering' },
  { value: 'zarina', label: 'Zarina Yusupova', description: 'Support' },
  { value: 'kamila', label: 'Kamila Rahimova', description: 'Design', disabled: true },
  { value: 'timur', label: 'Timur Saidov', description: 'Sales' },
  { value: 'nodira', label: 'Nodira Ismoilova', description: 'Engineering' },
];

export const ComboboxStory: Story = {
  name: 'Combobox',
  render: function ComboboxDemo() {
    const [owner, setOwner] = useState('');
    return (
      <Stack gap="5" style={{ maxWidth: 360 }}>
        <Field label="Owner" hint="Type a name or a team. Accents and apostrophes are ignored.">
          <Combobox options={people} value={owner} onValueChange={setOwner} placeholder="Search people" />
        </Field>
        <Text variant="small" tone="muted">
          Chosen: {owner || 'nobody'}
        </Text>
        <Field label="Reviewer" error="Choose a reviewer.">
          <Combobox options={people} placeholder="Search people" size="sm" />
        </Field>
        <Field label="Disabled">
          <Combobox options={people} defaultValue="ali" disabled />
        </Field>
      </Stack>
    );
  },
};

/** Opens on load with a query typed: for visual checks of filtering and the active option. */
export const OpenCombobox: Story = {
  name: 'Open: combobox',
  render: function OpenComboboxDemo() {
    useEffect(() => {
      const input = document.querySelector<HTMLInputElement>('[role="combobox"]');
      if (!input) return;
      input.focus();
      // React's onChange listens for native input events; set the value the way typing does.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'eng');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, []);
    return (
      <div style={{ maxWidth: 360, minHeight: 320 }}>
        <Field label="Owner">
          <Combobox options={people} defaultValue="jerome" placeholder="Search people" />
        </Field>
      </div>
    );
  },
};
