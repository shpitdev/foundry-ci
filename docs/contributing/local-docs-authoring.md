# Local Docs Authoring Workflow

## Adding a fork-owned docs page

Fork-owned docs (everything Foundry) live in `apps/web/app/docs/foundry/` as MDX pages. They are owned entirely by this repo, not derived from upstream.

### Steps

1. Create `apps/web/app/docs/foundry/<path>/page.mdx`. The directory path determines the URL:
   - `app/docs/foundry/auth/oauth/page.mdx` serves at `/docs/foundry/auth/oauth`
   - `app/docs/foundry/getting-started/page.mdx` serves at `/docs/foundry/getting-started`

2. Start the file with an H1 heading; rendering (typography, shiki code blocks, GFM tables) comes from `apps/web/mdx-components.tsx` automatically.

3. Add a sibling `layout.tsx` exporting page metadata:

   ```tsx
   import { pageMetadata } from "@/lib/page-metadata";

   export const metadata = pageMetadata("foundry/<path>");

   export default function Layout({ children }: { children: React.ReactNode }) {
     return children;
   }
   ```

4. Register the page in three lists (one entry each):
   - `apps/web/lib/docs-sections.ts` — sidebar (desktop + mobile)
   - `apps/web/lib/docs-navigation.ts` — search index
   - `apps/web/lib/page-titles.ts` — page/OG titles (keyed by the slug used in `pageMetadata`)

5. If the page replaces an old URL, add a redirect in `apps/web/next.config.mjs`.

### Verifying

```bash
pnpm --filter web dev:vinext   # check rendering at http://localhost:3001
pnpm --filter web build:vinext
```

Use install commands with the fork's npm package (`npx @nyrra/emulate`), not upstream's `npx emulate`.
