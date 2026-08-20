import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const PRICE_UNITS = ["ea", "kg", "100g"] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

/**
 * Selling unit for the listed SKU price (amounts are not converted).
 * Pack-sized SKUs must use "ea" — never label a pack selling price as /100g.
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

  // Fixed packs — listed price is for the pack (show pack size separately)
  prod_baby_spinach: "ea",
  prod_spinach: "ea",
  prod_cherry_tomatoes: "ea",
  prod_blueberries: "ea",
  prod_strawberries: "ea",
  prod_grapes: "ea",

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
  // Exact 1 kg packs are sold as a kg rate (price matches the bag).
  if (/^1(\.0+)?\s*kg$/.test(pack) || pack === "1000 g") return "kg";
  // Exact 100 g packs may use a /100g rate.
  if (/^100\s*g$/.test(pack)) return "100g";
  // Any other stated pack (200 g, 400 g, 2 kg, head, punnet...) is a pack selling price.
  if (/\d/.test(pack) || /pack of|bunch|head|punnet/.test(pack)) return "ea";
  return null;
}

export function resolvePriceUnit(input: {
  unit?: string | null;
  packSize?: string | null;
  productId?: string;
}): PriceUnit {
  // Pack size wins over a stale unit field (e.g. "100g" on a 400 g pack).
  const fromPack = unitFromPackSize(input.packSize);
  if (fromPack) return fromPack;
  const fromCatalogue = input.productId ? PRODUCT_PRICE_UNITS[input.productId] : undefined;
  if (fromCatalogue) return fromCatalogue;
  return parsePriceUnit(input.unit) ?? "ea";
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
