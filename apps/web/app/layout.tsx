import type { Metadata } from "next";
import Link from "next/link";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/search";
import { getStarCount } from "@/lib/github";
import {
  GITHUB_URL,
  NPM_URL,
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_NAME,
  SITE_OWNER,
  SITE_OWNER_URL,
  SITE_TAGLINE,
  SITE_URL,
  UPSTREAM_NAME,
  UPSTREAM_URL,
} from "@/lib/site";
import "./globals.css";

const ROOT_TITLE = `${SITE_NAME} by ${SITE_OWNER} | ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROOT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: { icon: SITE_LOGO },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${SITE_NAME} by ${SITE_OWNER}`,
    title: ROOT_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og", width: 1200, height: 630, alt: `${SITE_NAME} by ${SITE_OWNER}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og"],
  },
};

function Header({ stars }: { stars?: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm dark:bg-neutral-950/90">
      <div className="flex h-14 items-center justify-between px-4 gap-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE_LOGO} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
            <span className={`${GeistPixelSquare.className} text-lg leading-none`}>{SITE_NAME}</span>
          </Link>
          <span className="hidden text-neutral-300 sm:inline dark:text-neutral-700" aria-hidden="true">
            <svg height="14" strokeLinejoin="round" viewBox="0 0 16 16" width="14" style={{ color: "currentcolor" }}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <a
            href={SITE_OWNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs text-neutral-500 transition-colors hover:text-neutral-900 sm:inline dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            by {SITE_OWNER}
          </a>
        </div>
        <nav className="flex items-center gap-4">
          <Search />
          <Link
            href="/docs"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {stars && <span>{stars}</span>}
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            npm
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-500">
        <div>
          Built on{" "}
          <a
            href={UPSTREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {UPSTREAM_NAME}
          </a>
          .
        </div>
        <div>
          A{" "}
          <a
            href={SITE_OWNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {SITE_OWNER}
          </a>{" "}
          project.
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stars = await getStarCount();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <Header stars={stars} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
