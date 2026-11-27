// Shared tsdown (Rolldown) config for Mohirlab library packages.
// One tool emits JS, declarations and the extracted CSS. Vanilla Extract has no
// Rolldown plugin of its own; Rolldown runs its Rollup plugin unchanged.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

/**
 * @param {string} packageDir absolute path of the package
 * @param {{ css?: boolean, entry?: string[] }} [options]
 */
export function libraryConfig(packageDir, options = {}) {
  const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  const css = options.css ?? true;

  return {
    cwd: packageDir,
    entry: options.entry ?? ['src/index.ts'],
    outDir: 'dist',
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    // One output module per source file keeps tree-shaking honest for consumers.
    unbundle: true,
    clean: true,
    sourcemap: true,
    dts: { sourcemap: true },
    // Never inline another package, not even its types: consumers resolve them.
    deps: {
      neverBundle: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        /^@vanilla-extract\//,
        /^@mohirlab\//,
        /^react($|\/)/,
        /^react-dom($|\/)/,
      ],
    },
    plugins: css
      ? [
          vanillaExtractPlugin({
            cwd: packageDir,
            extract: { name: 'styles.css', sourcemap: false },
            identifiers: ({ hash, debugId }) =>
              `ml_${debugId ? `${debugId.replace(/[^a-zA-Z0-9_-]/g, '_')}_` : ''}${hash}`,
          }),
        ]
      : [],
    outputOptions: {
      // Compiled `x.css.ts` must not ship as `x.css.js`: Vanilla Extract bundler
      // plugins treat every `*.css.js` as uncompiled source, even in node_modules.
      entryFileNames: (chunk) => `${chunk.name.replace(/\.css$/, '.styles')}.js`,
      assetFileNames: '[name][extname]',
    },
    // Lint the package.json exports against what was actually emitted.
    publint: true,
  };
}
