"use client";

import { useMemo, useState } from "react";
import { LANGUAGES } from "@/config/translation";
import { Check, ChevronDown, Languages, LoaderCircle, Search, X } from "lucide-react";

type Translation = { target: string; text: string };

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
      const stored: unknown = JSON.parse(localStorage.getItem("coolname:translations") ?? "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        cache = stored as Record<string, unknown>;
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
        localStorage.setItem(
          "coolname:translations",
          JSON.stringify(Object.fromEntries(Object.entries(cache).slice(-50)))
        );
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
    <section className={embedded ? "home-translate" : "translate-page"}>
      {embedded ? (
        <div className="section-intro translate-intro">
          <div>
            <p>One word, six new sounds</p>
            <h2>Try it in another language</h2>
          </div>
          <p>Translate an idea to find a new rhythm, spelling, or starting point.</p>
        </div>
      ) : (
        <section className="page-heading translate-heading">
          <div>
            <p>Six translations at once</p>
            <h1>Translate a word</h1>
          </div>
          <p>
            Use another language for more uniqueness. City cards stay out of this tool because place names rarely need
            translation.
          </p>
        </section>
      )}
      <section className="translation-workbench">
        <div className="translation-input">
          <Languages size={23} />
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setTranslations({});
            }}
            maxLength={120}
            placeholder="Type a word or idea"
            aria-label="Word or idea to translate"
          />
          <button type="button" onClick={translate} disabled={status === "loading"}>
            {status === "loading" ? <LoaderCircle className="spin" /> : "Translate"}
          </button>
        </div>
        <div className="translation-grid">
          {targets.map((code, index) => {
            const language = LANGUAGES.find((entry) => entry.code === code);
            return (
              <button className="translation-slot" type="button" key={index} onClick={() => setSlot(index)}>
                <span>{language?.name ?? "Choose language"}</span>
                <strong>
                  {code
                    ? translations[code] || (
                        <>
                          <span aria-hidden="true">{language?.emoji}</span> {language?.country}
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
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
      {slot !== null && (
        <div className="dialog-backdrop" onMouseDown={() => setSlot(null)}>
          <div
            className="language-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-dialog-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") setSlot(null);
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="dialog-title">
              <h2 id="language-dialog-title">Choose a language</h2>
              <button type="button" onClick={() => setSlot(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <label className="field">
              <Search size={17} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try Urdu or Pakistan"
              />
            </label>
            <div className="language-list">
              {options.map((language) => (
                <button
                  type="button"
                  onClick={() => choose(language.code)}
                  key={language.code}
                  disabled={targets.some((target, index) => index !== slot && target === language.code)}
                >
                  <span>{language.name}</span>
                  <small>{language.code}</small>
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
