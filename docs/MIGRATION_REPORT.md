# Catalogue migration report

Source: Shopify `m-m-premium-produce.myshopify.com` snapshot in `data/import/shopify-products.json`.
Canonical names, slugs, SEO copy and production images come from the Phase 1B catalogue, with spelling normalized.
Google Drive original files are mapped to git-hosted WebP assets under `/images/products` and `/images/categories`. Drive URLs are not used at runtime.

Shopify products: 40. Validated for import: 40.

| Shopify name | Canonical name | Slug | Category | Variants | Price | Availability | Image | SEO complete | Import | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tomatoes | Tomatoes | `tomatoes` | vegetables | Default | Unset | out_of_stock | `/images/products/fresh-tomatoes.webp` | Yes | Yes | — |
| Avos | Avocados | `avocados` | fruit | Default | 15.00 ZAR | out_of_stock | `/images/products/fresh-avocados.webp` | Yes | Yes | Normalized handle avos → avocados. Normalized name Avos → Avocados |
| Cherry Tomatoes | Cherry Tomatoes | `cherry-tomatoes` | vegetables | Default | 34.99 ZAR | in_stock | `/images/products/fresh-cherry-tomatoes.webp` | Yes | Yes | Normalized handle tamatoes → cherry-tomatoes |
| Iceberg Lettuce | Iceberg Lettuce | `iceberg-lettuce` | vegetables | Default | 19.99 ZAR | in_stock | `/images/products/fresh-iceberg-lettuce.webp` | Yes | Yes | — |
| Cos Lettuce | Cos Lettuce | `cos-lettuce` | vegetables | Default | 29.99 ZAR | in_stock | `/images/products/fresh-cos-lettuce.webp` | Yes | Yes | — |
| Baby Spinach | Baby Spinach | `baby-spinach` | vegetables | Default | 34.99 ZAR | in_stock | `/images/products/fresh-baby-spinach.webp` | Yes | Yes | — |
| Spinach | Spinach | `spinach` | vegetables | Default | 24.99 ZAR | in_stock | `/images/products/fresh-spinach.webp` | Yes | Yes | — |
| Cabbage | Cabbage | `cabbage` | vegetables | Default | 22.99 ZAR | in_stock | `/images/products/fresh-cabbage.webp` | Yes | Yes | — |
| Beetroot | Beetroot | `beetroot` | vegetables | Default | 44.99 ZAR | in_stock | `/images/products/fresh-beetroot.webp` | Yes | Yes | — |
| Butternut | Butternut | `butternut` | vegetables | Default | 44.99 ZAR | in_stock | `/images/products/fresh-butternut.webp` | Yes | Yes | — |
| Sweetcorn | Sweetcorn | `sweetcorn` | vegetables | Default | 34.99 ZAR | in_stock | `/images/products/fresh-sweetcorn.webp` | Yes | Yes | — |
| Cauliflower | Cauliflower | `cauliflower` | vegetables | Default | 29.99 ZAR | in_stock | `/images/products/fresh-cauliflower.webp` | Yes | Yes | — |
| Red Onion | Red Onion | `red-onion` | vegetables | Default | 39.99 ZAR | in_stock | `/images/products/fresh-red-onion.webp` | Yes | Yes | — |
| Brown Onion | Brown Onion | `brown-onion` | vegetables | Default | 44.99 ZAR | in_stock | `/images/products/fresh-brown-onion.webp` | Yes | Yes | — |
| Sweet Potatoes | Sweet Potatoes | `sweet-potatoes` | vegetables | Default | 44.99 ZAR | in_stock | `/images/products/fresh-sweet-potatoes.webp` | Yes | Yes | — |
| Green Beans | Green Beans | `green-beans` | vegetables | Default | 29.99 ZAR | out_of_stock | `/images/products/fresh-green-beans.webp` | Yes | Yes | — |
| Baby Patatos | Baby Potatoes | `baby-potatoes` | vegetables | 2Kg @ 34.99 | 34.99 ZAR | in_stock | `/images/products/fresh-baby-potatoes.webp` | Yes | Yes | Normalized handle baby-patatos → baby-potatoes. Normalized name Baby Patatos → Baby Potatoes |
| Patatos | Potatoes | `potatoes` | vegetables | 2Kg @ 33.99; 10Kg @ 150.00 | 33.99 ZAR | in_stock | `/images/products/fresh-potatoes.webp` | Yes | Yes | Normalized handle patatos → potatoes. Normalized name Patatos → Potatoes |
| Carrots | Carrots | `carrots` | vegetables | 500g @ 9.99; 1Kg @ 17.99 | 9.99 ZAR | in_stock | `/images/products/fresh-carrots.webp` | Yes | Yes | — |
| Broccoli | Broccoli | `broccoli` | vegetables | Default | 29.99 ZAR | out_of_stock | `/images/products/fresh-broccoli.webp` | Yes | Yes | — |
| Bell Pepper | Bell Pepper | `bell-pepper` | vegetables | Red @ 18.99; Green @ 15.99; Yellow @ 18.99 | 18.99 ZAR | out_of_stock | `/images/products/fresh-bell-pepper.webp` | Yes | Yes | — |
| Cucumber | Cucumber | `cucumber` | vegetables | Default | 19.99 ZAR | in_stock | `/images/products/fresh-cucumber.webp` | Yes | Yes | — |
| Pears | Pears | `pears` | fruit | Default | 39.99 ZAR | out_of_stock | `/images/products/fresh-pears.webp` | Yes | Yes | Normalized handle pears-1-5-kg → pears |
| Dragon Fruit | Dragon Fruit | `dragon-fruit` | fruit | Default | 39.99 ZAR | out_of_stock | `/images/products/fresh-dragon-fruit.webp` | Yes | Yes | — |
| Grapes 500g | Grapes | `grapes` | fruit | Black Grapes 500g @ 49.99; Red Grapes 500g @ 49.99; White Grapes 500g @ 49.99; Cotton candy Grapes 500g @ 64.99 | 49.99 ZAR | out_of_stock | `/images/products/fresh-grapes.webp` | Yes | Yes | Normalized handle grapes-500g → grapes. Normalized name Grapes 500g → Grapes |
| Watermelon | Watermelon | `watermelon` | fruit | Default | 99.99 ZAR | out_of_stock | `/images/products/fresh-watermelon.webp` | Yes | Yes | — |
| Blueberries | Blueberries | `blueberries` | fruit | Default | 99.99 ZAR | out_of_stock | `/images/products/fresh-blueberries.webp` | Yes | Yes | — |
| Gauvas | Guavas | `guavas` | fruit | Default | 99.99 ZAR | out_of_stock | `/images/products/fresh-guavas.webp` | Yes | Yes | Normalized handle gauvas → guavas. Normalized name Gauvas → Guavas |
| Granadillas | Granadillas | `granadillas` | fruit | Default | 59.99 ZAR | out_of_stock | `/images/products/fresh-granadillas.webp` | Yes | Yes | Normalized handle granadillas-pack-of-6 → granadillas |
| Grapefruit | Grapefruit | `grapefruit` | fruit | Default | 49.99 ZAR | out_of_stock | `/images/products/fresh-grapefruit.webp` | Yes | Yes | Normalized handle grapefruit-pack-of-6 → grapefruit |
| Melon | Melon | `melon` | fruit | Default | 49.99 ZAR | out_of_stock | `/images/products/fresh-melon.webp` | Yes | Yes | Normalized handle cantaloupe → melon |
| Oranges | Oranges | `oranges` | fruit | Default | 29.99 ZAR | out_of_stock | `/images/products/fresh-oranges.webp` | Yes | Yes | — |
| Paw Paw | Paw Paw | `paw-paw` | fruit | Default | 34.99 ZAR | out_of_stock | `/images/products/fresh-paw-paw.webp` | Yes | Yes | — |
| Tangerines | Tangerines | `tangerines` | fruit | Default | 29.99 ZAR | out_of_stock | `/images/products/fresh-tangerines.webp` | Yes | Yes | — |
| Lemons | Lemons | `lemons` | fruit | Default | 29.99 ZAR | out_of_stock | `/images/products/fresh-lemons.webp` | Yes | Yes | — |
| Queen Pineapple | Queen Pineapple | `queen-pineapple` | fruit | Default | 23.99 ZAR | out_of_stock | `/images/products/fresh-queen-pineapple.webp` | Yes | Yes | Normalized handle pineapple → queen-pineapple |
| Strawberries | Strawberries | `strawberries` | fruit | Default | 49.99 ZAR | out_of_stock | `/images/products/fresh-strawberries.webp` | Yes | Yes | — |
| Kiwi's | Kiwis | `kiwis` | fruit | Default | 20.00 ZAR | out_of_stock | `/images/products/fresh-kiwis.webp` | Yes | Yes | Normalized name Kiwi's → Kiwis |
| Bananas | Bananas | `bananas` | fruit | Default | 49.99 ZAR | out_of_stock | `/images/products/fresh-bananas.webp` | Yes | Yes | Normalized handle banana → bananas |
| Appels | Apples | `apples` | fruit | Granny Smith @ 39.99; Fugi @ 39.99; Crisp Pink @ 39.99 | 39.99 ZAR | in_stock | `/images/products/fresh-apples.webp` | Yes | Yes | Normalized handle appels → apples. Normalized name Appels → Apples |

## Redirects created from Shopify handles

- `/products/avos` → `/products/avocados`
- `/products/tamatoes` → `/products/cherry-tomatoes`
- `/products/baby-patatos` → `/products/baby-potatoes`
- `/products/patatos` → `/products/potatoes`
- `/products/pears-1-5-kg` → `/products/pears`
- `/products/grapes-500g` → `/products/grapes`
- `/products/gauvas` → `/products/guavas`
- `/products/granadillas-pack-of-6` → `/products/granadillas`
- `/products/grapefruit-pack-of-6` → `/products/grapefruit`
- `/products/cantaloupe` → `/products/melon`
- `/products/pineapple` → `/products/queen-pineapple`
- `/products/banana` → `/products/bananas`
- `/products/appels` → `/products/apples`
- `/shop/fruits` → `/shop/fruit`

## Image mapping

Product photography in Google Drive is stored locally as optimized WebP. `original_asset_ref` records `drive:products/<file>` plus the Shopify CDN URL from the snapshot.
