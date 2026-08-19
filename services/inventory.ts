import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inventory } from "@/db/schema";
import { availableQuantity } from "@/lib/commerce/availability";

export type StockOwner = {
  ownerType: "product" | "variant" | "bundle";
  productId?: string | null;
  variantId?: string | null;
  bundleId?: string | null;
};

function ownerWhere(owner: StockOwner) {
  if (owner.variantId) {
    return and(eq(inventory.ownerType, "variant"), eq(inventory.variantId, owner.variantId));
  }
  if (owner.bundleId) {
    return and(eq(inventory.ownerType, "bundle"), eq(inventory.bundleId, owner.bundleId));
  }
  return and(eq(inventory.ownerType, "product"), eq(inventory.productId, owner.productId ?? ""));
}

export async function getAvailableStock(owner: StockOwner): Promise<number | null> {
  const db = getDb();
  const [row] = await db.select().from(inventory).where(ownerWhere(owner)).limit(1);
  if (!row) return null;
  return availableQuantity(row.quantity, row.reserved);
}

export async function decrementStock(owner: StockOwner, quantity: number): Promise<boolean> {
  if (!Number.isInteger(quantity) || quantity <= 0) return false;
  const db = getDb();
  const updated = await db
    .update(inventory)
    .set({
      quantity: sql`${inventory.quantity} - ${quantity}`,
      updatedAt: new Date(),
    })
    .where(and(ownerWhere(owner), sql`${inventory.quantity} - ${inventory.reserved} >= ${quantity}`))
    .returning({ id: inventory.id });
  if (updated.length) return true;
  const [existing] = await db.select({ id: inventory.id }).from(inventory).where(ownerWhere(owner)).limit(1);
  // No inventory row means the SKU is untracked (unlimited). A row that exists but
  // failed the available-quantity predicate is a genuine stock miss.
  return !existing;
}

export async function restoreStock(owner: StockOwner, quantity: number): Promise<void> {
  const db = getDb();
  await db
    .update(inventory)
    .set({
      quantity: sql`${inventory.quantity} + ${quantity}`,
      updatedAt: new Date(),
    })
    .where(ownerWhere(owner));
}
