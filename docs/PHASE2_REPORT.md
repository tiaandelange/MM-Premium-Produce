# Phase 2 quality report

## What shipped

The storefront was not rebuilt. Phase 1B routes, SEO helpers, typed catalogue domain and `services/catalog` remain the public contract. The file-backed implementation is now an import source only. Runtime catalogue reads come from Neon PostgreSQL.

## Database

- Neon project `mm-premium-produce` (`raspy-firefly-89972876`)
- Normalized tables: products, product_variants, product_images, categories, product_categories, collections, collection_products, bundles, bundle_items, inventory, media_assets, redirects, admin_users
- Stub tables reserved for later: customers, orders, order_items, payments, deliveries
- Indexes on slugs, SKUs, status, category, featured, indexable and redirect paths
- RLS enabled with public SELECT policies on published catalogue data; writes stay with the server role

## Catalogue import

Shopify snapshot: 40 products. All 40 validated against Phase 1B names, copy, images and categories.

Spelling and slug normalizations (with 301s):

- Avos → Avocados (`/products/avos`)
- Cherry Tomatoes handle `tamatoes` → `cherry-tomatoes`
- Baby Patatos / Patatos → Potatoes
- Gauvas → Guavas
- Appels → Apples (`Fugi` variant kept as Fuji in Phase 1B data)
- Kiwi's → Kiwis
- Grapes 500g, pack-size handles, `cantaloupe`, `pineapple`, `banana` → canonical slugs
- `/shop/fruits` → `/shop/fruit`

Imported: 40 published products, 2 categories, 14 variants, 44 product images, 46 media assets, 14 redirects.

## Images

Google Drive is not used as a runtime host. Production files live under `/images/products`, `/images/categories` and `/brand`. Each image row stores `original_asset_ref` (`drive:products/<file>` and the Shopify CDN snapshot URL), optimized `src`, alt, width, height, display order and primary flag.

## Admin CMS

Authenticated at `/admin/login`.

- `/admin`
- `/admin/products`, `/new`, `/[id]`
- `/admin/categories`, `/new`, `/[id]`
- `/admin/bundles`, `/new`, `/[id]`
- `/admin/media`
- `/admin/collections` (list)

Create, edit, publish (`active`), unpublish (`draft`) and archive. Indexable is blocked unless the product is published and meets the content quality gate. Published slug changes write 301s.

Admin routes stay noindex and out of the sitemap.

## SEO output

Metadata, canonicals, OG fields, JSON-LD, sitemap and merchant-feed mapping all read `services/catalog`. Price and availability therefore cannot disagree between page copy, schema and a future merchant feed.

## Quality gate

| Check | Result |
| --- | --- |
| Database migrations | Applied (`npm run db:push`) |
| RLS/auth | Applied (`npm run db:rls`); JWT admin sessions |
| Admin access | `/admin/login` + proxy + `requireAdmin()` |
| CRUD | Products, categories, bundles, media |
| Product/category rendering | Dynamic pages from the database |
| Metadata / schema / sitemap | Database-backed |
| Redirects | 14 Shopify handle 301s + slug-change protection |
| 404s | Unknown slugs still `notFound()` |
| Lint | Pass |
| Typecheck | Pass |
| Build | Pass |

Checkout and payments were not started.

Full row-level mapping: `docs/MIGRATION_REPORT.md`.
