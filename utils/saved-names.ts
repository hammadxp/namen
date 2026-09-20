import type { CatalogItem } from "@/types/catalog";

const SAVED_ITEMS_KEY = "namen:saved-items";
const SAVED_IDS_KEY = "namen:saved-ids";
const LEGACY_SAVED_ITEMS_KEY = "coolname:saved-items";

export function readSavedNames(): CatalogItem[] {
  try {
    const storedKey = localStorage.getItem(SAVED_ITEMS_KEY) ? SAVED_ITEMS_KEY : LEGACY_SAVED_ITEMS_KEY;
    const value: unknown = JSON.parse(localStorage.getItem(storedKey) ?? "[]");

    if (!Array.isArray(value)) {
      return [];
    }

    const items = value.filter(
      (item): item is CatalogItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.category === "string" &&
        typeof item.group === "string"
    );

    if (storedKey === LEGACY_SAVED_ITEMS_KEY) {
      writeSavedNames(items);
    }

    return items;
  } catch {
    return [];
  }
}

export function writeSavedNames(items: CatalogItem[]): boolean {
  try {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
    localStorage.setItem(SAVED_IDS_KEY, JSON.stringify(items.map((item) => item.id)));
    return true;
  } catch {
    return false;
  }
}
