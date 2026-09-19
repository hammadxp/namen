import type { CatalogItem } from "@/types/catalog";

const CONSTELLATIONS: Record<string, string> = {
  And: "Andromeda",
  Ant: "Antlia",
  Aps: "Apus",
  Aqr: "Aquarius",
  Aql: "Aquila",
  Ara: "Ara",
  Ari: "Aries",
  Aur: "Auriga",
  Boo: "Boötes",
  Cae: "Caelum",
  Cam: "Camelopardalis",
  Cnc: "Cancer",
  CVn: "Canes Venatici",
  CMa: "Canis Major",
  CMi: "Canis Minor",
  Cap: "Capricornus",
  Car: "Carina",
  Cas: "Cassiopeia",
  Cen: "Centaurus",
  Cep: "Cepheus",
  Cet: "Cetus",
  Cha: "Chamaeleon",
  Cir: "Circinus",
  Col: "Columba",
  Com: "Coma Berenices",
  CrA: "Corona Australis",
  CrB: "Corona Borealis",
  Crv: "Corvus",
  Crt: "Crater",
  Cru: "Crux",
  Cyg: "Cygnus",
  Del: "Delphinus",
  Dor: "Dorado",
  Dra: "Draco",
  Equ: "Equuleus",
  Eri: "Eridanus",
  For: "Fornax",
  Gem: "Gemini",
  Gru: "Grus",
  Her: "Hercules",
  Hor: "Horologium",
  Hya: "Hydra",
  Hyi: "Hydrus",
  Ind: "Indus",
  Lac: "Lacerta",
  Leo: "Leo",
  LMi: "Leo Minor",
  Lep: "Lepus",
  Lib: "Libra",
  Lup: "Lupus",
  Lyn: "Lynx",
  Lyr: "Lyra",
  Men: "Mensa",
  Mic: "Microscopium",
  Mon: "Monoceros",
  Mus: "Musca",
  Nor: "Norma",
  Oct: "Octans",
  Oph: "Ophiuchus",
  Ori: "Orion",
  Pav: "Pavo",
  Peg: "Pegasus",
  Per: "Perseus",
  Phe: "Phoenix",
  Pic: "Pictor",
  Psc: "Pisces",
  PsA: "Piscis Austrinus",
  Pup: "Puppis",
  Pyx: "Pyxis",
  Ret: "Reticulum",
  Sge: "Sagitta",
  Sgr: "Sagittarius",
  Sco: "Scorpius",
  Scl: "Sculptor",
  Sct: "Scutum",
  Ser: "Serpens",
  Sex: "Sextans",
  Tau: "Taurus",
  Tel: "Telescopium",
  Tri: "Triangulum",
  TrA: "Triangulum Australe",
  Tuc: "Tucana",
  UMa: "Ursa Major",
  UMi: "Ursa Minor",
  Vel: "Vela",
  Vir: "Virgo",
  Vol: "Volans",
  Vul: "Vulpecula",
};

const DISTINCTIVE_FRUITS = [
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
];

export function titleCase(value: string) {
  return value
    .split(/(\s+|-)/)
    .map((part) =>
      /\p{L}/u.test(part) ? `${part.slice(0, 1).toLocaleUpperCase()}${part.slice(1).toLocaleLowerCase()}` : part
    )
    .join("");
}

export function groupLabel(item: CatalogItem) {
  if (item.category === "stars") {
    if (item.group === '"') return "Uncatalogued";
    return CONSTELLATIONS[item.group] ?? item.group;
  }
  if (["colors", "scientific-words", "elements"].includes(item.category)) {
    return titleCase(item.group);
  }
  return item.group;
}

export function subtitleLabel(item: CatalogItem) {
  if (item.category === "stars") return `${groupLabel(item)} constellation`;
  return item.subtitle ? titleCase(item.subtitle) : groupLabel(item);
}

export function hasShortCityName(item: CatalogItem) {
  return item.category !== "cities" || item.name.trim().split(/\s+/).length <= 2;
}

export function compareDistinctiveFruits(a: CatalogItem, b: CatalogItem) {
  const aRank = DISTINCTIVE_FRUITS.indexOf(a.name);
  const bRank = DISTINCTIVE_FRUITS.indexOf(b.name);
  if (aRank !== -1 || bRank !== -1) {
    if (aRank === -1) return 1;
    if (bRank === -1) return -1;
    return aRank - bRank;
  }
  return (b.score ?? 0) - (a.score ?? 0) || a.name.localeCompare(b.name);
}

export function distinctiveFruitNames(items: CatalogItem[], limit = 5) {
  return [...items]
    .sort(compareDistinctiveFruits)
    .slice(0, limit)
    .map((item) => item.name);
}
