import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: [
    // GitHub-flavoured Markdown in MDX docs: tables, strikethrough, task lists.
    {
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
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
