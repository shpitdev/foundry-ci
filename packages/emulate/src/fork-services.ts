/**
 * Fork-owned service composition layer.
 *
 * This is the single place the fork extends upstream `emulate`. It keeps
 * `registry.ts` and `@emulators/core` byte-identical to upstream so that
 * upstream syncs never conflict on them. Everything fork-specific lives here:
 *
 *   - extra services (Foundry) registered alongside the upstream registry
 *   - fork branding (the default docs-link URL) applied via a createServer wrapper
 *   - the default `test_token_admin` scope set, folded per enabled service
 *
 * Every CLI/API entry point imports the registry and `createServer` from here
 * instead of from upstream, so adding a fork service or changing branding
 * never edits an upstream-owned file. Invariant: `rg foundry packages/emulate/src`
 * should match only this file (plus fork tests).
 */
import { createServer as coreCreateServer, type ServerOptions, type ServicePlugin } from "@emulators/core";
import {
  SERVICE_REGISTRY as UPSTREAM_SERVICE_REGISTRY,
  SERVICE_NAMES as UPSTREAM_SERVICE_NAMES,
  type ServiceEntry,
  type LoadedService,
} from "./registry.js";

export { DEFAULT_TOKENS } from "./registry.js";

/** Fork docs site; the default documentation_url for every emulator's errors. */
const FORK_DOCS_BASE_URL = "https://foundryci.com";

/** A ServiceEntry plus optional fork-only metadata. */
export interface ForkServiceEntry extends ServiceEntry {
  /** Scopes folded into the default `test_token_admin` when this service is enabled. */
  defaultTokenScopes?: string[];
}

/** Services the fork adds on top of upstream. `satisfies` keeps the literal
 * keys so the composed `ServiceName` below includes "foundry". */
const FORK_SERVICE_ENTRIES = {
  foundry: {
    label: "Palantir Foundry OAuth 2.0 and current user emulator",
    endpoints: "OAuth authorize, token exchange, current user lookup",
    async load(): Promise<LoadedService> {
      const mod = await import("@emulators/foundry");
      return { plugin: mod.foundryPlugin, seedFromConfig: mod.seedFromConfig };
    },
    defaultFallback(cfg) {
      const firstLogin = (cfg?.users as Array<{ username?: string }> | undefined)?.[0]?.username ?? "admin";
      return { login: firstLogin, id: 1, scopes: ["api:admin-read"] };
    },
    defaultTokenScopes: ["api:admin-read"],
    initConfig: {
      foundry: {
        users: [
          {
            username: "jane",
            display_name: "Jane Smith",
            email: "jane@example.com",
            given_name: "Jane",
            family_name: "Smith",
            attributes: {
              department: ["Finance"],
            },
          },
        ],
        oauth_clients: [
          {
            client_id: "foundry-web",
            client_secret: "foundry-secret",
            name: "Foundry Web App",
            redirect_uris: ["http://localhost:3000/callback"],
            allowed_scopes: ["api:admin-read", "api:ontologies-read", "api:ontologies-write", "offline_access"],
          },
        ],
      },
    },
  },
} satisfies Record<string, ForkServiceEntry>;

/** Upstream services plus the fork's. Consumers import this, not registry.ts. */
export const SERVICE_REGISTRY = { ...UPSTREAM_SERVICE_REGISTRY, ...FORK_SERVICE_ENTRIES };

export type ServiceName = keyof typeof SERVICE_REGISTRY;

export const SERVICE_NAMES: readonly ServiceName[] = [
  ...UPSTREAM_SERVICE_NAMES,
  ...Object.keys(FORK_SERVICE_ENTRIES),
] as ServiceName[];

/** Base scopes for the convenience admin token; mirrors upstream's start/api default. */
const DEFAULT_ADMIN_SCOPES = ["repo", "user", "admin:org", "admin:repo_hook"];

/**
 * Build the default `test_token_admin`, folding in each enabled service's
 * `defaultTokenScopes`. For upstream-only services this returns exactly the
 * upstream default; with Foundry enabled it also carries `api:admin-read` so a
 * freshly started Foundry emulator can answer getCurrent out of the box.
 */
export function buildDefaultAdminToken(services: readonly ServiceName[]): {
  login: string;
  id: number;
  scopes: string[];
} {
  const scopes = new Set(DEFAULT_ADMIN_SCOPES);
  for (const svc of services) {
    const entry = SERVICE_REGISTRY[svc] as ForkServiceEntry;
    for (const s of entry.defaultTokenScopes ?? []) scopes.add(s);
  }
  return { login: "admin", id: 2, scopes: [...scopes] };
}

/**
 * createServer wrapper that defaults the docs link to the fork's docs site.
 * Upstream `core/server.ts` keeps its own default; we override it here via the
 * existing `options.docsUrl` seam rather than editing core.
 */
export function createServer(plugin: ServicePlugin, options: ServerOptions = {}) {
  const docsUrl = options.docsUrl ?? `${FORK_DOCS_BASE_URL}/${plugin.name}`;
  return coreCreateServer(plugin, { ...options, docsUrl });
}
