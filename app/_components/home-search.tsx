"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Category } from "@/types/catalog";

export function HomeSearch({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("cities");
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return categories
      .flatMap((entry) =>
        entry.samples.filter((name) => name.toLowerCase().includes(value)).map((name) => ({ name, category: entry }))
      )
      .slice(0, 8);
  }, [categories, query]);

  function search(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(`/categories/${category}${value ? `?q=${encodeURIComponent(value)}` : ""}`);
  }

  return (
    <section
      className="relative grid min-h-[540px] place-content-center overflow-hidden border-b-2 border-ink bg-ink px-[clamp(1.125rem,8vw,8.125rem)] pt-[88px] pb-40 text-white max-[780px]:min-h-[500px] max-[780px]:pt-[68px] max-[560px]:min-h-[550px] max-[560px]:px-4"
      aria-labelledby="search-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(oklch(1_0_0_/_6%)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0_/_6%)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] bg-[size:46px_46px]"
      />
      <div className="relative z-[1] flex w-full max-w-[1050px] items-end justify-between gap-[35px] max-[780px]:flex-col max-[780px]:items-start">
        <h1
          id="search-title"
          className="m-0 max-w-[720px] animate-[hero-copy-in_650ms_cubic-bezier(0.2,0.72,0.2,1)_both] font-heading text-[clamp(3.4rem,7vw,6.7rem)] leading-[0.9] tracking-[-0.07em]"
        >
          Find a name worth keeping.
        </h1>
        <p className="mb-2 max-w-[275px] leading-[1.45] font-semibold text-white/85 max-[780px]:max-w-[520px]">
          Search cities, colors, fruit, stars, elements, and the language of science.
        </p>
      </div>
      <div className="relative z-[1] w-full max-w-[1050px]">
        <form
          className="relative mt-12 grid w-full animate-[search-in_560ms_120ms_cubic-bezier(0.2,0.72,0.2,1)_both] grid-cols-[auto_minmax(180px,1fr)_auto_auto] items-center border-2 border-ink bg-white text-ink shadow-[10px_10px_0_var(--orange)] max-[780px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] max-[560px]:mt-[34px] max-[560px]:shadow-[6px_6px_0_var(--orange)]"
          onSubmit={search}
        >
          <Search
            className="ml-5 text-violet max-[780px]:absolute max-[780px]:top-[25px] max-[780px]:left-[18px] max-[780px]:ml-0"
            aria-hidden="true"
            size={24}
          />
          <input
            className="h-[76px] min-w-0 border-0 bg-transparent px-4 text-[clamp(1.05rem,2vw,1.35rem)] font-semibold outline-none max-[780px]:col-span-full max-[780px]:pl-[58px] max-[560px]:h-[66px] max-[560px]:text-base"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Lahore, Azure, Quasar..."
            aria-label="Search names"
          />
          <select
            className="ml-3 h-12 w-[calc(100%-12px)] max-w-[205px] max-w-none rounded-full border border-ink bg-[color-mix(in_oklch,var(--cyan)_25%,var(--white))] px-[14px] pr-11 font-extrabold max-[780px]:col-start-1 max-[780px]:row-start-2 max-[780px]:mb-3"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Search category"
          >
            {categories
              .filter((entry) => entry.slug !== "countries")
              .map((entry) => (
                <option value={entry.slug} key={entry.slug}>
                  {entry.name}
                </option>
              ))}
          </select>
          <button
            className="min-w-[122px] self-stretch border-0 border-l-2 border-ink bg-lemon font-black transition-colors duration-150 hover:bg-mint max-[780px]:col-start-2 max-[780px]:row-start-2 max-[780px]:min-h-[58px]"
            type="submit"
          >
            Search
          </button>
        </form>
        {matches.length > 0 && (
          <div className="absolute top-full left-0 mt-5 flex max-h-32 w-full flex-wrap gap-2 overflow-y-auto" aria-label="Quick matches">
            {matches.map((match) => (
              <button
                className="flex gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white hover:text-ink"
                key={`${match.category.slug}-${match.name}`}
                onClick={() => router.push(`/categories/${match.category.slug}?q=${encodeURIComponent(match.name)}`)}
                type="button"
              >
                <strong>{match.name}</strong>
                <span className="opacity-65">{match.category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
