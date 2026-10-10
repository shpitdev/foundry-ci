import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export async function isPublished(name, version, request = fetch) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`;
  const response = await request(url, { signal: AbortSignal.timeout(30_000) });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Registry lookup failed for ${name}@${version}: HTTP ${response.status}`);
  const metadata = await response.json();
  if (metadata.name !== name || metadata.version !== version) {
    throw new Error(`Unexpected registry metadata for ${name}@${version}`);
  }
  return true;
}

export async function unpublishedPackages(names, version, request = fetch) {
  const unpublished = [];
  for (const name of names) {
    if (!(await isPublished(name, version, request))) unpublished.push(name);
  }
  return unpublished;
}

async function main() {
  const pkg = JSON.parse(readFileSync(new URL("../packages/emulate/package.json", import.meta.url), "utf8"));
  const emulators = process.env.EMULATOR_PACKAGES?.trim().split(/\s+/).filter(Boolean);
  if (!emulators?.length) throw new Error("EMULATOR_PACKAGES must name the release packages");
  const names = [pkg.name, ...emulators.map((name) => `@emulators/${name}`)];
  const unpublished = await unpublishedPackages(names, pkg.version);
  console.error(`Version ${pkg.version}: ${unpublished.length} unpublished package(s)`);
  if (process.argv.includes("--list")) {
    console.log(unpublished.join(" "));
  } else {
    if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is required unless using --list");
    appendFileSync(process.env.GITHUB_OUTPUT, `should_release=${unpublished.length > 0}\nversion=${pkg.version}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
