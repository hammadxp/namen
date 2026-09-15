import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CategoryCards } from "@/components/category-cards"
import { HomeSearch } from "@/components/home-search"
import { NameMarquee } from "@/components/name-marquee"
import { TranslationLab } from "@/components/translation-lab"
import { distinctiveFruitNames, hasShortCityName } from "@/lib/catalog-display"
import type { CatalogItem, Category, Country } from "@/lib/types"
import categories from "@/public/data/categories.json"
import cities from "@/public/data/categories/cities-top.json"
import fruits from "@/public/data/categories/fruits.json"
import countries from "@/public/data/countries.json"

export default function Page() {
  const entries = categories as Category[]
  const cityItems = (cities as CatalogItem[])
    .filter(hasShortCityName)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  const countryItems = [...(countries as Country[])].sort(
    (a, b) => b.cityCount - a.cityCount || a.name.localeCompare(b.name)
  )
  const fruitItems = fruits as CatalogItem[]
  const samples = {
    cities: cityItems.slice(0, 5).map((item) => item.name),
    countries: countryItems.slice(0, 5).map((item) => item.name),
    fruits: distinctiveFruitNames(fruitItems),
  }
  const discoveries = [
    ...distinctiveFruitNames(fruitItems, 4).map((name) => ({
      name,
      href: `/categories/fruits?q=${encodeURIComponent(name)}`,
      meta: "fruit",
    })),
    ...entries
      .filter((entry) =>
        ["colors", "scientific-words", "stars"].includes(entry.slug)
      )
      .flatMap((entry) =>
        entry.samples.slice(0, 2).map((name) => ({
          name,
          href: `/categories/${entry.slug}?q=${encodeURIComponent(name)}`,
          meta: entry.name.replace(" names", "").replace(" words", ""),
        }))
      ),
  ]

  return (
    <main>
      <HomeSearch categories={entries} />
      <NameMarquee
        cities={cityItems.slice(0, 10).map((item) => ({
          name: item.name,
          href: `/categories/cities?q=${encodeURIComponent(item.name)}`,
          meta: item.population?.toLocaleString(),
        }))}
        discoveries={discoveries}
      />
      <section className="home-categories" aria-labelledby="browse-heading">
        <div className="section-intro">
          <div>
            <p>Pick a shelf</p>
            <h2 id="browse-heading">Browse every category</h2>
          </div>
          <Link href="/categories">
            All categories <ArrowUpRight size={18} />
          </Link>
        </div>
        <CategoryCards categories={entries} samples={samples} />
      </section>
      <TranslationLab embedded />
    </main>
  )
}
