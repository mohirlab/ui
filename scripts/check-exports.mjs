// Verify every published package's tarball contains what its `exports` map promises.
// A package that works in the monorepo but not after `npm install` is not shipped.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const packageDirs = readdirSync(join(root, 'packages'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((group) =>
    readdirSync(join(root, 'packages', group.name), { withFileTypes: true })
      .filter(
        (d) => d.isDirectory() && existsSync(join(root, 'packages', group.name, d.name, 'package.json')),
      )
      .map((d) => join(root, 'packages', group.name, d.name)),
  );

const targets = (exp) =>
  typeof exp === 'string' ? [exp] : Object.values(exp ?? {}).flatMap((v) => targets(v));

let failed = false;
for (const dir of packageDirs) {
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  if (pkg.private) continue;

  const result = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: dir,
      encoding: 'utf8',
      shell: true,
    }),
  );
  // npm 11 prints an array of packages; npm 12 prints an object keyed by package name.
  const packed = Array.isArray(result) ? result[0] : (result[pkg.name] ?? Object.values(result)[0]);
  const files = new Set(packed.files.map((f) => f.path.replace(/\\/g, '/')));

  const missing = [];
  for (const target of targets(pkg.exports)) {
    const path = target.replace(/^\.\//, '');
    if (path.includes('*')) {
      const prefix = path.slice(0, path.indexOf('*'));
      if (![...files].some((f) => f.startsWith(prefix))) missing.push(target);
    } else if (!files.has(path)) {
      missing.push(target);
    }
  }
  // Compiled styles must never be named *.css.js (Vanilla Extract plugins would recompile them).
  const recompilable = [...files].filter((f) => f.endsWith('.css.js'));

  // Every stylesheet must declare the full layer order before any rule, or load order
  // between packages could reorder the cascade.
  const LAYER_ORDER = '@layer ml-reset;\n@layer ml-theme;\n@layer ml-components;\n@layer ml-utilities;';
  const css = join(dir, 'dist/styles.css');
  // (Vanilla Extract hoists @keyframes to the top; they are not layered, so only the
  // first @layer occurrence matters.)
  if (existsSync(css)) {
    const text = readFileSync(css, 'utf8');
    const firstLayer = text.indexOf('@layer');
    if (firstLayer === -1 || !text.slice(firstLayer).startsWith(LAYER_ORDER)) {
      missing.push('dist/styles.css does not declare the ml-* layer order before its first layered rule');
    }
  }

  if (missing.length || recompilable.length) {
    failed = true;
    console.error(`✗ ${pkg.name}`);
    for (const m of missing) console.error(`    missing export target ${m}`);
    for (const r of recompilable)
      console.error(`    ships ${r}, which Vanilla Extract plugins would recompile`);
  } else {
    console.log(
      `✓ ${pkg.name}@${pkg.version} (${files.size} files, ${(packed.size / 1024).toFixed(1)} kB packed)`,
    );
  }
}
process.exit(failed ? 1 : 0);
