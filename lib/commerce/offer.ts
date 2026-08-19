import { timingSafeEqual } from "node:crypto";
import type { AvailabilityStatus, Money, Product, ProductVariant } from "@/types/catalog";

export type MerchantAvailability = "in_stock" | "out_of_stock" | "preorder";

export function merchantAvailability(status: AvailabilityStatus): MerchantAvailability | null {
  if (status === "in_stock" || status === "out_of_stock" || status === "preorder") return status;
  return null;
}

export function formatOfferPrice(price: Money): string {
  return `${price.amount.toFixed(2)} ${price.currency}`;
}

export function hasSellablePrice(price: Money | null | undefined): price is Money {
  return Boolean(price && price.amount > 0 && price.currency);
}

export function isPublicSellableProduct(product: Product): boolean {
  return product.status === "active" && !product.isSample;
}

export function offerIdentity(product: Product, variant?: ProductVariant) {
  if (variant) {
    return {
      id: variant.sku || variant.id,
      groupId: product.sku,
      title: `${product.name} — ${variant.name}`,
    };
  }
  return {
    id: product.sku,
    groupId: undefined as string | undefined,
    title: product.name,
  };
}

export function offerSnapshot(product: Product, variant?: ProductVariant) {
  const price = variant?.price ?? product.price;
  const availability = merchantAvailability(variant?.availability ?? product.availability);
  return { price, availability };
}

const DRIVE_PATTERN = /drive\.google\.com|docs\.google\.com|googleapis\.com\/drive/i;

export function isUsableStorefrontImage(src: string): boolean {
  if (!src.trim()) return false;
  if (DRIVE_PATTERN.test(src)) return false;
  return src.startsWith("/") || src.startsWith("https://") || src.startsWith("http://");
}

export function secretsMatch(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
