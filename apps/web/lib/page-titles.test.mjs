import assert from "node:assert/strict";
import { test } from "node:test";
import { getPageTitle } from "./page-titles.ts";

test("OG titles resolve only documented pages", () => {
  assert.equal(getPageTitle(""), "Local Foundry\nEmulation");
  assert.equal(getPageTitle("foundry/auth/oauth"), "OAuth 2.0 Authorization Flow");
  for (const slug of ["missing", "constructor", "toString", "__proto__"]) {
    assert.equal(getPageTitle(slug), null, slug);
  }
});
