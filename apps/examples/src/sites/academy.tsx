import { useState } from 'react';
import { artwork, toDataUri } from '@mohirlab/assets';
import { iconArrowRight, iconCheck, iconClock, iconPlay, iconStar, iconUsers } from '@mohirlab/icons';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardMedia,
  Field,
  Heading,
  Icon,
  Input,
  SegmentedControl,
  Stack,
  Text,
  useToast,
} from '@mohirlab/react';
import { vars } from '@mohirlab/themes';
import { SiteBar } from '../site-bar';
import * as s from '../shell.css';

const courses = [
  {
    title: 'Draw like a pro on your iPad',
    teacher: 'Jerome Bell',
    lessons: 8,
    hours: 6,
    students: 4574,
    palette: 'dusk',
    kind: 'horizon',
  },
  {
    title: 'Natural dyes: from madder to indigo',
    teacher: 'Madina Karimova',
    lessons: 12,
    hours: 9,
    students: 2210,
    palette: 'saffron',
    kind: 'aurora',
  },
  {
    title: 'Pattern design with tilework geometry',
    teacher: 'Ali Valiyev',
    lessons: 10,
    hours: 7,
    students: 3180,
    palette: 'lapis',
    kind: 'tiles',
  },
] as const;

const plans = [
  {
    name: 'Starter',
    price: 0,
    note: 'Try any course’s first lessons.',
    features: ['3 free lessons per course', 'Community feedback'],
  },
  {
    name: 'Usta',
    price: 12,
    note: 'Everything, for one learner.',
    features: ['All courses and new releases', 'Downloadable materials', 'Certificates'],
    featured: true,
  },
  {
    name: 'Studio',
    price: 39,
    note: 'For teams of up to 10.',
    features: ['Everything in Usta', 'Team progress', 'Private workshops'],
  },
];

export function Academy() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const [tried, setTried] = useState(false);
  const [period, setPeriod] = useState('month');

  return (
    <>
      <SiteBar
        name="Usta Academy"
        nav={
          <>
            <a className={s.navLink} href="#/academy">
              Courses
            </a>
            <a className={s.navLink} href="#/academy">
              Teachers
            </a>
            <a className={s.navLink} href="#/academy">
              Pricing
            </a>
          </>
        }
        actions={
          <Button size="sm" appearance="ghost" tone="neutral" className={s.hideOnMobile}>
            Sign in
          </Button>
        }
      />

      {/* Hero */}
      <section className={s.container} style={{ paddingBlock: 'clamp(40px, 8vw, 96px)' }}>
        <Box display="grid" gridTemplateColumns={{ mobile: '1', desktop: '2' }} gap="10" alignItems="center">
          <Stack gap="5">
            <Badge tone="accent" seal style={{ alignSelf: 'flex-start' }}>
              New: natural dyes course
            </Badge>
            <Heading level={1} variant="display">
              Learn a craft from the people who master it.
            </Heading>
            <Text tone="muted" style={{ fontSize: '1.125rem', maxWidth: '34rem' }}>
              Short video lessons, real projects and feedback from working artisans. Start free, keep what you
              make.
            </Text>
            <Stack direction="row" gap="3" wrap>
              <Button size="lg" end={<Icon icon={iconArrowRight} />}>
                Start learning free
              </Button>
              <Button size="lg" appearance="outline" tone="neutral" start={<Icon icon={iconPlay} />}>
                Watch the trailer
              </Button>
            </Stack>
            <Stack direction="row" gap="3" align="center">
              <Stack direction="row" gap="0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} icon={iconStar} size={16} style={{ color: vars.color.warning }} />
                ))}
              </Stack>
              <Text variant="small" tone="muted">
                4.9 from 12,400 learners
              </Text>
            </Stack>
          </Stack>
          <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '5 / 4' }}>
            <img
              className={s.art}
              alt=""
              src={toDataUri(
                artwork('academy-hero', { kind: 'dunes', palette: 'lapis', width: 1000, height: 800 }),
              )}
            />
          </div>
        </Box>
      </section>

      {/* Courses */}
      <section className={s.container} style={{ paddingBlock: 48 }}>
        <Stack direction="row" justify="space-between" align="flex-end" marginBottom="6" gap="4">
          <Stack gap="2">
            <Text variant="label" tone="accent">
              Popular this month
            </Text>
            <Heading level={2} variant="title">
              Courses learners finish
            </Heading>
          </Stack>
          <Button appearance="ghost" end={<Icon icon={iconArrowRight} />} className={s.hideOnMobile}>
            All 64 courses
          </Button>
        </Stack>
        <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '2', desktop: '3' }} gap="5">
          {courses.map((c) => (
            <Card key={c.title} padding="sm">
              <CardMedia seed={c.title} artwork={{ kind: c.kind, palette: c.palette }}>
                <Badge solid tone="neutral">
                  {c.lessons} lessons
                </Badge>
              </CardMedia>
              <Stack gap="2" style={{ flex: 1 }}>
                <Text variant="small" tone="subtle">
                  <Icon icon={iconUsers} size="1em" /> {c.students.toLocaleString()} learners ·{' '}
                  <Icon icon={iconClock} size="1em" /> {c.hours}h
                </Text>
                <Heading level={3} variant="subheading">
                  {c.title}
                </Heading>
                <Stack direction="row" gap="2" align="center" marginTop="1">
                  <Avatar name={c.teacher} size="xs" />
                  <Text variant="small" tone="muted">
                    {c.teacher}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Box>
      </section>

      {/* Pricing */}
      <section className={s.container} style={{ paddingBlock: 64 }}>
        <Stack gap="2" align="center" marginBottom="8" style={{ textAlign: 'center' }}>
          <Text variant="label" tone="accent">
            Pricing
          </Text>
          <Heading level={2} variant="title">
            Pay for depth, not access
          </Heading>
          <SegmentedControl
            aria-label="Billing period"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: 'month', label: 'Monthly' },
              { value: 'year', label: 'Yearly · 2 months free' },
            ]}
            style={{ marginTop: 12 }}
          />
        </Stack>
        <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '3' }} gap="5" alignItems="stretch">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              elevation={plan.featured ? 'floating' : 'flat'}
              style={
                plan.featured
                  ? { boxShadow: `0 0 0 2px ${vars.color.accent}, ${vars.shadow.floating}` }
                  : undefined
              }
            >
              <Stack gap="4" style={{ height: '100%' }}>
                <Stack direction="row" justify="space-between" align="center">
                  <Heading level={3} variant="subheading">
                    {plan.name}
                  </Heading>
                  {plan.featured && (
                    <Badge tone="accent" seal>
                      Most chosen
                    </Badge>
                  )}
                </Stack>
                <Stack direction="row" align="baseline" gap="1">
                  <Text variant="display" numeric as="span">
                    ${period === 'year' ? Math.round((plan.price * 10) / 12) : plan.price}
                  </Text>
                  <Text tone="muted" as="span">
                    / month
                  </Text>
                </Stack>
                <Text variant="small" tone="muted">
                  {plan.note}
                </Text>
                <Stack gap="2" style={{ flex: 1 }}>
                  {plan.features.map((f) => (
                    <Text key={f} variant="small">
                      <Icon icon={iconCheck} size="1.1em" /> {f}
                    </Text>
                  ))}
                </Stack>
                <Button
                  appearance={plan.featured ? 'solid' : 'outline'}
                  tone={plan.featured ? 'accent' : 'neutral'}
                  fullWidth
                >
                  {plan.price === 0 ? 'Start free' : `Choose ${plan.name}`}
                </Button>
              </Stack>
            </Card>
          ))}
        </Box>
      </section>

      {/* Voices */}
      <section style={{ paddingBlock: 64 }}>
        <div className={s.container}>
          <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '2' }} gap="5">
            {[
              [
                'Courtney Henry',
                'Illustrator',
                'I finished three courses in a month. The feedback from Jerome on my first piece changed how I use layers.',
              ],
              [
                'Ali Valiyev',
                'Textile designer',
                'Finally a platform that treats crafts as serious work. The dye course paid for a year in one commission.',
              ],
            ].map(([name, role, quote]) => (
              <Card key={name} elevation="sunken">
                <Text style={{ fontSize: '1.125rem' }} marginBottom="5">
                  “{quote}”
                </Text>
                <Stack direction="row" gap="3" align="center">
                  <Avatar name={name!} />
                  <Stack gap="0">
                    <Text variant="small" style={{ fontWeight: 600 }}>
                      {name}
                    </Text>
                    <Text variant="small" tone="subtle">
                      {role}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Box>
        </div>
      </section>

      {/* Newsletter */}
      <section className={s.container} style={{ paddingBottom: 80 }}>
        <Card elevation="raised" padding="lg">
          <Box display="grid" gridTemplateColumns={{ mobile: '1', tablet: '2' }} gap="6" alignItems="center">
            <Stack gap="2">
              <Heading level={2} variant="heading">
                One good lesson, every Friday
              </Heading>
              <Text tone="muted">A short technique from a master, free. Unsubscribe any time.</Text>
            </Stack>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTried(true);
                if (!valid) return;
                setEmail('');
                setTried(false);
                toast({
                  title: 'You’re subscribed',
                  description: 'The first lesson arrives on Friday.',
                  tone: 'success',
                });
              }}
            >
              <Stack
                direction={{ mobile: 'column', tablet: 'row' }}
                gap="2"
                align={{ mobile: 'stretch', tablet: 'flex-end' }}
              >
                <div style={{ flex: 1 }}>
                  <Field
                    label="Email"
                    error={tried && !valid ? 'Enter a full address, like name@domain.uz.' : undefined}
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.uz"
                    />
                  </Field>
                </div>
                <Button type="submit">Subscribe</Button>
              </Stack>
            </form>
          </Box>
        </Card>
      </section>

      <footer>
        <div className={s.container} style={{ paddingBlock: 32 }}>
          <hr className={s.rule} />
          <Stack
            direction={{ mobile: 'column', tablet: 'row' }}
            justify="space-between"
            gap="3"
            marginTop="6"
          >
            <Text variant="small" tone="subtle">
              © 2026 Usta Academy · An example built with Mohirlab
            </Text>
            <Stack direction="row" gap="4">
              <Text variant="small" tone="subtle">
                Privacy
              </Text>
              <Text variant="small" tone="subtle">
                Terms
              </Text>
              <Text variant="small" tone="subtle">
                Contact
              </Text>
            </Stack>
          </Stack>
        </div>
      </footer>
    </>
  );
}
