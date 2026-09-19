import type { CSSProperties, ReactNode } from "react";
import { groupLabel, subtitleLabel } from "@/utils/catalog-display";
import type { CatalogItem } from "@/types/catalog";
import { cn } from "@/lib/utils";

type CatalogCardProps = {
  item: CatalogItem;
  actions: ReactNode;
};

const populationFormatter = new Intl.NumberFormat("en", { notation: "compact" });

export function CatalogCard({ item, actions }: CatalogCardProps) {
  return (
    <article
      className={cn(
        "group relative flex min-h-[228px] flex-col overflow-hidden border-2 border-ink p-[17px] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--cyan)]",
        item.color
          ? "bg-[linear-gradient(135deg,color-mix(in_oklch,var(--swatch)_48%,var(--white)),color-mix(in_oklch,var(--swatch)_18%,var(--white)))]"
          : "bg-white/75"
      )}
      style={item.color ? ({ "--swatch": item.color } as CSSProperties) : undefined}
    >
      {item.color && (
        <span
          aria-hidden="true"
          className="absolute -right-10 -bottom-[65px] size-[175px] rounded-full border-2 border-ink bg-[var(--swatch)] opacity-90"
        />
      )}
      <div className="relative z-[1] flex min-h-8 items-center justify-between gap-3">
        {item.countryEmoji ? (
          <span className="text-[1.45rem] leading-none">{item.countryEmoji}</span>
        ) : (
          <span className="max-w-[72%] truncate text-[0.7rem] font-black text-[oklch(0.4295_0.0312_289.8)]">
            {item.symbol ?? groupLabel(item)}
          </span>
        )}
        <div className="ml-auto flex gap-0.5 [&>button]:grid [&>button]:size-[34px] [&>button]:place-items-center [&>button]:rounded-full [&>button]:border [&>button]:border-transparent [&>button]:bg-white/55 [&>button]:p-0 [&>button:hover]:bg-ink [&>button:hover]:text-white">
          {actions}
        </div>
      </div>
      <h2 className="relative z-[1] mt-auto mb-3 font-heading text-[clamp(1.65rem,2.8vw,2.65rem)] leading-[0.95] tracking-[-0.06em] wrap-anywhere">
        {item.name}
      </h2>
      <div className="relative z-[1] flex min-h-[38px] items-end justify-between gap-2 border-t border-ink/40 pt-2.5 text-[0.7rem] font-extrabold text-[oklch(0.4295_0.0312_289.8)]">
        <span>{subtitleLabel(item)}</span>
        {item.population !== undefined && (
          <span className="ml-auto text-right whitespace-nowrap">
            Population {populationFormatter.format(item.population)}
          </span>
        )}
        {item.scientificName && <i className="truncate">{item.scientificName}</i>}
      </div>
    </article>
  );
}
