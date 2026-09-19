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
      className={cn("catalog-card", item.color && "has-swatch")}
      style={item.color ? ({ "--swatch": item.color } as CSSProperties) : undefined}
    >
      <div className="card-topline">
        {item.countryEmoji ? (
          <span className="flag">{item.countryEmoji}</span>
        ) : (
          <span className="card-index">{item.symbol ?? groupLabel(item)}</span>
        )}
        <div className="card-actions">{actions}</div>
      </div>
      <h2>{item.name}</h2>
      <div className="card-meta">
        <span>{subtitleLabel(item)}</span>
        {item.population !== undefined && (
          <span className="population">Population {populationFormatter.format(item.population)}</span>
        )}
        {item.scientificName && <i>{item.scientificName}</i>}
      </div>
    </article>
  );
}
