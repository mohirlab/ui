import '@mohirlab/themes/styles.css';
import '@mohirlab/sprinkles/styles.css';
import '@mohirlab/motion/styles.css';
import '@mohirlab/react/styles.css';
import './fonts.css';

import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { themes } from '@mohirlab/themes';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: themes.light, dark: themes.dark },
      defaultTheme: 'light',
      parentSelector: 'body',
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
    viewport: {
      options: {
        phone: { name: 'Phone · 375', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        phoneLarge: { name: 'Phone · 430', styles: { width: '430px', height: '932px' }, type: 'mobile' },
        tablet: { name: 'Tablet · 820', styles: { width: '820px', height: '1180px' }, type: 'tablet' },
        ...INITIAL_VIEWPORTS,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Colors', 'Typography', 'Spacing & radius', 'Elevation', 'Icons', 'Imagery'],
          'Components',
          'Patterns',
          '*',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
