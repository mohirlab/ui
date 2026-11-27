import { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  ThemeScope,
} from '@mohirlab/react';
import type { ThemeMode } from '@mohirlab/themes';
import { color } from '@mohirlab/tokens';
import * as styles from './app.css';

const ramps = ['ink', 'lapis', 'anor', 'jade', 'saffron'] as const;
const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

function Specimen({ mode }: { mode: ThemeMode }) {
  const [email, setEmail] = useState('usta@');
  const [saving, setSaving] = useState(false);
  const invalid = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <ThemeScope mode={mode} className={styles.pane}>
      <Stack gap="2">
        <Text variant="label" tone="subtle">
          Mohirlab · {mode} · v0.1
        </Text>
        <Heading level={1} variant="display">
          Made by hand, set in tokens.
        </Heading>
        <Text tone="muted" style={{ maxWidth: '52ch' }}>
          Warm paper and ink, a deep lapis accent, calm surfaces and a square seal that marks line.
        </Text>
      </Stack>

      <Stack gap="1.5">
        {ramps.map((ramp) => (
          <div key={ramp} className={styles.swatchRow} title={ramp}>
            {steps.map((step) => (
              <div key={step} className={styles.swatch} style={{ background: color[ramp][step] }} />
            ))}
          </div>
        ))}
      </Stack>

      <hr className={styles.rule} />

      <Stack gap="4">
        <Text variant="label" tone="subtle">
          Buttons
        </Text>
        <Stack direction="row" gap="3" wrap align="center">
          <Button>Publish</Button>
          <Button appearance="soft">Preview</Button>
          <Button appearance="outline">Duplicate</Button>
          <Button appearance="ghost">Cancel</Button>
        </Stack>
        <Stack direction="row" gap="3" wrap align="center">
          <Button tone="neutral">Archive</Button>
          <Button tone="neutral" appearance="outline">
            Export
          </Button>
          <Button tone="danger">Delete</Button>
          <Button tone="danger" appearance="soft">
            Revoke
          </Button>
        </Stack>
        <Stack direction="row" gap="3" wrap align="center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </Stack>
      </Stack>

      <Stack gap="4">
        <Text variant="label" tone="subtle">
          Stamps
        </Text>
        <Stack direction="row" gap="2" wrap>
          <Badge>Draft</Badge>
          <Badge tone="accent" seal>
            In review
          </Badge>
          <Badge tone="success" seal>
            Shipped
          </Badge>
          <Badge tone="warning">Rate limited</Badge>
          <Badge tone="danger" seal>
            Failed
          </Badge>
          <Badge tone="accent" solid>
            v0.1
          </Badge>
        </Stack>
      </Stack>

      <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '2' }} gap="5">
        <Card as="form" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
          <CardHeader>
            <Heading level={2} variant="subheading">
              Invite a maintainer
            </Heading>
            <Badge tone="neutral">2 of 5</Badge>
          </CardHeader>
          <Stack gap="4">
            <Field
              label="Email"
              hint="They get an invite link valid for 7 days."
              error={invalid ? 'Enter a full address, like name@domain.uz.' : undefined}
            >
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Note" optional>
              <Input placeholder="Why you're inviting them" />
            </Field>
            <Stack direction="row" gap="2" justify="flex-end">
              <Button appearance="ghost">Cancel</Button>
              <Button
                type="submit"
                loading={saving}
                onClick={() => {
                  setSaving(true);
                  setTimeout(() => setSaving(false), 1500);
                }}
              >
                Send invite
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Stack gap="5">
          <Card elevation="flat" padding="sm">
            <Stack direction="row" justify="space-between" align="baseline">
              <Text variant="label" tone="subtle">
                Weekly installs
              </Text>
              <Badge tone="success">+12.4%</Badge>
            </Stack>
            <Text variant="title" numeric>
              48,210
            </Text>
          </Card>
          <Card elevation="sunken" padding="sm">
            <Text variant="small" tone="muted">
              Sunken cards hold secondary content: empty states, previews, code.
            </Text>
            <Text variant="code" tone="accent">
              pnpm add @mohirlab/react
            </Text>
          </Card>
          <ThemeScope mode={mode === 'light' ? 'dark' : 'light'} style={{ borderRadius: 11, padding: 16 }}>
            <Stack gap="2">
              <Text variant="label" tone="subtle">
                Nested scope
              </Text>
              <Text variant="small">An inverted theme inside the page.</Text>
              <Stack direction="row" gap="2">
                <Button size="sm">Confirm</Button>
                <Button size="sm" appearance="outline">
                  Later
                </Button>
              </Stack>
            </Stack>
          </ThemeScope>
        </Stack>
      </Box>
    </ThemeScope>
  );
}

export function App() {
  return (
    <div className={styles.page}>
      <Specimen mode="light" />
      <Specimen mode="dark" />
    </div>
  );
}
