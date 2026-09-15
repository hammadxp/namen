export type Country = {
  code: string
  name: string
  emoji: string
  region: string
  subregion: string
  cityCount: number
}

export type NameItem = {
  id: string
  name: string
  category: "city"
  country: string
  countryEmoji: string
  wordEmoji: string
  population: number
  uniquenessScore: number
  tags: string[]
}

export type SortMode = "unique" | "population" | "alphabetical"
