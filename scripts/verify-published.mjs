// After a release, confirm each released version really is on npm with provenance.
// A green "changeset publish" is not proof: check the registry itself.
//
// Usage: node scripts/verify-published.mjs '<changesets publishedPackages JSON>'
//   e.g. '[{"name":"@mohirlab/tokens","version":"0.1.1"}]'
// Without an argument it checks every public workspace package at its current version.
//
// The registry is eventually consistent (one package can appear minutes after another),
// so missing versions are retried for up to MAX_WAIT_MS before failing.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_WAIT_MS = Number(process.env.VERIFY_MAX_WAIT_MS ?? 5 * 60_000);
const INTERVAL_MS = Math.min(15_000, MAX_WAIT_MS);

function workspacePackages() {
  const root = join(import.meta.dirname, '..', 'packages');
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((g) => readdirSync(join(root, g.name)).map((n) => join(root, g.name, n, 'package.json')))
    .filter(existsSync)
    .map((f) => JSON.parse(readFileSync(f, 'utf8')))
    .filter((p) => !p.private)
    .map(({ name, version }) => ({ name, version }));
}

async function check({ name, version }) {
  const res = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2f')}/${version}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache' },
  });
  if (res.status === 404) return `${name}@${version} is not on npm`;
  if (!res.ok) return `${name}@${version}: registry answered ${res.status}`;
  const manifest = await res.json();
  if (!manifest.dist?.attestations?.provenance) return `${name}@${version} has no provenance attestation`;
  return null;
}

const packages = process.argv[2] ? JSON.parse(process.argv[2]) : workspacePackages();
if (packages.length === 0) {
  console.log('Nothing was published.');
  process.exit(0);
}

const started = Date.now();
let pending = packages;
for (;;) {
  const results = await Promise.all(pending.map(async (pkg) => ({ pkg, problem: await check(pkg) })));
  for (const { pkg, problem } of results) if (!problem) console.log(`✓ ${pkg.name}@${pkg.version}`);
  const failed = results.filter((r) => r.problem);
  if (failed.length === 0) break;
  if (Date.now() - started > MAX_WAIT_MS) {
    for (const { problem } of failed) console.error(`✗ ${problem}`);
    process.exit(1);
  }
  console.log(`Waiting for ${failed.length} package(s) to appear on the registry…`);
  pending = failed.map((r) => r.pkg);
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
console.log(`All ${packages.length} released package(s) are on npm with provenance.`);
