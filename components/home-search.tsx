"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import type { Category } from "@/lib/types"

export function HomeSearch({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("cities")
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []
    return categories
      .flatMap((entry) =>
        entry.samples
          .filter((name) => name.toLowerCase().includes(value))
          .map((name) => ({ name, category: entry }))
      )
      .slice(0, 8)
  }, [categories, query])

  function search(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    router.push(
      `/categories/${category}${value ? `?q=${encodeURIComponent(value)}` : ""}`
    )
  }

  return (
    <section className="search-stage" aria-labelledby="search-title">
      <div className="search-copy">
        <h1 id="search-title">Find a name worth keeping.</h1>
        <p>
          Search cities, colors, fruit, stars, elements, and the language of
          science.
        </p>
      </div>
      <form className="home-search" onSubmit={search}>
        <Search aria-hidden="true" size={24} />
        <input
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try Lahore, Azure, Quasar..."
          aria-label="Search names"
        />
        <select
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
        <button type="submit">Search</button>
      </form>
      {matches.length > 0 && (
        <div className="quick-matches" aria-label="Quick matches">
          {matches.map((match) => (
            <button
              key={`${match.category.slug}-${match.name}`}
              onClick={() =>
                router.push(
                  `/categories/${match.category.slug}?q=${encodeURIComponent(match.name)}`
                )
              }
              type="button"
            >
              <strong>{match.name}</strong>
              <span>{match.category.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
