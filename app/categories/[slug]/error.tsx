"use client";

type CategoryErrorProps = {
  reset: () => void;
};

export default function CategoryError({ reset }: CategoryErrorProps) {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <div
        className="grid min-h-[360px] place-content-center justify-items-center gap-3 text-center font-extrabold"
        role="alert"
      >
        <h1 className="m-0">Collection unavailable</h1>
        <p className="m-0">Try opening it again.</p>
        <button
          className="mx-auto mt-9 block h-[52px] min-w-[190px] border-2 border-ink bg-lemon font-black shadow-[5px_5px_0_var(--ink)] transition-colors hover:bg-mint"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
