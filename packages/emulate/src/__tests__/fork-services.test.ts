import { describe, it, expect } from "vitest";
import { createEmulator } from "../api.js";
import { SERVICE_NAMES, buildDefaultAdminToken } from "../fork-services.js";

// Fork-owned integration tests. Kept separate from upstream's api.test.ts so
// upstream syncs never conflict on it.
describe("fork services (Foundry)", () => {
  it("registers foundry alongside the upstream services", () => {
    expect(SERVICE_NAMES).toContain("foundry");
    // A representative upstream service is still present.
    expect(SERVICE_NAMES).toContain("github");
  });

  it("folds api:admin-read into the default admin token only when foundry is enabled", () => {
    expect(buildDefaultAdminToken(["github"]).scopes).not.toContain("api:admin-read");
    expect(buildDefaultAdminToken(["foundry"]).scopes).toContain("api:admin-read");
  });

  it("starts foundry with a default token that can read the current user", async () => {
    const foundry = await createEmulator({ service: "foundry", port: 14012 });

    const res = await fetch(`${foundry.url}/api/v2/admin/users/getCurrent`, {
      headers: { Authorization: "Bearer test_token_admin" },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { username: string };
    expect(body.username).toBe("admin");

    await foundry.close();
  });

  it("defaults the docs link to the fork docs site (createServer wrapper)", async () => {
    const foundry = await createEmulator({ service: "foundry", port: 14013 });

    // The 404 handler embeds the configured documentation_url.
    const res = await fetch(`${foundry.url}/this-route-does-not-exist`);
    const body = (await res.json()) as { documentation_url?: string };
    expect(body.documentation_url).toContain("foundryci.com");

    await foundry.close();
  });
});
