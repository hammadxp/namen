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
    <main className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <section className="mb-[46px] grid grid-cols-[1.2fr_0.8fr] items-end gap-10 max-[780px]:grid-cols-1 max-[780px]:gap-[18px]">
        <h1 className="m-0 font-heading text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.065em]">
          Every category
        </h1>
        <p className="mb-2 max-w-[460px] text-[1.1rem] leading-[1.55] text-muted-foreground">
          Seven ways into the same question: what already exists that sounds like a great name?
        </p>
      </section>
      <CategoryCards categories={entries} />
    </main>
  );
}
