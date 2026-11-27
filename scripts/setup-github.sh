#!/usr/bin/env bash
# One-time GitHub setup for the public mohirlab/ui repository.
#
# Prerequisite: the mohirlab account is logged in to gh alongside your own account:
#   gh auth login --hostname github.com --git-protocol https --web   (sign in as mohirlab)
# The script acts as mohirlab without changing which gh account is active.
# Safe to re-run: every step is idempotent or skipped when already done.
set -euo pipefail

OWNER="mohirlab"
REPO="$OWNER/ui"
cd "$(dirname "$0")/.."

# Every gh call below runs as mohirlab, whatever account is active.
if ! GH_TOKEN="$(gh auth token --hostname github.com --user "$OWNER" 2>/dev/null)"; then
  echo "The $OWNER account is not logged in to gh. Run: gh auth login --hostname github.com --web" >&2
  exit 1
fi
export GH_TOKEN

# The username in the URL makes gh's git credential helper use the mohirlab token
# for this repository only; your other repositories keep using your own account.
REMOTE="https://$OWNER@github.com/$REPO.git"

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public \
    --description "Mohirlab: an open-source design system built on Vanilla Extract. Tokens, themes, icons, generative imagery and React components." \
    --homepage "https://$OWNER.github.io/ui/" \
    --disable-wiki
fi
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi
git config credential.https://github.com.username "$OWNER"
git push -u origin main

gh repo edit "$REPO" \
  --enable-discussions --enable-issues --enable-projects=false \
  --delete-branch-on-merge --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false \
  --enable-auto-merge \
  --add-topic design-system --add-topic vanilla-extract --add-topic react --add-topic design-tokens \
  --add-topic icons --add-topic typescript --add-topic css-in-ts --add-topic ui-components

# Security features.
gh api -X PUT "repos/$REPO/private-vulnerability-reporting" >/dev/null
gh api -X PUT "repos/$REPO/vulnerability-alerts" >/dev/null
gh api -X PUT "repos/$REPO/automated-security-fixes" >/dev/null
gh api -X PATCH "repos/$REPO" --input - >/dev/null <<'JSON'
{ "security_and_analysis": {
    "secret_scanning": { "status": "enabled" },
    "secret_scanning_push_protection": { "status": "enabled" } } }
JSON

# Labels used by the issue templates and triage.
label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null; }
label 'type: bug' 'b4231f' 'Something is broken'
label 'type: feature' '3a4bd0' 'New component, token, icon or API'
label 'type: docs' '6b6359' 'Documentation and Storybook'
label 'type: chore' 'a9a29a' 'Tooling, CI, dependencies'
label 'status: triage' 'e7b22c' 'Needs a maintainer to look'
label 'status: accepted' '1f8f5f' 'Agreed, ready to work on'
label 'good first issue' '7fd3a8' 'Small and well defined'
label 'help wanted' '4f6cd8' 'Maintainers would welcome a PR'
label 'breaking' '8a1022' 'Needs a major version'
for pkg in tokens themes sprinkles recipes icons assets react storybook; do
  label "pkg: $pkg" 'ddd6cc' "@mohirlab/$pkg"
done

# Protect main: changes land through pull requests that pass CI. On a personal
# account the repository admin role (actor 5) can bypass via pull request.
gh api -X POST "repos/$REPO/rulesets" --input - >/dev/null <<'JSON' || echo "Ruleset exists or could not be created; check Settings > Rules."
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [ { "context": "verify" } ] } }
  ],
  "bypass_actors": [ { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "pull_request" } ]
}
JSON

# GitHub Pages for Storybook, built by .github/workflows/storybook.yml.
gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 || true

cat <<'DONE'
GitHub is set up: https://github.com/mohirlab/ui
Remaining manual steps are in docs/maintainers.md (npm first publish and trusted publishing).
DONE
