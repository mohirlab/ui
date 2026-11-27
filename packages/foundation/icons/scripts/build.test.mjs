import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseIcon } from './build.mjs';

const dir = join(import.meta.dirname, '../src/svg');

describe('icon sources', () => {
  it.each(readdirSync(dir))('%s is valid', (file) => {
    expect(() => parseIcon(file, readFileSync(join(dir, file), 'utf8'))).not.toThrow();
  });

  it('rejects hard-coded colors and foreign elements', () => {
    const bad = '<svg viewBox="0 0 24 24"><path d="M0 0" stroke="#000"/><text x="1"/></svg>';
    expect(() => parseIcon('bad', bad)).toThrow(/currentColor.*not allowed|not allowed.*currentColor/);
  });
});
