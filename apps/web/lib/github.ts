import { GITHUB_REPO } from "./site";

const REVALIDATE = 86400;

export async function getStarCount(): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return "";
    const data = await res.json();
    const count = data.stargazers_count;
    // Returns a display string; an empty string (also used for zero stars)
    // hides the badge entirely.
    if (typeof count !== "number" || count === 0) return "";
    if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
    return String(count);
  } catch {
    return "";
  }
}
