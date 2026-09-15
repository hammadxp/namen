import { readFile } from "node:fs/promises"
import path from "node:path"
import { notFound } from "next/navigation"
import { CategoryBrowser } from "@/components/category-browser"
import categories from "@/public/data/categories.json"
import cityPreview from "@/public/data/categories/cities-top.json"
import type { CatalogItem, Category } from "@/lib/types"

const entries = categories as Category[]

export function generateStaticParams() {
  return entries
    .filter((category) => category.slug !== "countries")
    .map((category) => ({ slug: category.slug }))
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; country?: string }>
}) {
  const { slug } = await params
  const query = await searchParams
  const category = entries.find((entry) => entry.slug === slug)
  if (!category || slug === "countries") notFound()
  if (slug === "cities")
    return (
      <CategoryBrowser
        category={category}
        initialItems={query.country ? [] : (cityPreview as CatalogItem[])}
        dataUrl={
          query.country
            ? `/data/cities/${encodeURIComponent(query.country.toUpperCase())}.json`
            : "/data/categories/cities.json"
        }
        initialQuery={query.q}
        initialCountry={query.country}
      />
    )
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "categories",
    `${slug}.json`
  )
  const items = JSON.parse(await readFile(file, "utf8")) as CatalogItem[]
  return (
    <CategoryBrowser
      category={category}
      initialItems={items}
      initialQuery={query.q}
    />
  )
}
