"use client"

import { useEffect, useState } from "react"
import { BookmarkX } from "lucide-react"
import { groupLabel, subtitleLabel } from "@/lib/catalog-display"
import type { CatalogItem } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SavedBrowser() {
  const [items, setItems] = useState<CatalogItem[] | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("coolname:saved-items")
    queueMicrotask(() => setItems(raw ? JSON.parse(raw) : []))
  }, [])

  function remove(item: CatalogItem) {
    const next = (items ?? []).filter((entry) => entry.id !== item.id)
    setItems(next)
    localStorage.setItem("coolname:saved-items", JSON.stringify(next))
    const ids = JSON.parse(
      localStorage.getItem("coolname:saved-ids") ?? "[]"
    ) as string[]
    localStorage.setItem(
      "coolname:saved-ids",
      JSON.stringify(ids.filter((id) => id !== item.id))
    )
  }

  if (items === null) {
    return <div className="loading-state">Opening your saved names</div>
  }

  if (!items.length) {
    return (
      <div className="empty-state saved-empty">
        <span>☆</span>
        <h2>No saved names yet</h2>
        <p>Use the bookmark button on any name card to keep it here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="result-count">{items.length} saved names</div>
      <section className="catalog-grid">
        {items.map((item) => (
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
              <span className="card-index">
                {item.countryEmoji ?? item.symbol ?? groupLabel(item)}
              </span>
              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`Remove ${item.name}`}
                >
                  <BookmarkX size={17} />
                </button>
              </div>
            </div>
            <h2>{item.name}</h2>
            <div className="card-meta">
              <span>{subtitleLabel(item)}</span>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
