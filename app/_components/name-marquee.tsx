import Link from "next/link";

type MarqueeItem = { name: string; href: string; meta?: string };

function Track({ items }: { items: MarqueeItem[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="marquee-track">
      {repeated.map((item, index) => (
        <Link
          href={item.href}
          key={`${item.name}-${index}`}
          aria-hidden={index >= items.length}
          tabIndex={index >= items.length ? -1 : undefined}
        >
          <strong>{item.name}</strong>
          {item.meta && <span>{item.meta}</span>}
        </Link>
      ))}
    </div>
  );
}

export function NameMarquee({ cities, discoveries }: { cities: MarqueeItem[]; discoveries: MarqueeItem[] }) {
  return (
    <section className="name-marquees" aria-label="Featured names">
      <div className="marquee-row marquee-cities">
        <p>Big city names</p>
        <div className="marquee-window">
          <Track items={cities} />
        </div>
      </div>
      <div className="marquee-row marquee-discoveries">
        <p>Unexpected finds</p>
        <div className="marquee-window">
          <Track items={discoveries} />
        </div>
      </div>
    </section>
  );
}
