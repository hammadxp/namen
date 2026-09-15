export type Country = {
  code: string
  name: string
  emoji: string
  region: string
  subregion: string
  cityCount: number
}

export type Category = {
  slug: string
  name: string
  description: string
  accent: string
  count: number
  samples: string[]
}

export type CatalogItem = {
  id: string
  name: string
  category: string
  group: string
  subtitle?: string
  score?: number
  color?: string
  symbol?: string
  atomicNumber?: number
  scientificName?: string
  country?: string
  countryCode?: string
  countryEmoji?: string
  population?: number
  distance?: number | null
  magnitude?: number | null
}

export type SortMode = "top" | "alphabetical" | "population"
