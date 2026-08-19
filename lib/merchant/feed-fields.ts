import { buildMerchantFeedRows } from "@/lib/merchant/feed";
import type { Product } from "@/types/catalog";
import type { MerchantFeedRow } from "@/types/commerce";

/** @deprecated Use buildMerchantFeedRows for variant-aware Merchant output. */
export function toMerchantFeedProduct(product: Product): MerchantFeedRow | null {
  return buildMerchantFeedRows([product])[0] ?? null;
}
