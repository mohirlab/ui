import { useState } from 'react';
import {
  iconBell,
  iconBookmark,
  iconCalendar,
  iconCart,
  iconComment,
  iconFilter,
  iconGlobe,
  iconHeart,
  iconHome,
  iconImage,
  iconLocation,
  iconPlus,
  iconSearch,
  iconSend,
  iconUser,
  iconUsers,
} from '@mohirlab/icons';
import {
  Avatar,
  BottomNav,
  BottomNavItem,
  BottomNavSpacer,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogBody,
  Field,
  Heading,
  Icon,
  Textarea,
  Popover,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@mohirlab/react';
import { SiteBar } from '../site-bar';
import * as s from '../shell.css';
import * as k from './karvon.css';

const nav = [
  { icon: iconHome, label: 'Home', current: true },
  { icon: iconUsers, label: 'Circles' },
  { icon: iconCalendar, label: 'Meetups' },
  { icon: iconCart, label: 'Market' },
  { icon: iconUser, label: 'Profile' },
];

function Post({
  author,
  time,
  text,
  seed,
  likes,
  comments,
}: {
  author: string;
  time: string;
  text: string;
  seed: string;
  likes: number;
  comments: number;
}) {
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  return (
    <Card as="article" padding="sm">
      <Stack direction="row" gap="3" align="center" marginBottom="3">
        <Avatar name={author} />
        <Stack gap="0">
          <Text variant="small" style={{ fontWeight: 600 }}>
            {author}
          </Text>
          <Text variant="small" tone="subtle">
            <Icon icon={iconGlobe} size="0.9em" /> {time}
          </Text>
        </Stack>
      </Stack>
      <Text marginBottom="3">{text}</Text>
      <CardMedia seed={seed} ratio={16 / 10} />
      <div className={k.actions}>
        <Button
          appearance="ghost"
          tone={liked ? 'danger' : 'neutral'}
          size="sm"
          aria-pressed={liked}
          start={<Icon icon={iconHeart} />}
          onClick={() => setLiked((v) => !v)}
        >
          {(likes + (liked ? 1 : 0)).toLocaleString()}
        </Button>
        <Button appearance="ghost" tone="neutral" size="sm" start={<Icon icon={iconComment} />}>
          {comments}
        </Button>
        <Button appearance="ghost" tone="neutral" size="sm" start={<Icon icon={iconSend} />}>
          Share
        </Button>
        <Tooltip content="Save for later">
          <Button
            appearance="ghost"
            tone="neutral"
            size="sm"
            iconOnly
            aria-label="Save"
            style={{ marginLeft: 'auto' }}
            onClick={() => toast({ title: 'Saved to your collection', tone: 'success' })}
          >
            <Icon icon={iconBookmark} />
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
}

function Meetup() {
  const [going, setGoing] = useState(false);
  return (
    <Card as="article" padding="none">
      <CardMedia seed="karvon-meetup" artwork={{ kind: 'tiles', palette: 'saffron' }} ratio={21 / 9} bleed>
        <Badge tone="warning" solid>
          Meetup
        </Badge>
      </CardMedia>
      <Stack padding="5" gap="3">
        <Heading level={2} variant="subheading">
          Clay & glaze: a Rishtan pottery evening
        </Heading>
        <Stack gap="1">
          <Text variant="small" tone="muted">
            <Icon icon={iconCalendar} size="1em" /> Saturday, Dec 6 · 18:30
          </Text>
          <Text variant="small" tone="muted">
            <Icon icon={iconLocation} size="1em" /> Usta studio, Tashkent
          </Text>
        </Stack>
        <Stack direction="row" justify="space-between" align="center" wrap gap="3">
          <AvatarGroup total={86 + (going ? 1 : 0)} max={4}>
            {['Madina Karimova', 'Ali Valiyev', 'Jerome Bell', 'Courtney Henry'].map((n) => (
              <Avatar key={n} name={n} />
            ))}
          </AvatarGroup>
          <Button appearance={going ? 'soft' : 'solid'} onClick={() => setGoing((v) => !v)}>
            {going ? 'You’re going' : 'Attend'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

function Compose({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [text, setText] = useState('');
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="New post" description="Shared with your circles.">
      <DialogBody>
        <Stack gap="4">
          <Field label="What are you making?">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="A glaze test, a new loom…"
            />
          </Field>
          <Stack direction="row" gap="2">
            <Button appearance="soft" tone="neutral" size="sm" start={<Icon icon={iconImage} />}>
              Photo
            </Button>
            <Button appearance="soft" tone="neutral" size="sm" start={<Icon icon={iconLocation} />}>
              Place
            </Button>
          </Stack>
        </Stack>
      </DialogBody>
      <DialogActions>
        <Button appearance="ghost" tone="neutral" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          disabled={!text.trim()}
          onClick={() => {
            onOpenChange(false);
            setText('');
            toast({ title: 'Posted', description: 'Your circles can see it now.', tone: 'success' });
          }}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Karvon() {
  const [composing, setComposing] = useState(false);
  return (
    <>
      <SiteBar
        name="Karvon"
        actions={
          <>
            <Button appearance="ghost" tone="neutral" iconOnly aria-label="Search">
              <Icon icon={iconSearch} />
            </Button>
            <Button appearance="ghost" tone="neutral" iconOnly aria-label="Notifications">
              <Icon icon={iconBell} />
            </Button>
          </>
        }
      />
      <div className={`${s.container} ${k.layout}`}>
        <nav className={k.sidebar} aria-label="Sections">
          {nav.map((item) => (
            <a
              key={item.label}
              href="#/karvon"
              className={k.sideLink}
              aria-current={item.current ? 'page' : undefined}
            >
              <Icon icon={item.icon} /> {item.label}
            </a>
          ))}
          <Button
            start={<Icon icon={iconPlus} />}
            onClick={() => setComposing(true)}
            style={{ marginTop: 12 }}
          >
            New post
          </Button>
        </nav>

        <main className={k.feed}>
          <div className={k.composer}>
            <Avatar name="Otabek" size="sm" />
            <button type="button" className={k.composerPrompt} onClick={() => setComposing(true)}>
              Share what you’re making…
            </button>
            <Popover
              title="Show in feed"
              placement="bottom-end"
              trigger={
                <Button appearance="ghost" tone="neutral" iconOnly aria-label="Filter feed">
                  <Icon icon={iconFilter} />
                </Button>
              }
            >
              <Stack direction="row" gap="1.5" wrap>
                <Badge tone="accent" seal>
                  Posts
                </Badge>
                <Badge tone="accent" seal>
                  Meetups
                </Badge>
                <Badge>Market</Badge>
              </Stack>
            </Popover>
          </div>
          <Post
            author="Madina Karimova"
            time="2h"
            text="Third firing of the cobalt glaze. The blue finally sits under the clear coat instead of running."
            seed="karvon-glaze"
            likes={1240}
            comments={86}
          />
          <Meetup />
          <Post
            author="Ali Valiyev"
            time="5h"
            text="Morning light on the dunes outside Nukus. Sketching this for the next ikat pattern."
            seed="karvon-dunes"
            likes={532}
            comments={14}
          />
        </main>

        <aside className={k.rail} aria-label="Suggestions">
          <Card padding="sm" elevation="flat">
            <Text variant="label" tone="subtle" marginBottom="3">
              Makers to follow
            </Text>
            <Stack gap="3">
              {['Courtney Henry', 'Jerome Bell', 'Leslie Alexander'].map((name) => (
                <Stack key={name} direction="row" gap="3" align="center">
                  <Avatar name={name} size="sm" />
                  <Text variant="small" style={{ flex: 1, fontWeight: 500 }}>
                    {name}
                  </Text>
                  <Button size="sm" appearance="outline" tone="neutral">
                    Follow
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Card>
          <Card padding="sm" elevation="sunken">
            <Text variant="label" tone="subtle" marginBottom="2">
              From the market
            </Text>
            <CardMedia seed="karvon-market" artwork={{ kind: 'aurora', palette: 'saffron' }} ratio={4 / 3} />
            <Stack direction="row" justify="space-between" align="baseline">
              <Text variant="small" style={{ fontWeight: 600 }}>
                Hand-thrown bowl
              </Text>
              <Text variant="small" numeric>
                $48
              </Text>
            </Stack>
          </Card>
        </aside>
      </div>
      <BottomNavSpacer />

      <BottomNav aria-label="Sections">
        {nav.map((item) =>
          item.label === 'Meetups' ? (
            <BottomNavItem key="compose" icon={iconPlus} label="Post" onClick={() => setComposing(true)} />
          ) : (
            <BottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href="#/karvon"
              current={item.current}
              badge={item.label === 'Circles' ? 4 : undefined}
            />
          ),
        )}
      </BottomNav>
      <Compose open={composing} onOpenChange={setComposing} />
    </>
  );
}
