import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression tests: every Storybook story in Chromium, Firefox and WebKit,
 * light and dark, compared with committed baselines.
 *
 * Baselines must come from Linux CI (same OS, fonts and browser builds as the checks),
 * so they are made by the "Visual tests" workflow with update enabled, never locally.
 */
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      stylePath: './tests/screenshot.css',
      // WebKit can take a few frames to settle a top-layer dialog.
      timeout: 15_000,
      caret: 'hide',
      // Anti-aliasing differs slightly between runs; real changes are far larger.
      maxDiffPixelRatio: 0.002,
      threshold: 0.2,
    },
  },
  use: {
    baseURL: 'http://localhost:6007',
    viewport: { width: 1100, height: 800 },
    colorScheme: 'light',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1100, height: 800 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1100, height: 800 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1100, height: 800 } } },
  ],
  webServer: {
    command: 'vite preview --outDir ../storybook/storybook-static --port 6007 --strictPort',
    url: 'http://localhost:6007/iframe.html',
    reuseExistingServer: !process.env.CI,
  },
});
