"use client"

import { useMemo, useState } from "react"
import {
  Check,
  ChevronDown,
  Languages,
  LoaderCircle,
  Search,
  X,
} from "lucide-react"

const LANGUAGES = [
  { code: "ar", name: "Arabic", country: "Saudi Arabia", emoji: "🇸🇦", terms: "egypt jordan saudi uae" },
  { code: "bn", name: "Bengali", country: "Bangladesh", emoji: "🇧🇩", terms: "bangladesh india" },
  { code: "zh-CN", name: "Chinese", country: "China", emoji: "🇨🇳", terms: "china mandarin" },
  { code: "nl", name: "Dutch", country: "Netherlands", emoji: "🇳🇱", terms: "netherlands belgium" },
  { code: "fr", name: "French", country: "France", emoji: "🇫🇷", terms: "france canada belgium" },
  { code: "de", name: "German", country: "Germany", emoji: "🇩🇪", terms: "germany austria switzerland" },
  { code: "el", name: "Greek", country: "Greece", emoji: "🇬🇷", terms: "greece" },
  { code: "hi", name: "Hindi", country: "India", emoji: "🇮🇳", terms: "india" },
  { code: "id", name: "Indonesian", country: "Indonesia", emoji: "🇮🇩", terms: "indonesia" },
  { code: "it", name: "Italian", country: "Italy", emoji: "🇮🇹", terms: "italy" },
  { code: "ja", name: "Japanese", country: "Japan", emoji: "🇯🇵", terms: "japan" },
  { code: "ko", name: "Korean", country: "South Korea", emoji: "🇰🇷", terms: "korea" },
  { code: "fa", name: "Persian", country: "Iran", emoji: "🇮🇷", terms: "iran farsi" },
  { code: "pl", name: "Polish", country: "Poland", emoji: "🇵🇱", terms: "poland" },
  { code: "pt", name: "Portuguese", country: "Portugal", emoji: "🇵🇹", terms: "portugal brazil" },
  { code: "ro", name: "Romanian", country: "Romania", emoji: "🇷🇴", terms: "romania" },
  { code: "ru", name: "Russian", country: "Russia", emoji: "🇷🇺", terms: "russia" },
  { code: "es", name: "Spanish", country: "Spain", emoji: "🇪🇸", terms: "spain mexico argentina" },
  { code: "sw", name: "Swahili", country: "Kenya", emoji: "🇰🇪", terms: "kenya tanzania" },
  { code: "sv", name: "Swedish", country: "Sweden", emoji: "🇸🇪", terms: "sweden" },
  { code: "tr", name: "Turkish", country: "Türkiye", emoji: "🇹🇷", terms: "turkey" },
  { code: "uk", name: "Ukrainian", country: "Ukraine", emoji: "🇺🇦", terms: "ukraine" },
  { code: "ur", name: "Urdu", country: "Pakistan", emoji: "🇵🇰", terms: "pakistan pk india" },
  { code: "vi", name: "Vietnamese", country: "Vietnam", emoji: "🇻🇳", terms: "vietnam" },
]

type Translation = { target: string; text: string }

export function TranslationLab({ embedded = false }: { embedded?: boolean }) {
  const [input, setInput] = useState("")
  const [targets, setTargets] = useState<(string | null)[]>([
    "ur",
    "ar",
    "fr",
    "es",
    "ja",
    "de",
  ])
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [slot, setSlot] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState("")
  const options = useMemo(
    () =>
      LANGUAGES.filter((language) =>
        `${language.name} ${language.code} ${language.terms}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  )

  function choose(code: string) {
    if (slot === null) return
    setTargets((current) =>
      current.map((target, index) => (index === slot ? code : target))
    )
    setSlot(null)
    setQuery("")
  }

  async function translate() {
    const targetList = targets.filter((target): target is string =>
      Boolean(target)
    )
    if (!input.trim() || !targetList.length) {
      setStatus("error")
      setError("Enter a word and choose at least one language.")
      return
    }
    const cacheKey = `${input.trim().toLowerCase()}::${[...targetList].sort().join(",")}`
    try {
      const cache = JSON.parse(
        localStorage.getItem("coolname:translations") ?? "{}"
      )
      if (cache[cacheKey]) {
        setTranslations(cache[cacheKey])
        setStatus("idle")
        setError("")
        return
      }
      setStatus("loading")
      setError("")
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, targets: targetList }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      const next = Object.fromEntries(
        (result.translations as Translation[]).map((item) => [
          item.target,
          item.text,
        ])
      )
      setTranslations(next)
      cache[cacheKey] = next
      localStorage.setItem("coolname:translations", JSON.stringify(cache))
      setStatus("idle")
    } catch (caught) {
      setStatus("error")
      setError(caught instanceof Error ? caught.message : "Translation failed.")
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
          <p>
            Translate an idea to find a new rhythm, spelling, or starting point.
          </p>
        </div>
      ) : (
        <section className="page-heading translate-heading">
          <div>
            <p>Six translations at once</p>
            <h1>Translate a word</h1>
          </div>
          <p>
            Use another language for more uniqueness. City cards stay out of
            this tool because place names rarely need translation.
          </p>
        </section>
      )}
      <section className="translation-workbench">
        <div className="translation-input">
          <Languages size={23} />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={120}
            placeholder="Type a word or idea"
          />
          <button
            type="button"
            onClick={translate}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <LoaderCircle className="spin" />
            ) : (
              "Translate"
            )}
          </button>
        </div>
        <div className="translation-grid">
          {targets.map((code, index) => {
            const language = LANGUAGES.find((entry) => entry.code === code)
            return (
              <button
                className="translation-slot"
                type="button"
                key={index}
                onClick={() => setSlot(index)}
              >
                <span>{language?.name ?? "Choose language"}</span>
                <strong>
                  {code ? (
                    translations[code] || (
                      <><span aria-hidden="true">{language?.emoji}</span> {language?.country}</>
                    )
                  ) : "Empty"}
                </strong>
                <ChevronDown size={16} />
              </button>
            )
          })}
        </div>
        {status === "error" && <p className="form-error">{error}</p>}
      </section>
      {slot !== null && (
        <div className="dialog-backdrop" onMouseDown={() => setSlot(null)}>
          <div
            className="language-dialog"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="dialog-title">
              <h2>Choose a language</h2>
              <button
                type="button"
                onClick={() => setSlot(null)}
                aria-label="Close"
              >
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
                >
                  <span>{language.name}</span>
                  <small>{language.code}</small>
                  {targets.includes(language.code) && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
