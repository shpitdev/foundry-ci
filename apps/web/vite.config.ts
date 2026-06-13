import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // The Workers build resolves the "browser" condition, but just-bash's
      // browser bundle drops BashTransformPipeline and TeePlugin, which
      // bash-tool imports. Pin just-bash to its full ESM bundle; its node:
      // builtin imports are covered by the nodejs_compat flag.
      "just-bash": fileURLToPath(import.meta.resolve("just-bash")),
    },
  },
  plugins: [
    // vinext auto-injects @mdx-js/rollup when it detects MDX pages, but
    // without providerImportSource, so the root mdx-components.tsx mapping
    // (heading styles, shiki code blocks, GFM tables) never applies. Register
    // the plugin ourselves so vinext defers to this configuration.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        providerImportSource: "@/mdx-components",
      }),
    },
    vinext(),
    // Targets Cloudflare Workers: dev and build run the app in workerd, and
    // wrangler deploys the bundle described by wrangler.jsonc. The rsc/ssr
    // environment mapping is vinext's required App Router wiring.
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
