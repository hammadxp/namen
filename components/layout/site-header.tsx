import Link from "next/link";
import { Bookmark } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--orange)_0_20%,var(--lemon)_20%_40%,var(--mint)_40%_60%,var(--cyan)_60%_80%,var(--violet)_80%)]"
      />
      <div className="mx-auto grid min-h-[78px] max-w-[1500px] grid-cols-[auto_1fr_auto] items-center px-[clamp(1.125rem,4vw,3.875rem)] pt-1.5 max-[780px]:min-h-[70px] max-[780px]:grid-cols-[auto_minmax(0,1fr)] max-[560px]:flex max-[560px]:min-h-[108px] max-[560px]:flex-col max-[560px]:items-start max-[560px]:justify-center max-[560px]:gap-1.5 max-[560px]:pt-2.5">
        <Link
          className="font-heading text-2xl tracking-[-0.07em] no-underline max-[560px]:text-xl"
          href="/"
          aria-label="Coolname home"
        >
          cool<span className="text-orange">name</span>
        </Link>
        <p className="ml-[26px] flex items-center gap-2 text-xs font-extrabold text-muted-foreground max-[1050px]:hidden">
          <span className="h-2 w-[26px] rounded-full border border-ink bg-mint" /> Names hiding in plain sight.
        </p>
        <nav
          className="flex items-center gap-1 max-[780px]:justify-self-end max-[780px]:overflow-x-auto max-[560px]:w-full max-[560px]:justify-between max-[560px]:gap-0.5 max-[560px]:overflow-visible max-[780px]:[&>a]:px-2 max-[780px]:[&>a]:py-2 max-[780px]:[&>a]:text-xs max-[780px]:[&>a]:whitespace-nowrap max-[560px]:[&>a]:flex-none max-[560px]:[&>a]:px-1 max-[560px]:[&>a]:py-1.5 max-[560px]:[&>a]:text-[0.66rem]"
          aria-label="Primary navigation"
        >
          {primaryNavigation.map(({ label, href }) => (
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-xs font-extrabold no-underline transition-[background,color,transform] duration-150 hover:-translate-y-0.5 hover:bg-ink hover:text-white"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          <Link
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-ink bg-lemon px-3 py-2 text-xs font-extrabold no-underline shadow-[3px_3px_0_var(--ink)] transition-[background,color,transform] duration-150 hover:-translate-y-0.5 hover:bg-violet max-[780px]:ml-0.5 max-[560px]:px-2 max-[560px]:py-1.5 max-[560px]:shadow-[2px_2px_0_var(--ink)]"
            href="/saved"
          >
            <Bookmark size={15} aria-hidden="true" /> Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}
