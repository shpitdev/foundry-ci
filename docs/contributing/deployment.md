# Docs Site Deployment

## What gets deployed

`apps/web` is the only app, serving the landing page and all docs. It builds with vinext:

```bash
pnpm --filter web build:vinext   # outputs apps/web/dist/ (client + server)
pnpm --filter web start:vinext   # serve the production build locally
```

CI builds this path on every PR (`.github/workflows/ci.yml`), alongside the plain `next build` parity check via `pnpm build`.

## Hosting

Automated hosting is not wired up on this branch yet (the previous Cloudflare Workers pipeline deployed the retired SvelteKit app). Options when wiring it:

- **Cloudflare Workers**: vinext supports `vinext deploy` natively (Workers config via `wrangler.jsonc`).
- **Self-hosted Node**: run `vinext start` against the built `dist/` behind a reverse proxy.

Note the runtime requirements if targeting Workers: the OG image route reads font files from `public/` via `node:fs`, and the docs search index reads `app/**/page.mdx` from disk at runtime — both need bundling adjustments (assets or build-time generation) before a Workers deploy.
