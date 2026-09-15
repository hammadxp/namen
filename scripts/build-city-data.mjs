import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import AdmZip from "adm-zip"

const GEONAMES_URL = "https://download.geonames.org/export/dump/cities15000.zip"
const COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,flag,region,subregion"
const COUNTRIES_FALLBACK_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
const outputRoot = path.join(process.cwd(), "public", "data")
const citiesRoot = path.join(outputRoot, "cities")

const maxPerCountry = Number(readArg("--max-per-country") ?? 70)
const minPopulation = Number(readArg("--min-population") ?? 15_000)

function readArg(name) {
  const item = process.argv.find((argument) => argument.startsWith(`${name}=`))
  return item?.split("=")[1]
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function countryEmoji(countryCode) {
  return [...countryCode.toUpperCase()]
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("")
}

function scoreName(name, population) {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, "")
  const rareLetters = (normalized.match(/[qxzjkvwy]/g) ?? []).length
  const unusualPairs = (
    normalized.match(/zh|tz|sz|cz|lj|nj|kh|aa|uu|oe|ao|ui|eo/g) ?? []
  ).length
  const vowels = (normalized.match(/[aeiouy]/g) ?? []).length
  const vowelRatio = vowels / Math.max(1, normalized.length)
  const alternations = [...normalized].slice(1).filter((letter, index) => {
    const priorIsVowel = /[aeiouy]/.test(normalized[index])
    return /[aeiouy]/.test(letter) !== priorIsVowel
  }).length
  const pronounceability = alternations / Math.max(1, normalized.length - 1)
  const idealLength = 1 - Math.min(Math.abs(normalized.length - 7) / 9, 1)
  const discovery = 1 - clamp(Math.log10(Math.max(population, 15_000)) / 7.4)

  return Number(
    clamp(
      0.18 +
        rareLetters * 0.09 +
        unusualPairs * 0.1 +
        pronounceability * 0.24 +
        idealLength * 0.18 +
        (1 - Math.abs(vowelRatio - 0.43)) * 0.12 +
        discovery * 0.18,
    ).toFixed(2),
  )
}

function makeTags(name, population, featureCode) {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, "")
  const vowels = (normalized.match(/[aeiouy]/g) ?? []).length
  const tags = []
  if (featureCode.startsWith("PPLC")) tags.push("capital")
  if (population >= 1_000_000) tags.push("metropolis")
  if (population < 80_000) tags.push("hidden-gem")
  if (normalized.length <= 6) tags.push("short")
  if (/[qxzjkvw]/.test(normalized)) tags.push("rare-letter")
  if (vowels / Math.max(1, normalized.length) > 0.5) tags.push("vowel-rich")
  if (/([a-z])\1/.test(normalized)) tags.push("double-letter")
  if (/[lmnrsv][aeiouy]/.test(normalized)) tags.push("soft-sound")
  if (tags.length < 2) tags.push("place-name")
  return [...new Set(tags)].slice(0, 3)
}

function wordEmoji(name, tags) {
  if (tags.includes("capital")) return "✦"
  if (tags.includes("metropolis")) return "🌆"
  let options = ["☀️", "🪩", "🍒", "🌿", "🫧", "🎈"]
  if (tags.includes("rare-letter")) options = ["⚡", "🪩", "🧊", "🔮"]
  else if (tags.includes("vowel-rich")) options = ["🌊", "🫧", "☀️", "🪸"]
  else if (tags.includes("soft-sound")) options = ["🌙", "🌿", "🪶", "🍃"]
  else if (tags.includes("hidden-gem")) options = ["💎", "🔮", "🍒", "🪺"]
  const total = [...name].reduce((sum, letter) => sum + letter.codePointAt(0), 0)
  return options[total % options.length]
}

async function download(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

console.log("Downloading GeoNames and REST Countries data...")
const [zipBuffer, countryResponse] = await Promise.all([
  download(GEONAMES_URL),
  fetch(COUNTRIES_URL),
])
if (!countryResponse.ok) {
  throw new Error(`REST Countries request failed (${countryResponse.status})`)
}

let countries = await countryResponse.json()
if (!Array.isArray(countries)) {
  console.warn("REST Countries API needs a v5 key; using its open source dataset.")
  const fallbackResponse = await fetch(COUNTRIES_FALLBACK_URL)
  if (!fallbackResponse.ok) {
    throw new Error(`Country metadata request failed (${fallbackResponse.status})`)
  }
  countries = await fallbackResponse.json()
}
const metadataByCode = new Map(
  countries.map((country) => [country.cca2, country]),
)
const zip = new AdmZip(zipBuffer)
const cityEntry = zip
  .getEntries()
  .find((entry) => entry.entryName.endsWith(".txt"))
if (!cityEntry) throw new Error("GeoNames archive did not contain a text file")

const grouped = new Map()
for (const line of cityEntry.getData().toString("utf8").split("\n")) {
  if (!line.trim()) continue
  const fields = line.split("\t")
  const name = fields[1]?.trim()
  const country = fields[8]
  const featureCode = fields[7] ?? ""
  const population = Number(fields[14])
  if (
    !name ||
    !country ||
    !metadataByCode.has(country) ||
    !Number.isFinite(population) ||
    population < minPopulation
  ) {
    continue
  }

  const tags = makeTags(name, population, featureCode)
  const city = {
    id: `${country.toLowerCase()}-${fields[0]}`,
    name,
    category: "city",
    country,
    countryEmoji: metadataByCode.get(country)?.flag || countryEmoji(country),
    wordEmoji: wordEmoji(name, tags),
    population,
    uniquenessScore: scoreName(name, population),
    tags,
  }
  const existing = grouped.get(country) ?? []
  existing.push(city)
  grouped.set(country, existing)
}

await rm(outputRoot, { recursive: true, force: true })
await mkdir(citiesRoot, { recursive: true })

const countryIndex = []
for (const [code, rawCities] of grouped) {
  const seenNames = new Set()
  const selected = rawCities
    .sort((a, b) => b.uniquenessScore - a.uniquenessScore || b.population - a.population)
    .filter((city) => {
      const key = city.name.toLocaleLowerCase()
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    })
    .slice(0, maxPerCountry)
  if (!selected.length) continue
  const country = metadataByCode.get(code)
  countryIndex.push({
    code,
    name: country.name.common,
    emoji: country.flag || countryEmoji(code),
    region: country.region,
    subregion: country.subregion,
    cityCount: selected.length,
  })
  await writeFile(
    path.join(citiesRoot, `${code}.json`),
    `${JSON.stringify(selected)}\n`,
  )
}

countryIndex.sort((a, b) => a.name.localeCompare(b.name))
await writeFile(
  path.join(outputRoot, "countries.json"),
  `${JSON.stringify(countryIndex, null, 2)}\n`,
)

console.log(
  `Wrote ${countryIndex.length} countries and ${countryIndex.reduce((sum, country) => sum + country.cityCount, 0)} curated cities to public/data.`,
)
