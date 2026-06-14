import { readFile } from "fs/promises";
import { join } from "path";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import type { UIMessage } from "ai";
import { createBashTool } from "bash-tool";
import { allDocsPages } from "@/lib/docs-navigation";
import { mdxToCleanMarkdown } from "@/lib/mdx-to-markdown";

export const maxDuration = 60;

// Routed through Vercel AI Gateway. Spend is capped by the gateway API key's
// budget (set via `vercel ai-gateway api-keys create --budget`), so there is no
// per-request rate limiter here. DeepSeek V4 Flash does implicit prefix caching,
// so no explicit cache-control headers are needed.
const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";

const SYSTEM_PROMPT = `You are a helpful documentation assistant for emulate, a local drop-in replacement for Vercel, GitHub, Google, Slack, Apple, Microsoft, AWS, Okta, MongoDB Atlas, Resend, and Stripe APIs used in CI and no-network sandboxes.

emulate provides fully stateful, production-fidelity API emulation, not mocks. The CLI is installed as the "emulate" npm package and run via "npx emulate". It also supports a programmatic API via createEmulator and a Next.js adapter (@emulators/adapter-next) for embedding emulators in your app.

You have access to the full emulate documentation via the bash and readFile tools. The docs are available as markdown files in the /workspace/ directory.

When answering questions:
- Use the bash tool to list files (ls /workspace/) or search for content (grep -r "keyword" /workspace/)
- Use the readFile tool to read specific documentation pages (e.g. readFile with path "/workspace/index.md")
- Do NOT use bash to write, create, modify, or delete files (no tee, cat >, sed -i, echo >, cp, mv, rm, mkdir, touch, etc.). You are read-only
- Always base your answers on the actual documentation content
- Be concise and accurate
- If the docs don't cover a topic, say so honestly
- Do NOT include source references or file paths in your response
- Do NOT use emojis in your responses`;

async function loadDocsFiles(): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  const results = await Promise.allSettled(
    allDocsPages.map(async (page) => {
      const slug = page.href.replace(/^\//, "");
      const cwd = /* turbopackIgnore: true */ process.cwd();
      const filePath = slug ? join(cwd, "app", slug, "page.mdx") : join(cwd, "app", "page.mdx");

      const raw = await readFile(filePath, "utf-8");
      const md = mdxToCleanMarkdown(raw);
      const fileName = slug ? `/${slug}.md` : "/index.md";
      return { fileName, md };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      files[result.value.fileName] = result.value.md;
    }
  }

  return files;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const docsFiles = await loadDocsFiles();
  const {
    tools: { bash, readFile: readFileTool },
  } = await createBashTool({ files: docsFiles });

  const result = streamText({
    model: DEFAULT_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: { bash, readFile: readFileTool },
  });

  return result.toUIMessageStreamResponse();
}
