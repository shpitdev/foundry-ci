# Docs Platform Architecture

## Overview

The docs + landing site is a single app: **apps/web**, a Next.js-shaped App Router project built and served with [vinext](https://github.com/cloudflare/vinext) (the Next.js API surface reimplemented on Vite). It is FoundryCI-branded and Foundry-first, and it keeps upstream `vercel-labs/emulate`'s post-restructure layout: landing page at `/`, every docs page under `/docs/*`.

The earlier two-app platform (read-only `apps/web` mirror + deployed `apps/web-svelte` + `packages/docs-upstream` ingestion) was retired on this branch; `apps/web` is now the deployed site itself.

## Layout

| Surface | Source |
|---------|--------|
| Landing page | `apps/web/app/page.tsx` |
| Upstream service docs | `apps/web/app/docs/<service>/page.mdx` (inherited from upstream) |
| Foundry docs (fork-owned) | `apps/web/app/docs/foundry/**/page.mdx` |
| Sidebar sections | `apps/web/lib/docs-sections.ts` (shared by desktop + mobile nav) |
| Search index page list | `apps/web/lib/docs-navigation.ts` |
| Page/OG titles | `apps/web/lib/page-titles.ts` |
| Brand constants | `apps/web/lib/site.ts` (the single rename point: name, owner, URLs, repo, npm package) |
| Redirects (old URLs) | `apps/web/next.config.mjs` |

Adding or moving a docs page means touching the page.mdx plus the three lib lists and, when a URL changes, the redirects. `pnpm new-page --slug <path> --title "..." --section "<sidebar section>"` (tools/docs-gen) scaffolds the page from an EJS template and performs the three lib insertions; redirects for moved pages remain manual.

## Generated reference sections

The mechanical tables in `app/docs/foundry/reference/endpoints/page.mdx` and `scope-matrix/page.mdx` are generated from the route registry (`packages/@emulators/foundry/src/route-registry.ts`) by `pnpm docs-gen` (tools/docs-gen). Generated regions are delimited by `{/* docs-gen:begin <region> */}` markers; everything outside the markers is hand-written. Never edit inside the markers: CI regenerates and fails on any diff (the docs drift gate), so route changes must land in the registry and scope semantics in the `SCOPE_OVERRIDES` map in `tools/docs-gen/src/generate.mjs`.

## Build model

- `pnpm --filter web dev:vinext` / `build:vinext` / `start:vinext` — the deployed path (Vite, outputs `dist/`).
- `pnpm --filter web build` (`next build`) — upstream's path, kept working for parity; CI runs both.
- MDX: vinext auto-injects `@mdx-js/rollup` but does not wire the `mdx-components.tsx` convention, so `apps/web/vite.config.ts` registers the plugin explicitly with `providerImportSource: "@/mdx-components"` and `remark-gfm` (the Foundry docs use GFM tables). Without this, every MDX page renders unstyled and unhighlighted. `next.config.mjs` keeps upstream's bare `createMDX()`.
- Workers runtime: `vite.config.ts` includes `@cloudflare/vite-plugin`, so `dev:vinext` and `build:vinext` run the app in workerd, not node. Two workerd constraints shape the code: shiki uses the pure-JS regex engine (`components/code.tsx`) because Workers forbid compiling WASM at runtime, and `just-bash` is aliased to its full ESM bundle because the Workers resolve conditions would otherwise pick its trimmed browser build, which lacks exports `bash-tool` needs.

## Deployment

The site deploys to the Cloudflare Worker `foundryci-docs` (custom domains foundryci.com + www), configured in `apps/web/wrangler.jsonc` and driven by `.github/workflows/deploy-cloudflare.yml`:

- **Preview**: every PR touching the site runs `pnpm --filter web deploy:preview`, which uploads a worker version aliased `pr-<number>` (URL `https://pr-<n>-foundryci-docs.<subdomain>.workers.dev`) without touching production traffic, then comments the URL on the PR via `scripts/post-cloudflare-deployment-comment.mjs`.
- **Production**: pushes to main run `pnpm --filter web deploy:production` (`wrangler deploy`), then `apps/web/scripts/ensure-cloudflare-www-dns.mjs` and `ensure-cloudflare-https-settings.mjs` assert the www DNS record and HTTPS redirect settings (the preview job runs both with `--dry-run` as a permissions canary).
- Secrets: `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` repo secrets.
- Known limitations on workerd: `/og` image generation 500s (it reads font files from disk and @vercel/og needs WASM), and `/api/docs-chat` deploys but degrades (its runtime fs reads of `app/**/page.mdx` find nothing on the worker, and it needs AI gateway + Upstash secrets configured on the worker). Neither existed on the previously deployed web-svelte site; fixing them properly is follow-up work.

## Dev tooling

- **Lint**: `eslint` + `eslint-config-next`, run directly (`pnpm --filter web lint`). This is deliberate: `vinext lint` is a thin delegator that prefers exactly this setup (and recommends installing `eslint eslint-config-next` when no linter exists); oxlint/oxfmt are vinext's internal repo tooling, not a consumer expectation. Keeping upstream's lint stack also keeps merges clean. Build artifacts (`dist/`, `.vinext/`, `.next/`) are ignored in `eslint.config.mjs`.
- **Types**: `pnpm --filter web type-check` (`tsc --noEmit`), wired into turbo/CI like every other workspace. If it fails on missing `app/<x>/layout.js` modules from `.next/types`, the stale validator predates a structure change — remove `.next/` and rerun.
- **Compat**: `pnpm --filter web exec vinext check` reports the supported-API surface (100% at time of writing).

## Upstream sync rules for apps/web

The fork point for this app is upstream's `apps/web` at v0.6.0 (post-#81 restructure). When merging future upstream changes:

- **Keep the `/docs/<service>` structure.** It is upstream's own structure now; do not resurrect the fork's old root-level mirror layout.
- **Take upstream's service `page.mdx` content edits.** The fork avoids hand-editing those files except for npm package references (`npx emulate` becomes `npx @nyrra/emulate` in `app/docs/page.mdx` and `app/docs/programmatic-api/page.mdx`).
- **Fork-owned files upstream will never touch:** `app/docs/foundry/**`, `lib/site.ts`, `lib/docs-sections.ts`, `vite.config.ts`, the vinext deps/scripts in `package.json`, `public/nyrra-logo-5-colors.svg`.
- **Expected conflict surface:** `app/layout.tsx`, `app/page.tsx`, `app/og/og-image.tsx`, `lib/page-titles.ts`, `lib/docs-navigation.ts`, `lib/page-metadata.ts`, `components/docs-nav.tsx`, `components/docs-mobile-nav.tsx`, `components/hero-terminal.tsx`, `next.config.mjs` — resolve by keeping the fork's branding/Foundry entries and grafting upstream's structural or content additions (new services, new nav items) on top.
- If upstream adds a service, add it to `lib/docs-sections.ts`, `lib/docs-navigation.ts`, and `lib/page-titles.ts` (one entry each).

## @emulators/foundry (runtime package)

- One published npm package. Internals split by domain: auth, admin, connectivity, ontologies, compute-modules (see `foundry-domains.md`).
- The public API surface is the `foundryPlugin` ServicePlugin export. Internal domain modules are not re-exported.
- Published to npm inside `@nyrra/emulate` via `pnpm release:emulate:pack` / the release workflow.
