import { CountriesBrowser } from "@/components/countries-browser"
import countries from "@/public/data/countries.json"
import type { Country } from "@/lib/types"

export default function CountriesPage() {
  return <CountriesBrowser countries={countries as Country[]} />
}
