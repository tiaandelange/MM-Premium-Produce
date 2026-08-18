# Architecture — Phase 1

## Catalogue flow

```text
Admin (future CRUD)
        ↓
services/catalog  ← file-backed today, database later
        ↓
Typed domain: Product / Category / Collection / Bundle
        ↓
Server-rendered storefront + metadata + JSON-LD + sitemap
```

## SEO engine

- `lib/seo/metadata.ts` — titles, descriptions, OG, Twitter, robots
- `lib/seo/canonical.ts` — self-referencing canonicals from `NEXT_PUBLIC_SITE_URL`
- `lib/seo/structured-data.ts` — Organization, Product, Offer (only when data exists), BreadcrumbList
- `lib/seo/indexation.ts` — environment gate + entity `indexable`
- `app/sitemap.ts` — canonical public URLs only
- `app/robots.ts` — allow/disallow; blocks `/admin/` and `/api/`

## URL stability

Slugs are the public identifiers. `data/redirects.ts` is wired through `next.config.ts`. Changing a live slug requires a redirect in the same change.

## Future content

`types/content.ts` and `plannedContentPaths` reserve recipes/guides. Do not generate those routes until there is genuine content.

## Merchant Center / analytics

- `lib/merchant/feed-fields.ts` maps products only when required feed fields are real
- `lib/analytics/events.ts` names GA4 ecommerce events; no scripts are installed yet
