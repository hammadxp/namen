import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryBrowser } from "./_components/category-browser";
import { pageMetadata } from "@/config/metadata";
import { getCategories, getCategory, getCategoryItems, getCountries } from "@/queries/catalog";
import cityPreview from "@/public/data/categories/cities-top.json";
import type { CatalogItem } from "@/types/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string | string[]; group?: string | string[]; country?: string | string[] }>;
};

export function generateStaticParams() {
  return getCategories()
    .filter((category) => category.slug !== "countries")
    .map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return category ? pageMetadata(category.name, category.description) : {};
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const initialQuery = typeof query.q === "string" ? query.q : "";
  const initialGroup = typeof query.group === "string" ? query.group : "";

  if (slug === "cities") {
    const requestedCountry = typeof query.country === "string" ? query.country.toUpperCase() : "";
    const country = getCountries().find((entry) => entry.code === requestedCountry);

    return (
      <CategoryBrowser
        key={country?.code ?? "all"}
        category={category}
        initialItems={country ? [] : (cityPreview as CatalogItem[])}
        dataUrl={country ? `/data/cities/${country.code}.json` : "/data/categories/cities.json"}
        initialQuery={initialQuery}
        initialGroup={initialGroup}
        initialCountry={country?.code}
      />
    );
  }

  const items = await getCategoryItems(slug);

  return (
    <CategoryBrowser category={category} initialItems={items} initialQuery={initialQuery} initialGroup={initialGroup} />
  );
}
