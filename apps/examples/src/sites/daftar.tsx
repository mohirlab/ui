import { useState } from 'react';
import { iconArrowDown, iconArrowUp, iconDownload, iconInfo, iconPlus, iconTrash } from '@mohirlab/icons';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  Field,
  Heading,
  Icon,
  Input,
  Select,
  Switch,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@mohirlab/react';
import { vars } from '@mohirlab/themes';
import { SiteBar } from '../site-bar';
import * as s from '../shell.css';

const stats = [
  { label: 'Revenue', value: '$48,210', change: +12.4, hint: 'Paid invoices this month' },
  { label: 'Outstanding', value: '$6,920', change: -3.1, hint: 'Sent, not yet paid' },
  { label: 'Clients', value: '128', change: +4.0, hint: 'Billed at least once this year' },
  { label: 'Avg. days to pay', value: '11.6', change: -1.8, hint: 'Lower is better' },
];

const activity = [
  {
    who: 'Madina Karimova',
    what: 'paid invoice #2041',
    amount: '$1,200',
    tone: 'success' as const,
    status: 'Paid',
  },
  {
    who: 'Usta Atelier',
    what: 'was sent invoice #2042',
    amount: '$3,480',
    tone: 'accent' as const,
    status: 'Sent',
  },
  {
    who: 'Jerome Bell',
    what: 'invoice #2036 is 9 days late',
    amount: '$640',
    tone: 'danger' as const,
    status: 'Overdue',
  },
  {
    who: 'Ali Valiyev',
    what: 'drafted invoice #2043',
    amount: '$910',
    tone: 'neutral' as const,
    status: 'Draft',
  },
];

function Stat({ label, value, change, hint }: (typeof stats)[number]) {
  const good = label.startsWith('Avg') || label === 'Outstanding' ? change < 0 : change > 0;
  return (
    <Card padding="sm" elevation="flat">
      <Stack direction="row" justify="space-between" align="center">
        <Text variant="small" tone="muted">
          {label}
        </Text>
        <Tooltip content={hint}>
          <Button appearance="ghost" tone="neutral" size="sm" iconOnly aria-label={`About ${label}`}>
            <Icon icon={iconInfo} size={16} />
          </Button>
        </Tooltip>
      </Stack>
      <Text variant="title" numeric>
        {value}
      </Text>
      <Badge tone={good ? 'success' : 'danger'} style={{ alignSelf: 'flex-start', marginTop: 8 }}>
        <Icon icon={change > 0 ? iconArrowUp : iconArrowDown} size={12} />
        {Math.abs(change)}% vs last month
      </Badge>
    </Card>
  );
}

function Settings() {
  const { toast } = useToast();
  const [name, setName] = useState('Usta Studio');
  const [email, setEmail] = useState('billing@usta.uz');
  const nameError = name.trim().length < 2 ? 'Use at least 2 characters.' : undefined;
  const emailError = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? undefined : 'Enter a full address.';
  const [saving, setSaving] = useState(false);

  return (
    <Card>
      <CardHeader>
        <Heading level={2} variant="subheading">
          Workspace
        </Heading>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nameError || emailError) return;
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            toast({ title: 'Settings saved', tone: 'success' });
          }, 900);
        }}
      >
        <Stack gap="4">
          <Field label="Studio name" error={nameError}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Billing email" hint="Invoices and receipts are sent here." error={emailError}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Currency">
            <Select defaultValue="uzs">
              <option value="uzs">UZS · Uzbek soʻm</option>
              <option value="usd">USD · US dollar</option>
              <option value="eur">EUR · Euro</option>
            </Select>
          </Field>
          <Field label="VAT number" optional>
            <Input placeholder="UZ 000 000 000" />
          </Field>
          <Stack gap="3">
            <Switch
              label="Email clients a receipt"
              defaultChecked
              description="Sent when an invoice is paid."
            />
            <Switch label="Remind overdue clients" defaultChecked />
          </Stack>
          <Stack direction="row" justify="flex-end" gap="2">
            <Button type="submit" loading={saving} disabled={Boolean(nameError || emailError)}>
              Save changes
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}

function DangerZone() {
  const { open, setOpen, onOpen, onClose } = useDisclosure();
  const { toast } = useToast();
  return (
    <Card
      elevation="flat"
      style={{ boxShadow: `0 0 0 1px color-mix(in oklch, ${vars.color.danger} 35%, transparent)` }}
    >
      <Stack
        direction={{ mobile: 'column', tablet: 'row' }}
        justify="space-between"
        align={{ mobile: 'flex-start', tablet: 'center' }}
        gap="4"
      >
        <Stack gap="1">
          <Heading level={2} variant="subheading">
            Delete workspace
          </Heading>
          <Text variant="small" tone="muted">
            Removes all invoices, clients and history. This cannot be undone.
          </Text>
        </Stack>
        <Button tone="danger" appearance="soft" start={<Icon icon={iconTrash} />} onClick={onOpen}>
          Delete workspace
        </Button>
      </Stack>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        dismissible={false}
        size="sm"
        title="Delete “Usta Studio”?"
        description="All 2,043 invoices and 128 clients will be removed permanently."
      >
        <DialogActions>
          <Button appearance="outline" tone="neutral" onClick={onClose}>
            Keep workspace
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              onClose();
              toast({ title: 'Nothing was deleted', description: 'This is an example.', tone: 'warning' });
            }}
          >
            Delete forever
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export function Daftar() {
  return (
    <>
      <SiteBar
        name="Daftar"
        nav={
          <>
            <a className={s.navLink} href="#/daftar" aria-current="page">
              Overview
            </a>
            <a className={s.navLink} href="#/daftar">
              Invoices
            </a>
            <a className={s.navLink} href="#/daftar">
              Clients
            </a>
          </>
        }
        actions={<Avatar name="Otabek" size="sm" />}
      />
      <main className={s.container} style={{ paddingBlock: 32 }}>
        <Stack
          direction={{ mobile: 'column', tablet: 'row' }}
          justify="space-between"
          align={{ mobile: 'flex-start', tablet: 'flex-end' }}
          gap="4"
          marginBottom="6"
        >
          <Stack gap="1">
            <Text variant="label" tone="subtle">
              November 2026
            </Text>
            <Heading level={1} variant="title">
              Good morning, Otabek
            </Heading>
          </Stack>
          <Stack direction="row" gap="2">
            <Button appearance="outline" tone="neutral" start={<Icon icon={iconDownload} />}>
              Export
            </Button>
            <Button start={<Icon icon={iconPlus} />}>New invoice</Button>
          </Stack>
        </Stack>

        <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '2', desktop: '4' }} gap="4">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ mobile: '1', desktop: '2' }}
          gap="5"
          marginTop="6"
          alignItems="flex-start"
        >
          <Card>
            <CardHeader>
              <Heading level={2} variant="subheading">
                Recent activity
              </Heading>
              <Button size="sm" appearance="ghost">
                View all
              </Button>
            </CardHeader>
            <Stack gap="4">
              {activity.map((item) => (
                <Stack key={item.what} direction="row" gap="3" align="center">
                  <Avatar name={item.who} size="sm" />
                  <Stack gap="0" style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="small" style={{ fontWeight: 600 }}>
                      {item.who}
                    </Text>
                    <Text variant="small" tone="muted">
                      {item.what}
                    </Text>
                  </Stack>
                  <Stack gap="1" align="flex-end">
                    <Text variant="small" numeric style={{ fontWeight: 600 }}>
                      {item.amount}
                    </Text>
                    <Badge tone={item.tone} seal>
                      {item.status}
                    </Badge>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>
          <Stack gap="5">
            <Settings />
            <DangerZone />
          </Stack>
        </Box>
      </main>
    </>
  );
}
