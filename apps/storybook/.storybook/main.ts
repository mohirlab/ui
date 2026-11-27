import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  core: { disableTelemetry: true },
  // Stories consume the built packages, exactly like an outside app.
  viteFinal: (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), vanillaExtractPlugin()],
    // Storybook's own runtime and the axe a11y checker are large by design; our packages are not.
    build: { ...vite.build, chunkSizeWarningLimit: 1500 },
  }),
};

export default config;
