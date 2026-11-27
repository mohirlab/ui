# Consumer fixtures

Apps that use Mohirlab **the way an outside project does**: packed tarballs installed
with npm, no workspace links, no Vanilla Extract plugin. `scripts/consumer-test.mjs`
packs every package, installs the tarballs into a temporary copy of each fixture, and
builds it. CI runs it on every pull request.

- `vite-app`: Vite + React, client-rendered.
- `next-app`: Next.js App Router. `next build` server-renders the page, so components
  must work when imported from a Server Component.
