import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconBookmark } from '@mohirlab/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Heading,
  Icon,
  Stack,
  Text,
  ThemeScope,
} from '@mohirlab/react';

const meta: Meta = { title: 'Components' };
export default meta;
type Story = StoryObj;

export const Badges: Story = {
  render: () => (
    <Stack gap="3">
      {[false, true].map((solid) => (
        <Stack key={String(solid)} direction="row" gap="2" wrap>
          {(['neutral', 'accent', 'success', 'warning', 'danger'] as const).map((tone) => (
            <Badge key={tone} tone={tone} solid={solid} seal={!solid}>
              {tone}
            </Badge>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Avatars: Story = {
  render: () => (
    <Stack gap="5">
      <Stack direction="row" gap="3" align="center">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar key={size} name="Courtney Henry" size={size} />
        ))}
        <Avatar name="Mohirlab" shape="square" size="lg" initials={false} />
      </Stack>
      <AvatarGroup total={2140} max={4}>
        {['Leslie Alexander', 'Jerome Bell', 'Courtney Henry', 'Madina Karimova', 'Ali Valiyev'].map(
          (name) => (
            <Avatar key={name} name={name} />
          ),
        )}
      </AvatarGroup>
      <Text variant="small" tone="muted">
        Broken photo URLs fall back to the generated tile:
      </Text>
      <Avatar name="Jerome Bell" src="https://example.invalid/broken.jpg" size="lg" />
    </Stack>
  ),
};

export const Cards: Story = {
  render: () => (
    <Stack direction="row" gap="5" wrap align="flex-start">
      <Card style={{ width: 320 }}>
        <CardMedia seed="dunes-card" artwork={{ kind: 'dunes', palette: 'lapis' }}>
          <Badge tone="accent" solid>
            New
          </Badge>
          <Button appearance="soft" tone="neutral" size="sm" iconOnly aria-label="Save">
            <Icon icon={iconBookmark} />
          </Button>
        </CardMedia>
        <Heading level={3}>Inset media</Heading>
        <Text tone="muted" variant="small">
          Media sits inside the card like a print on a mount.
        </Text>
      </Card>
      <Card style={{ width: 320 }} padding="none">
        <CardMedia seed="bleed" artwork={{ kind: 'horizon', palette: 'saffron' }} bleed ratio={16 / 9} />
        <Stack padding="5" gap="2">
          <Heading level={3}>Bleed media</Heading>
          <Text tone="muted" variant="small">
            Full-bleed for photography-led cards.
          </Text>
        </Stack>
      </Card>
      <Card style={{ width: 320 }} elevation="flat">
        <CardHeader>
          <Heading level={3} variant="subheading">
            With header
          </Heading>
          <Badge>Flat</Badge>
        </CardHeader>
        <Text tone="muted" variant="small">
          Dense layouts use flat cards with a hairline.
        </Text>
      </Card>
    </Stack>
  ),
};

export const NestedThemes: Story = {
  name: 'Theme scope',
  render: () => (
    <ThemeScope mode="dark" style={{ padding: 24, borderRadius: 16 }}>
      <Stack gap="3">
        <Text variant="label" tone="subtle">
          dark scope
        </Text>
        <ThemeScope mode="light" style={{ padding: 16, borderRadius: 11 }}>
          <Stack direction="row" gap="2" align="center">
            <Text variant="small">Light inside dark</Text>
            <Button size="sm">Action</Button>
          </Stack>
        </ThemeScope>
      </Stack>
    </ThemeScope>
  ),
};
