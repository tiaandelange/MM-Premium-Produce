# Phase 4C — Merchant Center, GA4, Search Console

Feed, analytics and Search Console all read the same catalogue service as the storefront and cart.

## Feed

- URL: `/feeds/google-merchant.tsv`
- Format: TSV (Google scheduled fetch native format; one offer per row; no XML entity issues)
- Gate: `MERCHANT_FEED_SECRET` as `?token=` or `Authorization: Bearer`
- Returns 404 until the secret is set
- English product URLs are the Shopping landing pages; AF remains on-site hreflang

## Analytics

- Loads only after optional POPIA consent and only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- No GTM duplicate; ads storage stays denied
- Purchase is stored in `sessionStorage` + cookie `mm_ga4_purchase_{orderId}` so confirmation refresh does not double-count
- Events never include email, phone, address or name

## Search Console

- Sitemap: `/sitemap.xml` (listed in robots when `NEXT_PUBLIC_ALLOW_INDEXING=true`)
- Verification: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` only — never a hard-coded token
- Hreflang already emitted as `en-ZA`, `af-ZA`, `x-default`
