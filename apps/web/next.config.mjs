import createMDX from "@next/mdx";

const withMDX = createMDX();

const oldDocsSlugs = [
  "programmatic-api",
  "configuration",
  "nextjs",
  "vercel",
  "github",
  "google",
  "slack",
  "apple",
  "microsoft",
  "aws",
  "okta",
  "mongoatlas",
  "resend",
  "stripe",
  "authentication",
  "architecture",
];

// FoundryCI docs previously lived at root-level /foundry/* paths (the
// web-svelte site). They now live under /docs/foundry/* like every other
// service doc, so redirect the old URLs.
const foundrySlugs = [
  "foundry/getting-started",
  "foundry/auth/oauth",
  "foundry/auth/client-credentials",
  "foundry/auth/current-user",
  "foundry/auth/refresh-tokens",
  "foundry/auth/scopes",
  "foundry/admin/users",
  "foundry/compute-modules/overview",
  "foundry/compute-modules/runtimes",
  "foundry/compute-modules/jobs",
  "foundry/reference/seed-config",
  "foundry/reference/endpoints",
  "foundry/reference/scope-matrix",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  serverExternalPackages: ["just-bash", "bash-tool"],
  async redirects() {
    return [
      ...oldDocsSlugs.map((slug) => ({ source: `/${slug}`, destination: `/docs/${slug}`, permanent: true })),
      ...foundrySlugs.map((slug) => ({ source: `/${slug}`, destination: `/docs/${slug}`, permanent: true })),
      { source: "/foundry", destination: "/docs/foundry/getting-started", permanent: true },
      { source: "/docs/foundry", destination: "/docs/foundry/getting-started", permanent: true },
    ];
  },
};

export default withMDX(nextConfig);
