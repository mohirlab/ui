import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

// Read the built Storybook's own index, so every new story is covered automatically.
const index = JSON.parse(
  readFileSync(join(import.meta.dirname, '../../storybook/storybook-static/index.json'), 'utf8'),
) as { entries: Record<string, IndexEntry> };

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && /^(foundations|components|patterns)-/.test(entry.id),
);

async function open(page: Page, id: string, theme: 'light' | 'dark') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  // 'attached', not 'visible': stories whose content is all position:fixed leave the root 0×0.
  await page.locator('#storybook-root').waitFor({ state: 'attached' });
  // Web fonts and generated images must be in before the shot.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
}

/** Known browser problems, each with a tracking issue. */
const knownIssues: Record<string, { browser: string; issue: string }> = {
  'components-popover-tooltip--open-popover-flipped': {
    browser: 'firefox',
    issue: 'https://github.com/mohirlab/ui/issues/31',
  },
};

for (const story of stories) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${story.title} › ${story.name} (${theme})`, async ({ page, browserName }) => {
      const known = knownIssues[story.id];
      test.skip(known?.browser === browserName, `Page crash, see ${known?.issue}`);
      await open(page, story.id, theme);
      await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, { fullPage: true });
    });
  }

  // Patterns are mobile-first: also check them at phone width.
  if (story.id.startsWith('patterns-')) {
    test(`${story.title} › ${story.name} (phone)`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, story.id, 'light');
      await expect(page).toHaveScreenshot(`${story.id}--phone.png`, { fullPage: true });
    });
  }
}
