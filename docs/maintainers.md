# Maintainer setup

Mohirlab is owned by the dedicated **mohirlab** GitHub account and the **mohirlab** npm
account (scope `@mohirlab`). Maintainers work from their own machines with that identity
scoped to this repository only, so their personal accounts are untouched.

## 1. Git identity (this repository only)

```sh
git config user.name "Mohirlab"
git config user.email "mohirlab@gmail.com"
```

Make git in this repository push as mohirlab. The helper asks `gh` for the mohirlab token,
whichever gh account is active (section 2 adds the account):

```sh
git config --local --add credential.https://github.com.helper ""
git config --local --add credential.https://github.com.helper '!f() { test "$1" = get || exit 0; echo username=mohirlab; echo "password=$(gh auth token --hostname github.com --user mohirlab)"; }; f'
```

On github.com, signed in as **mohirlab**: Settings › Emails must list `mohirlab@gmail.com`
as **verified**, or commits won't link to the account. If "Block command line pushes that
expose my email" is on, pushes from this address are rejected. Either turn that option off,
or commit as the account's `…@users.noreply.github.com` address instead.

## 2. GitHub CLI with two accounts

Add the mohirlab account next to your own:

```sh
gh auth login --hostname github.com --git-protocol https --web   # sign in as mohirlab in the browser
gh auth switch --hostname github.com --user <your-own-account>   # login makes mohirlab active; switch back
gh auth status                                                   # both accounts listed
```

You don't switch accounts to work on Mohirlab: the repository-local helper from section 1
always uses the mohirlab token, and other repositories keep using your active account. `scripts/setup-github.sh` also runs every `gh` command as mohirlab
through `gh auth token --user mohirlab`.

Then run the one-time repository setup: it creates `mohirlab/ui`, pushes, and configures
labels, branch rules, security features and Pages:

```sh
bash scripts/setup-github.sh
```

## 3. npm: first publish, then trusted publishing

Releases come from GitHub Actions through **trusted publishing** (OIDC), so no npm token is
stored anywhere. npm only lets you attach a trusted publisher to a package that already
exists, so each package is published **once by hand**.

Prepare the account on npmjs.com, signed in as **mohirlab**:

- Enable two-factor authentication (Account › Two-Factor Authentication), using an
  authenticator app or a security key.

Log in from the terminal with a separate config file, so your personal npm login stays intact:

```sh
export npm_config_userconfig="$HOME/.npmrc-mohirlab"      # PowerShell: $env:npm_config_userconfig = "$HOME\.npmrc-mohirlab"
npm login --auth-type=web                                 # sign in as mohirlab in the browser
npm whoami                                                # prints: mohirlab
```

First publish of every package, from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build && pnpm check:exports
pnpm -r publish --access public --no-git-checks
```

`pnpm -r publish` goes in dependency order and rewrites `workspace:^` ranges to real
versions. npm will ask for your 2FA code. If it stops partway (an expired code, for example),
run it again: versions already on npm are skipped. Provenance is not set in `publishConfig`;
npm adds it automatically to every release made through trusted publishing.

Then, for **each** package on npmjs.com (`@mohirlab/tokens`, `icons`, `assets`, `themes`,
`sprinkles`, `recipes`, `react`), go to Settings › Trusted publishing and add:

| Field                | Value          |
| -------------------- | -------------- |
| Publisher            | GitHub Actions |
| Organization or user | `mohirlab`     |
| Repository           | `ui`           |
| Workflow filename    | `release.yml`  |
| Environment          | `npm`          |

Still under Settings, set **Publishing access** to "Require two-factor authentication and
disallow tokens". Trusted publishing keeps working; leaked tokens become useless.

Finally, remove the local login, because it's no longer needed:

```sh
npm logout
rm "$HOME/.npmrc-mohirlab"
unset npm_config_userconfig
```

From now on, merging the "Version packages" pull request publishes with provenance.
A **new** package added later repeats this section for that package only.
