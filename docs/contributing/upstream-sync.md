# Upstream Sync Workflow

## When to sync

Pull from `vercel-labs/emulate` whenever upstream ships service emulator changes, docs content updates, or CLI features worth inheriting.

## How to sync

```bash
git fetch upstream
git merge upstream/main
```

There is no generation step: `apps/web` tracks upstream's `apps/web` structure directly, and the emulator packages merge as normal code.

## Resolving conflicts

Package- and CLI-level rules (fork identity, `@nyrra` scope, Foundry/Clerk packages, workflows) are unchanged — see the conflict rules in the repo memory of past syncs and `docs/architecture/docs-platform.md` for the `apps/web` rules. In short:

1. **Emulator packages** (`packages/@emulators/*` except `foundry`/`clerk`) and `examples/` usually auto-merge; upstream owns them.
2. **`packages/emulate`** keeps the fork's `@nyrra/emulate` identity and Foundry-aware CLI; graft upstream features on top.
3. **`apps/web`** keeps the fork's vinext setup (`vite.config.ts`, vinext scripts/deps), branding (`lib/site.ts`), and Foundry docs (`app/docs/foundry/**`); take upstream's service `page.mdx` content edits. If upstream adds a service, add one entry each to `lib/docs-sections.ts`, `lib/docs-navigation.ts`, and `lib/page-titles.ts`.
4. **Fork-owned, never take upstream's:** `.github/workflows/*`, root `package.json`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `README.md`.

## After syncing

```bash
pnpm install
pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build
pnpm --filter web build:vinext
```

These are the same steps CI runs.
