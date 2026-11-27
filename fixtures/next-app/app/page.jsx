// A Server Component (no "use client"): Mohirlab components must be importable and
// server-renderable from here, as in any App Router page.
import { iconArrowRight } from '@mohirlab/icons';
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  Field,
  Heading,
  Icon,
  Input,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  ThemeScope,
} from '@mohirlab/react';

export default function Page() {
  return (
    <ThemeScope mode="light">
      <Stack gap="4" padding="6">
        <Heading level={1}>Fixture</Heading>
        <Card>
          <Text>Server-rendered with Mohirlab.</Text>
          <Badge tone="success" seal>
            ok
          </Badge>
        </Card>
        <Field label="Email">
          <Input type="email" />
        </Field>
        <Field label="Country">
          <Select placeholder="Choose">
            <option value="uz">Uzbekistan</option>
          </Select>
        </Field>
        <Switch label="Notify me" />
        <Tabs defaultValue="a">
          <TabList aria-label="Fixture tabs">
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
        <Accordion>
          <AccordionItem title="Question">Answer</AccordionItem>
        </Accordion>
        <Button end={<Icon icon={iconArrowRight} />}>Continue</Button>
      </Stack>
    </ThemeScope>
  );
}
