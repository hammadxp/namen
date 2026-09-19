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
    <div className="grid grid-cols-12 gap-3.5">
      {categories.map((category, index) => {
        const featured = samples[category.slug] ?? category.samples;
        return (
          <article
            className="group relative col-span-4 flex min-h-[330px] flex-col overflow-hidden border-2 border-ink bg-[linear-gradient(145deg,color-mix(in_oklch,var(--accent)_22%,var(--paper))_0_43%,oklch(1_0_0_/_82%)_43%)] p-6 shadow-[5px_5px_0_color-mix(in_oklch,var(--accent)_82%,var(--ink))] transition-[transform,box-shadow] duration-200 first:col-span-8 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_color-mix(in_oklch,var(--accent)_82%,var(--ink))] nth-[5]:col-span-8 max-[780px]:col-span-6 max-[780px]:first:col-span-6 max-[780px]:nth-[5]:col-span-6 max-[560px]:col-span-full max-[560px]:min-h-[305px] max-[560px]:first:col-span-full max-[560px]:nth-[5]:col-span-full"
            key={category.slug}
            style={{ "--accent": category.accent } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="absolute -right-[55px] -bottom-[75px] size-[195px] rounded-full border-2 border-ink bg-[var(--accent)] opacity-60 transition-transform duration-200 group-hover:scale-[1.14] group-hover:rotate-[8deg]"
            />
            <span className="relative z-[1] font-black text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link
              className="relative z-[1] mt-auto mb-2 flex w-fit max-w-[calc(100%-24px)] items-start gap-2.5 text-foreground underline decoration-[3px] underline-offset-[5px]"
              href={categoryHref(category.slug)}
            >
              <h2 className="m-0 max-w-[550px] font-heading text-[clamp(2rem,4vw,3.55rem)] leading-[0.95] tracking-[-0.06em]">
                {category.name}
              </h2>
              <ArrowUpRight
                className="mt-1 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={22}
              />
            </Link>
            <p className="relative z-[1] m-0 max-w-[500px] leading-[1.45] text-[oklch(0.4295_0.0312_289.8)]">
              {category.description}
            </p>
            <div className="relative z-[1] my-5 mb-[11px] flex flex-wrap gap-1.5" aria-label={`Top ${category.name}`}>
              {featured.slice(0, 5).map((sample) => (
                <span
                  className="rounded-full border border-ink bg-white px-2 py-1 text-[0.7rem] font-extrabold"
                  key={sample}
                >
                  {sample}
                </span>
              ))}
            </div>
            <strong className="relative z-[1] text-[0.7rem]">{category.count.toLocaleString()} entries</strong>
          </article>
        );
      })}
    </div>
  );
}
