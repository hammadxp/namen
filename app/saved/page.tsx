import { SavedBrowser } from "./_components/saved-browser";
import { pageMetadata } from "@/config/metadata";

export const metadata = pageMetadata("Saved names", "Review the names saved in this browser.");

export default function SavedPage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <section
        className="relative mb-[42px] grid grid-cols-[1.3fr_0.7fr] items-end gap-[50px] border-b-2 border-ink pb-8 max-[780px]:grid-cols-1 max-[780px]:gap-[18px]"
        style={{ "--accent": "var(--violet)" } as React.CSSProperties}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-2.5 w-[min(42%,560px)] origin-left animate-[rule-grow_620ms_100ms_cubic-bezier(0.2,0.72,0.2,1)_both] border-r-2 border-ink bg-[var(--accent)] max-[560px]:w-2/3"
        />
        <div>
          <p className="mb-1.5 text-xs font-black text-muted-foreground">Your shortlist</p>
          <h1 className="m-0 font-heading text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.065em]">
            Saved names
          </h1>
        </div>
        <p className="mb-1 max-w-[470px] text-[1.05rem] leading-[1.55] text-[oklch(0.4295_0.0312_289.8)]">
          Keep the names that deserve another look in one local collection.
        </p>
      </section>
      <SavedBrowser />
    </main>
  );
}
