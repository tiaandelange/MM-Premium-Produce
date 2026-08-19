# Phase 6 — Organic growth loop (month 0)

**As of 19 Aug 2026.** Real sources only. Google Search Console, GA4 and Merchant Center APIs are **not connected** in this workspace. No query/CTR/position numbers are invented.

## Cadence

1. Weekly: production HTTP sample (home, shop, one category, one PDP, sitemap, robots).
2. Weekly: Merchant Center disapprovals — fix `products` / translations in Neon, then regenerate the TSV. Do not patch the feed file by hand.
3. Monthly: export GSC Queries + Pages (last 28 days), drop CSVs in `data/seo/imports/`, run `npm run seo:monthly`.
4. Monthly: GA4 organic landing pages vs Neon orders (EN vs AF). Orders currently have **no UTM/source column**, so organic revenue is not attributable until that is added **after** measurement is live.
5. Quarterly: field CWV in Search Console (not lab Lighthouse alone).
6. Do not change slugs for CTR tests. Titles/descriptions only when a page has impressions.

## Indexation gate

Do not request indexing while `robots.txt` is `Disallow: /` or while storefront URLs return 500.

## Authority (Phase 4A, no spam)

Blocked until public NAP exists: HelloPeter, Google Business Profile, Brabys, food/agri directories. Do not create listings with invented address/phone.
