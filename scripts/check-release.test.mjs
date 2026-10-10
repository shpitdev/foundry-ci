import assert from "node:assert/strict";
import { test } from "node:test";
import { isPublished, unpublishedPackages } from "./check-release.mjs";

const metadata = (name, version) => Response.json({ name, version });

test("an existing release is skipped even when latest has moved forward", async () => {
  const calls = [];
  const request = async (url) => {
    calls.push(url);
    // The old latest-version comparison would republish 0.6.1.
    if (url === "https://registry.npmjs.org/emulate/latest") return metadata("emulate", "0.12.1");
    return metadata("emulate", "0.6.1");
  };
  assert.deepEqual(await unpublishedPackages(["emulate"], "0.6.1", request), []);
  assert.deepEqual(calls, ["https://registry.npmjs.org/emulate/0.6.1"]);
});

test("partial releases include only missing exact versions", async () => {
  const request = async (url) =>
    url.includes("%40emulators%2Fcore") ? new Response(null, { status: 404 }) : metadata("emulate", "0.6.1");
  assert.deepEqual(await unpublishedPackages(["emulate", "@emulators/core"], "0.6.1", request), ["@emulators/core"]);
});

test("registry authentication, throttling and server failures stop the release plan", async () => {
  for (const status of [401, 403, 429, 500, 503]) {
    await assert.rejects(
      isPublished("emulate", "0.6.1", async () => new Response(null, { status })),
      /Registry lookup failed/,
    );
  }
  await assert.rejects(
    isPublished("emulate", "0.6.1", async () => {
      throw new Error("network unavailable");
    }),
    /network unavailable/,
  );
});

test("malformed or mismatched metadata cannot authorize publishing", async () => {
  await assert.rejects(
    isPublished("emulate", "0.6.1", async () => metadata("emulate", "0.12.1")),
    /Unexpected registry metadata/,
  );
  await assert.rejects(
    isPublished("emulate", "0.6.1", async () => new Response("not JSON")),
    SyntaxError,
  );
});
