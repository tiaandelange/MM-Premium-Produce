# Phase 5 — Production SEO audit, Shopify migration & go-live

**Decision: NO-GO.** Do not deploy for DNS cutover. Do not set `NEXT_PUBLIC_ALLOW_INDEXING=true`.

Recorded 19 Aug 2026 against live Vercel production and the current local repository.

Full findings: see the Phase 5 canvas beside chat.

## Domain (confirmed, not guessed)

`https://mm-premium-produce.vercel.app`

Evidence: Vercel production aliases on deployment `dpl_GN7J5AViwnodJjnag6fXCq2xi18u`, and live canonical tags on that host. No branded custom domain is attached. Local `.env.local` still uses `http://localhost:3004` and `NEXT_PUBLIC_ALLOW_INDEXING=false`.

## Indexing

Production `robots.txt` is `Disallow: /`. Page meta is `noindex`. Keep that until the 500s, payment, and Shopify redirects are closed.
