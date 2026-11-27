import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { iconSearch, iconUpload, iconUsers } from '@mohirlab/icons';
import { Button, Card, EmptyState, Pagination, Skeleton, Stack, Text } from '@mohirlab/react';

const meta: Meta = { title: 'Components/Loading, empty & pages' };
export default meta;
type Story = StoryObj;

export const Skeletons: Story = {
  render: () => (
    <Stack gap="4" style={{ maxWidth: 720 }}>
      <Text variant="small" tone="muted">
        A slow breath instead of a shimmer; still under reduced motion. The region is marked aria-busy.
      </Text>
      <div
        aria-busy="true"
        aria-label="Loading posts"
        style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {[0, 1].map((i) => (
          <Card key={i}>
            <Stack gap="3">
              <Skeleton shape="block" height={140} />
              <Stack direction="row" gap="3" align="center">
                <Skeleton shape="circle" size={36} />
                <Stack gap="0" style={{ flex: 1 }}>
                  <Skeleton width="55%" />
                  <Skeleton width="35%" style={{ fontSize: 12 }} />
                </Stack>
              </Stack>
              <Skeleton lines={3} />
            </Stack>
          </Card>
        ))}
      </div>
    </Stack>
  ),
};

export const EmptyStates: Story = {
  render: () => (
    <Stack gap="6" style={{ maxWidth: 720 }}>
      <Card>
        <EmptyState
          icon={iconUsers}
          title="No teammates yet"
          description="Invite the people you work with. They get an email and join when they accept."
          actions={
            <>
              <Button>Invite people</Button>
              <Button appearance="ghost" tone="neutral">
                Copy invite link
              </Button>
            </>
          }
        />
      </Card>
      <EmptyState
        framed
        size="sm"
        icon={iconUpload}
        title="Drop files here"
        description="PDF, PNG or JPG, up to 20 MB each."
        level={3}
      />
      <EmptyState
        size="sm"
        icon={iconSearch}
        level={3}
        title="No results for “invoce”"
        description="Check the spelling, or search all workspaces instead of this one."
      />
    </Stack>
  ),
};

export const PaginationStory: Story = {
  name: 'Pagination',
  render: function PaginationDemo() {
    const [page, setPage] = useState(6);
    return (
      <Stack gap="5">
        <Pagination page={page} pageCount={24} onPageChange={setPage} />
        <Pagination page={2} pageCount={5} onPageChange={() => {}} aria-label="Short list" />
        <Pagination
          page={1}
          pageCount={8}
          href={(p) => `#page-${p}`}
          aria-label="As links"
          labels={{
            previous: 'Oldingi',
            next: 'Keyingi',
            page: (p) => `${p}-sahifa`,
            status: (p, n) => `${p} / ${n}`,
          }}
        />
        <Text variant="small" tone="muted">
          Below tablet width the numbers become “Page 6 of 24”. The last one uses links and Uzbek labels.
        </Text>
      </Stack>
    );
  },
};
