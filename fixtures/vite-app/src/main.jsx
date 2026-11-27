import '@mohirlab/themes/styles.css';
import '@mohirlab/sprinkles/styles.css';
import '@mohirlab/motion/styles.css';
import '@mohirlab/react/styles.css';

import { createRoot } from 'react-dom/client';
import { iconArrowRight } from '@mohirlab/icons';
import { artwork, toDataUri } from '@mohirlab/assets';
import { color } from '@mohirlab/tokens';
import { Button, Dialog, Field, Icon, Input, Stack, ThemeScope, ToastProvider } from '@mohirlab/react';

createRoot(document.getElementById('root')).render(
  <ThemeScope mode="light">
    <ToastProvider>
      <Stack gap="3" padding="6">
        <img alt="" src={toDataUri(artwork('fixture'))} style={{ borderColor: color.lapis[500] }} />
        <Field label="Email">
          <Input />
        </Field>
        <Button end={<Icon icon={iconArrowRight} />}>Continue</Button>
        <Dialog open={false} onOpenChange={() => {}} title="Fixture" />
      </Stack>
    </ToastProvider>
  </ThemeScope>,
);
