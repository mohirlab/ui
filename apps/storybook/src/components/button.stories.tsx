import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconArrowRight, iconHeart, iconPlus } from '@mohirlab/icons';
import { Button, Icon, Stack, Text } from '@mohirlab/react';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Publish',
    tone: 'accent',
    appearance: 'solid',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'danger'] },
    appearance: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  name: 'Tone × appearance',
  render: () => (
    <Stack gap="4">
      {(['accent', 'neutral', 'danger'] as const).map((tone) => (
        <Stack key={tone} direction="row" gap="3" align="center" wrap>
          <Text variant="label" tone="subtle" style={{ width: 72 }}>
            {tone}
          </Text>
          {(['solid', 'soft', 'outline', 'ghost'] as const).map((appearance) => (
            <Button key={appearance} tone={tone} appearance={appearance}>
              {appearance}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center" wrap>
      <Button start={<Icon icon={iconPlus} />}>New post</Button>
      <Button appearance="outline" end={<Icon icon={iconArrowRight} />}>
        Continue
      </Button>
      <Button appearance="soft" iconOnly aria-label="Like">
        <Icon icon={iconHeart} />
      </Button>
      <Button appearance="ghost" tone="neutral" iconOnly size="sm" aria-label="Add">
        <Icon icon={iconPlus} />
      </Button>
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center" wrap>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button fullWidth appearance="outline">
        Full width
      </Button>
    </Stack>
  ),
};
