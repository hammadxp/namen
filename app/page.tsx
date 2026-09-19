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
        <CategoryCards categories={categories} samples={samples} />
      </section>
      <TranslationLab embedded />
    </main>
  );
}
