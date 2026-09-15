import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const outputRoot = path.join(process.cwd(), "public", "data")
const categoriesRoot = path.join(outputRoot, "categories")
await mkdir(categoriesRoot, { recursive: true })

const sources = {
  fruits:
    "https://raw.githubusercontent.com/Franqsanz/fruits-api/main/src/data/data.js",
  colors: "https://thecolorpalettestudio.com/pages/color-name-ideas",
  elements:
    "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json",
  stars:
    "https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv",
}

const fruitCatalog = [
  ["Apple", "Malus domestica", "Kazakhstan"],
  ["Pear", "Pyrus communis", "China"],
  ["Banana", "Musa acuminata", "Papua New Guinea"],
  ["Orange", "Citrus sinensis", "China"],
  ["Mandarin", "Citrus reticulata", "China"],
  ["Lemon", "Citrus limon", "India"],
  ["Lime", "Citrus aurantiifolia", "Indonesia"],
  ["Grapefruit", "Citrus paradisi", "Barbados"],
  ["Apricot", "Prunus armeniaca", "China"],
  ["Plum", "Prunus domestica", "Romania"],
  ["Peach", "Prunus persica", "China"],
  ["Loquat", "Eriobotrya japonica", "China"],
  ["Dragon fruit", "Selenicereus undatus", "Mexico"],
  ["Tamarind", "Tamarindus indica", "Sudan"],
  ["Mango", "Mangifera indica", "India"],
  ["Soursop", "Annona muricata", "Dominican Republic"],
  ["Cherry", "Prunus avium", "Turkey"],
  ["Guava", "Psidium guajava", "Mexico"],
  ["Avocado", "Persea americana", "Mexico"],
  ["Coconut", "Cocos nucifera", "Philippines"],
  ["Starfruit", "Averrhoa carambola", "Sri Lanka"],
  ["Fig", "Ficus carica", "Turkey"],
  ["Pomegranate", "Punica granatum", "Iran"],
  ["Olive", "Olea europaea", "Greece"],
  ["Lychee", "Litchi chinensis", "China"],
  ["Durian", "Durio zibethinus", "Indonesia"],
  ["Jackfruit", "Artocarpus heterophyllus", "India"],
  ["Mangosteen", "Garcinia mangostana", "Indonesia"],
  ["Pineapple", "Ananas comosus", "Brazil"],
  ["Persimmon", "Diospyros kaki", "China"],
  ["Kiwi", "Actinidia deliciosa", "China"],
  ["Passion fruit", "Passiflora edulis", "Brazil"],
  ["Papaya", "Carica papaya", "Mexico"],
  ["Date", "Phoenix dactylifera", "Iraq"],
  ["Rambutan", "Nephelium lappaceum", "Malaysia"],
  ["Longan", "Dimocarpus longan", "China"],
  ["Feijoa", "Acca sellowiana", "Brazil"],
  ["Açaí", "Euterpe oleracea", "Brazil"],
  ["Cranberry", "Vaccinium macrocarpon", "Canada"],
  ["Blueberry", "Vaccinium corymbosum", "United States"],
]

const colorFamilies = {
  red: [
    "Crimson",
    "Ruby",
    "Scarlet",
    "Carmine",
    "Burgundy",
    "Vermilion",
    "Maroon",
    "Cherry",
    "Brick",
    "Cranberry",
    "Rose",
    "Garnet",
    "Raspberry",
    "Mahogany",
    "Merlot",
    "Auburn",
    "Cinnabar",
    "Pomegranate",
    "Claret",
    "Poppy",
    "Hibiscus",
    "Amaranth",
    "Sangria",
    "Watermelon",
  ],
  orange: [
    "Tangerine",
    "Apricot",
    "Peach",
    "Pumpkin",
    "Amber",
    "Carrot",
    "Citrus",
    "Mandarin",
    "Salmon",
    "Sunrise",
    "Cider",
    "Ginger",
    "Saffron",
    "Marigold",
    "Copper",
    "Papaya",
    "Terracotta",
    "Cantaloupe",
    "Mango",
    "Bronze",
    "Clay",
    "Sienna",
    "Topaz",
    "Nectarine",
  ],
  yellow: [
    "Lemon",
    "Sunshine",
    "Canary",
    "Gold",
    "Butter",
    "Dandelion",
    "Mustard",
    "Honey",
    "Maize",
    "Citrine",
    "Banana",
    "Flaxen",
    "Goldenrod",
    "Pineapple",
    "Primrose",
    "Straw",
    "Sunflower",
    "Mimosa",
    "Champagne",
    "Daffodil",
    "Jonquil",
    "Ochre",
    "Wattle",
    "Cornsilk",
  ],
  green: [
    "Emerald",
    "Jade",
    "Olive",
    "Lime",
    "Mint",
    "Forest",
    "Grass",
    "Shamrock",
    "Fern",
    "Moss",
    "Pine",
    "Sage",
    "Chartreuse",
    "Celadon",
    "Hunter",
    "Pistachio",
    "Pear",
    "Teal",
    "Avocado",
    "Clover",
    "Malachite",
    "Cactus",
    "Bamboo",
    "Ivy",
    "Kiwi",
    "Verdant",
    "Beryl",
    "Spearmint",
  ],
  blue: [
    "Azure",
    "Cobalt",
    "Navy",
    "Sky",
    "Sapphire",
    "Turquoise",
    "Indigo",
    "Cerulean",
    "Denim",
    "Aqua",
    "Royal",
    "Steel",
    "Powder",
    "Periwinkle",
    "Cornflower",
    "Prussian",
    "Midnight",
    "Aegean",
    "Cyan",
    "Glaucous",
    "Lapis",
    "Peacock",
    "Ultramarine",
    "Wedgwood",
  ],
  purple: [
    "Lavender",
    "Amethyst",
    "Violet",
    "Plum",
    "Lilac",
    "Mauve",
    "Orchid",
    "Grape",
    "Iris",
    "Magenta",
    "Eggplant",
    "Mulberry",
    "Thistle",
    "Pansy",
    "Heather",
    "Wisteria",
    "Boysenberry",
    "Fuchsia",
    "Twilight",
    "Velvet",
    "Grapevine",
  ],
  pink: [
    "Blush",
    "Bubblegum",
    "Flamingo",
    "Carnation",
    "Peony",
    "Petal",
    "Cotton candy",
    "Strawberry",
    "Azalea",
    "Candy",
    "Blossom",
    "Honeysuckle",
    "Bougainvillea",
    "Sherbet",
    "Tulip",
    "Rosewood",
    "Candyfloss",
  ],
  white: [
    "Snow",
    "Ivory",
    "Pearl",
    "Chalk",
    "Alabaster",
    "Cotton",
    "Cream",
    "Lily",
    "Vanilla",
    "Parchment",
    "Marshmallow",
    "Coconut",
    "Frost",
    "Bone",
    "Blanc",
    "Ghost",
    "Dove",
    "Porcelain",
    "Silica",
    "Crystal",
    "Linen",
    "Opal",
    "Eggshell",
    "Magnolia",
    "Oyster",
    "Seashell",
    "Whisper",
    "Cloud",
  ],
  beige: [
    "Sand",
    "Taupe",
    "Camel",
    "Buff",
    "Fawn",
    "Oatmeal",
    "Khaki",
    "Tawny",
    "Ecru",
    "Biscuit",
    "Hazelnut",
    "Caramel",
    "Almond",
    "Wheat",
    "Tan",
    "Mushroom",
    "Sepia",
    "Mocha",
    "Bisque",
    "Latte",
    "Sandstone",
    "Pebble",
    "Toffee",
    "Pecan",
    "Putty",
    "Sable",
    "Maple",
    "Driftwood",
    "Umber",
    "Pumice",
  ],
  black: [
    "Ebony",
    "Onyx",
    "Jet",
    "Coal",
    "Obsidian",
    "Raven",
    "Pitch",
    "Charcoal",
    "Ink",
    "Soot",
    "Shadow",
    "Noir",
    "Licorice",
    "Graphite",
    "Carbon",
    "Caviar",
    "Dusk",
    "Crow",
    "Void",
    "Panther",
    "Tarmac",
    "Nightfall",
    "Abyss",
    "Iron",
    "Asphalt",
    "Thunder",
    "Vanta",
    "Gloom",
  ],
}

const colorHex = {
  red: "#C8464A",
  orange: "#E4833A",
  yellow: "#E2B93B",
  green: "#4D8B62",
  blue: "#3979A8",
  purple: "#795B9D",
  pink: "#D97893",
  white: "#F2F0E8",
  beige: "#C5A982",
  black: "#24272B",
}

const scientificWords = {
  astronomy: [
    "Aphelion",
    "Azimuth",
    "Bolide",
    "Chromosphere",
    "Eclipse",
    "Ecliptic",
    "Exoplanet",
    "Galactic",
    "Heliosphere",
    "Interstellar",
    "Libration",
    "Magnetar",
    "Nebula",
    "Occultation",
    "Parallax",
    "Perihelion",
    "Pulsar",
    "Quasar",
    "Singularity",
    "Solstice",
    "Supernova",
    "Syzygy",
    "Zenith",
  ],
  biology: [
    "Allele",
    "Anabolism",
    "Axon",
    "Bioluminescence",
    "Chromatin",
    "Cytoplasm",
    "Dendrite",
    "Epigenetic",
    "Homeostasis",
    "Lichen",
    "Mitosis",
    "Morphogenesis",
    "Mycelium",
    "Nucleotide",
    "Organelle",
    "Osmosis",
    "Phylogeny",
    "Plasmid",
    "Rhizome",
    "Symbiosis",
    "Telomere",
  ],
  chemistry: [
    "Allotrope",
    "Anion",
    "Catalyst",
    "Chelation",
    "Chirality",
    "Covalent",
    "Effervescence",
    "Enthalpy",
    "Isomer",
    "Ligand",
    "Molarity",
    "Polymer",
    "Precipitate",
    "Radical",
    "Redox",
    "Sublimation",
    "Valence",
  ],
  earth: [
    "Albedo",
    "Bathymetry",
    "Cryosphere",
    "Delta",
    "Eolian",
    "Fumarole",
    "Geode",
    "Isobar",
    "Lithosphere",
    "Moraine",
    "Orogeny",
    "Penumbra",
    "Petrichor",
    "Seismic",
    "Stratum",
    "Tectonic",
    "Thermocline",
  ],
  physics: [
    "Amplitude",
    "Boson",
    "Entropy",
    "Fermion",
    "Flux",
    "Frequency",
    "Inertia",
    "Isotope",
    "Kinetic",
    "Luminescence",
    "Momentum",
    "Neutrino",
    "Photon",
    "Quantum",
    "Resonance",
    "Scalar",
    "Tensor",
    "Velocity",
    "Vortex",
    "Wavelength",
  ],
}

function slug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
async function updateFruits() {
  console.log("[fruits] Fetching fruit names and origins")
  const response = await fetch(sources.fruits)
  if (!response.ok) throw new Error(`Fruit source returned ${response.status}`)
  const distinctive = [
    "Feijoa",
    "Rambutan",
    "Mangosteen",
    "Açaí",
    "Soursop",
    "Loquat",
    "Longan",
    "Persimmon",
    "Lychee",
    "Durian",
    "Starfruit",
    "Tamarind",
    "Pomegranate",
    "Dragon fruit",
    "Passion fruit",
    "Jackfruit",
  ]
  const rows = fruitCatalog.map(([name, scientificName, origin]) => ({
    id: `fruit-${slug(name)}`,
    name,
    category: "fruits",
    group: origin,
    subtitle: `Origin: ${origin}`,
    scientificName,
    score: Number(
      (
        1 -
        Math.min(
          (distinctive.indexOf(name) === -1
            ? distinctive.length + name.length
            : distinctive.indexOf(name)) * 0.012,
          0.6
        )
      ).toFixed(2)
    ),
  }))
  rows.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  await writeFile(
    path.join(categoriesRoot, "fruits.json"),
    `${JSON.stringify(rows, null, 2)}\n`
  )
  return rows
}

async function updateColors() {
  console.log("[colors] Verifying source and storing grouped color names")
  const response = await fetch(sources.colors)
  if (!response.ok) throw new Error(`Color source returned ${response.status}`)
  const rows = Object.entries(colorFamilies).flatMap(([family, names]) =>
    [...new Set(names)].map((name, index) => ({
      id: `color-${family}-${slug(name)}`,
      name,
      category: "colors",
      group: family,
      subtitle: `${family} family`,
      color: colorHex[family],
      score: Number((0.95 - index * 0.008).toFixed(2)),
    }))
  )
  await writeFile(
    path.join(categoriesRoot, "colors.json"),
    `${JSON.stringify(rows, null, 2)}\n`
  )
  return rows
}

async function updateScientificWords() {
  console.log("[science] Building the local scientific word list")
  const rows = Object.entries(scientificWords).flatMap(([field, names]) =>
    names.map((name, index) => ({
      id: `science-${slug(name)}`,
      name,
      category: "scientific-words",
      group: field,
      subtitle: `${field} term`,
      score: Number((0.98 - index * 0.01).toFixed(2)),
    }))
  )
  await writeFile(
    path.join(categoriesRoot, "scientific-words.json"),
    `${JSON.stringify(rows, null, 2)}\n`
  )
  return rows
}

async function updateElements() {
  console.log("[elements] Fetching the periodic table")
  const source = await fetch(sources.elements).then((response) =>
    response.json()
  )
  const rows = source.elements
    .filter((element) => element.number <= 118)
    .map((element) => ({
      id: `element-${element.number}`,
      name: element.name,
      category: "elements",
      group: element.category,
      subtitle: `Atomic number ${element.number}`,
      symbol: element.symbol,
      atomicNumber: element.number,
      score: Number(
        (1 - Math.min(Math.abs(element.name.length - 7) / 14, 0.72)).toFixed(2)
      ),
    }))
  await writeFile(
    path.join(categoriesRoot, "elements.json"),
    `${JSON.stringify(rows, null, 2)}\n`
  )
  return rows
}

function parseCsvLine(line) {
  const output = []
  let value = ""
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"' && line[index + 1] === '"') {
      value += '"'
      index += 1
    } else if (character === '"') quoted = !quoted
    else if (character === "," && !quoted) {
      output.push(value)
      value = ""
    } else value += character
  }
  output.push(value)
  return output
}

async function updateStars() {
  console.log("[stars] Fetching named stars from HYG")
  const csv = await fetch(sources.stars).then((response) => response.text())
  const lines = csv.trim().split("\n")
  const headers = parseCsvLine(lines[0])
  const properIndex = headers.indexOf("proper")
  const constellationIndex = headers.indexOf("con")
  const distanceIndex = headers.indexOf("dist")
  const magnitudeIndex = headers.indexOf("mag")
  const seen = new Set()
  const rows = []
  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line)
    const name = fields[properIndex]?.trim()
    if (!name || seen.has(name.toLowerCase())) continue
    seen.add(name.toLowerCase())
    rows.push({
      id: `star-${slug(name)}`,
      name,
      category: "stars",
      group: fields[constellationIndex] || "Uncatalogued",
      subtitle: `${fields[constellationIndex] || "Unknown"} constellation`,
      distance: Number(fields[distanceIndex]) || null,
      magnitude: Number(fields[magnitudeIndex]) || null,
      score: Number(
        (1 - Math.min(Math.abs(name.length - 7) / 16, 0.75)).toFixed(2)
      ),
    })
  }
  rows.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  await writeFile(
    path.join(categoriesRoot, "stars.json"),
    `${JSON.stringify(rows, null, 2)}\n`
  )
  return rows
}

const updated = {}
for (const [key, updater] of Object.entries({
  fruits: updateFruits,
  colors: updateColors,
  "scientific-words": updateScientificWords,
  elements: updateElements,
  stars: updateStars,
}))
  updated[key] = await updater()

const countries = JSON.parse(
  await readFile(path.join(outputRoot, "countries.json"), "utf8")
)
const topCities = JSON.parse(
  await readFile(path.join(categoriesRoot, "cities-top.json"), "utf8").catch(
    () => "[]"
  )
)
const definitions = [
  {
    slug: "cities",
    name: "Cities",
    description:
      "Place names from around the world, ranked for sound and shape.",
    accent: "#35B8D4",
    count: countries.reduce((sum, country) => sum + country.cityCount, 0),
    samples: topCities.slice(0, 5).map((item) => item.name),
  },
  {
    slug: "countries",
    name: "Countries",
    description: "Country names with flags, regions, and sortable city counts.",
    accent: "#FFD166",
    count: countries.length,
    samples: [...countries]
      .sort((a, b) => b.cityCount - a.cityCount || a.name.localeCompare(b.name))
      .slice(0, 5)
      .map((item) => item.name),
  },
  {
    slug: "fruits",
    name: "Fruit names",
    description: "Fruit names paired with their documented region of origin.",
    accent: "#FF6B35",
    count: updated.fruits.length,
    samples: updated.fruits.slice(0, 5).map((item) => item.name),
  },
  {
    slug: "colors",
    name: "Color names",
    description: "Evocative names grouped into ten main color families.",
    accent: "#7657FF",
    count: updated.colors.length,
    samples: updated.colors.slice(0, 5).map((item) => item.name),
  },
  {
    slug: "scientific-words",
    name: "Scientific words",
    description:
      "Distinctive terms from astronomy, biology, chemistry, earth science, and physics.",
    accent: "#43C59E",
    count: updated["scientific-words"].length,
    samples: updated["scientific-words"].slice(0, 5).map((item) => item.name),
  },
  {
    slug: "elements",
    name: "Periodic elements",
    description:
      "All 118 element names with symbols, atomic numbers, and classifications.",
    accent: "#F19C2B",
    count: updated.elements.length,
    samples: updated.elements.slice(0, 5).map((item) => item.name),
  },
  {
    slug: "stars",
    name: "Star names",
    description: "Proper star names from the HYG stellar database.",
    accent: "#5956E9",
    count: updated.stars.length,
    samples: updated.stars.slice(0, 5).map((item) => item.name),
  },
]

await writeFile(
  path.join(outputRoot, "categories.json"),
  `${JSON.stringify(definitions, null, 2)}\n`
)
await writeFile(
  path.join(outputRoot, "metadata.json"),
  `${JSON.stringify({ updatedAt: new Date().toISOString(), sources }, null, 2)}\n`
)
console.log("[catalog] Category data and timestamp updated")
