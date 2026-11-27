import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { iconCheck, iconTrash } from '@mohirlab/icons';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  Field,
  Icon,
  Input,
  Stack,
  Text,
  ToastProvider,
  useDisclosure,
  useToast,
  type ToastTone,
} from '@mohirlab/react';

const meta: Meta = { title: 'Components/Overlays' };
export default meta;
type Story = StoryObj;

function Demo({
  label,
  placement,
  size,
  initialOpen = false,
}: {
  label: string;
  initialOpen?: boolean;
  placement?: 'auto' | 'center' | 'sheet';
  size?: 'sm' | 'md' | 'lg';
}) {
  const { open, setOpen, onOpen, onClose } = useDisclosure(initialOpen);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={onOpen}>
        {label}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        placement={placement}
        size={size}
        title="Rename workspace"
        description="The new name shows everywhere your team sees this workspace."
      >
        <DialogBody>
          <Field label="Workspace name" hint="Up to 40 characters.">
            <Input defaultValue="Usta atelier" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button appearance="ghost" tone="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save name</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const Dialogs: Story = {
  render: () => (
    <Stack gap="4">
      <Text tone="muted" variant="small">
        <code>auto</code> is a bottom sheet on phones and a centered dialog from tablet up. Switch the
        viewport to Phone to compare. On a sheet, drag the handle down to dismiss.
      </Text>
      <Stack direction="row" gap="3" wrap>
        <Demo label="Auto (default)" />
        <Demo label="Centered" placement="center" />
        <Demo label="Sheet" placement="sheet" />
        <Demo label="Large, centered" placement="center" size="lg" />
      </Stack>
    </Stack>
  ),
};

export const Confirmation: Story = {
  name: 'Destructive confirmation',
  render: function Confirm() {
    const { open, setOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button tone="danger" appearance="soft" start={<Icon icon={iconTrash} />} onClick={onOpen}>
          Delete project
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          role="alertdialog"
          dismissible={false}
          size="sm"
          title="Delete “Usta atelier”?"
          description="All 214 files and their history are removed. This cannot be undone."
        >
          <DialogActions>
            <Button appearance="outline" tone="neutral" onClick={onClose}>
              Keep project
            </Button>
            <Button tone="danger" onClick={onClose}>
              Delete forever
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

const samples: Record<ToastTone, { title: string; description?: string }> = {
  neutral: { title: 'Link copied' },
  accent: { title: 'New version available', description: 'Reload to get 0.2.0.' },
  success: { title: 'Invite sent', description: 'madina@example.com will get an email shortly.' },
  warning: { title: 'Storage almost full', description: '92% of 10 GB used.' },
  danger: { title: 'Payment failed', description: 'The card was declined. Nothing was charged.' },
};

function ToastButtons() {
  const { toast } = useToast();
  return (
    <Stack direction="row" gap="2" wrap>
      {(Object.keys(samples) as ToastTone[]).map((tone) => (
        <Button
          key={tone}
          appearance="outline"
          tone="neutral"
          onClick={() => toast({ ...samples[tone], tone })}
        >
          {tone}
        </Button>
      ))}
      <Button
        start={<Icon icon={iconCheck} />}
        onClick={() =>
          toast({
            title: '3 photos archived',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored 3 photos', tone: 'success' }) },
          })
        }
      >
        With undo
      </Button>
    </Stack>
  );
}

export const Toasts: Story = {
  decorators: [(Story) => <ToastProvider>{Story()}</ToastProvider>],
  render: () => (
    <Stack gap="4">
      <Text tone="muted" variant="small">
        Toasts pause while hovered or focused, stack up to three, and danger interrupts screen readers.
      </Text>
      <ToastButtons />
    </Stack>
  ),
};

/** Opens on load: for visual checks of the centered dialog. */
export const OpenCentered: Story = {
  name: 'Open: centered',
  render: () => <Demo label="Rename" placement="center" initialOpen />,
};

/** Opens on load: for visual checks of the bottom sheet. */
export const OpenSheet: Story = {
  name: 'Open: sheet',
  render: () => <Demo label="Rename" placement="sheet" initialOpen />,
};

function ToastStack() {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: 'Invite sent',
      description: 'madina@example.com will get an email shortly.',
      tone: 'success',
      duration: Infinity,
    });
    toast({ title: '3 photos archived', action: { label: 'Undo', onClick: () => {} }, duration: Infinity });
    toast({
      title: 'Payment failed',
      description: 'The card was declined. Nothing was charged.',
      tone: 'danger',
      duration: Infinity,
    });
  }, [toast]);
  return <Text tone="muted">Three toasts, shown on load.</Text>;
}

/** Shows a stack on load: for visual checks. */
export const OpenToasts: Story = {
  name: 'Open: toasts',
  decorators: [(Story) => <ToastProvider>{Story()}</ToastProvider>],
  render: () => <ToastStack />,
};
