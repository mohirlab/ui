import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  iconBookmark,
  iconCalendar,
  iconCart,
  iconCheck,
  iconComment,
  iconCopy,
  iconGift,
  iconGlobe,
  iconHeart,
  iconLink,
  iconSend,
  iconShare,
  iconStar,
  iconUsers,
} from '@mohirlab/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardMedia,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
} from '@mohirlab/react';

/**
 * Real-world compositions. They are built only from public components, so they
 * double as a test that the components compose without custom CSS.
 */
const meta: Meta = {
  title: 'Patterns/Cards',
  parameters: { viewport: { defaultViewport: 'phone' }, layout: 'padded' },
  globals: { viewport: { value: 'phone', isRotated: false } },
};
export default meta;
type Story = StoryObj;

const Stat = ({ icon, value, label }: { icon: typeof iconHeart; value: string; label: string }) => (
  <Button
    appearance="ghost"
    tone="neutral"
    size="sm"
    aria-label={`${label}: ${value}`}
    start={<Icon icon={icon} />}
  >
    <Text as="span" variant="small" numeric>
      {value}
    </Text>
  </Button>
);

export const SocialPost: Story = {
  render: () => (
    <Card padding="sm" style={{ maxWidth: 400 }}>
      <Stack direction="row" gap="3" align="center" marginBottom="3">
        <Avatar name="Leslie Alexander" />
        <Stack gap="0">
          <Text variant="small" style={{ fontWeight: 620 }}>
            Leslie Alexander
          </Text>
          <Text variant="label" tone="subtle">
            <Icon icon={iconGlobe} size="1em" /> Public · 1d
          </Text>
        </Stack>
      </Stack>
      <Text variant="small" marginBottom="3">
        Rode the cliff road above the lake at first light. Worth every switchback.
      </Text>
      <CardMedia seed="cliff-road" artwork={{ kind: 'dunes', palette: 'jade' }} ratio={4 / 5} />
      <Stack direction="row" justify="space-between" align="center" style={{ marginBottom: -8 }}>
        <Stack direction="row" gap="1">
          <Stat icon={iconHeart} value="5.3k" label="Likes" />
          <Stat icon={iconComment} value="142" label="Comments" />
          <Stat icon={iconSend} value="87" label="Shares" />
        </Stack>
        <Button appearance="ghost" tone="neutral" size="sm" iconOnly aria-label="Save">
          <Icon icon={iconBookmark} />
        </Button>
      </Stack>
    </Card>
  ),
};

export const Meetup: Story = {
  render: () => (
    <Card padding="none" style={{ maxWidth: 400 }}>
      <CardMedia seed="meetup" artwork={{ kind: 'tiles', palette: 'lapis' }} bleed ratio={2}>
        <Badge tone="accent" solid>
          Meetup
        </Badge>
      </CardMedia>
      <Stack padding="5" gap="3">
        <Heading level={3}>Make the most of your money: an intro to crypto</Heading>
        <Stack gap="1.5">
          <Text variant="small" tone="muted">
            <Icon icon={iconCalendar} size="1.1em" /> Wed, Feb 14 · 20:00
          </Text>
          <Text variant="small" tone="muted">
            <Icon icon={iconGlobe} size="1.1em" /> Online
          </Text>
        </Stack>
        <Stack direction="row" justify="space-between" align="center" gap="3" wrap>
          <AvatarGroup total={324} max={4}>
            {['Ali Valiyev', 'Madina Karimova', 'Jerome Bell', 'Courtney Henry'].map((n) => (
              <Avatar key={n} name={n} />
            ))}
          </AvatarGroup>
          <Button>Attend</Button>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const Product: Story = {
  render: function ProductStory() {
    const [saved, setSaved] = useState(false);
    return (
      <Card padding="sm" style={{ maxWidth: 400 }}>
        <CardMedia seed="tee" artwork={{ kind: 'aurora', palette: 'saffron' }} ratio={1}>
          <Badge tone="warning" solid>
            −20%
          </Badge>
        </CardMedia>
        <Stack direction="row" justify="space-between" align="baseline" gap="3">
          <Stack gap="0">
            <Heading level={3} variant="subheading">
              Ikat heavyweight tee
            </Heading>
            <Text variant="label" tone="subtle">
              Usta Atelier
            </Text>
          </Stack>
          <Text variant="heading" numeric>
            $32
          </Text>
        </Stack>
        <Text variant="small" tone="muted" marginY="3">
          <Icon icon={iconStar} size="1em" /> 4.8 · 1,204 reviews
        </Text>
        <Stack direction="row" gap="2">
          <Button
            appearance="outline"
            tone="neutral"
            aria-pressed={saved}
            onClick={() => setSaved((v) => !v)}
            start={<Icon icon={saved ? iconCheck : iconHeart} />}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button fullWidth start={<Icon icon={iconCart} />}>
            Add to cart
          </Button>
        </Stack>
      </Card>
    );
  },
};

export const Course: Story = {
  render: () => (
    <Card padding="sm" style={{ maxWidth: 400 }}>
      <CardMedia seed="course" artwork={{ kind: 'horizon', palette: 'dusk' }}>
        <Badge tone="neutral" solid>
          8 lessons
        </Badge>
      </CardMedia>
      <Text variant="label" tone="subtle">
        <Icon icon={iconUsers} size="1em" /> 4,574 students
      </Text>
      <Heading level={3} style={{ marginBlock: 6 }}>
        Draw like a pro: Procreate on your iPad
      </Heading>
      <Stack direction="row" gap="2" align="center" marginBottom="4">
        <Avatar name="Jerome Bell" size="xs" />
        <Text variant="small" tone="muted">
          Jerome Bell
        </Text>
      </Stack>
      <Stack direction="row" gap="2">
        <Button appearance="outline" tone="neutral">
          Syllabus
        </Button>
        <Button fullWidth>Register</Button>
      </Stack>
    </Card>
  ),
};

export const Invite: Story = {
  render: function InviteStory() {
    const [copied, setCopied] = useState(false);
    const link = 'https://example.com/invite/usta';
    return (
      <Card padding="sm" style={{ maxWidth: 400 }}>
        <CardMedia seed="invite" artwork={{ kind: 'dunes', palette: 'lapis' }} ratio={2.4} />
        <Heading level={3} variant="title">
          Learn &amp; earn
        </Heading>
        <Text variant="label" tone="subtle" marginY="3">
          How it works
        </Text>
        <Stack gap="3" marginBottom="5">
          {[
            [iconShare, 'Share the course link'],
            [iconGift, 'Your friend gets 7 days free'],
            [iconStar, 'You earn 50 points per sign-up'],
          ].map(([icon, text]) => (
            <Stack key={text as string} direction="row" gap="3" align="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                background="sunken"
                borderRadius="sm"
                style={{ width: 32, height: 32 }}
              >
                <Icon icon={icon as typeof iconShare} size={18} />
              </Box>
              <Text variant="small">{text as string}</Text>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" gap="2">
          <Input readOnly value={link} aria-label="Your invite link" />
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
        <Text variant="small" tone="subtle" marginTop="2">
          <Icon icon={iconLink} size="1em" /> Links expire after 30 days.
        </Text>
      </Card>
    );
  },
};

export const Feed: Story = {
  name: 'Feed (responsive)',
  parameters: { viewport: { defaultViewport: undefined } },
  globals: { viewport: { value: undefined } },
  render: (_, context) => (
    <Box
      display="grid"
      gridTemplateColumns={{ mobile: '1', tablet: '2', desktop: '3' }}
      gap="5"
      alignItems="flex-start"
    >
      {[SocialPost, Meetup, Product, Course, Invite].map((story, i) => (
        <div key={i}>{story.render!({}, context)}</div>
      ))}
    </Box>
  ),
};
