import type { CatalogItem } from "@/types/catalog";

const SAVED_ITEMS_KEY = "coolname:saved-items";
const SAVED_IDS_KEY = "coolname:saved-ids";

export function readSavedNames(): CatalogItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY) ?? "[]");

    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item): item is CatalogItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.category === "string" &&
        typeof item.group === "string"
    );
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
