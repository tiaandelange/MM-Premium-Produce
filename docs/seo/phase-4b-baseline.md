# Phase 4B baseline (before on-page SEO changes)

Recorded from the codebase immediately before Phase 4B implementation. Live values on Vercel follow the database overlay of these files.

## URLs (unchanged)

| Surface | EN | AF |
| --- | --- | --- |
| Home | `/en` | `/af` |
| Shop | `/en/shop` | `/af/winkel` |
| Vegetables | `/en/shop/vegetables` | `/af/winkel/groente` |
| Fruit | `/en/shop/fruit` | `/af/winkel/vrugte` |
| Delivery | `/en/delivery` | `/af/aflewering` |
| Bundles | `/en/bundles` | `/af/bokse` |
| Product | `/en/products/{slug}` | `/af/produkte/{slug}` |

No URL or slug changes in 4B.

## Titles / descriptions / H1 (pre-change)

| Page | Title | Description (summary) | Visible H1 |
| --- | --- | --- | --- |
| Home EN | Fresh Fruit & Vegetables \| M & M Premium Produce | Shop personally handpicked… | Hero lines: Premium Fresh / Fruit, Vegetables / & Produce |
| Home AF | Vars vrugte en groente \| M & M Premium Produce | Koop persoonlik uitgesoekte… | Vars Vrugte, / Groente / & Produkte |
| Shop EN | Fresh Produce Shop | Shop fresh fruit and vegetables… | Fresh Produce Shop |
| Shop AF | Varsproduk-winkel | Koop vars vrugte en groente… | Varsproduk-winkel |
| Vegetables | Fresh Vegetables | Browse fresh vegetables… including tomatoes | Vegetables / Groente |
| Fruit | Fresh Fruit | Browse fresh fruit… apples, citrus, grapes | Fruit / Vrugte |
| Delivery EN | Delivery Information | Areas, times and fees will be published… | Delivery information |
| Delivery AF | Afleweringsinligting | Areas, tye en fooie… | Afleweringsinligting |
| P1 PDPs | Usually product name only (e.g. Potatoes) | Generic shop-from-M&M lines | Product name |

AF P1 `seoTitle` was mostly empty except apples, baby spinach, green beans.

## Canonicals / hreflang

`lib/seo/metadata.ts` + `lib/seo/hreflang.ts`: self canonical per locale path; reciprocal `en`/`af`; `x-default` → English.

## Schema

- Organization (home)
- BreadcrumbList (shop, category, PDP, delivery)
- ItemList (home categories, shop, category products)
- Product or ProductGroup + Offer when price > 0
- No AggregateRating, no invented GTIN/MPN

## Sitemap

`app/sitemap.ts` (`force-dynamic`): home, shop, bundles, about, delivery, FAQ, contact, indexable categories, indexable products, indexable bundles. Locale pairs + x-default.

## Images

Hero: `hero1-828/1280/1920.webp` with `heroImageAlt`. Category/product WebP filenames already descriptive (`fresh-potatoes.webp`, etc.).
