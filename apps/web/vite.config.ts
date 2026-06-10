import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
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
  ],
});
