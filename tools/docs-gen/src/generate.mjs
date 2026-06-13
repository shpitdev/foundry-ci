/**
 * Regenerates the machine-derivable sections of the Foundry reference docs
 * from the route registry in @emulators/foundry.
 *
 * Sections are delimited by marker comments in the MDX source:
 *
 *   {/* docs-gen:begin <region> *\/}
 *   ...generated content...
 *   {/* docs-gen:end <region> *\/}
 *
 * Everything outside the markers is hand-written and never touched. CI runs
 * this script and fails if it produces a diff, so the committed tables can
 * never drift from the registry.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FOUNDRY_ROUTES, FOUNDRY_SCOPES } from "@emulators/foundry";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const AUTH_LABELS = {
  bearer: "Bearer",
  "module-auth-token": "Module-Auth-Token",
  none: "None",
};

/**
 * One entry per generated endpoint table. `category` selects registry rows;
 * `includeScopes` adds the Required Scope column (only meaningful where the
 * emulator enforces scopes); `stripPrefix` abbreviates long shared prefixes
 * the surrounding prose already explains.
 */
const ENDPOINT_REGIONS = [
  { region: "endpoints-oauth", category: "OAuth", includeScopes: false },
  { region: "endpoints-admin", category: "Admin", includeScopes: true },
  { region: "endpoints-connectivity", category: "Connectivity", includeScopes: true },
  { region: "endpoints-ontologies", category: "Ontologies", includeScopes: true },
  { region: "endpoints-runtime", category: "Runtime Control", includeScopes: false },
  {
    region: "endpoints-contour",
    category: "Contour",
    includeScopes: false,
    stripPrefix: "/contour-backend-multiplexer/api/module-group-multiplexer",
  },
];

/**
 * Hand-maintained semantics for scopes the registry cannot derive from
 * route metadata. A scope listed in FOUNDRY_SCOPES that has no registry
 * routes and no override fails the build, forcing a docs decision.
 */
const SCOPE_OVERRIDES = {
  offline_access: {
    endpoints: "`POST /multipass/api/oauth2/token` (authorization_code)",
    effect: "Triggers refresh token issuance",
    enforcement: "The token endpoint omits `refresh_token` from the response without this scope",
  },
  "api:ontologies-write": {
    endpoints: "Ontology write endpoints",
    effect: "Stored on token for application-level checks",
  },
};

function routesFor(category) {
  return FOUNDRY_ROUTES.filter((r) => r.category === category);
}

function displayPath(path, stripPrefix) {
  if (stripPrefix && path.startsWith(stripPrefix)) {
    return `...${path.slice(stripPrefix.length)}`;
  }
  return path;
}

function scopeCell(route) {
  if (!route.requiredScopes || route.requiredScopes.length === 0) return "None";
  return route.requiredScopes.map((s) => `\`${s}\``).join(", ");
}

function renderRouteTable({ category, includeScopes, stripPrefix }) {
  const routes = routesFor(category);
  if (routes.length === 0) {
    throw new Error(`route registry has no routes in category "${category}"`);
  }
  const header = includeScopes
    ? "| Method | Path | Auth | Required Scope | Description |\n|---|---|---|---|---|"
    : "| Method | Path | Auth | Description |\n|---|---|---|---|";
  const rows = routes.map((r) => {
    const cells = [r.method, `\`${displayPath(r.path, stripPrefix)}\``, AUTH_LABELS[r.auth]];
    if (includeScopes) cells.push(scopeCell(r));
    cells.push(r.description);
    return `| ${cells.join(" | ")} |`;
  });
  return [header, ...rows].join("\n");
}

function enforcedRoutesByScope() {
  const byScope = new Map();
  for (const route of FOUNDRY_ROUTES) {
    for (const scope of route.requiredScopes ?? []) {
      if (!byScope.has(scope)) byScope.set(scope, []);
      byScope.get(scope).push(route);
    }
  }
  return byScope;
}

function renderScopeMatrix() {
  const byScope = enforcedRoutesByScope();
  const rows = FOUNDRY_SCOPES.map(({ scope }) => {
    const routes = byScope.get(scope);
    const override = SCOPE_OVERRIDES[scope];
    if (!routes && !override) {
      throw new Error(`scope "${scope}" has no registry routes and no override in generate.mjs`);
    }
    const endpoints = routes
      ? routes.map((r) => `\`${r.method} ${r.path}\``).join(", ")
      : override.endpoints;
    const effect = routes
      ? "Required; requests without it return `PERMISSION_DENIED` (403)"
      : override.effect;
    return `| \`${scope}\` | ${endpoints} | ${effect} |`;
  });
  return ["| Scope | Endpoint | Effect |", "|---|---|---|", ...rows].join("\n");
}

function renderEnforcedScopes() {
  const byScope = enforcedRoutesByScope();
  const rows = [];
  for (const { scope } of FOUNDRY_SCOPES) {
    const routes = byScope.get(scope);
    const override = SCOPE_OVERRIDES[scope];
    if (routes) {
      const refs = routes.map((r) => `\`${r.method} ${r.path}\``).join(", ");
      rows.push(`| \`${scope}\` | ${refs} return \`PERMISSION_DENIED\` (403) without this scope |`);
    } else if (override?.enforcement) {
      rows.push(`| \`${scope}\` | ${override.enforcement} |`);
    }
    // Scopes with neither routes nor an enforcement override are
    // application-level and intentionally absent from this table.
  }
  return ["| Scope | Enforcement |", "|---|---|", ...rows].join("\n");
}

const TARGETS = [
  {
    file: "apps/web/app/docs/foundry/reference/endpoints/page.mdx",
    regions: Object.fromEntries(ENDPOINT_REGIONS.map((r) => [r.region, () => renderRouteTable(r)])),
  },
  {
    file: "apps/web/app/docs/foundry/reference/scope-matrix/page.mdx",
    regions: {
      "scope-matrix": renderScopeMatrix,
      "enforced-scopes": renderEnforcedScopes,
    },
  },
];

function spliceRegion(source, region, content, file) {
  const begin = `{/* docs-gen:begin ${region} */}`;
  const end = `{/* docs-gen:end ${region} */}`;
  const beginIdx = source.indexOf(begin);
  const endIdx = source.indexOf(end);
  if (beginIdx === -1 || endIdx === -1) {
    throw new Error(`${file}: missing docs-gen markers for region "${region}"`);
  }
  if (source.indexOf(begin, beginIdx + 1) !== -1) {
    throw new Error(`${file}: duplicate begin marker for region "${region}"`);
  }
  return source.slice(0, beginIdx + begin.length) + "\n" + content + "\n" + source.slice(endIdx);
}

let changed = 0;
for (const target of TARGETS) {
  const path = join(REPO_ROOT, target.file);
  const before = readFileSync(path, "utf8");
  let after = before;
  for (const [region, render] of Object.entries(target.regions)) {
    after = spliceRegion(after, region, render(), target.file);
  }
  if (after !== before) {
    writeFileSync(path, after);
    changed++;
    console.log(`updated ${target.file}`);
  } else {
    console.log(`unchanged ${target.file}`);
  }
}
console.log(`docs-gen: ${FOUNDRY_ROUTES.length} routes, ${FOUNDRY_SCOPES.length} scopes, ${changed} file(s) updated`);
