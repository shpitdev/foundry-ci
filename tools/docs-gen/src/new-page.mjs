/**
 * Scaffolds a new docs page and wires it into every surface a page must
 * touch (the checklist from CLAUDE.md / docs-platform.md):
 *
 *   1. apps/web/app/docs/<slug>/page.mdx        (from templates/page.mdx.ejs)
 *   2. apps/web/lib/docs-sections.ts             (sidebar)
 *   3. apps/web/lib/docs-navigation.ts           (search index)
 *   4. apps/web/lib/page-titles.ts               (page/OG titles)
 *
 * Usage:
 *   pnpm new-page --slug foundry/admin/groups --title "Group Management" \
 *     --section "Foundry · Admin" [--label Groups] [--name "Group Management"] \
 *     [--description "..."]
 *
 * The edited lib files are formatted with prettier; review the diff before
 * committing. Moving or renaming pages still needs manual redirect entries
 * in apps/web/next.config.mjs.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import ejs from "ejs";

const TOOL_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = join(TOOL_ROOT, "..", "..");
const WEB = join(REPO_ROOT, "apps", "web");

const { values: args } = parseArgs({
  options: {
    slug: { type: "string" },
    title: { type: "string" },
    section: { type: "string" },
    label: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
  },
});

function fail(message) {
  console.error(`new-page: ${message}`);
  process.exit(1);
}

if (!args.slug || !args.title || !args.section) {
  fail("required: --slug <docs path without /docs/ prefix> --title <title> --section <sidebar section title>");
}
if (args.slug.startsWith("/") || args.slug.startsWith("docs/")) {
  fail(`--slug must be relative to /docs/ (got "${args.slug}")`);
}

const slug = args.slug.replace(/\/+$/, "");
const href = `/docs/${slug}`;
const title = args.title;
const label = args.label ?? title;
const name = args.name ?? title;
const description = args.description ?? `TODO: describe ${title}.`;

// 1. Page file from the EJS template.
const pageDir = join(WEB, "app", "docs", slug);
const pagePath = join(pageDir, "page.mdx");
if (existsSync(pagePath)) fail(`${pagePath} already exists`);
const rendered = ejs.render(readFileSync(join(TOOL_ROOT, "templates", "page.mdx.ejs"), "utf8"), {
  title,
  description,
});
mkdirSync(pageDir, { recursive: true });
writeFileSync(pagePath, rendered);
console.log(`created app/docs/${slug}/page.mdx`);

// 2. Sidebar: append to the section's items array (bracket-matched so both
// single-line and multi-line item lists work; prettier reflows afterwards).
const sectionsPath = join(WEB, "lib", "docs-sections.ts");
let sections = readFileSync(sectionsPath, "utf8");
const sectionIdx = sections.indexOf(`title: "${args.section}"`);
if (sectionIdx === -1) {
  const available = [...sections.matchAll(/title: "([^"]+)"/g)].map((m) => `  - ${m[1]}`);
  fail(`section "${args.section}" not found in lib/docs-sections.ts. Available:\n${available.join("\n")}`);
}
const itemsIdx = sections.indexOf("items: [", sectionIdx);
if (itemsIdx === -1) fail(`section "${args.section}" has no items array`);
let depth = 0;
let closeIdx = -1;
for (let i = sections.indexOf("[", itemsIdx); i < sections.length; i++) {
  if (sections[i] === "[") depth++;
  if (sections[i] === "]") depth--;
  if (depth === 0) {
    closeIdx = i;
    break;
  }
}
if (closeIdx === -1) fail("unbalanced items array in lib/docs-sections.ts");
const before = sections.slice(0, closeIdx).trimEnd();
const needsComma = !before.endsWith(",") && !before.endsWith("[");
sections =
  before +
  (needsComma ? ", " : " ") +
  `{ href: "${href}", label: "${label}" }` +
  sections.slice(closeIdx);
writeFileSync(sectionsPath, sections);

// 3. Search index: keep foundry pages grouped together, other pages ahead of
// the upstream service block.
const navPath = join(WEB, "lib", "docs-navigation.ts");
const navLines = readFileSync(navPath, "utf8").split("\n");
const navEntry = `  { name: "${name}", href: "${href}" },`;
let navInsertAt = -1;
if (slug.startsWith("foundry/")) {
  for (let i = navLines.length - 1; i >= 0; i--) {
    if (navLines[i].includes('href: "/docs/foundry')) {
      navInsertAt = i + 1;
      break;
    }
  }
} else {
  navInsertAt = navLines.findIndex((l) => l.includes('href: "/docs/vercel"'));
}
if (navInsertAt === -1) fail("could not find an insertion anchor in lib/docs-navigation.ts");
navLines.splice(navInsertAt, 0, navEntry);
writeFileSync(navPath, navLines.join("\n"));

// 4. Page/OG titles.
const titlesPath = join(WEB, "lib", "page-titles.ts");
const titleLines = readFileSync(titlesPath, "utf8").split("\n");
const titleEntry = `  "${slug}": "${title}",`;
let titleInsertAt = -1;
if (slug.startsWith("foundry/")) {
  for (let i = titleLines.length - 1; i >= 0; i--) {
    if (titleLines[i].trimStart().startsWith('"foundry/')) {
      titleInsertAt = i + 1;
      break;
    }
  }
} else {
  titleInsertAt = titleLines.findIndex((l) => l.trimStart().startsWith("vercel:"));
}
if (titleInsertAt === -1) fail("could not find an insertion anchor in lib/page-titles.ts");
titleLines.splice(titleInsertAt, 0, titleEntry);
writeFileSync(titlesPath, titleLines.join("\n"));

execFileSync("pnpm", ["exec", "prettier", "--write", sectionsPath, navPath, titlesPath], {
  cwd: REPO_ROOT,
  stdio: "inherit",
});

console.log(`wired ${href} into docs-sections.ts, docs-navigation.ts, page-titles.ts`);
console.log("review the diff, then fill in the page content");
