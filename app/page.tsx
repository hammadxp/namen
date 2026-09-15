import countries from "@/public/data/countries.json"
import { NameLab } from "@/components/name-lab"
import type { Country } from "@/lib/types"

export default function Page() {
  return <NameLab countries={countries as Country[]} />
}
