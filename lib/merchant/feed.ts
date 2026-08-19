import { getSiteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { createPaths } from "@/lib/i18n/paths";
import {
  formatOfferPrice,
  hasSellablePrice,
  isPublicSellableProduct,
  isUsableStorefrontImage,
  offerIdentity,
  offerSnapshot,
} from "@/lib/commerce/offer";
import type { MerchantFeedRow } from "@/types/commerce";
import type { Product, ProductVariant } from "@/types/catalog";

export const MERCHANT_FEED_COLUMNS = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "additional_image_link",
  "availability",
  "price",
  "condition",
  "brand",
  "gtin",
  "mpn",
  "identifier_exists",
  "google_product_category",
  "product_type",
  "item_group_id",
] as const;

function httpsAsset(src: string): string | null {
  if (!isUsableStorefrontImage(src)) return null;
  if (src.startsWith("http://")) return `https://${src.slice("http://".length)}`;
  if (src.startsWith("https://")) return src;
  return buildCanonicalUrl(src);
}

function productLink(product: Product, variantSlug?: string): string {
  const paths = createPaths("en");
  const url = buildCanonicalUrl(paths.product(product.slug));
  return variantSlug ? `${url}#${variantSlug}` : url;
}

function escapeCell(value: string): string {
  return value.replace(/\t/g, " ").replace(/\r?\n/g, " ").trim();
}

function rowToLine(row: MerchantFeedRow): string {
  return MERCHANT_FEED_COLUMNS.map((column) => escapeCell(row[column] ?? "")).join("\t");
}

function identifiers(gtin?: string | null, mpn?: string | null): {
  gtin: string;
  mpn: string;
  identifier_exists: "yes" | "no";
} {
  const hasGtin = Boolean(gtin?.trim());
  const hasMpn = Boolean(mpn?.trim());
  return {
    gtin: hasGtin ? gtin!.trim() : "",
    mpn: hasMpn ? mpn!.trim() : "",
    identifier_exists: hasGtin || hasMpn ? "yes" : "no",
  };
}

function additionalImages(product: Product, primarySrc: string): string {
  const extras = product.images
    .map((image) => httpsAsset(image.src))
    .filter((src): src is string => Boolean(src) && src !== primarySrc);
  return [...new Set(extras)].join(",");
}

function toRow(product: Product, variant?: ProductVariant): MerchantFeedRow | null {
  if (!isPublicSellableProduct(product)) return null;
  const offer = offerSnapshot(product, variant);
  if (!hasSellablePrice(offer.price) || !offer.availability) return null;
  const imageSrc = variant?.image?.src ?? product.primaryImage.src;
  const imageLink = httpsAsset(imageSrc);
  if (!imageLink) return null;

  const identity = offerIdentity(product, variant);
  const ids = identifiers(product.gtin, product.mpn);
  const site = getSiteConfig();

  return {
    id: identity.id,
    title: identity.title,
    description: product.shortDescription || product.description,
    link: productLink(product, variant?.slug),
    image_link: imageLink,
    additional_image_link: additionalImages(product, imageLink),
    availability: offer.availability,
    price: formatOfferPrice(offer.price),
    condition: "new",
    brand: site.businessName,
    gtin: ids.gtin,
    mpn: ids.mpn,
    identifier_exists: ids.identifier_exists,
    google_product_category: product.googleProductCategory?.trim() || "",
    product_type: product.productType?.trim() || "",
    item_group_id: identity.groupId || "",
  };
}

export function buildMerchantFeedRows(products: Product[]): MerchantFeedRow[] {
  const rows: MerchantFeedRow[] = [];
  for (const product of products) {
    const variants = product.variants?.filter(Boolean) ?? [];
    if (variants.length) {
      for (const variant of variants) {
        const row = toRow(product, variant);
        if (row) rows.push(row);
      }
      continue;
    }
    const row = toRow(product);
    if (row) rows.push(row);
  }
  return rows;
}

export function renderMerchantFeedTsv(rows: MerchantFeedRow[]): string {
  const header = MERCHANT_FEED_COLUMNS.join("\t");
  return `${[header, ...rows.map(rowToLine)].join("\n")}\n`;
}
