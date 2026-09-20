"use client";

import { useMemo, useState } from "react";
import { LANGUAGES } from "@/config/translation";
import { Check, ChevronDown, Languages, LoaderCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Translation = { target: string; text: string };

const TRANSLATIONS_KEY = "naime:translations";
const LEGACY_TRANSLATIONS_KEY = "coolname:translations";

export function TranslationLab({ embedded = false }: { embedded?: boolean }) {
  const [input, setInput] = useState("");
  const [targets, setTargets] = useState<(string | null)[]>(["ur", "ar", "fr", "es", "ja", "de"]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [slot, setSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const options = useMemo(
    () =>
      LANGUAGES.filter((language) =>
        `${language.name} ${language.code} ${language.terms}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  function choose(code: string) {
    if (slot === null) return;
    if (targets.some((target, index) => index !== slot && target === code)) return;
    setTargets((current) => current.map((target, index) => (index === slot ? code : target)));
    setTranslations({});
    setSlot(null);
    setQuery("");
  }

  async function translate() {
    const targetList = targets.filter((target): target is string => Boolean(target));
    if (!input.trim() || !targetList.length) {
      setStatus("error");
      setError("Enter a word and choose at least one language.");
      return;
    }
    const cacheKey = `${input.trim().toLowerCase()}::${[...targetList].sort().join(",")}`;
    let cache: Record<string, unknown> = {};
    try {
      const storedKey = localStorage.getItem(TRANSLATIONS_KEY) ? TRANSLATIONS_KEY : LEGACY_TRANSLATIONS_KEY;
      const stored: unknown = JSON.parse(localStorage.getItem(storedKey) ?? "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        cache = stored as Record<string, unknown>;
        if (storedKey === LEGACY_TRANSLATIONS_KEY) {
          localStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(cache));
        }
      }
    } catch {
      // A damaged cache should not prevent a fresh translation.
    }

    try {
      const cached = cache[cacheKey];
      if (
        cached &&
        typeof cached === "object" &&
        targetList.every((target) => typeof (cached as Record<string, unknown>)[target] === "string")
      ) {
        setTranslations(cached as Record<string, string>);
        setStatus("idle");
        setError("");
        return;
      }
      setStatus("loading");
      setError("");
      setTranslations({});
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, targets: targetList }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const next = Object.fromEntries((result.translations as Translation[]).map((item) => [item.target, item.text]));
      setTranslations(next);
      cache[cacheKey] = next;
      try {
        localStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(Object.fromEntries(Object.entries(cache).slice(-50))));
      } catch {
        // Storage may be disabled or full; the translation still succeeded.
      }
      setStatus("idle");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Translation failed.");
    }
  }

  return (
    <section
      className={cn(
        embedded
          ? "max-w-none border-t-2 border-ink bg-violet px-4 py-[clamp(3.625rem,7vw,6.5rem)] text-white sm:px-[clamp(1.125rem,4vw,3.875rem)]"
          : "text-foreground"
      )}
    >
      {embedded ? (
        <div className="mx-auto mb-7.5 flex w-full max-w-245 items-end justify-between gap-6 max-[560px]:flex-col max-[560px]:items-start">
          <div>
            <p className="mb-2 text-xs font-black text-lemon">One word, six new sounds</p>
            <h2 className="m-0 font-heading text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.94] tracking-[-0.065em]">
              Try it in another language
            </h2>
          </div>
          <p className="mb-1 max-w-82.5 leading-normal text-white/85">
            Translate an idea to find a new rhythm, spelling, or starting point.
          </p>
        </div>
      ) : (
        <section
          className="relative mb-10.5 grid grid-cols-[1.3fr_0.7fr] items-end gap-12.5 border-b-2 border-ink pb-8 max-[780px]:grid-cols-1 max-[780px]:gap-4.5"
          style={{ "--accent": "var(--orange)" } as React.CSSProperties}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-0.5 h-2.5 w-[min(42%,560px)] origin-left animate-[rule-grow_620ms_100ms_cubic-bezier(0.2,0.72,0.2,1)_both] border-r-2 border-ink bg-accent max-[560px]:w-2/3"
          />
          <div>
            <p className="mb-1.5 text-xs font-black text-muted-foreground">Six translations at once</p>
            <h1 className="m-0 font-heading text-[clamp(3.6rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.065em]">
              Translate a word
            </h1>
          </div>
          <p className="mb-1 max-w-117.5 text-[1.05rem] leading-[1.55] text-[oklch(0.4295_0.0312_289.8)]">
            Use another language for more uniqueness. City cards stay out of this tool because place names rarely need
            translation.
          </p>
        </section>
      )}
      <section className="mx-auto max-w-245">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center border-2 border-ink bg-white text-ink shadow-[8px_8px_0_var(--orange)] max-[560px]:grid-cols-[auto_1fr]">
          <Languages className="ml-4.5 text-violet" size={23} />
          <input
            className="h-18 min-w-0 border-0 bg-transparent px-4 text-[1.2rem] font-semibold outline-none max-[560px]:h-16.5"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setTranslations({});
            }}
            maxLength={120}
            placeholder="Type a word or idea"
            aria-label="Word or idea to translate"
          />
          <button
            className="grid min-h-full min-w-35 place-items-center self-stretch border-0 border-l-2 border-ink bg-lemon font-black transition-colors hover:bg-mint max-[560px]:col-span-full max-[560px]:min-h-13 max-[560px]:border-t-2 max-[560px]:border-l-0"
            type="button"
            onClick={translate}
            disabled={status === "loading"}
          >
            {status === "loading" ? <LoaderCircle className="animate-[spin_900ms_linear_infinite]" /> : "Translate"}
          </button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
          {targets.map((code, index) => {
            const language = LANGUAGES.find((entry) => entry.code === code);
            return (
              <button
                className="grid min-h-20 grid-cols-[112px_minmax(0,1fr)_auto] items-center border-2 border-ink bg-white/80 px-3.5 py-3.5 pr-5 text-left text-ink transition-[background,transform] hover:-translate-y-0.5 hover:bg-white max-[560px]:grid-cols-[105px_minmax(0,1fr)_auto]"
                type="button"
                key={index}
                onClick={() => setSlot(index)}
              >
                <span className="text-[0.7rem] font-black text-muted-foreground">
                  {language?.name ?? "Choose language"}
                </span>
                <strong className="truncate px-2 text-base">
                  {code
                    ? translations[code] || (
                        <>
                          <span className="mr-1 text-[1.05rem]" aria-hidden="true">
                            {language?.emoji}
                          </span>{" "}
                          {language?.country}
                        </>
                      )
                    : "Empty"}
                </strong>
                <ChevronDown size={16} />
              </button>
            );
          })}
        </div>
        {status === "loading" && <p role="status">Translating...</p>}
        {status === "error" && (
          <p className="w-fit max-w-full border-2 border-ink bg-orange px-3 py-2 font-semibold" role="alert">
            {error}
          </p>
        )}
      </section>
      {slot !== null && (
        <div className="fixed inset-0 z-80 grid place-items-center bg-ink/75 p-4.5" onMouseDown={() => setSlot(null)}>
          <div
            className="max-h-[80vh] w-[min(460px,100%)] animate-[dialog-pop_180ms_ease-out_both] border-2 border-ink bg-paper p-5 text-ink shadow-[9px_9px_0_var(--orange)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-dialog-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") setSlot(null);
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="m-0 font-heading tracking-[-0.05em]" id="language-dialog-title">
                Choose a language
              </h2>
              <button
                className="grid size-8.5 place-items-center border-0 bg-transparent"
                type="button"
                onClick={() => setSlot(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <label className="flex min-h-12.5 items-center gap-2.5 border border-ink bg-white px-3.5">
              <Search size={17} />
              <input
                className="w-full min-w-0 border-0 bg-transparent outline-none"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try Urdu or Pakistan"
              />
            </label>
            <div className="mt-2.5 max-h-107.5 overflow-y-auto border border-ink">
              {options.map((language) => (
                <button
                  className="grid min-h-11.5 w-full grid-cols-[1fr_auto_24px] items-center border-0 border-b border-line bg-white px-3 py-2 text-left hover:bg-lemon disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={() => choose(language.code)}
                  key={language.code}
                  disabled={targets.some((target, index) => index !== slot && target === language.code)}
                >
                  <span>{language.name}</span>
                  <small className="mr-3 text-muted-foreground">{language.code}</small>
                  {targets.includes(language.code) && <Check size={16} />}
                </button>
              ))}
              {options.length === 0 && <p>No languages found. Try another search.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
