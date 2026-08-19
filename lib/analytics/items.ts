import { offerIdentity } from "@/lib/commerce/offer";
import type { Product, ProductVariant } from "@/types/catalog";
import type { HydratedCart, HydratedCartLine, OrderRecord } from "@/types/commerce";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

const BRAND = "M & M Premium Produce";

const PII_KEYS = /email|phone|address|name|customer|deliveryline|suburb|city|province|postal|first|last/i;

export function analyticsItemFromProduct(product: Product, variant?: ProductVariant, quantity = 1): AnalyticsItem {
  const identity = offerIdentity(product, variant);
  const price = variant?.price ?? product.price;
  return {
    item_id: identity.id,
    item_name: product.name,
    item_brand: BRAND,
    item_category: product.productType,
    item_variant: variant?.name,
    price: price && price.amount > 0 ? Number(price.amount.toFixed(2)) : undefined,
    quantity,
  };
}

export function analyticsItemFromCartLine(item: HydratedCartLine): AnalyticsItem {
  return {
    item_id: item.sku || item.productId,
    item_name: item.name,
    item_brand: BRAND,
    item_variant: item.variantName ?? undefined,
    price: item.unitPrice && item.unitPrice.amount > 0 ? Number(item.unitPrice.amount.toFixed(2)) : undefined,
    quantity: item.quantity,
  };
}

export function analyticsItemsFromCart(cart: HydratedCart): AnalyticsItem[] {
  return cart.items.filter((item) => item.sku).map(analyticsItemFromCartLine);
}

export function analyticsValue(items: AnalyticsItem[]): number {
  return Number(
    items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0).toFixed(2),
  );
}

export function purchasePayload(order: Pick<OrderRecord, "id" | "number" | "currency" | "totalAmount" | "items">) {
  return {
    transaction_id: order.number || order.id,
    currency: order.currency,
    value: Number(order.totalAmount.toFixed(2)),
    items: order.items.map((item) => ({
      item_id: item.skuSnapshot,
      item_name: item.nameSnapshot,
      item_brand: BRAND,
      item_variant: item.variantNameSnapshot ?? undefined,
      price: Number(item.unitPriceAmount.toFixed(2)),
      quantity: item.quantity,
    })),
  };
}

export function stripPii(params: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEYS.test(key)) continue;
    cleaned[key] = value;
  }
  return cleaned;
}
