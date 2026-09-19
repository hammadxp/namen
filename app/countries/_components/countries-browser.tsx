"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAutoHideOnScroll } from "@/hooks/use-auto-hide";
import type { Country } from "@/types/catalog";
import { cn } from "@/lib/utils";

type CountrySort = "name" | "region" | "most-cities" | "fewest-cities";

export function CountriesBrowser({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [sort, setSort] = useState<CountrySort>("most-cities");
  const toolbarHidden = useAutoHideOnScroll();
  const visible = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase();
    return countries
      .filter((country) =>
        `${country.name} ${country.code} ${country.region} ${country.subregion}`.toLowerCase().includes(value)
      )
      .sort((a, b) => {
        if (sort === "region") return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
        if (sort === "most-cities") return b.cityCount - a.cityCount || a.name.localeCompare(b.name);
        if (sort === "fewest-cities") return a.cityCount - b.cityCount || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
  }, [countries, deferredQuery, sort]);

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <section
        className="relative mb-[42px] grid grid-cols-[1.3fr_0.7fr] items-end gap-[50px] border-b-2 border-ink pb-8 max-[780px]:grid-cols-1 max-[780px]:gap-[18px]"
        style={{ "--accent": "var(--lemon)" } as React.CSSProperties}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-2.5 w-[min(42%,560px)] origin-left animate-[rule-grow_620ms_100ms_cubic-bezier(0.2,0.72,0.2,1)_both] border-r-2 border-ink bg-[var(--accent)] max-[560px]:w-2/3"
        />
        <div>
          <p className="mb-1.5 text-xs font-black text-muted-foreground">{countries.length} places</p>
          <h1 className="m-0 font-heading text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.065em]">
            Countries
          </h1>
        </div>
        <p className="mb-1 max-w-[470px] text-[1.05rem] leading-[1.55] text-[oklch(0.4295_0.0312_289.8)]">
          Browse every country in the local city index, then open its complete city list.
        </p>
      </section>
      <section
        className={cn(
          "sticky top-[90px] z-20 flex items-end gap-2.5 border-2 border-ink bg-paper/95 p-3 shadow-[5px_5px_0_var(--violet)] backdrop-blur-[12px] transition-[opacity,transform] duration-200 max-[780px]:top-[82px] max-[780px]:flex-wrap max-[560px]:top-[116px]",
          toolbarHidden && "pointer-events-none -translate-y-[calc(100%+110px)] opacity-0"
        )}
      >
        <label className="flex min-h-[50px] flex-1 items-center gap-2.5 border border-ink bg-white px-3.5 max-[780px]:basis-full">
          <Search size={18} />
          <input
            className="w-full min-w-0 border-0 bg-transparent font-bold outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country, region, or code"
          />
        </label>
        <label className="grid flex-1 gap-1 max-[780px]:flex-1">
          <span className="text-[0.65rem] font-black">Sort</span>
          <select
            className="h-[50px] min-w-[168px] border border-ink bg-white px-[13px] pr-11 font-extrabold max-[780px]:w-full max-[780px]:min-w-0"
            value={sort}
            onChange={(event) => setSort(event.target.value as CountrySort)}
          >
            <option value="name">Name</option>
            <option value="region">Region</option>
            <option value="most-cities">Most cities</option>
            <option value="fewest-cities">Fewest cities</option>
          </select>
        </label>
      </section>
      <div className="my-6 mb-3.5 text-xs font-black text-muted-foreground">{visible.length} countries</div>
      <section className="grid grid-cols-3 gap-2.5 max-[1050px]:grid-cols-2 max-[560px]:grid-cols-1">
        {visible.map((country) => (
          <Link
            className="group grid min-h-[92px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-2 border-ink bg-white/70 p-[15px] no-underline transition-[background,transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)] [&:nth-child(4n):hover]:bg-orange/40 [&:nth-child(4n+1):hover]:bg-lemon [&:nth-child(4n+2):hover]:bg-cyan/45 [&:nth-child(4n+3):hover]:bg-mint/45"
            href={`/categories/cities?country=${country.code}`}
            key={country.code}
          >
            <span className="text-[1.45rem] leading-none">{country.emoji}</span>
            <div>
              <h2 className="m-0 font-heading text-[1.18rem] tracking-[-0.04em]">{country.name}</h2>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">{country.subregion || country.region}</p>
            </div>
            <strong className="text-right">
              {country.cityCount.toLocaleString()}
              <small className="block text-[0.62rem] text-muted-foreground">cities</small>
            </strong>
          </Link>
        ))}
      </section>
      {visible.length === 0 && (
        <div className="grid min-h-[360px] place-content-center justify-items-center gap-3 text-center font-extrabold">
          <h2 className="m-0">No countries found</h2>
          <p className="m-0">Try another name, region, or code.</p>
        </div>
      )}
    </main>
  );
}
