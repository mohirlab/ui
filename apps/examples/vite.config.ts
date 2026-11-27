import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Relative base + hash routing: the build works at any path, e.g. /ui/examples/ on Pages.
export default defineConfig({
  base: './',
  plugins: [react(), vanillaExtractPlugin()],
});
