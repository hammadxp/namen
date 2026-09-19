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
    return (
      <div className="grid min-h-[360px] place-content-center justify-items-center gap-3 text-center font-extrabold">
        Opening your saved names
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid min-h-[360px] place-content-center justify-items-center gap-3 text-center font-extrabold">
        <span>☆</span>
        <h2 className="m-0">No saved names yet</h2>
        <p className="m-0">Use the bookmark button on any name card to keep it here.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="w-fit max-w-full border-2 border-ink bg-orange px-3 py-2 font-semibold" role="alert">
          {error}
        </p>
      )}
      <div className="my-6 mb-3.5 text-xs font-black text-muted-foreground">{items.length} saved names</div>
      <section className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-3 max-[780px]:grid-cols-2 max-[560px]:grid-cols-1">
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
