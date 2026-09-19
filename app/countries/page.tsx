import { CountriesBrowser } from "./_components/countries-browser";
import { pageMetadata } from "@/config/metadata";
import { getCountries } from "@/queries/catalog";

export const metadata = pageMetadata("Countries", "Explore country names and the city collections behind them.");

export default function CountriesPage() {
  return <CountriesBrowser countries={getCountries()} />;
}
