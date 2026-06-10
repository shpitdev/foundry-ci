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

Adding or moving a docs page means touching the page.mdx plus the three lib lists and, when a URL changes, the redirects.

## Build model

- `pnpm --filter web dev:vinext` / `build:vinext` / `start:vinext` — the deployed path (Vite, outputs `dist/`).
- `pnpm --filter web build` (`next build`) — upstream's path, kept working for parity; CI runs both.
- MDX: vinext auto-injects `@mdx-js/rollup` but does not wire the `mdx-components.tsx` convention, so `apps/web/vite.config.ts` registers the plugin explicitly with `providerImportSource: "@/mdx-components"` and `remark-gfm` (the Foundry docs use GFM tables). Without this, every MDX page renders unstyled and unhighlighted. `next.config.mjs` keeps upstream's bare `createMDX()`.

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
