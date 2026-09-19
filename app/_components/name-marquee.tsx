import Link from "next/link";

type MarqueeItem = { name: string; href: string; meta?: string };

function Track({ items }: { items: MarqueeItem[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="flex w-max flex-none animate-[marquee-left_34s_linear_infinite] items-center group-hover:[animation-play-state:paused]">
      {repeated.map((item, index) => (
        <Link
          href={item.href}
          key={`${item.name}-${index}`}
          aria-hidden={index >= items.length}
          tabIndex={index >= items.length ? -1 : undefined}
          className="flex items-baseline gap-2 border-r border-line px-[25px] whitespace-nowrap no-underline hover:[&>strong]:text-violet"
        >
          <strong className="font-heading text-[1.22rem] tracking-[-0.05em]">{item.name}</strong>
          {item.meta && <span className="text-[0.66rem] font-extrabold text-muted-foreground">{item.meta}</span>}
        </Link>
      ))}
    </div>
  );
}

export function NameMarquee({ cities, discoveries }: { cities: MarqueeItem[]; discoveries: MarqueeItem[] }) {
  return (
    <section className="overflow-hidden border-b-2 border-ink" aria-label="Featured names">
      <div className="grid min-h-[62px] grid-cols-[180px_minmax(0,1fr)] items-stretch border-t border-ink max-[780px]:grid-cols-[140px_minmax(0,1fr)] max-[560px]:block">
        <p className="m-0 grid items-center justify-start border-r-2 border-ink bg-lemon px-[22px] text-xs font-black max-[560px]:min-h-[34px] max-[560px]:border-r-0 max-[560px]:border-b max-[560px]:px-4">
          Big city names
        </p>
        <div className="group flex min-w-0 overflow-hidden bg-paper max-[560px]:min-h-[58px]">
          <Track items={cities} />
        </div>
      </div>
      <div className="grid min-h-[62px] grid-cols-[180px_minmax(0,1fr)] items-stretch border-t border-ink max-[780px]:grid-cols-[140px_minmax(0,1fr)] max-[560px]:block">
        <p className="m-0 grid items-center justify-start border-r-2 border-ink bg-mint px-[22px] text-xs font-black max-[560px]:min-h-[34px] max-[560px]:border-r-0 max-[560px]:border-b max-[560px]:px-4">
          Unexpected finds
        </p>
        <div className="group flex min-w-0 overflow-hidden bg-paper max-[560px]:min-h-[58px]">
          <div className="flex w-max flex-none animate-[marquee-left_39s_linear_infinite_reverse] items-center group-hover:[animation-play-state:paused]">
            {[...discoveries, ...discoveries].map((item, index) => (
              <Link
                href={item.href}
                key={`${item.name}-${index}`}
                aria-hidden={index >= discoveries.length}
                tabIndex={index >= discoveries.length ? -1 : undefined}
                className="flex items-baseline gap-2 border-r border-line px-[25px] no-underline hover:[&>strong]:text-violet"
              >
                <strong className="font-heading text-[1.22rem] tracking-[-0.05em]">{item.name}</strong>
                {item.meta && <span className="text-[0.66rem] font-extrabold text-muted-foreground">{item.meta}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
