import { artwork, toDataUri, type ArtworkKind, type PaletteName } from '@mohirlab/assets';
import { iconArrowRight } from '@mohirlab/icons';
import { Badge, Box, Card, CardMedia, Heading, Icon, Stack, Text } from '@mohirlab/react';
import { ThemeToggle } from './site-bar';
import * as s from './shell.css';

const examples: Array<{
  id: string;
  name: string;
  kind: string;
  description: string;
  art: { kind: ArtworkKind; palette: PaletteName };
  shows: string[];
}> = [
  {
    id: 'karvon',
    name: 'Karvon',
    kind: 'Community app',
    description:
      'A feed of posts, meetups and makers’ goods. Sidebar on desktop, bottom navigation on phones.',
    art: { kind: 'dunes', palette: 'jade' },
    shows: ['Avatar', 'CardMedia', 'Dialog sheet', 'Toast', 'Popover'],
  },
  {
    id: 'academy',
    name: 'Usta Academy',
    kind: 'Marketing site',
    description: 'A landing page for a course platform: hero, catalogue, pricing, voices, newsletter.',
    art: { kind: 'horizon', palette: 'dusk' },
    shows: ['Typography', 'Card', 'Badge', 'Field', 'Button'],
  },
  {
    id: 'daftar',
    name: 'Daftar',
    kind: 'SaaS dashboard',
    description:
      'Accounts for small studios: numbers at a glance, recent activity, settings and a danger zone.',
    art: { kind: 'tiles', palette: 'lapis' },
    shows: ['Stats', 'Settings form', 'Alert dialog', 'Tooltip', 'Toast'],
  },
];

export function Home() {
  return (
    <div className={s.container} style={{ paddingBlock: 48 }}>
      <Stack direction="row" justify="space-between" align="flex-start" gap="4">
        <Stack gap="3" style={{ maxWidth: 640 }}>
          <Text variant="label" tone="accent">
            Mohirlab · Examples
          </Text>
          <Heading level={1} variant="display">
            One system, three very different products.
          </Heading>
          <Text tone="muted">
            Every screen here is built only from Mohirlab tokens, components, icons and generated imagery.
            Open one, resize the window down to phone width, and flip the theme.
          </Text>
        </Stack>
        <ThemeToggle />
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns={{ mobile: '1', tablet: '2', desktop: '3' }}
        gap="5"
        marginTop="10"
      >
        {examples.map((example) => (
          <a key={example.id} href={`#/${example.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card padding="sm" style={{ height: '100%' }}>
              <CardMedia
                src={toDataUri(artwork(example.id, { ...example.art, width: 720, height: 450 }))}
                ratio={16 / 10}
              />
              <Stack gap="2">
                <Text variant="label" tone="subtle">
                  {example.kind}
                </Text>
                <Stack direction="row" justify="space-between" align="center">
                  <Heading level={2} variant="heading">
                    {example.name}
                  </Heading>
                  <Icon icon={iconArrowRight} />
                </Stack>
                <Text variant="small" tone="muted">
                  {example.description}
                </Text>
                <Stack direction="row" gap="1.5" wrap marginTop="2">
                  {example.shows.map((name) => (
                    <Badge key={name}>{name}</Badge>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </a>
        ))}
      </Box>
    </div>
  );
}
