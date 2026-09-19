import { CategoryCards } from "@/components/card/category-cards";
import { pageMetadata } from "@/config/metadata";
import { getCategories } from "@/queries/catalog";

export const metadata = pageMetadata(
  "Categories",
  "Browse city, country, fruit, color, science, element, and star names."
);

export default function CategoriesPage() {
  const entries = getCategories();
  return (
    <main className="page-shell">
      <section className="index-heading">
        <h1>Every category</h1>
        <p>Seven ways into the same question: what already exists that sounds like a great name?</p>
      </section>
      <CategoryCards categories={entries} />
    </main>
  );
}
