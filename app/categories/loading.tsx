export default function Loading() {
  return (
    <main
      className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]"
      aria-busy="true"
      aria-label="Loading collection"
    >
      <section className="relative mb-[42px] grid grid-cols-[1.3fr_0.7fr] items-end gap-[50px] border-b-2 border-ink pb-8 max-[780px]:grid-cols-1 max-[780px]:gap-[18px]">
        <div>
          <p className="mb-1.5 text-xs font-black text-muted-foreground">Loading local entries</p>
          <h1 className="m-0 font-heading text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.065em]">
            Opening collection
          </h1>
        </div>
      </section>
      <div className="grid min-h-[360px] place-content-center justify-items-center gap-3 text-center font-extrabold">
        Preparing the name index
      </div>
    </main>
  );
}
