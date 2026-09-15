"use client"

import Link from "next/link"
import { useDeferredValue, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useAutoHideOnScroll } from "@/components/use-auto-hide"
import type { Country } from "@/lib/types"
import { cn } from "@/lib/utils"

type CountrySort = "name" | "region" | "most-cities" | "fewest-cities"

export function CountriesBrowser({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [sort, setSort] = useState<CountrySort>("most-cities")
  const toolbarHidden = useAutoHideOnScroll()
  const visible = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase()
    return countries
      .filter((country) =>
        `${country.name} ${country.code} ${country.region} ${country.subregion}`
          .toLowerCase()
          .includes(value)
      )
      .sort((a, b) => {
        if (sort === "region")
          return (
            a.region.localeCompare(b.region) || a.name.localeCompare(b.name)
          )
        if (sort === "most-cities")
          return b.cityCount - a.cityCount || a.name.localeCompare(b.name)
        if (sort === "fewest-cities")
          return a.cityCount - b.cityCount || a.name.localeCompare(b.name)
        return a.name.localeCompare(b.name)
      })
  }, [countries, deferredQuery, sort])

  return (
    <main className="page-shell">
      <section className="page-heading country-heading">
        <div>
          <p>{countries.length} places</p>
          <h1>Countries</h1>
        </div>
        <p>
          Browse every country in the local city index, then open its complete
          city list.
        </p>
      </section>
      <section className={cn("browser-toolbar", toolbarHidden && "is-hidden")}>
        <label className="field grow">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country, region, or code"
          />
        </label>
        <label className="select-field">
          <span>Sort</span>
          <select
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
      <div className="result-count">{visible.length} countries</div>
      <section className="country-grid">
        {visible.map((country) => (
          <Link
            className="country-card"
            href={`/categories/cities?country=${country.code}`}
            key={country.code}
          >
            <span className="flag">{country.emoji}</span>
            <div>
              <h2>{country.name}</h2>
              <p>{country.subregion || country.region}</p>
            </div>
            <strong>
              {country.cityCount.toLocaleString()}
              <small>cities</small>
            </strong>
          </Link>
        ))}
      </section>
    </main>
  )
}
