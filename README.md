# M&M Premium Produce

SEO-first ecommerce storefront skeleton. Phase 1 establishes catalogue architecture, crawlable URLs, metadata, structured data, sitemap/robots and an admin information architecture. Checkout, database persistence, authentication and payments are intentionally out of scope.

## Stack

- Next.js 16 App Router
- TypeScript (strict)
- React 19 Server Components
- Tailwind CSS 4
- npm

## Local development

```bash
cp .env.example .env.local
# set DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD
npm install
npm run db:push
npm run db:rls
npm run db:report
npm run db:import
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at `/admin`.

Copy `.env.example` to `.env.local` if you need to override the site URL.

```bash
npm run check    # lint + typecheck
npm run build    # production build
```

## Information architecture

```text
/                      Homepage
/shop                  Catalogue hub
/shop/[category]       Category landing pages (fruit, vegetables)
/products/[slug]       Individual products
/bundles               Produce boxes
/bundles/[slug]        Individual boxes
/about /delivery /contact /faq
/admin...              Noindex admin skeleton
```

Filters must not create indexable URLs. Canonical category pages are `/shop/fruit` and `/shop/vegetables`, not `/shop?category=`.

## Catalogue model

Storefront and admin read the same `services/catalog` layer. Today that layer is file-backed (`data/`). It is the seam for PostgreSQL/Supabase later.

- **Category** — taxonomy (`/shop/vegetables`)
- **Collection** — merchandising groups (not public in Phase 1 unless indexable)
- **Product** — purchasable item (`/products/baby-spinach`)
- **Bundle** — purchasable box that references products (`/bundles/family-produce-box`)

Sample records are marked `isSample: true`. Do not treat them as live inventory.

## Indexing

Pages stay `noindex` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Admin routes are always noindex and never appear in `/sitemap.xml`. Unknown product, category and bundle slugs return a real 404.

## Business facts

Unconfirmed details live in `config/site.ts` as `{ status: "todo" }` fields. Do not invent addresses, delivery areas, prices, reviews or certifications in public copy.
