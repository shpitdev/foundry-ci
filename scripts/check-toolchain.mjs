import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const config = readFileSync(new URL("mise.toml", root), "utf8");
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const expectedNode = config.match(/^node = "([^"]+)"$/m)[1];
const expectedPnpm = config.match(/^pnpm = "([^"]+)"$/m)[1];
assert.equal(process.versions.node, expectedNode, "Node must match mise.toml");
assert.equal(pkg.packageManager.split("+")[0], `pnpm@${expectedPnpm}`);
for (const cwd of [root, new URL("examples/nextjs-embedded/", root)]) {
  assert.equal(execFileSync("pnpm", ["--version"], { cwd, encoding: "utf8" }).trim(), expectedPnpm);
  assert.equal(
    execFileSync("pnpm", ["exec", "node", "-p", "process.versions.node"], { cwd, encoding: "utf8" }).trim(),
    expectedNode,
  );
}
console.log(`Node ${expectedNode} and pnpm ${expectedPnpm}: root and nested PATH verified`);

const npmVersion = execFileSync("npm", ["--version"], { encoding: "utf8" }).trim();
const [major, minor, patch] = npmVersion.split(".").map(Number);
assert.ok(
  major > 11 || (major === 11 && (minor > 5 || (minor === 5 && patch >= 1))),
  "npm >=11.5.1 is required for trusted publishing",
);
console.log(`npm ${npmVersion}: trusted-publishing client minimum verified`);
