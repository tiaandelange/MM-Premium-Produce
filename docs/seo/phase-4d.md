# Phase 4D — Helpful content, produce guides & recipe authority

**Status:** seven household guides and two genuine recipes published in English and Afrikaans. Not a content farm.

## Architecture

- `/en/guides/[slug]` · `/af/gidse/[slug]` (AF public path rewritten to the English App Router segment)
- `/en/recipes/[slug]` · `/af/resepte/[slug]`
- Index pages at `/en/guides`, `/af/gidse`, `/en/recipes`, `/af/resepte`
- Footer links only; primary nav is unchanged
- File seed: `data/editorial/guides.ts`, `data/editorial/recipes.ts`
- Runtime: `services/editorial` (Neon + file fallback)

## Database / admin

Tables: `articles`, `article_translations`, `article_products`, `article_categories`, `recipes`, `recipe_translations`, `recipe_products`.

Fields: title, slug, body JSON, image + alt, SEO title/description, published/draft, indexable, related products/categories.

Admin lists: `/admin/guides`, `/admin/recipes`. Copy is edited in seed files, then `npm run db:editorial`.

## Published P1 set (quality-tested as kitchen-useful)

Guides:

1. Store potatoes and onions — `store-potatoes-and-onions` / `berg-aartappels-en-uie`
2. Store spinach and lettuce — `store-spinach-and-lettuce` / `berg-spinasie-en-slaai`
3. Store carrots — `store-carrots` / `berg-wortels`
4. Keep salad produce fresh — `keep-salad-produce-fresh` / `hou-slaai-vars`
5. Store apples — `store-apples` / `berg-appels`
6. Baby spinach or bunch spinach — `baby-spinach-or-bunch-spinach` / `babaspinasie-of-bondel-spinasie`
7. Use leftover vegetables — `use-leftover-vegetables` / `gebruik-oorskiet-groente`

Recipes (justified household methods, not a magazine):

1. Roast potatoes with onion — `roast-potatoes-with-onion` / `gebraaide-aartappels-met-uie`
2. Pan carrots and onions — `pan-carrots-and-onions` / `pan-wortels-en-uie`

Skipped: produce-box contents, seasonal fruit hub, geo pages, “how we select” (already on About).

## EN / AF

Both languages are complete, published and indexable. Canonical is self. Hreflang is reciprocal. Unfinished AF would be `draft` or `indexable: false` and omitted from sitemap/hreflang.

## Internal links

Guide → related in-stock SKUs and categories. Product → relevant guides/recipes. Category → related guides. Home, FAQ and footer point at the indexes. No keyword stuffing.

## Schema

`Article` on guides. `Recipe` on the two recipes (ingredients + HowToStep only). No ratings, nutrition, or times.

## Sitemap

Published + indexable guides/recipes and their indexes. AF URL only when AF is published and indexable.

## Backlog

**P1 (ops, not more articles):** delivery areas/fees on `/delivery` when confirmed.

**P2:** avocado ripeness only while avocados are in stock; pack-size explainer as PDP snippet; leafy/root child categories only if vegetables page is too long.

**P3:** more recipes only when they use live SKUs; food-waste expansions; seasonal fruit hub when fruit availability is real; produce-box “what’s inside” after a live bundle SKU.
