import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { deliveryRules } from "@/db/schema";
import { moneyFrom } from "@/services/catalog/mappers";
import type { DeliveryRule } from "@/types/commerce";

function mapRule(row: typeof deliveryRules.$inferSelect): DeliveryRule {
  return {
    id: row.id,
    name: row.name,
    suburb: row.suburb,
    city: row.city,
    province: row.province,
    postalCode: row.postalCode,
    fee: moneyFrom(row.feeAmount, row.currency) ?? { amount: 0, currency: row.currency },
    minOrder: moneyFrom(row.minOrderAmount, row.currency),
    freeDeliveryThreshold: moneyFrom(row.freeDeliveryThreshold, row.currency),
    estimatedWindow: row.estimatedWindow,
    estimatedMinDays: row.estimatedMinDays,
    estimatedMaxDays: row.estimatedMaxDays,
    published: row.published,
    sortOrder: row.sortOrder,
    notes: row.notes,
  };
}

function normalizePlace(value?: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePostal(value?: string | null): string {
  return (value ?? "").replace(/\s+/g, "");
}

export async function listPublishedDeliveryRules(): Promise<DeliveryRule[]> {
  // Delivery rules live in Postgres. When DATABASE_URL is missing (misconfigured
  // host), return an empty list so the page can still render honest "not published yet" copy.
  if (!process.env.DATABASE_URL?.trim()) return [];
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(deliveryRules)
      .where(eq(deliveryRules.published, true))
      .orderBy(asc(deliveryRules.sortOrder), asc(deliveryRules.name));
    return rows.map(mapRule);
  } catch (error) {
    console.error("Failed to load published delivery rules.", error);
    return [];
  }
}

export async function listDeliveryRules(): Promise<DeliveryRule[]> {
  const db = getDb();
  const rows = await db.select().from(deliveryRules).orderBy(asc(deliveryRules.sortOrder), asc(deliveryRules.name));
  return rows.map(mapRule);
}

export async function getDeliveryRule(id: string): Promise<DeliveryRule | null> {
  const db = getDb();
  const [row] = await db.select().from(deliveryRules).where(eq(deliveryRules.id, id)).limit(1);
  return row ? mapRule(row) : null;
}

export function quoteDeliveryFee(rule: DeliveryRule, subtotal: number): number {
  if (rule.freeDeliveryThreshold && subtotal >= rule.freeDeliveryThreshold.amount) return 0;
  return rule.fee.amount;
}

export function matchDeliveryDestination(
  rules: DeliveryRule[],
  destination: { suburb?: string; city?: string; postalCode?: string },
): DeliveryRule | null {
  const suburb = normalizePlace(destination.suburb);
  const city = normalizePlace(destination.city);
  const postal = normalizePostal(destination.postalCode);
  return (
    rules.find((rule) => {
      const rulePostal = normalizePostal(rule.postalCode);
      const ruleSuburb = normalizePlace(rule.suburb);
      const ruleCity = normalizePlace(rule.city);
      if (!rulePostal && !ruleSuburb && !ruleCity) return false;
      if (rulePostal && rulePostal !== postal) return false;
      if (ruleSuburb && ruleSuburb !== suburb) return false;
      if (ruleCity && ruleCity !== city) return false;
      return true;
    }) ?? null
  );
}

export async function saveDeliveryRule(input: {
  id?: string;
  name: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  feeAmount: string;
  minOrderAmount?: string;
  freeDeliveryThreshold?: string;
  estimatedWindow?: string;
  estimatedMinDays?: string;
  estimatedMaxDays?: string;
  published: boolean;
  sortOrder: number;
  notes?: string;
}): Promise<string> {
  const db = getDb();
  const id = input.id || `del_${crypto.randomUUID().slice(0, 12)}`;
  const values = {
    id,
    name: input.name.trim(),
    suburb: input.suburb?.trim() || null,
    city: input.city?.trim() || null,
    province: input.province?.trim() || null,
    postalCode: input.postalCode?.trim() || null,
    feeAmount: input.feeAmount || "0",
    minOrderAmount: input.minOrderAmount || null,
    freeDeliveryThreshold: input.freeDeliveryThreshold || null,
    estimatedWindow: input.estimatedWindow?.trim() || null,
    estimatedMinDays: input.estimatedMinDays ? Number(input.estimatedMinDays) : null,
    estimatedMaxDays: input.estimatedMaxDays ? Number(input.estimatedMaxDays) : null,
    published: input.published,
    sortOrder: input.sortOrder,
    notes: input.notes?.trim() || null,
    updatedAt: new Date(),
  };
  const [existing] = await db.select({ id: deliveryRules.id }).from(deliveryRules).where(eq(deliveryRules.id, id)).limit(1);
  if (existing) {
    await db.update(deliveryRules).set(values).where(eq(deliveryRules.id, id));
  } else {
    await db.insert(deliveryRules).values(values);
  }
  return id;
}
