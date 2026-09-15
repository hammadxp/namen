"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Bookmark,
  Check,
  ChevronDown,
  Heart,
  Languages,
  LoaderCircle,
  Search,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react"
import type { Country, NameItem, SortMode } from "@/lib/types"

const LANGUAGES = [
  { code: "ar", name: "Arabic", terms: "egypt jordan saudi uae" },
  { code: "bn", name: "Bengali", terms: "bangladesh india" },
  { code: "zh-CN", name: "Chinese", terms: "china mandarin" },
  { code: "nl", name: "Dutch", terms: "netherlands belgium" },
  { code: "fr", name: "French", terms: "france canada belgium" },
  { code: "de", name: "German", terms: "germany austria switzerland" },
  { code: "el", name: "Greek", terms: "greece" },
  { code: "hi", name: "Hindi", terms: "india" },
  { code: "id", name: "Indonesian", terms: "indonesia" },
  { code: "it", name: "Italian", terms: "italy" },
  { code: "ja", name: "Japanese", terms: "japan" },
  { code: "ko", name: "Korean", terms: "korea" },
  { code: "fa", name: "Persian", terms: "iran farsi" },
  { code: "pl", name: "Polish", terms: "poland" },
  { code: "pt", name: "Portuguese", terms: "portugal brazil" },
  { code: "ro", name: "Romanian", terms: "romania" },
  { code: "ru", name: "Russian", terms: "russia" },
  { code: "es", name: "Spanish", terms: "spain mexico argentina" },
  { code: "sw", name: "Swahili", terms: "kenya tanzania" },
  { code: "sv", name: "Swedish", terms: "sweden" },
  { code: "tr", name: "Turkish", terms: "turkey" },
  { code: "uk", name: "Ukrainian", terms: "ukraine" },
  { code: "ur", name: "Urdu", terms: "pakistan pk india" },
  { code: "vi", name: "Vietnamese", terms: "vietnam" },
]

type Translation = { target: string; text: string }

function formatPopulation(population: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(population)
}

export function NameLab({ countries }: { countries: Country[] }) {
  const defaultCountry = countries.find((country) => country.code === "PT") ?? countries[0]
  const [countryCode, setCountryCode] = useState(defaultCountry.code)
  const [countryQuery, setCountryQuery] = useState("")
  const [cityQuery, setCityQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("unique")
  const [cities, setCities] = useState<NameItem[]>([])
  const [loadedCountry, setLoadedCountry] = useState<string | null>(null)
  const [saved, setSaved] = useState<NameItem[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [votes, setVotes] = useState<Record<string, -1 | 1>>({})
  const [toast, setToast] = useState("")
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [sharedNames, setSharedNames] = useState<string[]>([])
  const [translationInput, setTranslationInput] = useState("")
  const [targetLanguages, setTargetLanguages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [languageSlot, setLanguageSlot] = useState<number | null>(null)
  const [languageQuery, setLanguageQuery] = useState("")
  const [translationStatus, setTranslationStatus] = useState<"idle" | "loading" | "error">("idle")
  const [translationError, setTranslationError] = useState("")
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedCountry =
    countries.find((country) => country.code === countryCode) ?? defaultCountry
  const loadingCities = loadedCountry !== countryCode

  function announce(message: string) {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 2400)
  }

  useEffect(() => {
    try {
      const storedSaved = JSON.parse(localStorage.getItem("coolname:saved") ?? "[]")
      const storedVotes = JSON.parse(localStorage.getItem("coolname:votes") ?? "{}")
      const params = new URLSearchParams(window.location.search)
      const requestedCountry = params.get("country")?.toUpperCase()
      const requestedName = params.get("name")
      const list = params.get("list")
      queueMicrotask(() => {
        setSaved(storedSaved)
        setVotes(storedVotes)
        if (requestedCountry && countries.some((country) => country.code === requestedCountry)) {
          setCountryCode(requestedCountry)
        }
        if (requestedName) setHighlightedId(requestedName)
        if (list) setSharedNames(list.split("|").filter(Boolean).slice(0, 20))
      })
    } catch {
      localStorage.removeItem("coolname:saved")
      localStorage.removeItem("coolname:votes")
    }
  }, [countries])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/data/cities/${countryCode}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("City file not found")
        return response.json() as Promise<NameItem[]>
      })
      .then((items) => {
        setCities(items)
        setLoadedCountry(countryCode)
        if (highlightedId) {
          const highlighted = items.find((item) => item.id === highlightedId)
          if (highlighted) setTranslationInput(highlighted.name)
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setCities([])
          setLoadedCountry(countryCode)
        }
      })
    return () => controller.abort()
  }, [countryCode, highlightedId])

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase()
    if (!query) return countries
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query),
    )
  }, [countries, countryQuery])

  const visibleNames = useMemo(() => {
    if (showSaved) return saved
    const query = cityQuery.trim().toLowerCase()
    return cities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(query) ||
          city.tags.some((tag) => tag.includes(query)),
      )
      .sort((a, b) => {
        if (sortMode === "alphabetical") return a.name.localeCompare(b.name)
        if (sortMode === "population") return b.population - a.population
        return b.uniquenessScore - a.uniquenessScore
      })
  }, [cities, cityQuery, saved, showSaved, sortMode])

  const languageOptions = useMemo(() => {
    const query = languageQuery.trim().toLowerCase()
    return LANGUAGES.filter((language) =>
      `${language.name} ${language.code} ${language.terms}`.toLowerCase().includes(query),
    )
  }, [languageQuery])

  function chooseCountry(code: string) {
    setCountryCode(code)
    setCityQuery("")
    setShowSaved(false)
    setHighlightedId(null)
    const url = new URL(window.location.href)
    url.searchParams.set("country", code.toLowerCase())
    url.searchParams.delete("name")
    window.history.replaceState({}, "", url)
  }

  function toggleSaved(item: NameItem) {
    const exists = saved.some((savedItem) => savedItem.id === item.id)
    const next = exists ? saved.filter((savedItem) => savedItem.id !== item.id) : [item, ...saved]
    setSaved(next)
    localStorage.setItem("coolname:saved", JSON.stringify(next))
    announce(exists ? `${item.name} removed` : `${item.name} saved`)
  }

  function vote(item: NameItem, value: -1 | 1) {
    const next = { ...votes }
    if (next[item.id] === value) delete next[item.id]
    else next[item.id] = value
    setVotes(next)
    localStorage.setItem("coolname:votes", JSON.stringify(next))
  }

  async function shareName(item: NameItem) {
    const url = new URL(window.location.href)
    url.searchParams.set("country", item.country.toLowerCase())
    url.searchParams.set("name", item.id)
    url.searchParams.delete("list")
    try {
      if (navigator.share) {
        await navigator.share({ title: `${item.name} on Coolname`, url: url.toString() })
      } else {
        await navigator.clipboard.writeText(url.toString())
        announce("Name link copied")
      }
    } catch {
      // Closing the native share sheet needs no follow-up.
    }
  }

  async function shareList() {
    if (!saved.length) {
      announce("Save a few names first")
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.delete("name")
    url.searchParams.delete("country")
    url.searchParams.set("list", saved.map((item) => item.name).join("|"))
    await navigator.clipboard.writeText(url.toString())
    announce("Shortlist link copied")
  }

  function pickForTranslation(item: NameItem) {
    setTranslationInput(item.name)
    document.getElementById("translation-lab")?.scrollIntoView({ behavior: "smooth" })
  }

  function chooseLanguage(code: string) {
    if (languageSlot === null) return
    setTargetLanguages((current) =>
      current.map((language, index) => (index === languageSlot ? code : language)),
    )
    setLanguageSlot(null)
    setLanguageQuery("")
  }

  async function translateWord() {
    const targets = targetLanguages.filter((target): target is string => Boolean(target))
    if (!translationInput.trim() || !targets.length) {
      setTranslationError("Enter a word and add at least one language.")
      setTranslationStatus("error")
      return
    }

    const orderedTargets = [...targets].sort()
    const cacheKey = `${translationInput.trim().toLowerCase()}::${orderedTargets.join(",")}`
    try {
      const cache = JSON.parse(localStorage.getItem("coolname:translations") ?? "{}")
      if (cache[cacheKey]) {
        setTranslations(cache[cacheKey])
        setTranslationStatus("idle")
        setTranslationError("")
        return
      }
      setTranslationStatus("loading")
      setTranslationError("")
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translationInput, targets: orderedTargets }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      const nextTranslations = Object.fromEntries(
        (result.translations as Translation[]).map((item) => [item.target, item.text]),
      )
      setTranslations(nextTranslations)
      cache[cacheKey] = nextTranslations
      localStorage.setItem("coolname:translations", JSON.stringify(cache))
      setTranslationStatus("idle")
    } catch (error) {
      setTranslationStatus("error")
      setTranslationError(error instanceof Error ? error.message : "Translation failed.")
    }
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Coolname home">
          COOL<span>NAME</span><i>✦</i>
        </a>
        <p>Names hiding in plain sight.</p>
        <div className="header-actions">
          <button className="header-button" onClick={shareList} type="button">
            <Share2 size={17} /> Share list
          </button>
          <button
            className={`saved-button ${showSaved ? "is-active" : ""}`}
            onClick={() => setShowSaved((value) => !value)}
            type="button"
          >
            <Bookmark size={17} fill={showSaved ? "currentColor" : "none"} />
            Saved <strong>{saved.length}</strong>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <h1>Steal your next name from the map.</h1>
          <p>
            Browse the world&apos;s best city names, ranked for sound, shape, and just
            enough oddness.
          </p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>8,000+</span>
          <small>curious names</small>
        </div>
      </section>

      {sharedNames.length > 0 && (
        <section className="shared-strip">
          <div>
            <Heart size={18} fill="currentColor" />
            <strong>A shortlist landed in your lap</strong>
          </div>
          <p>{sharedNames.join(", ")}</p>
          <button type="button" onClick={() => setSharedNames([])} aria-label="Hide shared list">
            <X size={18} />
          </button>
        </section>
      )}

      <section className="workspace" aria-label="Browse city names">
        <aside className="country-panel">
          <div className="panel-heading">
            <h2>Pick a place</h2>
            <span>{countries.length} countries</span>
          </div>
          <label className="search-field country-search">
            <Search size={17} />
            <input
              value={countryQuery}
              onChange={(event) => setCountryQuery(event.target.value)}
              placeholder="Find a country"
              aria-label="Find a country"
            />
          </label>
          <div className="country-list">
            {filteredCountries.map((country) => (
              <button
                type="button"
                key={country.code}
                className={country.code === countryCode && !showSaved ? "selected" : ""}
                onClick={() => chooseCountry(country.code)}
              >
                <span className="flag">{country.emoji}</span>
                <span>{country.name}</span>
                <small>{country.cityCount}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="name-panel">
          <div className="name-toolbar">
            <div className="place-title">
              <span>{showSaved ? "📌" : selectedCountry.emoji}</span>
              <div>
                <p>{showSaved ? "Your pocket list" : selectedCountry.region}</p>
                <h2>{showSaved ? "Saved names" : selectedCountry.name}</h2>
              </div>
            </div>
            <label className="search-field city-search">
              <Search size={18} />
              <input
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
                placeholder="Search names or tags"
                aria-label="Search city names"
              />
            </label>
          </div>

          <div className="sort-row">
            <p>{visibleNames.length} names on the desk</p>
            {!showSaved && (
              <div className="sort-controls" aria-label="Sort city names">
                {(
                  [
                    ["unique", "Most unique"],
                    ["population", "Population"],
                    ["alphabetical", "A to Z"],
                  ] as [SortMode, string][]
                ).map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={sortMode === value ? "active" : ""}
                    onClick={() => setSortMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loadingCities && !showSaved ? (
            <div className="loading-state">
              <LoaderCircle className="spin" /> Shuffling the map...
            </div>
          ) : visibleNames.length === 0 ? (
            <div className="empty-state">
              <span>🫙</span>
              <h3>{showSaved ? "Your jar is empty" : "No names found"}</h3>
              <p>
                {showSaved ? "Save any name that makes you look twice." : "Try a shorter search."}
              </p>
            </div>
          ) : (
            <div className="name-grid">
              {visibleNames.map((item, index) => {
                const isSaved = saved.some((savedItem) => savedItem.id === item.id)
                const itemVote = votes[item.id]
                return (
                  <article
                    className={`name-card color-${index % 6} ${highlightedId === item.id ? "highlighted" : ""}`}
                    key={item.id}
                  >
                    <div className="name-card-top">
                      <span className="word-emoji">{item.wordEmoji}</span>
                      <span className="country-chip">{item.countryEmoji} {item.country}</span>
                      <button
                        type="button"
                        className={`save-icon ${isSaved ? "saved" : ""}`}
                        onClick={() => toggleSaved(item)}
                        aria-label={`${isSaved ? "Remove" : "Save"} ${item.name}`}
                      >
                        <Bookmark size={19} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <button className="name-button" type="button" onClick={() => pickForTranslation(item)}>
                      <h3>{item.name}</h3>
                      <span>Try this word <Languages size={14} /></span>
                    </button>
                    <div className="tag-row">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag.replaceAll("-", " ")}</span>
                      ))}
                    </div>
                    <div className="name-card-bottom">
                      <div className="score-block">
                        <strong>{Math.round(item.uniquenessScore * 100)}</strong>
                        <span>unique</span>
                      </div>
                      <span className="population">pop. {formatPopulation(item.population)}</span>
                      <div className="mini-actions">
                        <button
                          type="button"
                          className={itemVote === 1 ? "voted" : ""}
                          onClick={() => vote(item, 1)}
                          aria-label={`Upvote ${item.name}`}
                        >
                          <ThumbsUp size={15} />
                        </button>
                        <button
                          type="button"
                          className={itemVote === -1 ? "voted" : ""}
                          onClick={() => vote(item, -1)}
                          aria-label={`Downvote ${item.name}`}
                        >
                          <ThumbsDown size={15} />
                        </button>
                        <button type="button" onClick={() => shareName(item)} aria-label={`Share ${item.name}`}>
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="translation-lab" id="translation-lab">
        <div className="translation-intro">
          <span className="translation-icon"><Languages size={27} /></span>
          <div>
            <h2>Turn one word into six new leads.</h2>
            <p>Translate for sound and shape. The result does not have to mean the same thing forever.</p>
          </div>
        </div>
        <div className="translation-input-row">
          <input
            value={translationInput}
            onChange={(event) => setTranslationInput(event.target.value)}
            placeholder="Type a word, idea, or city name"
            maxLength={120}
            aria-label="Word to translate"
          />
          <button type="button" onClick={translateWord} disabled={translationStatus === "loading"}>
            {translationStatus === "loading" ? <LoaderCircle className="spin" /> : <Sparkles size={19} />}
            Translate
          </button>
        </div>

        <div className="translation-grid">
          {targetLanguages.map((code, index) => {
            const language = LANGUAGES.find((option) => option.code === code)
            return (
              <button
                className={`translation-slot ${code ? "has-language" : ""}`}
                type="button"
                key={index}
                onClick={() => setLanguageSlot(index)}
              >
                {language ? (
                  <>
                    <span>{language.name}</span>
                    <strong>{translations[language.code] || "Ready to translate"}</strong>
                    <ChevronDown size={16} />
                  </>
                ) : (
                  <>
                    <b>+</b>
                    <span>Add a language</span>
                  </>
                )}
              </button>
            )
          })}
        </div>
        {translationStatus === "error" && <p className="translation-error">{translationError}</p>}
      </section>

      <footer>
        <p>Built for names that feel found, not generated.</p>
        <span>GeoNames data • Stored in your browser</span>
      </footer>

      {languageSlot !== null && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setLanguageSlot(null)}>
          <div
            className="language-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a language"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="dialog-title">
              <h3>Choose a language</h3>
              <button type="button" onClick={() => setLanguageSlot(null)} aria-label="Close language picker">
                <X size={20} />
              </button>
            </div>
            <label className="search-field">
              <Search size={17} />
              <input
                autoFocus
                value={languageQuery}
                onChange={(event) => setLanguageQuery(event.target.value)}
                placeholder="Try Urdu, Pakistan, or pk"
              />
            </label>
            <div className="language-list">
              {languageOptions.map((language) => (
                <button type="button" key={language.code} onClick={() => chooseLanguage(language.code)}>
                  <span>{language.name}</span>
                  <small>{language.code}</small>
                  {targetLanguages.includes(language.code) && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <Check size={17} /> {toast}
      </div>
    </main>
  )
}
