import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { color, font, motion, radius, space, modes } from '@mohirlab/tokens';
import * as icons from '@mohirlab/icons';
import { vars } from '@mohirlab/themes';
import { artwork, artworkKinds, avatar, initialsOf, paletteNames, toDataUri } from '@mohirlab/assets';
import { Avatar, Card, Heading, Icon, Input, Stack, Text } from '@mohirlab/react';
import * as s from '../specimen.css';

const meta: Meta = { title: 'Foundations', parameters: { layout: 'padded' }, tags: ['!autodocs'] };
export default meta;
type Story = StoryObj;

const ramps = ['ink', 'lapis', 'anor', 'jade', 'saffron'] as const;
const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export const Colors: Story = {
  render: () => (
    <Stack gap="8">
      <Stack gap="3">
        <Heading level={2}>Ramps</Heading>
        <Text tone="muted">
          OKLCH ramps sharing one lightness curve, so a step means the same contrast in every hue.
        </Text>
        {ramps.map((name) => (
          <Stack key={name} gap="1">
            <Text variant="label" tone="subtle">
              {name}
            </Text>
            <div className={s.ramp}>
              {steps.map((step) => (
                <div
                  key={step}
                  className={s.chip}
                  style={{
                    background: color[name][step],
                    color: Number(step) < 500 ? color.ink[900] : color.paper,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </Stack>
        ))}
      </Stack>
      <Stack gap="3">
        <Heading level={2}>Semantic colors</Heading>
        <Text tone="muted">
          Components use roles, never ramps. Switch the theme in the toolbar to see dark values.
        </Text>
        <div className={s.grid}>
          {Object.keys(modes.light.color).map((role) => (
            <div key={role} className={s.tile}>
              {/* The live theme variable, so the swatch follows the toolbar theme. */}
              <div className={s.swatch} style={{ background: vars.color[role as keyof typeof vars.color] }} />
              <span className={s.mono}>{modes.light.color[role as keyof typeof modes.light.color]}</span>
              <Text variant="small">{role}</Text>
            </div>
          ))}
        </div>
      </Stack>
    </Stack>
  ),
};

export const Typography: Story = {
  render: () => (
    <Stack gap="5">
      {(['display', 'title', 'heading', 'subheading', 'body', 'small', 'label', 'code'] as const).map(
        (variant) => (
          <Stack key={variant} gap="1">
            <Text variant="label" tone="subtle">
              {variant}
            </Text>
            <Text variant={variant}>Mohir usta qo‘lida — made by a master’s hand.</Text>
          </Stack>
        ),
      )}
      <Text variant="small" tone="muted">
        Families: {font.family.sans} / {font.family.mono}
      </Text>
    </Stack>
  ),
};

export const SpacingAndRadius: Story = {
  name: 'Spacing & radius',
  render: () => (
    <Stack gap="8">
      <Stack gap="2">
        {Object.entries(space).map(([key, value]) => (
          <Stack key={key} direction="row" gap="4" align="center">
            <span className={s.mono} style={{ width: '4rem' }}>
              {key} · {value}
            </span>
            <div style={{ height: 10, width: value, background: vars.color.accent, borderRadius: 2 }} />
          </Stack>
        ))}
      </Stack>
      <div className={s.grid}>
        {Object.entries(radius).map(([key, value]) => (
          <div key={key} className={s.tile}>
            <div
              className={s.swatch}
              style={{ borderRadius: value, background: vars.color.accentSoft, height: 64 }}
            />
            <span className={s.mono}>
              {key} · {value}
            </span>
          </div>
        ))}
      </div>
    </Stack>
  ),
};

export const Elevation: Story = {
  render: () => (
    <Stack direction="row" gap="6" wrap>
      {(['sunken', 'flat', 'raised', 'floating'] as const).map((elevation) => (
        <Card key={elevation} elevation={elevation} style={{ width: 180, height: 120 }}>
          <Text variant="label" tone="subtle">
            {elevation}
          </Text>
        </Card>
      ))}
      <Text variant="small" tone="muted" style={{ width: '100%' }}>
        Motion:{' '}
        {Object.entries(motion.duration)
          .map(([k, v]) => `${k} ${v}`)
          .join(' · ')}
      </Text>
    </Stack>
  ),
};

const iconList = Object.values(icons).filter(
  (v): v is icons.IconData => typeof v === 'object' && v !== null && 'nodes' in v,
);

const exportName = (name: string) =>
  `icon${name.replace(/(^|-)(w)/g, (_, __, c: string) => c.toUpperCase())}`;

export const Icons: Story = {
  render: function IconsStory() {
    const [query, setQuery] = useState('');
    const [copied, setCopied] = useState('');
    const shown = iconList.filter((i) => i.name.includes(query.trim().toLowerCase()));
    return (
      <Stack gap="2">
        <Text tone="muted">
          {iconList.length} icons. 24px grid, 1.75 stroke, square caps and mitred joins. Click to copy the
          import name.
        </Text>
        <div className={s.search}>
          <Input placeholder="Search icons" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className={s.grid}>
          {shown.map((icon) => (
            <button
              key={icon.name}
              type="button"
              className={s.iconCell}
              onClick={() => {
                void navigator.clipboard?.writeText(exportName(icon.name));
                setCopied(icon.name);
              }}
            >
              <Icon icon={icon} size={28} />
              <span className={s.mono}>{copied === icon.name ? 'copied' : icon.name}</span>
            </button>
          ))}
        </div>
      </Stack>
    );
  },
};

export const Imagery: Story = {
  render: () => (
    <Stack gap="8">
      <Text tone="muted">
        Generated from a seed: the same seed always gives the same image, at any size, with no network or
        licensing.
      </Text>
      {artworkKinds.map((kind) => (
        <Stack key={kind} gap="2">
          <Text variant="label" tone="subtle">
            artwork · {kind}
          </Text>
          <div className={s.grid}>
            {paletteNames.map((palette) => (
              <img
                key={palette}
                className={s.art}
                alt=""
                src={toDataUri(artwork(`${kind}-${palette}`, { kind, palette, width: 480, height: 300 }))}
                title={palette}
              />
            ))}
          </div>
        </Stack>
      ))}
      <Stack gap="2">
        <Text variant="label" tone="subtle">
          avatars
        </Text>
        <Stack direction="row" gap="2" wrap>
          {[
            'Courtney Henry',
            'Leslie Alexander',
            'Jerome Bell',
            'Madina Karimova',
            'Ali Valiyev',
            'Otabek',
          ].map((name) => (
            <Avatar key={name} name={name} size="lg" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <img
              key={i}
              alt=""
              width={56}
              height={56}
              style={{ borderRadius: '50%' }}
              src={toDataUri(avatar(`member-${i}`))}
            />
          ))}
        </Stack>
        <Text variant="small" tone="muted">
          Initials come from <code>initialsOf()</code>: “{initialsOf('Madina Karimova')}”.
        </Text>
      </Stack>
    </Stack>
  ),
};
