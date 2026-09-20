import Link from "next/link";

export function SiteFooter({ updatedAt }: { updatedAt: string }) {
  const formatted = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(updatedAt));
  return (
    <footer className="relative grid min-h-45 grid-cols-[1fr_auto_1fr] items-center gap-7.5 overflow-hidden bg-ink px-[clamp(1.125rem,4vw,3.875rem)] pt-11 pb-7.5 text-white max-[780px]:grid-cols-[1fr_auto] max-[560px]:grid-cols-1">
      <div className="absolute inset-x-0 top-0 grid h-3 grid-cols-5" aria-hidden="true">
        <span className="bg-orange" />
        <span className="bg-lemon" />
        <span className="bg-mint" />
        <span className="bg-cyan" />
        <span className="bg-violet" />
      </div>
      <div>
        <Link className="font-heading text-[1.55rem] tracking-[-0.07em] no-underline" href="/">
          namen
        </Link>
        <p className="mt-2 text-xs text-white/80">Built for names that feel found, not generated.</p>
      </div>
      <nav
        className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 p-1.5 max-[780px]:overflow-x-auto max-[560px]:w-fit max-[560px]:max-w-full"
        aria-label="Footer navigation"
      >
        <Link
          className="rounded-full px-2 py-1.5 text-xs font-extrabold no-underline hover:bg-lemon hover:text-ink"
          href="/categories"
        >
          Categories
        </Link>
        <Link
          className="rounded-full px-2 py-1.5 text-xs font-extrabold no-underline hover:bg-lemon hover:text-ink"
          href="/countries"
        >
          Countries
        </Link>
        <Link
          className="rounded-full px-2 py-1.5 text-xs font-extrabold no-underline hover:bg-lemon hover:text-ink"
          href="/translate"
        >
          Translate
        </Link>
        <Link
          className="rounded-full px-2 py-1.5 text-xs font-extrabold no-underline hover:bg-lemon hover:text-ink"
          href="/saved"
        >
          Saved
        </Link>
      </nav>
      <p className="justify-self-end text-right text-xs text-white/80 max-[780px]:col-span-full max-[780px]:justify-self-start max-[780px]:text-left max-[560px]:col-auto">
        Local data updated {formatted}
      </p>
    </footer>
  );
}
