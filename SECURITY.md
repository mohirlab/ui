# Security policy

## Supported versions

Before 1.0, only the latest minor release of each `@mohirlab/*` package gets fixes.

## Reporting a vulnerability

Please don't open a public issue. Report privately through
[GitHub private vulnerability reporting](https://github.com/mohirlab/ui/security/advisories/new).

Include the affected package and version, what an attacker could do, and steps to reproduce.
We aim to acknowledge within 3 working days and to agree a fix and disclosure date with you.

## How releases are protected

- Packages are published only from GitHub Actions, through npm trusted publishing (OIDC).
  No long-lived npm tokens exist.
- Every release carries an npm provenance attestation linking it to the commit and workflow
  that built it. Check it with `npm audit signatures`.
- Dependency install scripts are blocked unless explicitly approved, and new dependency
  versions are installed only after a minimum release age.
