"use client"

import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { Bookmark, LoaderCircle, Search, Share2 } from "lucide-react"
import {
  compareDistinctiveFruits,
  groupLabel,
  hasShortCityName,
  subtitleLabel,
} from "@/lib/catalog-display"
import type { CatalogItem, Category, SortMode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useAutoHideOnScroll } from "@/components/use-auto-hide"

const PAGE_SIZE = 60

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value)
}

export function CategoryBrowser({
  category,
  initialItems = [],
  dataUrl,
  initialQuery = "",
  initialCountry = "",
}: {
  category: Category
  initialItems?: CatalogItem[]
  dataUrl?: string
  initialQuery?: string
  initialCountry?: string
}) {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(Boolean(dataUrl && !initialItems.length))
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)
  const [group, setGroup] = useState(initialCountry)
  const [sort, setSort] = useState<SortMode>(
    category.slug === "cities" ? "population" : "top"
  )
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [saved, setSaved] = useState<string[]>([])
  const toolbarHidden = useAutoHideOnScroll()

  useEffect(() => {
    const raw = localStorage.getItem("coolname:saved-ids")
    if (raw) queueMicrotask(() => setSaved(JSON.parse(raw)))
  }, [])

  useEffect(() => {
    if (!dataUrl) return
    let active = true
    const load = () => fetch(dataUrl)
      .then((response) => response.json())
      .then((rows: CatalogItem[]) => {
        if (active) setItems(rows)
      })
      .catch(() => {
        if (active) setItems([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    const hasIdleCallback = typeof window.requestIdleCallback === "function"
    const idleWindow = hasIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 0)
    return () => {
      active = false
      if (hasIdleCallback && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleWindow)
      } else {
        window.clearTimeout(idleWindow)
      }
    }
  }, [dataUrl])

  const eligibleItems = useMemo(() => items.filter(hasShortCityName), [items])
  const groups = useMemo(() => {
    const values = new Map<string, string>()
    for (const item of eligibleItems)
      values.set(item.countryCode ?? item.group, groupLabel(item))
    return [...values]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [eligibleItems])
  const filtered = useMemo(() => {
    const value = deferredQuery.trim().toLowerCase()
    return eligibleItems
      .filter(
        (item) =>
          (!group || item.countryCode === group || item.group === group) &&
          (!value ||
            `${item.name} ${item.group} ${item.subtitle ?? ""} ${item.symbol ?? ""}`
              .toLowerCase()
              .includes(value))
      )
      .sort((a, b) => {
        if (sort === "alphabetical") return a.name.localeCompare(b.name)
        if (sort === "population")
          return (
            (b.population ?? b.atomicNumber ?? 0) -
            (a.population ?? a.atomicNumber ?? 0)
          )
        if (category.slug === "fruits") return compareDistinctiveFruits(a, b)
        return (b.score ?? 0) - (a.score ?? 0) || a.name.localeCompare(b.name)
      })
  }, [category.slug, deferredQuery, eligibleItems, group, sort])

  function toggleSaved(item: CatalogItem) {
    const next = saved.includes(item.id)
      ? saved.filter((id) => id !== item.id)
      : [item.id, ...saved]
    setSaved(next)
    localStorage.setItem("coolname:saved-ids", JSON.stringify(next))
    const stored = JSON.parse(
      localStorage.getItem("coolname:saved-items") ?? "[]"
    ) as CatalogItem[]
    const nextItems = saved.includes(item.id)
      ? stored.filter((entry) => entry.id !== item.id)
      : [item, ...stored.filter((entry) => entry.id !== item.id)]
    localStorage.setItem("coolname:saved-items", JSON.stringify(nextItems))
  }

  async function share(item: CatalogItem) {
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(item.name)}`
    if (navigator.share)
      await navigator.share({ title: `${item.name} on Coolname`, url })
    else await navigator.clipboard.writeText(url)
  }

  return (
    <main className="page-shell">
      <section
        className="page-heading"
        style={{ "--accent": category.accent } as React.CSSProperties}
      >
        <div>
          <p>
            {(loading ? category.count : eligibleItems.length).toLocaleString()}{" "}
            local entries
          </p>
          <h1>{category.name}</h1>
        </div>
        <p>{category.description}</p>
      </section>
      <section className={cn("browser-toolbar", toolbarHidden && "is-hidden")}>
        <label className="field grow">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setLimit(PAGE_SIZE)
            }}
            placeholder={`Search ${category.name.toLowerCase()}`}
          />
        </label>
        <label className="select-field">
          <span>{category.slug === "cities" ? "City" : "Group"}</span>
          <select
            value={group}
            onChange={(event) => {
              setGroup(event.target.value)
              setLimit(PAGE_SIZE)
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
        <label className="select-field">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
          >
            <option value="top">
              {category.slug === "fruits" ? "Distinctive first" : "Top names"}
            </option>
            <option value="alphabetical">A to Z</option>
            {(category.slug === "cities" || category.slug === "elements") && (
              <option value="population">
                {category.slug === "cities" ? "Population" : "Atomic number"}
              </option>
            )}
          </select>
        </label>
      </section>
      <div className="result-count">
        {loading
          ? "Loading local index"
          : `${filtered.length.toLocaleString()} results`}
      </div>
      {loading ? (
        <div className="loading-state">
          <LoaderCircle className="spin" /> Opening the collection
        </div>
      ) : (
        <section className="catalog-grid" aria-live="polite">
          {filtered.slice(0, limit).map((item) => (
            <article
              className={cn("catalog-card", item.color && "has-swatch")}
              key={item.id}
              style={
                item.color
                  ? ({ "--swatch": item.color } as React.CSSProperties)
                  : undefined
              }
            >
              <div className="card-topline">
                {item.countryEmoji ? (
                  <span className="flag">{item.countryEmoji}</span>
                ) : (
                  <span className="card-index">
                    {item.symbol ?? groupLabel(item)}
                  </span>
                )}
                <div className="card-actions">
                  <button
                    type="button"
                    onClick={() => toggleSaved(item)}
                    aria-label={`${saved.includes(item.id) ? "Remove" : "Save"} ${item.name}`}
                  >
                    <Bookmark
                      size={17}
                      fill={saved.includes(item.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => share(item)}
                    aria-label={`Share ${item.name}`}
                  >
                    <Share2 size={17} />
                  </button>
                </div>
              </div>
              <h2>{item.name}</h2>
              <div className="card-meta">
                <span>{subtitleLabel(item)}</span>
                {item.population !== undefined && (
                  <span className="population">
                    Population {formatNumber(item.population)}
                  </span>
                )}
                {item.scientificName && <i>{item.scientificName}</i>}
              </div>
            </article>
          ))}
        </section>
      )}
      {!loading && limit < filtered.length && (
        <button
          className="load-more"
          type="button"
          onClick={() => setLimit((value) => value + PAGE_SIZE)}
        >
          Show {Math.min(PAGE_SIZE, filtered.length - limit)} more
        </button>
      )}
      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <h2>No matches</h2>
          <p>Try a shorter word or clear the current filter.</p>
        </div>
      )}
    </main>
  )
}
