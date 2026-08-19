import type { AvailabilityStatus } from "@/types/catalog";

export function availableQuantity(quantity: number | null | undefined, reserved = 0): number | null {
  if (quantity === null || quantity === undefined) return null;
  return Math.max(0, quantity - reserved);
}

export function availabilityFromStock(
  listed: AvailabilityStatus,
  available: number | null,
): AvailabilityStatus {
  if (listed === "discontinued" || listed === "preorder") return listed;
  if (available === 0) return "out_of_stock";
  if (available !== null && available > 0) {
    return listed === "out_of_stock" || listed === "unknown" ? "in_stock" : listed;
  }
  return listed;
}

export function canPurchase(status: AvailabilityStatus, available: number | null): boolean {
  if (status === "discontinued" || status === "out_of_stock") return false;
  if (available === 0) return false;
  return true;
}
