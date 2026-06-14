export type NavSection = {
  title?: string;
  items: { href: string; label: string }[];
};

// Sidebar structure shared by the desktop sidebar (docs-nav) and the mobile
// sheet (docs-mobile-nav). Keep in sync with lib/docs-navigation.ts (search
// index) and lib/page-titles.ts (page/OG titles) when adding pages.
export const docsSections: NavSection[] = [
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
