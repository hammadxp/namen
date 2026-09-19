import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/catalog";

function categoryHref(slug: string) {
  return slug === "countries" ? "/countries" : `/categories/${slug}`;
}

export function CategoryCards({
  categories,
  samples = {},
}: {
  categories: Category[];
  samples?: Record<string, string[]>;
}) {
  return (
    <div className="category-index">
      {categories.map((category, index) => {
        const featured = samples[category.slug] ?? category.samples;
        return (
          <article
            className="category-index-card"
            key={category.slug}
            style={{ "--accent": category.accent } as React.CSSProperties}
          >
            <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
            <Link className="category-title-link" href={categoryHref(category.slug)}>
              <h2>{category.name}</h2>
              <ArrowUpRight size={22} />
            </Link>
            <p>{category.description}</p>
            <div className="category-pills" aria-label={`Top ${category.name}`}>
              {featured.slice(0, 5).map((sample) => (
                <span key={sample}>{sample}</span>
              ))}
            </div>
            <strong>{category.count.toLocaleString()} entries</strong>
          </article>
        );
      })}
    </div>
  );
}
