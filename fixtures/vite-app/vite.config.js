import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No Vanilla Extract plugin: consumers of the built packages must not need one.
export default defineConfig({ plugins: [react()] });
