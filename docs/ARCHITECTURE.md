# Architecture — Phase 2

## Catalogue flow

```text
Admin CMS (authenticated)
        ↓
PostgreSQL (Neon)  ← products, variants, images, categories, bundles, inventory, redirects
        ↓
services/catalog  ← database implementation, same CatalogService interface
        ↓
Typed domain: Product / Category / Collection / Bundle
        ↓
Server-rendered storefront + metadata + JSON-LD + sitemap + 301 redirects
```

File-backed seed data in `data/` remains an import source only. Runtime requests do not read Shopify or Google Drive.

## SEO engine

- `lib/seo/metadata.ts` — titles, descriptions, OG, Twitter, robots, canonical override
- `lib/seo/canonical.ts` — self-referencing canonicals from `NEXT_PUBLIC_SITE_URL`
- `lib/seo/structured-data.ts` — Organization, Product, Offer (only when data exists), BreadcrumbList
- `lib/seo/indexation.ts` — environment gate + entity `indexable`
- `lib/catalog/quality.ts` — minimum content required before a published page can be indexable
- `app/sitemap.ts` — canonical public URLs only (published + indexable)
- `app/robots.ts` — allow/disallow; blocks `/admin/` and `/api/`
- `proxy.ts` — locale routing, unprefixed 301s, and an admin session perimeter. Database 301s for changed slugs run from entity pages via `lib/seo/redirects.ts`.

## URL stability

When a published slug changes, `services/catalog/admin.ts` writes the old path into `redirects` and `proxy.ts` returns 301. Indexed URLs are not silently dropped.

## Auth

Admin users live in `admin_users`. Sessions are signed JWTs in an httpOnly cookie. Server Components and Server Actions verify the session; `proxy.ts` is a perimeter only.

## Future content

`types/content.ts` and `plannedContentPaths` reserve recipes/guides. Do not generate those routes until there is genuine content.

Checkout tables (`customers`, `orders`, `order_items`, `payments`, `deliveries`) are live. Cart cookies store product/variant IDs and quantity only. Prices, delivery fees and totals are computed on the server from the catalogue at checkout.

Inventory decrement uses a single SQL `UPDATE ... WHERE quantity - reserved >= qty`. Untracked SKUs (no inventory row) are treated as unlimited. Concurrent duplicate `idempotency_key` requests restore the loser’s decrement and return the winner’s order. Neon HTTP has no interactive transaction around the full checkout; stock is decremented first and restored on failure.

Payments use `lib/payments` with an `unconfigured` adapter. Browser redirects are not treated as paid. Webhooks must be verified by a future provider adapter, then `applyProviderPayment` updates the order idempotently.

Admin pages call `requireAdmin()` (`role === "admin"`). `proxy.ts` also redirects unauthenticated `/admin` requests to login. RLS is enabled but the app uses the database owner role, so application-layer checks are the live control.

`lib/email/order-notifications.ts` builds localized order emails. Sending is not configured and is not faked.
