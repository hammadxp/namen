# Coolname

A colorful name-inspiration desk built from real city names. Browse 8,000+ curated
places, sort them by uniqueness, translate promising words, vote, save a shortlist,
and share a name or list.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Translation setup

The translation route keeps the Google credential on the server. Add a Google Cloud
Translation API key to `.env`:

```env
GOOGLE_CLOUD_TRANSLATE_API_KEY="your-key"
```

The interface remains usable without a key and explains what is missing when a
translation is requested.

## Rebuild the city dataset

```bash
pnpm data:build
```

The offline script downloads GeoNames `cities15000`, reads country metadata from REST
Countries or its open dataset fallback, removes duplicate place names, computes a
uniqueness score, infers tags and word emojis, and writes static files under
`public/data`.

Optional limits can be changed without editing the script:

```bash
pnpm data:build --max-per-country=50 --min-population=25000
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Favorites, votes, and translation cache entries are stored in browser localStorage.
Share links use URL parameters and do not require an account or database.
