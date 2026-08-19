# Phase 4A — South African English + Afrikaans SEO research & search-intent map

**Status:** research only. No URLs, titles, categories, schema or guides were changed in this phase.

**Sources used**

- Live catalogue: `data/catalog-products.json` (40 products), `data/i18n/af-products.ts`, `data/categories.ts`, `data/bundles.ts` (empty)
- Current storefront copy: `lib/i18n/pages.ts`, `lib/i18n/paths.ts`, `lib/seo/*`
- Operational facts: delivery page still unpublished for areas/fees/slots; homepage now states nationwide delivery; payments remain `unconfigured`
- Public SERP and competitor pages (August 2026): Woolworths, Pick n Pay / asap! / Mr D, Checkers Sixty60, Spar2U, Fresh Online, Retropack, DeFarmer, Virgin City Fields, Farm Fresh Direct, Veggies Basket
- Language behaviour: Wired Web Services analysis of SA commercial search; Census 2022 language distribution vs English-dominant ecommerce vocabulary
- Shopify storefront `m-m-premium-produce.myshopify.com` and Google Drive folders were referenced as catalogue origin; product facts below are taken from the **current repo/database catalogue**, not from unpublished Drive files (those folders were not independently crawlable here)

Keyword volumes are **not** claimed as paid Keyword Planner exports. Judgements are relative (high / medium / low / niche) from SERP composition, retailer architecture, and how South Africans actually shop groceries online.

---

## 1. English research

### How South Africans actually search for this category

Two markets sit on top of each other:

1. **On-demand grocery** — “Checkers Sixty60”, “Woolies Dash”, “PnP asap”, “Spar2U”, “buy vegetables online”. Google returns **apps and national retailers**. Intent is speed, basket, address. A 40-SKU specialist cannot win this cluster as a generic category in the short term.
2. **Specialist produce delivery** — “fresh produce delivery South Africa”, “fruit and veg delivered”, “veg box Johannesburg”, farm/market-to-door brands. Google returns **ecommerce category + local/delivery pages**. This is the realistic English battlefield.

SA English for produce is informal and mixed: *veg*, *veggies*, *fruit and veg*, *fresh produce*, *punnet*, *pocket* (potatoes/onions), *head* (lettuce/cabbage), *avo* more than “avocado pear”. Product nouns are almost always English even when the shopper speaks Afrikaans at home.

### Cluster findings (EN)

| Cluster | Relative demand | Dominant SERP type | M&M fit now |
| --- | --- | --- | --- |
| buy vegetables / fruit online | High | National grocery apps + Woolies/PnP category | Weak until delivery proof and range depth |
| fresh vegetables / fresh fruit | High | Retailer category + images + Shopping | Medium — own `/shop/vegetables` and `/shop/fruit` |
| fresh produce delivery | Medium | Specialist ecommerce + local | Strong if delivery page matches the nationwide claim |
| vegetable / fruit delivery | Medium | Mix of apps and specialists | Same as above; “delivery” queries expect coverage copy |
| produce / veg / fruit boxes | Medium | Subscription/box landing pages | **No live bundles** — do not target until a box exists |
| baby spinach, carrots, potatoes, onions, lettuce, apples | Medium–high item | Product + Shopping | Strong for **in-stock** SKUs |
| blueberries, dragon fruit, cotton candy grapes | Low–niche | Product / images | Only when in stock; do not build content hubs yet |

### English intent to own (not “rank for everything”)

- **Brand / navigational:** M & M Premium Produce, “personally handpicked”
- **Commercial investigation:** quality-led fruit and veg online, not the cheapest Sixty60 basket
- **Transactional (specialist):** fresh vegetables online, fresh fruit online, named staples
- **Transactional (delivery):** nationwide produce delivery — only after `/en/delivery` is the source of truth
- **Do not primary-target:** “grocery delivery 60 minutes”, city+same-day, “free delivery Gauteng”, organic-certified (not claimed), veg box subscription (no SKU)

---

## 2. Afrikaans research (independent, not translated EN)

### How Afrikaans users actually search

Commercial search in South Africa is **overwhelmingly English**, even where Afrikaans is a home language (Western Cape / Northern Cape). People type the **trade noun** they see on packs and apps.

Observed patterns for this catalogue:

| AF speakers often type | Rarely / unnaturally typed | Notes |
| --- | --- | --- |
| baby spinach, avocado, kiwi, pineapple | babaspinasie as a search (page language yes; query mixed) | Pack English dominates |
| carrots, potatoes, onions, tomatoes | wortels / aartappels / uie / tamaties — used, but secondary to English in ecommerce | Grocery apps are English-UI |
| veg box, fruit box | groenteboks / vrugteboks | Box market is English-led |
| delivery, nationwide delivery | groente aflewering | “Aflewering” is real on AF sites; query volume sits under EN “delivery” |
| lettuce, spinach | slaai, spinasie | Both exist; “cos slaai” is already mixed on this site |

**Do not force:** “koop varsprodukte aanlyn Suid-Afrika” as a head term, “vrugteboks intekening”, or calques of Woolies titles.

**Do use AF for:** on-site language, AF titles/descriptions, AF slugs (already good: `wortels`, `aartappels`, `ysbergslaai`, `nartjies`, `koejawels`), and a smaller AF keyword set where the Afrikaans noun is the everyday word (aartappels, wortels, tamaties, spinasie, lemoene, piesangs, waatlemoen).

### AF clusters worth a page, not a mirror of EN

| Cluster | Use as | SERP reality |
| --- | --- | --- |
| vars groente / vars vrugte | Category titles + H1 support | Some AF retailer/copy use; EN still wins SERP |
| groente aanlyn / vrugte aanlyn | Secondary on shop + categories | Thin specialist SERP; grocery apps still EN |
| groente aflewering / vrugte aflewering | Delivery page AF, not homepage primary | Intent needs **areas/fees** — currently unpublished |
| groenteboks / vrugteboks | Only after a live bundle | Otherwise empty-result risk |
| aartappels, wortels, tamaties, spinasie, appels, piesangs | Product primary AF where the AF name is the household word | Product SERP + Shopping |

AF strategy is **bilingual site + AF product nouns**, not a parallel keyword universe.

---

## 3. Product map (current catalogue)

**40 products.** Selling units: `ea` / `kg` / `100g` (listed pack price unchanged). **0 bundles.** Variants only on potatoes, carrots, bell pepper, grapes, apples.

**SEO field quality:** most EN `seoTitle` = product name only. AF `seoTitle`/`seoDescription` exist for a minority (apples, baby spinach, green beans). Short descriptions are marketing prose, not search titles.

### Vegetables

| ID | EN slug / title | AF slug / name | Pack / variants | Unit | Stock | Indexable SEO today |
| --- | --- | --- | --- | --- | --- | --- |
| prod_tomatoes | tomatoes / Tomatoes | tamaties / Tamaties | — | kg | OOS | Title = name |
| prod_cherry_tomatoes | cherry-tomatoes | kerrietamaties | 400 g | 100g | In | Title = name |
| prod_iceberg_lettuce | iceberg-lettuce | ysbergslaai | head | ea | In | Title = name |
| prod_cos_lettuce | cos-lettuce | cos-slaai | head | ea | In | Title = name |
| prod_baby_spinach | baby-spinach | babaspinasie | 200 g | 100g | In | AF has seo fields |
| prod_spinach | spinach | spinasie | 350 g bunch | 100g | In | Title = name |
| prod_cabbage | cabbage | kool | head | ea | In | Title = name |
| prod_beetroot | beetroot | beet | 2 kg | kg | In | Title = name |
| prod_butternut | butternut | bottelpampoen | 3 kg | kg | In | Title = name |
| prod_sweetcorn | sweetcorn | suikermielies | cob/pack | ea | In | Title = name |
| prod_cauliflower | cauliflower | blomkool | 500 g | ea | In | Title = name |
| prod_red_onion | red-onion | rooi-ui | 1 kg | kg | In | Title = name |
| prod_brown_onion | brown-onion | bruinui | 2 kg | kg | In | Title = name |
| prod_sweet_potatoes | sweet-potatoes | patats | 2 kg | kg | In | Title = name |
| prod_green_beans | green-beans | groenbone | 500 g | kg | OOS | AF seo fields |
| prod_baby_potatoes | baby-potatoes | baba-aartappels | 2 kg | kg | In | Title = name |
| prod_potatoes | potatoes | aartappels | 2 kg, 10 kg | kg | In | Title = name |
| prod_carrots | carrots | wortels | 500 g, 1 kg | kg | In | Title = name |
| prod_broccoli | broccoli | brokkoli | 330 g | ea | OOS | Title = name |
| prod_bell_pepper | bell-pepper | soetrissie | Red/Green/Yellow | ea | OOS | Title = name |
| prod_cucumber | cucumber | komkommer | each | ea | In | Title = name |

### Fruit

| ID | EN slug / title | AF slug / name | Pack / variants | Unit | Stock | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| prod_avocados | avocados | avokados | each | ea | OOS | High demand; page should not over-promise |
| prod_apples | apples | appels | Granny Smith, Fuji, Crisp Pink | kg | In | Only in-stock fruit staple |
| prod_pears | pears | pere | 1.5 kg | kg | OOS | |
| prod_bananas | bananas | piesangs | — | kg | OOS | High demand when listed |
| prod_oranges | oranges | lemoene | — | kg | OOS | |
| prod_lemons | lemons | suurlemoene | — | kg | OOS | |
| prod_tangerines | tangerines | nartjies | 2 kg | kg | OOS | AF noun is stronger than EN |
| prod_grapefruit | grapefruit | pomelo | pack of 6 | ea | OOS | |
| prod_grapes | grapes | druiwe | Black, Red, White, Cotton candy | 100g | OOS | “Cotton candy” stays English |
| prod_strawberries | strawberries | aarbeie | punnet | 100g | OOS | |
| prod_blueberries | blueberries | bloubessies | punnet | 100g | OOS | |
| prod_watermelon | watermelon | waatlemoen | whole | ea | OOS | Seasonal |
| prod_melon | melon | spanspek | whole | ea | OOS | spanspek ≠ generic melon |
| prod_paw_paw | paw-paw | papaja | each | ea | OOS | Dual naming (pawpaw/papaya) |
| prod_queen_pineapple | queen-pineapple | queen-pynappel | each | ea | OOS | Mixed AF slug is correct |
| prod_guavas | guavas | koejawels | — | kg | OOS | Strong AF household word |
| prod_granadillas | granadillas | grensies | pack of 6 | ea | OOS | grensies is natural AF |
| prod_kiwis | kiwis | kiwis | — | ea | OOS | Same noun both languages |
| prod_dragon_fruit | dragon-fruit | drakevrug | each | ea | OOS | Niche / images SERP |

URLs today: `/en/products/{slug}`, `/af/produkte/{slug}`.

### Product intent (only where demand is real)

Assigning a keyword because the SKU exists is rejected for OOS seasonal/niche items as **P1**. Those pages stay indexable with honest availability, not as rank targets.

| Product | Primary EN | Secondary EN | Primary AF | Secondary AF | Page type Google wants |
| --- | --- | --- | --- | --- | --- |
| Potatoes | potatoes 2kg / 10kg pocket | buy potatoes online | aartappels | sak aartappels | Product + Shopping |
| Carrots | carrots 1kg / 500g | fresh carrots | wortels | — | Product |
| Baby spinach | baby spinach 200g | baby spinach punnet | babaspinasie / baby spinach | — | Product (Woolies-style pack pages) |
| Spinach bunch | spinach bunch | Swiss chard (do **not** claim unless true) | spinasie bondel | — | Product |
| Iceberg / cos | iceberg lettuce / cos lettuce | lettuce head | ysbergslaai / cos-slaai | slaai | Product |
| Onions | brown onions 2kg, red onions 1kg | onion pocket | bruinui / rooi-ui | uie | Product |
| Apples | apples Granny Smith / Fuji | apples per kg | appels | — | Product |
| Cherry tomatoes | cherry tomatoes 400g | baby tomatoes punnet | kerrietamaties | — | Product |
| Cucumber | cucumber each | English cucumber (only if that’s the SKU) | komkommer | — | Product |
| Avocado (when in stock) | avocado each / avo | ripe avocados | avokado | avo | Product |
| Bananas (when in stock) | bananas per kg | — | piesangs | — | Product |
| Nartjies (when in stock) | naartjies / tangerines | soft citrus | nartjies | — | Product (AF noun stronger) |
| Dragon fruit | dragon fruit | pitaya | drakevrug | — | Product / images; low transactional |
| Cotton candy grapes | cotton candy grapes | — | keep English | — | Niche product |

---

## 4. Category map

| Page | EN URL | AF URL | Current SEO | Role |
| --- | --- | --- | --- | --- |
| Home | `/en` | `/af` | “Fresh Fruit & Vegetables \| M & M…” | Brand + why buy + nationwide teaser |
| Shop | `/en/shop` | `/af/winkel` | Fresh Produce Shop | Full catalogue index |
| Vegetables | `/en/shop/vegetables` | `/af/winkel/groente` | Fresh Vegetables | Transactional veg |
| Fruit | `/en/shop/fruit` | `/af/winkel/vrugte` | Fresh Fruit | Transactional fruit |
| Produce boxes | `/en/bundles` | `/af/bokse` | Empty state | **Do not rank** until a box exists |
| Delivery | `/en/delivery` | `/af/aflewering` | “will be published once confirmed” | Conflicts with homepage nationwide line |
| About | `/en/about` | `/af/oor-ons` | Story | Navigational / brand |
| FAQ | `/en/faq` | `/af/gereelde-vrae` | Includes “delivery not confirmed” | Support, not money page |

### Legitimate expansions (products exist + demand + user value)

Recommend **collection-style filters or future child categories only after P1 titles/delivery are done**. Do not explode the taxonomy now.

| Candidate | SKUs that would sit on it | Demand | Verdict |
| --- | --- | --- | --- |
| Leafy greens | iceberg, cos, baby spinach, spinach, cabbage | Real (salad/weeknight) | **P2** — only if veg category gets too long |
| Root vegetables | carrots, potatoes, baby potatoes, beetroot, sweet potato | Real | **P2** |
| Salad vegetables | lettuces, cucumber, cherry tomatoes, (tomatoes when in) | Real | **P2** |
| Citrus | oranges, lemons, grapefruit, tangerines | Real but **mostly OOS** | Wait for stock |
| Berries | strawberries, blueberries | Real but **OOS** | Wait for stock |
| Onions & potatoes | already a farm-shop mental aisle | Real | Optional P2; can stay on Vegetables |

Do **not** create: organic, herbs (no SKUs), mushrooms, ready-cut, subscription hub.

---

## 5. Competitors

### National grocery (own the generic “buy veg online” SERP)

| Player | URL pattern | What they rank with | Gap for M&M |
| --- | --- | --- | --- |
| Woolworths | `/browse/.../fresh-vegetables` title “Buy Fresh Vegetables Online” | Category copy, cold-chain, pack sizes, Shopping | Cannot match range/speed; **can** match “selected quality / handpicked” if true |
| Checkers Sixty60 / PnP asap / Spar2U | App-first | Brand queries, 60-minute | Do not compete on speed |
| Mr D Groceries | PnP catalogue | Address-gated product URLs | Same |

### Specialist produce (true peers)

| Player | Positioning | Architecture | Exploit |
| --- | --- | --- | --- |
| Fresh Online | Market-to-door, free delivery over R300, next weekday | Shallow marketing site + shop | M&M has bilingual URLs and unique brand story; they have **delivery proof** |
| Retropack | JHB weekly boxes + add-ons | Box-first, area-limited | Boxes + local honesty; M&M must not fake JHB if ops are nationwide courier |
| DeFarmer | Free delivery Gauteng, R300 min | Product grid, combo packs | Combo SKUs; M&M has none |
| Virgin City Fields | Organic + meat boxes, Friday Gauteng | Content + weekly ops | Organic claim they have; M&M must not copy |
| Farm Fresh Direct | Garden Route | Geo in title | Geo only if M&M publishes areas |
| Veggies Basket / Veg Express | Door veg baskets | Thin product copy | Better PDP copy + pack/unit already on M&M |

### SERP / technical patterns they use

- Category H1 = “Buy fresh veg” not brand slogan
- Pack size in product title (`Baby Spinach 100 g`)
- Delivery in title or first paragraph
- Images: pack shot + lifestyle; M&M has strong produce photography
- Schema: retailer Product + Offer; M&M already has product/org JSON-LD (do not expand in 4A)
- Internal links: aisle → product → related; M&M related products exist, **no guides**
- Location strategy: they **name metros**. M&M homepage says nationwide; delivery page says unpublished — this is the largest trust/SEO gap

---

## 6. SERP types by cluster

| Cluster | Google favours | M&M page to match |
| --- | --- | --- |
| Brand name | Official site | Home |
| fresh vegetables / fresh fruit (unqualified) | Ecommerce **category** + Shopping + images | `/shop/vegetables`, `/shop/fruit` |
| buy vegetables online | Grocery **apps** + a few specialists | Do not make Shop pretend to be Sixty60 |
| fresh produce delivery | Specialist **delivery landing** + category | Delivery page (once factual) + Home support |
| baby spinach 200g / carrots 1kg | **Product** + Shopping | PDP |
| how to store spinach / keep avos ripe | **Informational** / recipe / YouTube | Future guide — not PDP (cannibalisation) |
| veg box Johannesburg | Local + box landing | Bundles **after** a box SKU |
| lettuce images | Image pack | PDP images already strong |

---

## 7. Local SEO

**Confirmed in product copy (Phase 3.3+):** nationwide delivery / across South Africa.

**Confirmed on the delivery page and FAQ:** areas, times, fees, collection **not published**. Contact address/phone **todo**. `config/site.ts` still marks country, address, delivery areas as unconfirmed.

**Therefore Phase 4A local rules:**

- Do **not** target Pretoria, Johannesburg, Cape Town, Durban, “Gauteng free delivery”, or “same-day” in titles.
- Do **not** build LocalBusiness / NAP citations until a **public address or service-area list** exists.
- Preferred local/delivery intent page: `/en/delivery` and `/af/aflewering` once it states coverage honestly (nationwide courier vs metro van).
- Until then, treat “nationwide” as a **homepage supporting claim** that must be reconciled with the delivery URL in Phase 4B copy — research only here.

Google Business Profile, HelloPeter, and geo landing pages wait on that fact set.

---

## 8. Content gaps (commercial first)

Prioritise pages that help a shopper choose, store, or complete an order — not a recipe magazine.

| Gap | Intent | Commercial value | When |
| --- | --- | --- | --- |
| Delivery facts (areas, how it arrives, what is not promised) | Transactional / local | Highest | P1 (copy on existing URL) |
| How we select / pack (true process, not farm-washing) | Commercial investigation | High | P1 on About + Home (already started) |
| Pack size / unit explainer (ea vs kg vs 100g) | Informational → cart | Medium | P2 snippet on PDP, not a new URL |
| Store spinach / lettuce / potatoes / onions | Informational | Medium | P2 short PDP sections first; standalone guides later |
| Seasonal fruit “what’s in” | Commercial | Medium | Only with real availability |
| Produce box “what’s inside this week” | Transactional | High **if** SKU exists | Blocked |
| Recipes | Informational | Low–medium | P3; link back to in-stock SKUs only |
| Food waste / use-it-up | Informational | Low | P3 |

Do not publish a blog farm in 4B.

---

## 9. Cannibalisation map (one primary intent per page)

| Intent | Winner | Must not also try to win |
| --- | --- | --- |
| Brand / personally handpicked | Home `/en` `/af` | About can support, not duplicate H1 |
| Shop all produce | Shop | Home (home links, does not list every SKU as the index) |
| Fresh vegetables (transactional) | `/shop/vegetables` | Shop, Home, leafy-greens child (until created) |
| Fresh fruit (transactional) | `/shop/fruit` | Shop, Home |
| Named staple (carrots, baby spinach…) | That PDP | Category (category ranks for the aisle, not the SKU) |
| Delivery coverage | Delivery | Home (one supporting line only), FAQ |
| Produce box | Bundles (future SKU page) | Shop, Home |
| How to store X | Future guide **or** PDP subsection | If a guide exists, PDP links to it and does not rank for “how to store” |
| FAQ “do you deliver?” | FAQ answers + link to Delivery | Delivery keeps the detailed facts |

**Homepage vs Shop:** Home = brand + quality + nationwide teaser + paths into shop. Shop = crawlable catalogue. Do not put the same “Fresh Fruit & Vegetables \| …” title on both (home already uses a close variant — 4B should differentiate).

---

## 10. Internal link opportunities (for 4B+, not built now)

- Category → all in-stock products in that aisle (already largely true)
- Product → 3 related in same category (exists) **plus** complementary pairs: lettuce↔cucumber↔cherry tomato; potato↔onion↔carrot; apple↔(pear when in)
- Product → Delivery (one line: how orders arrive) once delivery is factual
- Product → Shop / parent category (breadcrumbs exist)
- Bundle → included products (no bundles yet)
- Guide → 2–3 in-stock PDPs (when guides exist)
- Home → Vegetables, Fruit, Shop, Delivery (partially exists)
- OOS fruit should not be featured as if shoppable on Home if that misleads — merchandising, not a new URL

---

## 11. Authority / backlinks (legitimate only)

No paid link networks.

| Type | Examples | Prerequisite |
| --- | --- | --- |
| Review / trust | HelloPeter, Google Business Profile | Public contact + ops identity |
| Directories | Brabys, relevant food/agri listings | NAP consistency |
| SA food media | Seasonal produce stories, small-business features | Real photos + founder story (already on About) |
| Hospitality | Chef/B&B suppliers if that channel is real | Do not invent HoReCa |
| Recipe publishers | Guest “what’s in season” with SKU links | Stock truth |
| Community | Local markets, church/school once geo is public | Service area |
| Suppliers / farms | “where we buy” only if named with permission | Legal/comms |

---

## 12. P1 / P2 / P3 matrix

Competition: **H** = grocery apps/Woolies, **M** = specialists, **L** = thin SERPs.

Need: **copy** = on-page only; **ops** = business facts; **merch** = stock/box SKU; **tech** = later phase.

### P1 — do first in Phase 4B (existing URLs)

| # | Lang | Intent | Page | New? | Target URL | Comp | Value | Need |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | EN | Brand + commercial | Home | Current | `/en` | M | High | Copy: distinct from Shop; delivery line aligned with Delivery page |
| 2 | AF | Brand | Home | Current | `/af` | L–M | Medium | Copy: natural AF, not a calque of EN H1 |
| 3 | EN | Transactional aisle | Vegetables | Current | `/en/shop/vegetables` | H | High | Copy: title/H1 closer to “fresh vegetables” + what you can buy now |
| 4 | AF | Transactional aisle | Groente | Current | `/af/winkel/groente` | L | Medium | Copy: vars groente + household nouns |
| 5 | EN | Transactional aisle | Fruit | Current | `/en/shop/fruit` | H | Medium (many OOS) | Copy: honest seasonal/availability |
| 6 | AF | Transactional aisle | Vrugte | Current | `/af/winkel/vrugte` | L | Medium | Same |
| 7 | EN | Catalogue | Shop | Current | `/en/shop` | M | High | Copy: “all produce” not “fresh vegetables” duplicate |
| 8 | Both | Delivery | Delivery | Current | `/en/delivery` `/af/aflewering` | M | Highest trust | **Ops + copy**: reconcile nationwide vs “not confirmed” |
| 9 | EN | Product | In-stock staples | Current | potatoes, carrots, baby-spinach, spinach, lettuces, onions, apples, cucumber, cherry-tomatoes | M | High | Copy: pack size in title; no new URLs |
| 10 | AF | Product | Same SKUs | Current | aartappels, wortels, babaspinasie, etc. | L | Medium | Copy: AF title where the AF noun is the search noun |

### P2

| # | Lang | Intent | Page | New? | URL idea | Comp | Value | Need |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | EN | Transactional | Avocado, banana, tomato, peppers when in stock | Current PDPs | existing slugs | M | High | Merch |
| 12 | Both | Commercial | About | Current | `/en/about` | L | Medium | Copy: selection process, not farm-owner claim unless true |
| 13 | EN | Informational | PDP storage/selection blocks | Current | on PDPs | L | Medium | Copy |
| 14 | EN | Aisle | Leafy greens **or** roots **or** salad | New only if justified | e.g. `/en/shop/vegetables` filtered or one child slug | M | Medium | Tech + enough SKUs |
| 15 | AF | Product | nartjies, koejawels, grensies, patats when in stock | Current | existing AF slugs | L | Medium | Merch |
| 16 | Both | Transactional | First produce box | New | `/en/bundles/{slug}` | M | High | Merch |

### P3

| # | Lang | Intent | Page | New? | Notes |
| --- | --- | --- | --- | --- | --- |
| 17 | EN | Informational | Storage / seasonality guides | New | After PDPs are unique; one intent per URL |
| 18 | EN | Informational | Recipes | New | Only with in-stock links |
| 19 | Both | Local | Geo landings | New | **Forbidden** until areas are published |
| 20 | EN | Transactional | Citrus / berries categories | New | After those ranges are reliably in stock |
| 21 | Both | Navigational | Citations, GBP, HelloPeter | Off-site | After NAP |

---

## 13. Exact Phase 4B implementation list

Phase 4B should **edit existing pages only**, except delivery facts supplied by the business.

1. **Reconcile delivery:** one factual story across Home, Delivery, FAQ (nationwide vs unpublished areas). No invented fees, slots, or cities.
2. **Differentiate titles:** Home vs Shop vs Vegetables vs Fruit (EN and AF separately).
3. **Vegetables + Fruit category copy:** H1, intro, and meta that match aisle intent and **current in-stock** reality.
4. **Shop meta:** catalogue index, not a second vegetables page.
5. **PDP title pattern for P1 staples:** `{Name} {pack} | M & M Premium Produce` (EN) and AF equivalent using the **natural noun** (e.g. Aartappels 2 kg / 10 kg). Do not keyword-stuff.
6. **Fill missing AF `seoTitle` / `seoDescription`** for P1 SKUs only.
7. **Internal links:** Home → Veg/Fruit/Shop/Delivery; PDPs → parent category + Delivery once factual; keep related products in-stock-biased if possible.
8. **Do not:** new category tree, blog, schema overhaul, URL changes, mass product rewrites, geo pages, box SEO, Shopping feed claims that contradict stock.

Out of scope for 4B (already decided): payments, hero redesign, price amounts.

---

## Research limits

- No Google Ads Keyword Planner export was attached; relative demand is SERP- and market-based.
- Drive/Shopify were not a substitute for the live JSON/DB catalogue.
- Nationwide delivery is a **marketing fact on Home**; local SEO cannot go further than the delivery page allows.

---

READY FOR PHASE 4B
