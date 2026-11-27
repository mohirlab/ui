import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { iconBookmark, iconCopy, iconFilter, iconHeart, iconShare } from '@mohirlab/icons';
import { Badge, Button, Field, Icon, Input, Popover, Stack, Text, Tooltip } from '@mohirlab/react';

const meta: Meta = { title: 'Components/Popover & Tooltip' };
export default meta;
type Story = StoryObj;

function FilterPopover({ openOnLoad = false }: { openOnLoad?: boolean }) {
  useEffect(() => {
    if (openOnLoad) document.querySelector<HTMLElement>('[popover="auto"]')?.showPopover();
  }, [openOnLoad]);
  return (
    <Popover
      title="Filter posts"
      trigger={
        <Button appearance="outline" tone="neutral" start={<Icon icon={iconFilter} />}>
          Filters
        </Button>
      }
    >
      <Stack gap="3">
        <Field label="Author">
          <Input size="sm" placeholder="Anyone" />
        </Field>
        <Stack direction="row" gap="1.5" wrap>
          <Badge tone="accent" seal>
            Published
          </Badge>
          <Badge>Draft</Badge>
          <Badge>Archived</Badge>
        </Stack>
        <Stack direction="row" gap="2" justify="flex-end">
          <Button size="sm" appearance="ghost" tone="neutral">
            Reset
          </Button>
          <Button size="sm">Apply</Button>
        </Stack>
      </Stack>
    </Popover>
  );
}

export const Popovers: Story = {
  render: () => (
    <Stack gap="4">
      <Text variant="small" tone="muted">
        Light dismiss, Escape and the top layer come from the Popover API; CSS anchor positioning places it
        and flips it at the viewport edge.
      </Text>
      <FilterPopover />
    </Stack>
  ),
};

export const Tooltips: Story = {
  render: () => (
    <Stack gap="4">
      <Text variant="small" tone="muted">
        Hover (after 400ms) or focus with the keyboard. Escape hides it.
      </Text>
      <Stack direction="row" gap="2">
        {[
          [iconHeart, 'Like', 'Like this post'],
          [iconShare, 'Share', 'Share with your team'],
          [iconBookmark, 'Save', 'Save for later'],
          [iconCopy, 'Copy link', 'Copy the link'],
        ].map(([icon, label, tip]) => (
          <Tooltip key={label as string} content={tip as string}>
            <Button appearance="ghost" tone="neutral" iconOnly aria-label={label as string}>
              <Icon icon={icon as typeof iconHeart} />
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  ),
};

/** Opens on load: for visual checks of anchoring. */
export const OpenPopover: Story = {
  name: 'Open: popover',
  render: () => (
    <div style={{ paddingTop: 40, paddingLeft: 120 }}>
      <FilterPopover openOnLoad />
    </div>
  ),
};

/** Opens on load near the bottom edge: the popover should flip above its trigger. */
export const OpenPopoverFlipped: Story = {
  name: 'Open: popover at the bottom edge',
  render: () => (
    <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
      <FilterPopover openOnLoad />
    </div>
  ),
};

function TooltipOnLoad() {
  useEffect(() => {
    document.querySelector<HTMLElement>('[role="tooltip"]')?.showPopover();
  }, []);
  return (
    <div style={{ paddingTop: 60, paddingLeft: 120 }}>
      <Tooltip content="Share with your team">
        <Button appearance="outline" tone="neutral" iconOnly aria-label="Share">
          <Icon icon={iconShare} />
        </Button>
      </Tooltip>
    </div>
  );
}

export const OpenTooltip: Story = { name: 'Open: tooltip', render: () => <TooltipOnLoad /> };
