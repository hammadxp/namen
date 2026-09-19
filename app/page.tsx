import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryCards } from "@/components/card/category-cards";
import { HomeSearch } from "./_components/home-search";
import { NameMarquee } from "./_components/name-marquee";
import { TranslationLab } from "@/components/form/translation-lab";
import { getHomeCatalog } from "@/queries/catalog";

export default function Page() {
  const { categories, samples, featuredCities, discoveries } = getHomeCatalog();

  return (
    <main>
      <HomeSearch categories={categories} />
      <NameMarquee cities={featuredCities} discoveries={discoveries} />
      <section
        className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]"
        aria-labelledby="browse-heading"
      >
        <div className="mb-[30px] flex items-end justify-between gap-6 max-[560px]:flex-col max-[560px]:items-start">
          <div>
            <p className="mb-2 text-xs font-black text-muted-foreground">Pick a shelf</p>
            <h2
              id="browse-heading"
              className="font-heading text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.94] tracking-[-0.065em]"
            >
              Browse every category
            </h2>
          </div>
          <Link
            className="flex items-center gap-2 rounded-full border border-ink bg-white px-3.5 py-2.5 font-extrabold no-underline shadow-[3px_3px_0_var(--ink)] transition-[transform,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--ink)]"
            href="/categories"
          >
            All categories <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <CategoryCards categories={categories} samples={samples} />
      </section>
      <TranslationLab embedded />
    </main>
  );
}
