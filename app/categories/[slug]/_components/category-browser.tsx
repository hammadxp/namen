"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, LoaderCircle, Search, Share2 } from "lucide-react";
import { CatalogCard } from "@/components/card/catalog-card";
import { compareDistinctiveFruits, groupLabel, hasShortCityName } from "@/utils/catalog-display";
import type { CatalogItem, Category, SortMode } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { useAutoHideOnScroll } from "@/hooks/use-auto-hide";
import { readSavedNames, writeSavedNames } from "@/utils/saved-names";

const PAGE_SIZE = 60;

type CategoryBrowserProps = {
  category: Category;
  initialItems?: CatalogItem[];
  dataUrl?: string;
  initialQuery?: string;
  initialGroup?: string;
  initialCountry?: string;
};

export function CategoryBrowser({
  category,
  initialItems = [],
  dataUrl,
  initialQuery = "",
  initialGroup = "",
  initialCountry = "",
}: CategoryBrowserProps) {
  const router = useRouter();
  const changingCountryScope = useRef(false);
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(Boolean(dataUrl && !initialItems.length));
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [group, setGroup] = useState(initialGroup || initialCountry);
  const [sort, setSort] = useState<SortMode>(category.slug === "cities" ? "population" : "top");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [savedItems, setSavedItems] = useState<CatalogItem[]>([]);
  const savedIds = useMemo(() => new Set(savedItems.map((item) => item.id)), [savedItems]);
  const [feedback, setFeedback] = useState("");
  const toolbarHidden = useAutoHideOnScroll();

  useEffect(() => {
    queueMicrotask(() => setSavedItems(readSavedNames()));
  }, []);

  useEffect(() => {
    if (!dataUrl) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(dataUrl, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load collection");
        const rows: unknown = await response.json();
        if (!Array.isArray(rows)) throw new Error("Invalid collection data");
        setItems(rows as CatalogItem[]);
        setLoadError(false);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleWindow = hasIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 0);
    return () => {
      controller.abort();
      if (hasIdleCallback && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleWindow);
      } else {
        window.clearTimeout(idleWindow);
      }
    };
  }, [dataUrl]);

  useEffect(() => {
    if (changingCountryScope.current) return;
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (group && group !== initialCountry) url.searchParams.set("group", group);
    else url.searchParams.delete("group");
    window.history.replaceState(null, "", url);
  }, [group, initialCountry, query]);

  const eligibleItems = useMemo(() => items.filter(hasShortCityName), [items]);
  const groups = useMemo(() => {
    const values = new Map<string, string>();
    for (const item of eligibleItems) values.set(item.countryCode ?? item.group, groupLabel(item));
    return [...values].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
  }, [eligibleItems]);
  const filtered = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase();
    return eligibleItems
      .filter(
        (item) =>
          (!group || item.countryCode === group || item.group === group) &&
          (!value ||
            `${item.name} ${item.group} ${item.subtitle ?? ""} ${item.symbol ?? ""}`.toLowerCase().includes(value))
      )
      .sort((a, b) => {
        if (sort === "alphabetical") return a.name.localeCompare(b.name);
        if (sort === "population") return (b.population ?? b.atomicNumber ?? 0) - (a.population ?? a.atomicNumber ?? 0);
        if (category.slug === "fruits") return compareDistinctiveFruits(a, b);
        return (b.score ?? 0) - (a.score ?? 0) || a.name.localeCompare(b.name);
      });
  }, [category.slug, deferredQuery, eligibleItems, group, sort]);

  function toggleSaved(item: CatalogItem) {
    const isSaved = savedIds.has(item.id);
    const next = isSaved ? savedItems.filter((entry) => entry.id !== item.id) : [item, ...savedItems];
    if (!writeSavedNames(next)) {
      setFeedback("Could not save this name. Check browser storage and try again.");
      return;
    }
    setSavedItems(next);
    setFeedback(isSaved ? `${item.name} removed from saved names.` : `${item.name} saved.`);
  }

  async function share(item: CatalogItem) {
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(item.name)}`;
    try {
      if (navigator.share) await navigator.share({ title: `${item.name} on Naime`, url });
      else {
        await navigator.clipboard.writeText(url);
        setFeedback("Link copied.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback("Could not share this name. Try again.");
    }
  }

  return (
    <main className="mx-auto max-w-375 px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <section
        className="relative mb-10.5 grid grid-cols-[1.3fr_0.7fr] items-end gap-12.5 border-b-2 border-ink pb-8 max-[780px]:grid-cols-1 max-[780px]:gap-4.5"
        style={{ "--accent": category.accent } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-2.5 w-[min(42%,560px)] origin-left animate-[rule-grow_620ms_100ms_cubic-bezier(0.2,0.72,0.2,1)_both] border-r-2 border-ink bg-accent max-[560px]:w-2/3"
        />
        <div>
          <p className="mb-1.5 text-xs font-black text-muted-foreground">
            {(loading ? category.count : eligibleItems.length).toLocaleString()} local entries
          </p>
          <h1 className="m-0 font-heading text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.065em]">
            {category.name}
          </h1>
        </div>
        <p className="mb-1 max-w-117.5 text-[1.05rem] leading-[1.55] text-[oklch(0.4295_0.0312_289.8)]">
          {category.description}
        </p>
      </section>
      <section
        className={cn(
          "sticky top-22.5 z-20 flex items-end gap-2.5 border-2 border-ink bg-paper/95 p-3 shadow-[5px_5px_0_var(--violet)] backdrop-blur-md transition-[opacity,transform] duration-200 max-[780px]:top-20.5 max-[780px]:flex-wrap max-[560px]:top-29",
          toolbarHidden && "pointer-events-none -translate-y-[calc(100%+110px)] opacity-0"
        )}
      >
        <label className="flex min-h-12.5 flex-1 items-center gap-2.5 border border-ink bg-white px-3.5 max-[780px]:basis-full">
          <Search size={18} />
          <input
            className="w-full min-w-0 border-0 bg-transparent font-bold outline-none"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder={`Search ${category.name.toLowerCase()}`}
          />
        </label>
        <label className="grid flex-1 gap-1 max-[780px]:flex-1">
          <span className="text-[0.65rem] font-black">{category.slug === "cities" ? "Country" : "Group"}</span>
          <select
            className="h-12.5 min-w-42 border border-ink bg-white px-3.25 pr-11 font-extrabold max-[780px]:w-full max-[780px]:min-w-0"
            value={group}
            onChange={(event) => {
              if (initialCountry && !event.target.value) {
                changingCountryScope.current = true;
                router.push(`/categories/cities${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
                return;
              }
              setGroup(event.target.value);
              setLimit(PAGE_SIZE);
            }}
          >
            <option value="">All</option>
            {groups.map((entry) => (
              <option value={entry.value} key={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid flex-1 gap-1 max-[780px]:flex-1">
          <span className="text-[0.65rem] font-black">Sort</span>
          <select
            className="h-12.5 min-w-42 border border-ink bg-white px-3.25 pr-11 font-extrabold max-[780px]:w-full max-[780px]:min-w-0"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
          >
            <option value="top">{category.slug === "fruits" ? "Distinctive first" : "Top names"}</option>
            <option value="alphabetical">A to Z</option>
            {(category.slug === "cities" || category.slug === "elements") && (
              <option value="population">{category.slug === "cities" ? "Population" : "Atomic number"}</option>
            )}
          </select>
        </label>
      </section>
      {feedback && (
        <p className="my-6 mb-3.5 text-xs font-black text-muted-foreground" role="status">
          {feedback}
        </p>
      )}
      <div className="my-6 mb-3.5 text-xs font-black text-muted-foreground">
        {loading ? "Loading local index" : `${filtered.length.toLocaleString()} results`}
      </div>
      {loading ? (
        <div className="grid min-h-90 place-content-center justify-items-center gap-3 text-center font-extrabold">
          <LoaderCircle className="animate-[spin_900ms_linear_infinite]" /> Opening the collection
        </div>
      ) : loadError ? (
        <div
          className="grid min-h-90 place-content-center justify-items-center gap-3 text-center font-extrabold"
          role="alert"
        >
          <h2 className="m-0">Collection unavailable</h2>
          <p className="m-0">Reload the page to try again.</p>
        </div>
      ) : (
        <section
          className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-3 max-[780px]:grid-cols-2 max-[560px]:grid-cols-1"
          aria-live="polite"
        >
          {filtered.slice(0, limit).map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => toggleSaved(item)}
                    aria-label={`${savedIds.has(item.id) ? "Remove" : "Save"} ${item.name}`}
                  >
                    <Bookmark size={17} fill={savedIds.has(item.id) ? "currentColor" : "none"} />
                  </button>
                  <button type="button" onClick={() => share(item)} aria-label={`Share ${item.name}`}>
                    <Share2 size={17} />
                  </button>
                </>
              }
            />
          ))}
        </section>
      )}
      {!loading && !loadError && limit < filtered.length && (
        <button
          className="mx-auto mt-9 block h-13 min-w-47.5 border-2 border-ink bg-lemon font-black shadow-[5px_5px_0_var(--ink)] transition-colors hover:bg-mint"
          type="button"
          onClick={() => setLimit((value) => value + PAGE_SIZE)}
        >
          Show {Math.min(PAGE_SIZE, filtered.length - limit)} more
        </button>
      )}
      {!loading && !loadError && filtered.length === 0 && (
        <div className="grid min-h-90 place-content-center justify-items-center gap-3 text-center font-extrabold">
          <h2 className="m-0">No matches</h2>
          <p className="m-0">Try a shorter word or clear the current filter.</p>
        </div>
      )}
    </main>
  );
}
