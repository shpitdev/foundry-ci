import Link from "next/link";
import { GeistPixelSquare } from "geist/font/pixel";
import { Code } from "@/components/code";
import { HeroTerminal } from "@/components/hero-terminal";
import { docsSections } from "@/lib/docs-sections";
import { GITHUB_URL, NPM_PACKAGE, SITE_NAME } from "@/lib/site";

const serviceLinks = docsSections.find((section) => section.title === "Services")?.items ?? [];

const PROGRAMMATIC_EXAMPLE = `import { createEmulator } from "${NPM_PACKAGE}";

const foundry = await createEmulator({ service: "foundry", port: 4000 });

afterEach(() => foundry.reset());
afterAll(() => foundry.close());`;

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
            Run <span className={`${GeistPixelSquare.className} font-normal`}>Foundry</span> on localhost
          </h1>
          <p className="mb-8 max-w-xl text-base text-neutral-600 dark:text-neutral-400">
            {SITE_NAME} is a stateful, production-fidelity Palantir Foundry emulator for dev and CI. OAuth flows,
            Multipass identity, and Compute Module jobs — no live stack, no API keys, not mocks.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/foundry/getting-started"
              className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Get started
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 px-4 text-sm text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source
            </a>
          </div>
        </div>

        {/* Terminal */}
        <div
          className="relative animate-in fade-in slide-in-from-bottom-2 duration-700"
          style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 rounded-[3rem] bg-gradient-to-br from-[#7d70ff]/25 via-[#13a5c6]/15 to-transparent blur-2xl"
          />
          <HeroTerminal pixelFont={GeistPixelSquare.className} />
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100">What this gives you</h2>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Multipass-compatible auth
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                OAuth 2.0 authorization code with PKCE, client credentials, refresh-token rotation, and scope
                enforcement — the token endpoints your Foundry SDK already calls.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">Compute Modules</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Register runtimes, poll for jobs, post results. The full job lifecycle runs locally, including seeded
                deployed apps and runtime credentials.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">Stateful, not mocks</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Enroll users, mint tokens, run jobs — state persists across requests, so multi-step flows behave like a
                real stack.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">Offline and CI-ready</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No network, no Docker, no shared sandbox enrollments. Same deterministic behavior in GitHub Actions as
                on your laptop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Point your Foundry client at localhost
          </h2>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            Your existing code stays the same. Just change the host and token.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-500">Before</div>
              <div className="flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-950 dark:border-neutral-800">
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-400 font-mono">
                  <code>{`const client = createClient(
  "https://acme.palantirfoundry.com",
  ontologyRid,
  confidentialClientAuth
)

// needs a live enrollment
// needs network + approvals
// shared, mutable stack`}</code>
                </pre>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">With {SITE_NAME}</div>
              <div className="flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-950 dark:border-neutral-800">
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-400 font-mono">
                  <code>
                    {`const client = createClient(
  `}
                    <span className="text-emerald-400">{`"http://localhost:4000"`}</span>
                    {`,
  ontologyRid,
  () => `}
                    <span className="text-emerald-400">{`"foundry_test_token"`}</span>
                    {`
)

// offline, instant, stateful`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage modes */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Use it your way</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">CLI</div>
              <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                Run alongside your dev server. Foundry only, or any mix of services.
              </p>
              <div className="overflow-x-auto rounded-md bg-neutral-100 px-3 py-2 font-mono text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                npx {NPM_PACKAGE} --service foundry
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">Seed config</div>
              <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                Generate a starter config with users, OAuth clients, and compute-module runtimes, then check it into
                your repo. See{" "}
                <Link
                  href="/docs/foundry/reference/seed-config"
                  className="text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:decoration-neutral-100"
                >
                  Seed Config
                </Link>{" "}
                for every field.
              </p>
              <div className="overflow-x-auto rounded-md bg-neutral-100 px-3 py-2 font-mono text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                npx {NPM_PACKAGE} init --service foundry
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">Programmatic API</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Import into Vitest or Jest. Start per-suite, reset between tests. See the{" "}
                <Link
                  href="/docs/programmatic-api"
                  className="text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:decoration-neutral-100"
                >
                  Programmatic API
                </Link>{" "}
                docs for instance methods.
              </p>
              <Code lang="typescript">{PROGRAMMATIC_EXAMPLE}</Code>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Foundry */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Beyond Foundry</h2>
          <p className="mb-6 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            {SITE_NAME} is built on emulate, so the same process can stand in for {serviceLinks.length} more services
            your app talks to — each one stateful and protocol-faithful.
          </p>
          <ul className="flex flex-wrap gap-2">
            {serviceLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
