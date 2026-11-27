import { describe, expect, it } from 'vitest';
import { artwork, artworkKinds, avatar, initialsOf, toDataUri } from '../src/index';

describe('artwork', () => {
  it('is deterministic for a seed', () => {
    expect(artwork('post-42')).toBe(artwork('post-42'));
    expect(artwork('post-42')).not.toBe(artwork('post-43'));
  });

  it.each(artworkKinds)('renders %s as decorative SVG unless titled', (kind) => {
    const svg = artwork('x', { kind, width: 320, height: 200 });
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 320 200"/);
    expect(svg).toContain('aria-hidden="true"');
    expect(artwork('x', { kind, title: 'Dunes at <dusk>' })).toContain('aria-label="Dunes at &lt;dusk&gt;"');
  });
});

describe('avatar', () => {
  it('is deterministic and draws initials', () => {
    expect(avatar('u1')).toBe(avatar('u1'));
    expect(avatar('u1', { initials: 'ch' })).toContain('>CH</text>');
  });

  it('derives initials from names', () => {
    expect(initialsOf('Courtney Henry')).toBe('CH');
    expect(initialsOf('  leslie  ')).toBe('L');
    expect(initialsOf('Otabek Sadiridinov Ali')).toBe('OA');
  });
});

it('encodes data URIs', () => {
  expect(toDataUri('<svg/>')).toBe('data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E');
});
