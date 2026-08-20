import type { Money } from "@/types/catalog";
import { resolvePriceUnit, type PriceUnit } from "@/lib/catalog/price-unit";

export type PackMeasure =
  | { kind: "g"; grams: number }
  | { kind: "kg"; kilograms: number }
  | { kind: "each" };

/**
 * Parse a human pack string such as "400 g", "1 kg", "2 kg", "Pack of 4".
 */
export function parsePackMeasure(packSize?: string | null): PackMeasure | null {
  const pack = (packSize ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!pack) return null;
  if (/pack of|bunch|head|punnet|each|ea\b/.test(pack)) return { kind: "each" };
  const kg = pack.match(/^(\d+(?:\.\d+)?)\s*kg$/);
  if (kg) return { kind: "kg", kilograms: Number(kg[1]) };
  if (pack === "1000 g") return { kind: "kg", kilograms: 1 };
  const grams = pack.match(/^(\d+(?:\.\d+)?)\s*g$/);
  if (grams) return { kind: "g", grams: Number(grams[1]) };
  return null;
}

/**
 * Optional comparison rate for shoppers comparing packs.
 * Only derived when the pack mass is known and the selling price is confirmed.
 * Never invent a comparison from a missing price.
 */
export function comparisonPricePer100g(price: Money | null | undefined, packSize?: string | null): Money | null {
  if (!price || !Number.isFinite(price.amount) || price.amount <= 0) return null;
  const measure = parsePackMeasure(packSize);
  if (!measure) return null;
  let grams: number | null = null;
  if (measure.kind === "g") grams = measure.grams;
  if (measure.kind === "kg") grams = measure.kilograms * 1000;
  if (!grams || grams <= 0) return null;
  // Avoid noisy "same as selling" comparison when the pack is already 100 g.
  if (grams === 100) return null;
  return {
    amount: Number(((price.amount / grams) * 100).toFixed(2)),
    currency: price.currency,
  };
}

export type DisplayPrice = {
  sellingPrice: Money | null;
  sellingUnit: PriceUnit;
  packLabel: string | null;
  comparisonPer100g: Money | null;
  priceConfirmed: boolean;
};

export function resolveDisplayPrice(input: {
  price: Money | null | undefined;
  unit?: string | null;
  packSize?: string | null;
  productId?: string;
}): DisplayPrice {
  const sellingPrice = input.price && Number.isFinite(input.price.amount) ? input.price : null;
  const sellingUnit = resolvePriceUnit({
    unit: input.unit,
    packSize: input.packSize,
    productId: input.productId,
  });
  const packLabel = input.packSize?.trim() || null;
  return {
    sellingPrice,
    sellingUnit,
    packLabel,
    comparisonPer100g: comparisonPricePer100g(sellingPrice, input.packSize),
    priceConfirmed: Boolean(sellingPrice),
  };
}

export function sellingUnitForDisplay(unit: PriceUnit, packLabel: string | null): PriceUnit | null {
  // Pack selling prices show the pack size separately — never suffix a rate on the pack total.
  if (packLabel && unit === "ea") return null;
  return unit;
}
