// Enforce the layer rule: a package may depend only on packages in a lower layer.
// pnpm already refuses imports of undeclared dependencies, so checking the
// declared dependencies is enough to keep the graph pointing downwards.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Lower number = lower layer. Keep in sync with ARCHITECTURE.md. */
const LAYERS = {
  '@mohirlab/tokens': 1,
  '@mohirlab/icons': 1,
  '@mohirlab/assets': 2,
  '@mohirlab/themes': 2,
  '@mohirlab/sprinkles': 3,
  '@mohirlab/recipes': 3,
  '@mohirlab/react': 4,
};

const root = join(import.meta.dirname, '..');
const manifests = readdirSync(join(root, 'packages'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((group) =>
    readdirSync(join(root, 'packages', group.name), { withFileTypes: true })
      .map((d) => join(root, 'packages', group.name, d.name, 'package.json'))
      .filter(existsSync),
  )
  .map((file) => JSON.parse(readFileSync(file, 'utf8')));

const problems = [];
for (const pkg of manifests) {
  const own = LAYERS[pkg.name];
  if (own === undefined) {
    problems.push(`${pkg.name} has no layer. Add it to scripts/check-boundaries.mjs.`);
    continue;
  }
  const deps = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies };
  for (const dep of Object.keys(deps).filter((d) => d.startsWith('@mohirlab/'))) {
    const theirs = LAYERS[dep];
    if (theirs === undefined) problems.push(`${pkg.name} depends on unknown ${dep}`);
    else if (theirs >= own)
      problems.push(`${pkg.name} (layer ${own}) must not depend on ${dep} (layer ${theirs})`);
  }
  if (own < 4 && ['react', 'react-dom'].some((r) => r in deps)) {
    problems.push(`${pkg.name} is below the component layer and must not depend on React`);
  }
}

if (problems.length) {
  console.error(`Boundary check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${manifests.length} packages respect the layer order.`);
