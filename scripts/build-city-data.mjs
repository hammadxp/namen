import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import AdmZip from "adm-zip"

const GEONAMES_URL = "https://download.geonames.org/export/dump/cities500.zip"
const COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,flag,region,subregion"
const COUNTRIES_FALLBACK_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
const outputRoot = path.join(process.cwd(), "public", "data")
const citiesRoot = path.join(outputRoot, "cities")
const categoriesRoot = path.join(outputRoot, "categories")

const minimumPopulation = Number(readArg("--min-population") ?? 500)
const maximumPerCountry = Number(readArg("--max-per-country") ?? Infinity)

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

function hasShortName(name) {
  return name.trim().split(/\s+/).length <= 2
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
  const discovery = 1 - clamp(Math.log10(Math.max(population, 500)) / 7.4)

  return Number(
    clamp(
      0.18 +
        rareLetters * 0.09 +
        unusualPairs * 0.1 +
        pronounceability * 0.24 +
        idealLength * 0.18 +
        (1 - Math.abs(vowelRatio - 0.43)) * 0.12 +
        discovery * 0.18
    ).toFixed(2)
  )
}

async function download(url) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Download failed (${response.status}): ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

console.log("[cities] Downloading GeoNames and country metadata")
const [zipBuffer, countryResponse] = await Promise.all([
  download(GEONAMES_URL),
  fetch(COUNTRIES_URL),
])
if (!countryResponse.ok) {
  throw new Error(`REST Countries request failed (${countryResponse.status})`)
}

let countries = await countryResponse.json()
if (!Array.isArray(countries)) {
  const fallbackResponse = await fetch(COUNTRIES_FALLBACK_URL)
  if (!fallbackResponse.ok) {
    throw new Error(
      `Country metadata request failed (${fallbackResponse.status})`
    )
  }
  countries = await fallbackResponse.json()
}

const metadataByCode = new Map(
  countries.map((country) => [country.cca2, country])
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
  const countryCode = fields[8]
  const population = Number(fields[14])
  if (
    !name ||
    !countryCode ||
    !metadataByCode.has(countryCode) ||
    !Number.isFinite(population) ||
    population < minimumPopulation ||
    !hasShortName(name)
  ) {
    continue
  }

  const country = metadataByCode.get(countryCode)
  const city = {
    id: `city-${fields[0]}`,
    name,
    category: "cities",
    group: country?.name?.common ?? countryCode,
    country: country?.name?.common ?? countryCode,
    countryCode,
    countryEmoji: country?.flag || countryEmoji(countryCode),
    population,
    score: scoreName(name, population),
  }
  const existing = grouped.get(countryCode) ?? []
  existing.push(city)
  grouped.set(countryCode, existing)
}

await rm(citiesRoot, { recursive: true, force: true })
await mkdir(citiesRoot, { recursive: true })
await mkdir(categoriesRoot, { recursive: true })

const countryIndex = []
const allCities = []
for (const [code, rawCities] of grouped) {
  const seenNames = new Set()
  const selected = rawCities
    .sort((a, b) => b.population - a.population || a.name.localeCompare(b.name))
    .filter((city) => {
      const key = city.name.toLocaleLowerCase()
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    })
    .slice(0, maximumPerCountry)

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
  allCities.push(...selected)
  await writeFile(
    path.join(citiesRoot, `${code}.json`),
    `${JSON.stringify(selected)}\n`
  )
}

countryIndex.sort(
  (a, b) => b.cityCount - a.cityCount || a.name.localeCompare(b.name)
)
allCities.sort(
  (a, b) => b.population - a.population || a.name.localeCompare(b.name)
)

await writeFile(
  path.join(outputRoot, "countries.json"),
  `${JSON.stringify(countryIndex, null, 2)}\n`
)
await writeFile(
  path.join(categoriesRoot, "cities.json"),
  `${JSON.stringify(allCities)}\n`
)
await writeFile(
  path.join(categoriesRoot, "cities-top.json"),
  `${JSON.stringify(allCities.slice(0, 24), null, 2)}\n`
)

console.log(
  `[cities] Stored ${allCities.length.toLocaleString()} cities across ${countryIndex.length} countries`
)
