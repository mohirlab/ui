---
'@mohirlab/react': patch
---

Fix: components can be imported from React Server Components (Next.js App Router). Every module of `@mohirlab/react` now starts with `"use client"`. Previously a page importing any component failed at build time with `createContext is not a function`. Client components still render on the server for the first paint. Found by the new consumer test, which builds clean Vite and Next.js apps against the packed packages in CI.
