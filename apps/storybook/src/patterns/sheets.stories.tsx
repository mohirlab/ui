import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { iconCheck, iconCopy, iconLink, iconMail, iconSend, iconShare, iconUsers } from '@mohirlab/icons';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogBody,
  Icon,
  Input,
  Stack,
  Text,
  ToastProvider,
  useToast,
} from '@mohirlab/react';

const meta: Meta = {
  title: 'Patterns/Sheets',
  parameters: { viewport: { defaultViewport: 'phone' } },
  globals: { viewport: { value: 'phone', isRotated: false } },
  decorators: [(Story) => <ToastProvider>{Story()}</ToastProvider>],
};
export default meta;
type Story = StoryObj;

const people = ['Madina Karimova', 'Ali Valiyev', 'Courtney Henry', 'Jerome Bell'];
const targets = [
  { icon: iconMail, label: 'Email' },
  { icon: iconSend, label: 'Message' },
  { icon: iconUsers, label: 'Team' },
  { icon: iconLink, label: 'Link' },
];

function ShareSheet() {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const link = 'https://example.com/p/usta-42';
  return (
    <>
      <Button start={<Icon icon={iconShare} />} onClick={() => setOpen(true)}>
        Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen} placement="sheet" title="Share “Dunes at dusk”">
        <DialogBody>
          <Stack gap="5">
            <Stack direction="row" gap="4" style={{ overflowX: 'auto' }}>
              {people.map((name) => (
                <Stack
                  key={name}
                  as="button"
                  gap="1.5"
                  align="center"
                  background="transparent"
                  borderStyle="none"
                  cursor="pointer"
                  style={{ font: 'inherit', color: 'inherit', width: 64, flexShrink: 0 }}
                  onClick={() => {
                    setOpen(false);
                    toast({ title: `Sent to ${name.split(' ')[0]}`, tone: 'success' });
                  }}
                >
                  <Avatar name={name} size="lg" />
                  <Text variant="small" style={{ textAlign: 'center' }}>
                    {name.split(' ')[0]}
                  </Text>
                </Stack>
              ))}
            </Stack>
            <Box display="grid" gridTemplateColumns="4" gap="2">
              {targets.map(({ icon, label }) => (
                <Button
                  key={label}
                  appearance="soft"
                  tone="neutral"
                  size="lg"
                  style={{ height: 'auto', paddingBlock: 12 }}
                >
                  <Stack gap="1.5" align="center">
                    <Icon icon={icon} size={22} />
                    <Text as="span" variant="label">
                      {label}
                    </Text>
                  </Stack>
                </Button>
              ))}
            </Box>
            <Stack direction="row" gap="2">
              <Input readOnly value={link} aria-label="Share link" />
              <Button
                tone="neutral"
                start={<Icon icon={copied ? iconCheck : iconCopy} />}
                onClick={() => {
                  void navigator.clipboard?.writeText(link);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Stack>
          </Stack>
        </DialogBody>
      </Dialog>
    </>
  );
}

export const Share: Story = { render: () => <ShareSheet /> };
