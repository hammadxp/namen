"use client";

import { useEffect, useState } from "react";
import { BookmarkX } from "lucide-react";
import { CatalogCard } from "@/components/card/catalog-card";
import type { CatalogItem } from "@/types/catalog";
import { readSavedNames, writeSavedNames } from "@/utils/saved-names";

export function SavedBrowser() {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => setItems(readSavedNames()));
  }, []);

  function remove(item: CatalogItem) {
    const next = (items ?? []).filter((entry) => entry.id !== item.id);
    if (!writeSavedNames(next)) {
      setError("Could not update saved names. Check browser storage and try again.");
      return;
    }
    setItems(next);
    setError("");
  }

  if (items === null) {
    return <div className="loading-state">Opening your saved names</div>;
  }

  if (!items.length) {
    return (
      <div className="empty-state saved-empty">
        <span>☆</span>
        <h2>No saved names yet</h2>
        <p>Use the bookmark button on any name card to keep it here.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="result-count">{items.length} saved names</div>
      <section className="catalog-grid">
        {items.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            actions={
              <button type="button" onClick={() => remove(item)} aria-label={`Remove ${item.name}`}>
                <BookmarkX size={17} />
              </button>
            }
          />
        ))}
      </section>
    </>
  );
}
