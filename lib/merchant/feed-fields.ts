import type { MerchantFeedProduct } from "@/types/commerce";
import type { Product } from "@/types/catalog";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { paths } from "@/lib/routes";
import { getSiteConfig } from "@/config/site";

/**
 * Maps a catalogue product to Merchant Center fields when every required
 * value is genuinely present. Returns null rather than inventing data.
 */
export function toMerchantFeedProduct(product: Product): MerchantFeedProduct | null {
  if (!product.price || product.price.amount <= 0) return null;
  if (product.availability === "unknown" || product.availability === "discontinued") {
    return null;
  }

  const availability =
    product.availability === "in_stock" ||
    product.availability === "out_of_stock" ||
    product.availability === "preorder"
      ? product.availability
      : null;

  if (!availability) return null;

  const site = getSiteConfig();

  return {
    id: product.sku,
    title: product.name,
    description: product.shortDescription,
    link: buildCanonicalUrl(paths.product(product.slug)),
    image_link: buildCanonicalUrl(product.primaryImage.src),
    availability,
    price: `${product.price.amount.toFixed(2)} ${product.price.currency}`,
    condition: "new",
    brand: site.businessName,
    ...(product.gtin ? { gtin: product.gtin } : {}),
    ...(product.mpn ? { mpn: product.mpn } : {}),
    ...(product.googleProductCategory
      ? { google_product_category: product.googleProductCategory }
      : {}),
    ...(product.productType ? { product_type: product.productType } : {}),
  };
}
