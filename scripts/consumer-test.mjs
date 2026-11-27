// Install the packed packages into clean consumer apps and build them.
// Packages must already be built (`pnpm build`). Usage: node scripts/consumer-test.mjs [fixture...]
//
// Each fixture is copied to a temporary folder outside the workspace, the tarballs are
// added as dependencies, and npm "overrides" make every @mohirlab package (including
// transitive ones) resolve to the local tarballs, never to the registry.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });

const work = mkdtempSync(join(tmpdir(), 'mohirlab-consumers-'));
const packs = join(work, 'packs');

// 1. Pack every public package (pnpm rewrites workspace: ranges to real versions).
const tarballs = {};
for (const group of readdirSync(join(root, 'packages'))) {
  for (const name of readdirSync(join(root, 'packages', group))) {
    const dir = join(root, 'packages', group, name);
    if (!existsSync(join(dir, 'package.json'))) continue;
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    if (pkg.private) continue;
    run('pnpm', ['pack', '--pack-destination', packs], dir);
    const file = readdirSync(packs).find((f) =>
      f.startsWith(pkg.name.replace('@', '').replace('/', '-') + '-'),
    );
    tarballs[pkg.name] = `file:${join(packs, file).replace(/\\/g, '/')}`;
  }
}
console.log('Packed:', Object.keys(tarballs).join(', '));

// 2. Install them into a fresh copy of each fixture and build it.
const fixtures = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(join(root, 'fixtures')).filter((f) => existsSync(join(root, 'fixtures', f, 'package.json')));
const failures = [];
for (const fixture of fixtures) {
  const dir = join(work, fixture);
  cpSync(join(root, 'fixtures', fixture), dir, { recursive: true });
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  pkg.dependencies = { ...pkg.dependencies, ...tarballs };
  pkg.overrides = { ...pkg.overrides, ...tarballs };
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  console.log(`\n=== ${fixture}: install and build ===`);
  try {
    run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], dir);
    run('npm', ['run', 'build'], dir);
    console.log(`✓ ${fixture} builds against the packed packages`);
  } catch {
    failures.push(fixture);
    console.error(`✗ ${fixture} failed`);
  }
}

if (!process.env.KEEP) rmSync(work, { recursive: true, force: true });
else console.log(`Kept ${work}`);
if (failures.length) process.exit(1);
