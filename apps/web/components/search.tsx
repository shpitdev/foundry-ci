"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SearchResult = {
  title: string;
  href: string;
  snippet: string;
};

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState(false);

  const cancelSearch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort();
  }, []);

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      cancelSearch();
      setOpen(nextOpen);
      setQuery("");
      setResults([]);
      setLoading(false);
      setError(false);
      setActiveIndex(0);
    },
    [cancelSearch],
  );

  // React's ref lifecycle owns the global shortcut subscription.
  const shortcutRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (!node) return;
      function onKeyDown(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          changeOpen(!open);
        }
      }
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    },
    [open, changeOpen],
  );

  const inputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) return cancelSearch;
    },
    [cancelSearch],
  );

  function navigate(href: string) {
    changeOpen(false);
    router.push(href);
  }

  function changeQuery(value: string) {
    cancelSearch();
    setQuery(value);
    setResults([]);
    setActiveIndex(0);
    setError(false);
    const q = value.trim();
    setLoading(Boolean(q));
    if (!q) return;

    const controller = new AbortController();
    abortRef.current = controller;
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (!controller.signal.aborted) setResults(data.results);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 150);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, Math.min(i + 1, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex].href);
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <button
        ref={shortcutRef}
        onClick={() => changeOpen(true)}
        className="hidden sm:flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search docs
        <kbd className="pointer-events-none ml-1 inline-flex items-center gap-0.5 rounded border border-border/50 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          <span>&#8984;</span>K
        </kbd>
      </button>

      <button
        onClick={() => changeOpen(true)}
        className="sm:hidden flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search docs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent showCloseButton={false} aria-describedby={undefined} className="gap-0 p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search documentation</DialogTitle>
          <div className="flex items-center gap-2 border-b border-border/50 px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search docs..."
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => changeQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="max-h-[min(60vh,400px)] overflow-y-auto p-2">
            {loading && hasQuery ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </div>
            ) : error ? (
              <p role="alert" className="py-6 text-center text-sm text-muted-foreground">
                Search is unavailable. Try again.
              </p>
            ) : hasQuery && results.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
            ) : !hasQuery ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Type to search documentation...</p>
            ) : (
              results.map((item, i) => (
                <button
                  key={item.href}
                  data-active={i === activeIndex}
                  ref={(node) => {
                    if (i === activeIndex) node?.scrollIntoView({ block: "nearest" });
                  }}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left transition-colors",
                    i === activeIndex ? "bg-muted text-foreground" : "text-foreground",
                  )}
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.snippet && (
                    <span className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">{item.snippet}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
