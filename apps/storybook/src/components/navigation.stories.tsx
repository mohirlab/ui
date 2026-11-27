import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconBell, iconCalendar, iconHome, iconPlus, iconUser } from '@mohirlab/icons';
import {
  BottomNav,
  BottomNavItem,
  Breadcrumbs,
  SegmentedControl,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '@mohirlab/react';

const meta: Meta = { title: 'Components/Navigation' };
export default meta;
type Story = StoryObj;

export const TabsStory: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs defaultValue="overview" style={{ maxWidth: 560 }}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="files">Files</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="archived" disabled>
          Archived
        </Tab>
      </TabList>
      <TabPanel value="overview">
        <Text tone="muted">Arrow keys move between tabs; Home and End jump to the ends.</Text>
      </TabPanel>
      <TabPanel value="files">
        <Text tone="muted">214 files.</Text>
      </TabPanel>
      <TabPanel value="activity">
        <Text tone="muted">No activity this week.</Text>
      </TabPanel>
      <TabPanel value="settings">
        <Text tone="muted">Settings live here.</Text>
      </TabPanel>
    </Tabs>
  ),
};

export const Segmented: Story = {
  render: () => (
    <Stack gap="4" style={{ maxWidth: 420 }}>
      <SegmentedControl
        aria-label="Range"
        defaultValue="30d"
        options={[
          { value: '7d', label: '7 days' },
          { value: '30d', label: '30 days' },
          { value: '12m', label: '12 months' },
        ]}
      />
      <SegmentedControl
        aria-label="View"
        fullWidth
        options={[
          { value: 'feed', label: 'Feed' },
          { value: 'calendar', label: 'Calendar', icon: iconCalendar },
          { value: 'people', label: 'People', disabled: true },
        ]}
      />
    </Stack>
  ),
};

export const BreadcrumbsStory: Story = {
  name: 'Breadcrumbs',
  render: () => (
    <Stack gap="2">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '#clients' },
          { label: 'Usta Atelier', href: '#usta' },
          { label: 'Invoice #2042' },
        ]}
      />
      <Text variant="small" tone="subtle">
        Narrow the window below tablet width: it collapses to a back link to “Usta Atelier”.
      </Text>
    </Stack>
  ),
};

export const BottomNavStory: Story = {
  name: 'Bottom nav (phone)',
  parameters: { viewport: { defaultViewport: 'phone' }, layout: 'fullscreen' },
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => (
    <div style={{ minHeight: 360, padding: 16 }}>
      <Text tone="muted">Fixed to the bottom, clear of the home indicator. Hidden from tablet up.</Text>
      <BottomNav aria-label="Main" hideFrom="never">
        <BottomNavItem icon={iconHome} label="Home" href="#home" current />
        <BottomNavItem icon={iconCalendar} label="Events" href="#events" />
        <BottomNavItem icon={iconPlus} label="Post" onClick={() => {}} />
        <BottomNavItem icon={iconBell} label="Alerts" href="#alerts" badge={3} />
        <BottomNavItem icon={iconUser} label="Profile" href="#me" />
      </BottomNav>
    </div>
  ),
};
