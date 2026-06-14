import { SERVICE_REGISTRY } from "../fork-services.js";

export function listCommand(): void {
  console.log("\nAvailable services:\n");
  for (const [name, entry] of Object.entries(SERVICE_REGISTRY)) {
    console.log(`  ${name.padEnd(10)}${entry.label}`);
    console.log(`            Endpoints: ${entry.endpoints}`);
    console.log();
  }
}
