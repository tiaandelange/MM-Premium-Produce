/**
 * Shopify → Next.js permanent redirects for domain cutover.
 * Old origin: https://m-m-premium-produce.myshopify.com
 * These run on the Next host after DNS points here — not on Shopify itself.
 */
export type RedirectRule = {
  from: string;
  to: string;
  permanent: boolean;
};

const handleToSlug: Record<string, string> = {
  avos: "avocados",
  tamatoes: "cherry-tomatoes",
  "baby-patatos": "baby-potatoes",
  patatos: "potatoes",
  "pears-1-5-kg": "pears",
  "grapes-500g": "grapes",
  gauvas: "guavas",
  "granadillas-pack-of-6": "granadillas",
  "grapefruit-pack-of-6": "grapefruit",
  cantaloupe: "melon",
  pineapple: "queen-pineapple",
  banana: "bananas",
  appels: "apples",
  tomatoes: "tomatoes",
  "iceberg-lettuce": "iceberg-lettuce",
  "cos-lettuce": "cos-lettuce",
  "baby-spinach": "baby-spinach",
  spinach: "spinach",
  cabbage: "cabbage",
  beetroot: "beetroot",
  butternut: "butternut",
  sweetcorn: "sweetcorn",
  cauliflower: "cauliflower",
  "red-onion": "red-onion",
  "brown-onion": "brown-onion",
  "sweet-potatoes": "sweet-potatoes",
  "green-beans": "green-beans",
  carrots: "carrots",
  broccoli: "broccoli",
  "bell-pepper": "bell-pepper",
  cucumber: "cucumber",
  "dragon-fruit": "dragon-fruit",
  watermelon: "watermelon",
  blueberries: "blueberries",
  oranges: "oranges",
  "paw-paw": "paw-paw",
  tangerines: "tangerines",
  lemons: "lemons",
  strawberries: "strawberries",
  kiwis: "kiwis",
};

function productRules(): RedirectRule[] {
  return Object.entries(handleToSlug).flatMap(([handle, slug]) => {
    const to = `/en/products/${slug}`;
    const rules: RedirectRule[] = [
      { from: `/products/${handle}`, to, permanent: true },
      { from: `/en/products/${handle}`, to, permanent: true },
    ];
    if (handle !== slug) {
      rules.push({ from: `/products/${slug}`, to, permanent: true });
    }
    return rules;
  });
}

export const shopifyRedirects: RedirectRule[] = [
  { from: "/collections/fruits", to: "/en/shop/fruit", permanent: true },
  { from: "/collections/vegetables", to: "/en/shop/vegetables", permanent: true },
  { from: "/collections/all", to: "/en/shop", permanent: true },
  { from: "/collections", to: "/en/shop", permanent: true },
  { from: "/pages/contact", to: "/en/contact", permanent: true },
  { from: "/pages/about-us", to: "/en/about", permanent: true },
  { from: "/pages/about", to: "/en/about", permanent: true },
  { from: "/cart", to: "/en/cart", permanent: true },
  { from: "/search", to: "/en/shop", permanent: true },
  ...productRules(),
];
