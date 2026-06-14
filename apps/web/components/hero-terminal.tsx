"use client";

import { useState } from "react";
import { NPM_PACKAGE } from "@/lib/site";

// Ports are assigned in the order passed to --service, so Foundry stays on
// the base port. The CLI banner name ("emulate") is the bin name, which is
// stable across site renames.
const services = [
  { name: "Foundry", port: 4000, slug: "foundry" },
  { name: "GitHub", port: 4001, slug: "github" },
  { name: "Slack", port: 4002, slug: "slack" },
  { name: "Stripe", port: 4003, slug: "stripe" },
];

const CLI_VERSION = "v0.6.0";

export function HeroTerminal({ pixelFont }: { pixelFont: string }) {
  const [portless, setPortless] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 shadow-lg dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        </div>
        <div className="flex items-center gap-2 px-2 py-1 text-[11px] text-neutral-500">
          <span className={portless ? "text-emerald-400" : ""}>{portless ? "HTTPS" : "HTTP"}</span>
          <button
            onClick={() => setPortless((p) => !p)}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              portless ? "bg-emerald-500" : "bg-neutral-700"
            }`}
            aria-label="Toggle portless"
          >
            <span
              className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                portless ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
          <a
            href="https://portless.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            portless
          </a>
        </div>
      </div>
      <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-neutral-400 font-mono">
        <code>
          <span className="text-neutral-500">$</span>{" "}
          <span className="text-neutral-200">
            npx {NPM_PACKAGE} --service foundry,github,slack,stripe{portless ? " --portless" : ""}
          </span>
          {"\n\n"}
          <span className={`${pixelFont} text-neutral-200`}>emulate</span>
          {` ${CLI_VERSION}\n\n`}
          {services.map((s) => (
            <span key={s.name}>
              {"  "}
              <span className="text-neutral-500">{s.name.padEnd(14)}</span>
              <span className="text-emerald-400">
                {portless ? `https://${s.slug}.emulate.localhost` : `http://localhost:${s.port}`}
              </span>
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
