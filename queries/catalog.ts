import { readFile } from "node:fs/promises";
import path from "node:path";
import { distinctiveFruitNames, hasShortCityName } from "@/utils/catalog-display";
import type { CatalogItem, Category, Country } from "@/types/catalog";
import categories from "@/public/data/categories.json";
import cities from "@/public/data/categories/cities-top.json";
import fruits from "@/public/data/categories/fruits.json";
import countries from "@/public/data/countries.json";

const categoryEntries = categories as Category[];
const countryEntries = countries as Country[];

export function getCategories() {
  return categoryEntries;
}

export function getCountries() {
  return countryEntries;
}

export function getCategory(slug: string) {
  return categoryEntries.find((entry) => entry.slug === slug && slug !== "countries");
}

export async function getCategoryItems(slug: string): Promise<CatalogItem[]> {
  if (!getCategory(slug) || slug === "cities") {
    return [];
  }

  const file = path.join(process.cwd(), "public", "data", "categories", `${slug}.json`);
  return JSON.parse(await readFile(file, "utf8")) as CatalogItem[];
}

export function getHomeCatalog() {
  const cityItems = (cities as CatalogItem[])
    .filter(hasShortCityName)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
  const countryItems = [...countryEntries].sort((a, b) => b.cityCount - a.cityCount || a.name.localeCompare(b.name));
  const fruitItems = fruits as CatalogItem[];

  return {
    categories: categoryEntries,
    samples: {
      cities: cityItems.slice(0, 5).map((item) => item.name),
      countries: countryItems.slice(0, 5).map((item) => item.name),
      fruits: distinctiveFruitNames(fruitItems),
    },
    featuredCities: cityItems.slice(0, 10).map((item) => ({
      name: item.name,
      href: `/categories/cities?q=${encodeURIComponent(item.name)}`,
      meta: item.population?.toLocaleString(),
    })),
    discoveries: [
      ...distinctiveFruitNames(fruitItems, 4).map((name) => ({
        name,
        href: `/categories/fruits?q=${encodeURIComponent(name)}`,
        meta: "fruit",
      })),
      ...categoryEntries
        .filter((entry) => ["colors", "scientific-words", "stars"].includes(entry.slug))
        .flatMap((entry) =>
          entry.samples.slice(0, 2).map((name) => ({
            name,
            href: `/categories/${entry.slug}?q=${encodeURIComponent(name)}`,
            meta: entry.name.replace(" names", "").replace(" words", ""),
          }))
        ),
    ],
  };
}
