import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const PRICE_UNITS = ["ea", "kg", "g"] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

/**
 * How the listed catalogue price is sold.
 * National fresh-produce markets mostly quote R/kg (and 10 kg pockets for
 * potatoes/onions). Retail greengrocers still sell heads, punnets and packed
 * bags as each, so the suffix must match the listed amount — never convert it.
 */
const PRODUCT_PRICE_UNITS: Record<string, PriceUnit> = {
  prod_tomatoes: "kg",
  prod_avocados: "ea",
  prod_cherry_tomatoes: "ea",
  prod_iceberg_lettuce: "ea",
  prod_cos_lettuce: "ea",
  prod_baby_spinach: "ea",
  prod_spinach: "ea",
  prod_cabbage: "ea",
  prod_beetroot: "ea",
  prod_butternut: "ea",
  prod_sweetcorn: "ea",
  prod_cauliflower: "ea",
  prod_red_onion: "kg",
  prod_brown_onion: "ea",
  prod_sweet_potatoes: "ea",
  prod_green_beans: "ea",
  prod_baby_potatoes: "ea",
  prod_potatoes: "ea",
  prod_carrots: "ea",
  prod_broccoli: "ea",
  prod_bell_pepper: "ea",
  prod_cucumber: "ea",
  prod_pears: "ea",
  prod_dragon_fruit: "ea",
  prod_grapes: "ea",
  prod_watermelon: "ea",
  prod_blueberries: "ea",
  prod_guavas: "ea",
  prod_granadillas: "ea",
  prod_grapefruit: "ea",
  prod_melon: "ea",
  prod_oranges: "kg",
  prod_paw_paw: "ea",
  prod_tangerines: "ea",
  prod_lemons: "kg",
  prod_queen_pineapple: "ea",
  prod_strawberries: "ea",
  prod_kiwis: "ea",
  prod_bananas: "kg",
  prod_apples: "kg",
};

function normalizePack(value?: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function parsePriceUnit(value?: string | null): PriceUnit | null {
  const raw = normalizePack(value).replace(/^\//, "");
  if (!raw) return null;
  if (raw === "ea" || raw === "each" || raw === "elk" || raw === "stuk") return "ea";
  if (raw === "kg" || raw === "per kg" || raw === "kilogram") return "kg";
  if (raw === "g" || raw === "per g" || raw === "gram" || raw === "grams") return "g";
  return null;
}

function unitFromPackSize(packSize?: string | null): PriceUnit | null {
  const pack = normalizePack(packSize);
  if (!pack) return null;
  if (/pack of|punnet|bunch|head/.test(pack)) return "ea";
  if (/^(1|1\.0)\s*kg$/.test(pack) || pack === "1000 g") return "kg";
  if (/^\d+(\.\d+)?\s*(kg|g)$/.test(pack)) return "ea";
  return "ea";
}

export function resolvePriceUnit(input: {
  unit?: string | null;
  packSize?: string | null;
  productId?: string;
}): PriceUnit {
  return parsePriceUnit(input.unit) ?? unitFromPackSize(input.packSize) ?? PRODUCT_PRICE_UNITS[input.productId ?? ""] ?? "ea";
}

export function priceUnitLabel(unit: PriceUnit, locale: AppLocale): string {
  const messages = getMessages(locale);
  if (unit === "kg") return messages.priceUnitKg;
  if (unit === "g") return messages.priceUnitG;
  return messages.priceUnitEach;
}
