import type { AvailabilityStatus, Money } from "@/types/catalog";

/**
 * Future cart/checkout shapes. Not persisted in Phase 1.
 */
export type CartLineType = "product" | "bundle";

export type CartLine = {
  type: CartLineType;
  entityId: string;
  quantity: number;
};

export type CheckoutPlaceholder = {
  cart: CartLine[];
};

/**
 * Google Merchant Center product feed fields we intend to support later.
 * Do not invent GTIN/MPN values. Omit unknown fields in any future feed.
 */
export type MerchantFeedProduct = {
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder";
  price: string;
  condition: "new";
  brand: string;
  gtin?: string;
  mpn?: string;
  google_product_category?: string;
  product_type?: string;
};

export type OfferSnapshot = {
  price: Money | null;
  availability: AvailabilityStatus;
  url: string;
};
