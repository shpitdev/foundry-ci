"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavSection = {
  title?: string;
  items: { href: string; label: string }[];
};

const sections: NavSection[] = [
  {
    items: [
      { href: "/docs", label: "Getting Started" },
      { href: "/docs/programmatic-api", label: "Programmatic API" },
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/docs/nextjs", label: "Next.js Integration" },
    ],
  },
  {
    title: "Foundry",
    items: [{ href: "/docs/foundry/getting-started", label: "Getting Started" }],
  },
  {
    title: "Foundry · Auth",
    items: [
      { href: "/docs/foundry/auth/oauth", label: "OAuth 2.0" },
      { href: "/docs/foundry/auth/client-credentials", label: "Client Credentials" },
      { href: "/docs/foundry/auth/refresh-tokens", label: "Refresh Tokens" },
      { href: "/docs/foundry/auth/scopes", label: "Scopes" },
      { href: "/docs/foundry/auth/current-user", label: "Current User" },
    ],
  },
  {
    title: "Foundry · Admin",
    items: [{ href: "/docs/foundry/admin/users", label: "Users" }],
  },
  {
    title: "Foundry · Compute Modules",
    items: [
      { href: "/docs/foundry/compute-modules/overview", label: "Overview" },
      { href: "/docs/foundry/compute-modules/runtimes", label: "Runtimes" },
      { href: "/docs/foundry/compute-modules/jobs", label: "Jobs" },
    ],
  },
  {
    title: "Foundry · Reference",
    items: [
      { href: "/docs/foundry/reference/seed-config", label: "Seed Config" },
      { href: "/docs/foundry/reference/endpoints", label: "Endpoints" },
      { href: "/docs/foundry/reference/scope-matrix", label: "Scope Matrix" },
    ],
  },
  {
    title: "Services",
    items: [
      { href: "/docs/vercel", label: "Vercel" },
      { href: "/docs/github", label: "GitHub" },
      { href: "/docs/google", label: "Google" },
      { href: "/docs/slack", label: "Slack" },
      { href: "/docs/apple", label: "Apple" },
      { href: "/docs/microsoft", label: "Microsoft Entra ID" },
      { href: "/docs/aws", label: "AWS" },
      { href: "/docs/okta", label: "Okta" },
      { href: "/docs/mongoatlas", label: "MongoDB Atlas" },
      { href: "/docs/resend", label: "Resend" },
      { href: "/docs/stripe", label: "Stripe" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/docs/authentication", label: "Authentication" },
      { href: "/docs/architecture", label: "Architecture" },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function DocsNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:py-12">
      <div className="flex gap-12">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <article className="max-w-none">{children}</article>
        </main>
      </div>
    </div>
  );
}
