import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const PRICE_UNITS = ["ea", "kg", "100g"] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

/**
 * Selling unit for the listed SKU price (amounts are not converted).
 *
 * Sources:
 * - This catalogue’s pack copy (heads, punnets, 100g–400g bags, kg bags)
 * - SA greengrocer practice: loose roots/fruit per kg; salad punnets and
 *   berries per 100g; lettuce, peppers, avocados and similar per piece
 * - Shopper examples: carrots /kg, baby spinach /100g, cherry tomatoes /100g,
 *   lettuce ea
 */
const PRODUCT_PRICE_UNITS: Record<string, PriceUnit> = {
  // Loose / bagged by weight — national markets quote these in R/kg
  prod_tomatoes: "kg",
  prod_carrots: "kg",
  prod_red_onion: "kg",
  prod_brown_onion: "kg",
  prod_potatoes: "kg",
  prod_baby_potatoes: "kg",
  prod_sweet_potatoes: "kg",
  prod_beetroot: "kg",
  prod_butternut: "kg",
  prod_green_beans: "kg",
  prod_apples: "kg",
  prod_bananas: "kg",
  prod_oranges: "kg",
  prod_lemons: "kg",
  prod_pears: "kg",
  prod_tangerines: "kg",
  prod_guavas: "kg",

  // Small salad packs, berries and cherry tomatoes — retailed per 100g
  prod_baby_spinach: "100g",
  prod_spinach: "100g",
  prod_cherry_tomatoes: "100g",
  prod_blueberries: "100g",
  prod_strawberries: "100g",
  prod_grapes: "100g",

  // Sold as a head, fruit, cob, pepper or counted pack
  prod_avocados: "ea",
  prod_iceberg_lettuce: "ea",
  prod_cos_lettuce: "ea",
  prod_cabbage: "ea",
  prod_cauliflower: "ea",
  prod_broccoli: "ea",
  prod_cucumber: "ea",
  prod_bell_pepper: "ea",
  prod_sweetcorn: "ea",
  prod_dragon_fruit: "ea",
  prod_watermelon: "ea",
  prod_melon: "ea",
  prod_paw_paw: "ea",
  prod_queen_pineapple: "ea",
  prod_granadillas: "ea",
  prod_grapefruit: "ea",
  prod_kiwis: "ea",
};

function normalizePack(value?: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function parsePriceUnit(value?: string | null): PriceUnit | null {
  const raw = normalizePack(value).replace(/^\//, "");
  if (!raw) return null;
  if (raw === "ea" || raw === "each" || raw === "elk" || raw === "stuk") return "ea";
  if (raw === "kg" || raw === "per kg" || raw === "kilogram") return "kg";
  if (
    raw === "100g" ||
    raw === "100 g" ||
    raw === "per 100g" ||
    raw === "per 100 g" ||
    raw === "g" ||
    raw === "per g" ||
    raw === "gram" ||
    raw === "grams"
  ) {
    return "100g";
  }
  return null;
}

function unitFromPackSize(packSize?: string | null): PriceUnit | null {
  const pack = normalizePack(packSize);
  if (!pack) return null;
  if (/pack of|bunch|head/.test(pack)) return "ea";
  if (/^100\s*g$/.test(pack)) return "100g";
  if (/punnet/.test(pack)) return "100g";
  if (/\d+(\.\d+)?\s*kg$/.test(pack) || pack === "1000 g") return "kg";
  return null;
}

export function resolvePriceUnit(input: {
  unit?: string | null;
  packSize?: string | null;
  productId?: string;
}): PriceUnit {
  const fromCatalogue = input.productId ? PRODUCT_PRICE_UNITS[input.productId] : undefined;
  if (fromCatalogue) return fromCatalogue;
  return parsePriceUnit(input.unit) ?? unitFromPackSize(input.packSize) ?? "ea";
}

export function priceUnitLabel(unit: PriceUnit, locale: AppLocale): string {
  const messages = getMessages(locale);
  if (unit === "kg") return messages.priceUnitKg;
  if (unit === "100g") return messages.priceUnit100g;
  return messages.priceUnitEach;
}

export function packQuantityLabel(product: { packSize?: string | null; variants?: Array<{ packSize?: string | null }> | null }): string | null {
  const pack = product.packSize?.trim();
  if (pack) return pack;
  const packs = [...new Set((product.variants ?? []).map((variant) => variant.packSize?.trim()).filter(Boolean))] as string[];
  if (packs.length === 1) return packs[0];
  if (packs.length > 1) return packs.join(" · ");
  return null;
}
