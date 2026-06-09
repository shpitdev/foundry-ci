import Link from "next/link";

const QUICK_START = `# Start the Foundry emulator on its own
npx @nyrra/emulate --service foundry

# Verify it is running (uses the bundled foundry_test_token)
curl -H "Authorization: Bearer foundry_test_token" \\
  http://localhost:4000/multipass/api/me`;

const CLI = `# Start the default startup set
emulate

# Start specific services (Foundry first keeps it on the base port)
emulate --service foundry,github

# Custom base port (auto-increments per service)
emulate --port 3000

# Use a seed config file
emulate --seed emulate.config.yaml

# Generate a starter config for Foundry
emulate init --service foundry

# List available services
emulate list`;

const DEFAULT_STARTUP = [
  { label: "Vercel", port: 4000 },
  { label: "GitHub", port: 4001 },
  { label: "Google", port: 4002 },
  { label: "Slack", port: 4003 },
  { label: "Apple", port: 4004 },
  { label: "Microsoft Entra ID", port: 4005 },
  { label: "AWS", port: 4006 },
];

const SUPPORTED_SERVICES_PROSE =
  "Apple, AWS, Clerk, GitHub, Google, Microsoft, MongoDB Atlas, Okta, Resend, Slack, Stripe, and Vercel";

const link =
  "text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:decoration-neutral-100";
const inlineCode = "rounded bg-neutral-100 px-1.5 py-0.5 text-[13px] dark:bg-neutral-800";
const h2 = "mb-4 mt-12 text-lg font-semibold text-neutral-900 dark:text-neutral-100";
const p = "mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-[13px] leading-relaxed dark:border-neutral-800 dark:bg-neutral-900">
      <code className="font-mono text-neutral-800 dark:text-neutral-200">{code}</code>
    </pre>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Local Foundry Emulation
      </h1>

      <p className={p}>
        FoundryCI is a Nyrra project that runs Palantir Foundry locally for CI and no-network sandboxes. It emulates the
        OAuth 2.0, current-user, and compute-module routes Foundry clients depend on, with production-fidelity state
        instead of mocks. FoundryCI is built on{" "}
        <a className={link} href="https://github.com/vercel-labs/emulate" target="_blank" rel="noopener noreferrer">
          emulate by Vercel Labs
        </a>
        , so the same process can also stand in for {SUPPORTED_SERVICES_PROSE} inside your test runs.
      </p>

      <h2 className={`${h2} first:mt-0`}>Start with Foundry</h2>

      <p className={p}>
        FoundryCI should get you to local Foundry first, not make you hunt through generic emulate docs. These are the
        pages to start with:
      </p>

      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
        <li>
          <Link className={link} href="/docs/foundry/getting-started">
            Getting Started
          </Link>{" "}
          shows the fastest path to a local Foundry process, seed config, and a first verification request.
        </li>
        <li>
          <Link className={link} href="/docs/foundry/reference/endpoints">
            Endpoint Reference
          </Link>{" "}
          covers the OAuth 2.0 endpoints, current-user lookup, compute-module runtime, and contour job routes.
        </li>
        <li>
          <Link className={link} href="/docs/configuration">
            Configuration
          </Link>{" "}
          shows the seed config for users, OAuth clients, deployed apps, and compute-module runtimes.
        </li>
      </ul>

      <p className={p}>
        Bring up the Foundry emulator with <code className={inlineCode}>npx @nyrra/emulate --service foundry</code> or
        include <code className={inlineCode}>foundry:</code> in the seed config. When Foundry runs by itself, its base
        URL is <code className={inlineCode}>http://localhost:4000</code>.
      </p>

      <h2 className={h2}>Foundry Quick Start</h2>

      <CodeBlock code={QUICK_START} />

      <p className={p}>
        Set <code className={inlineCode}>FOUNDRY_EMULATOR_URL=http://localhost:4000</code> when Foundry is running on its
        own. If you launch more than one service, use the startup banner to see which port Foundry received.
      </p>

      <h2 className={h2}>Default Startup Set</h2>

      <p className={p}>
        The generic multi-service emulate stack is still available. It starts with sensible defaults and keeps Foundry
        out of the default list unless you opt in:
      </p>

      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
        {DEFAULT_STARTUP.map((service) => (
          <li key={service.label}>
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">{service.label}</strong> on{" "}
            <code className={inlineCode}>http://localhost:{service.port}</code>
          </li>
        ))}
      </ul>

      <h2 className={h2}>CLI</h2>

      <CodeBlock code={CLI} />

      <h2 className={h2}>Options</h2>

      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th className="pb-2 pr-4 text-left font-medium text-neutral-900 dark:text-neutral-100">Flag</th>
              <th className="pb-2 pr-4 text-left font-medium text-neutral-900 dark:text-neutral-100">Default</th>
              <th className="pb-2 text-left font-medium text-neutral-900 dark:text-neutral-100">Description</th>
            </tr>
          </thead>
          <tbody className="text-neutral-600 dark:text-neutral-400">
            <tr className="border-b border-neutral-100 dark:border-neutral-800/50">
              <td className="py-2 pr-4">
                <code className={inlineCode}>-p, --port</code>
              </td>
              <td className="py-2 pr-4">
                <code className={inlineCode}>4000</code>
              </td>
              <td className="py-2">Base port (auto-increments per service)</td>
            </tr>
            <tr className="border-b border-neutral-100 dark:border-neutral-800/50">
              <td className="py-2 pr-4">
                <code className={inlineCode}>-s, --service</code>
              </td>
              <td className="py-2 pr-4">default startup set</td>
              <td className="py-2">Comma-separated services to enable</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <code className={inlineCode}>--seed</code>
              </td>
              <td className="py-2 pr-4">auto-detect</td>
              <td className="py-2">Path to seed config (YAML or JSON)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={p}>
        The port can also be set via <code className={inlineCode}>EMULATE_PORT</code> or{" "}
        <code className={inlineCode}>PORT</code> environment variables.
      </p>

      <h2 className={h2}>Programmatic API</h2>

      <p className={p}>
        You can also use emulate as a library in your tests. See the{" "}
        <Link className={link} href="/docs/programmatic-api">
          Programmatic API
        </Link>{" "}
        page for <code className={inlineCode}>createEmulator</code>, Vitest/Jest setup, and instance methods.
      </p>

      <h2 className={h2}>Next.js Integration</h2>

      <p className={p}>
        Embed emulators directly in your Next.js app so they run on the same origin. See the{" "}
        <Link className={link} href="/docs/nextjs">
          Next.js Integration
        </Link>{" "}
        page for setup instructions.
      </p>
    </div>
  );
}
