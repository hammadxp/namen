# Coolname

A searchable name collection built from cities, countries, fruit, colors, scientific
words, periodic elements, and stars. The browser uses local static data and keeps
saved names and translation results in localStorage.

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

## Update local data

```bash
pnpm data:update
```

The parent updater runs each source in order and records its completion time in
`public/data/metadata.json`. It downloads GeoNames `cities500`, REST Countries,
the HYG star database, the periodic table dataset, fruit-origin source data, and
verifies the configured color-name source. Generated files live under
`public/data` and the footer displays the last update date.

Run only one part when needed:

```bash
pnpm data:build
pnpm data:categories
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Saved names and translation cache entries are stored in browser localStorage.
