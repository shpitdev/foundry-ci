export type NavItem = {
  name: string;
  href: string;
};

export const allDocsPages: NavItem[] = [
  { name: "Getting Started", href: "/docs" },
  { name: "Programmatic API", href: "/docs/programmatic-api" },
  { name: "Configuration", href: "/docs/configuration" },
  { name: "Next.js Integration", href: "/docs/nextjs" },
  { name: "Getting Started with Foundry", href: "/docs/foundry/getting-started" },
  { name: "OAuth 2.0 Authorization Flow", href: "/docs/foundry/auth/oauth" },
  { name: "Client Credentials Grant", href: "/docs/foundry/auth/client-credentials" },
  { name: "Token Refresh", href: "/docs/foundry/auth/refresh-tokens" },
  { name: "Scope Model", href: "/docs/foundry/auth/scopes" },
  { name: "Current User Endpoint", href: "/docs/foundry/auth/current-user" },
  { name: "User Management", href: "/docs/foundry/admin/users" },
  { name: "Compute Modules Overview", href: "/docs/foundry/compute-modules/overview" },
  { name: "Runtime Lifecycle", href: "/docs/foundry/compute-modules/runtimes" },
  { name: "Job Execution", href: "/docs/foundry/compute-modules/jobs" },
  { name: "Seed Config Reference", href: "/docs/foundry/reference/seed-config" },
  { name: "Endpoint Reference", href: "/docs/foundry/reference/endpoints" },
  { name: "Scope to Endpoint Mapping", href: "/docs/foundry/reference/scope-matrix" },
  { name: "Vercel API", href: "/docs/vercel" },
  { name: "GitHub API", href: "/docs/github" },
  { name: "Google API", href: "/docs/google" },
  { name: "Slack API", href: "/docs/slack" },
  { name: "Apple Sign In", href: "/docs/apple" },
  { name: "Microsoft Entra ID", href: "/docs/microsoft" },
  { name: "AWS", href: "/docs/aws" },
  { name: "Okta", href: "/docs/okta" },
  { name: "MongoDB Atlas", href: "/docs/mongoatlas" },
  { name: "Resend", href: "/docs/resend" },
  { name: "Stripe", href: "/docs/stripe" },
  { name: "Authentication", href: "/docs/authentication" },
  { name: "Architecture", href: "/docs/architecture" },
];
