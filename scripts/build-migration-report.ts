import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import catalogProducts from "../data/catalog-products.json";
import type { Product } from "../types/catalog";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    available: boolean;
    compare_at_price: string | null;
  }>;
  images: Array<{ src: string; width: number; height: number; position: number }>;
};

const HANDLE_TO_SLUG: Record<string, string> = {
  avos: "avocados",
  tamatoes: "cherry-tomatoes",
  "baby-patatos": "baby-potatoes",
  patatos: "potatoes",
  "pears-1-5-kg": "pears",
  "grapes-500g": "grapes",
  gauvas: "guavas",
  "granadillas-pack-of-6": "granadillas",
  "grapefruit-pack-of-6": "grapefruit",
  cantaloupe: "melon",
  pineapple: "queen-pineapple",
  banana: "bananas",
  appels: "apples",
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function seoComplete(product: Product) {
  return Boolean(
    product.seoTitle &&
      product.seoDescription &&
      product.primaryImage?.src &&
      product.primaryImage?.alt &&
      product.shortDescription &&
      product.description,
  );
}

async function main() {
  const shopifyPath = path.join(process.cwd(), "data/import/shopify-products.json");
  const shopify = JSON.parse(readFileSync(shopifyPath, "utf8")) as { products: ShopifyProduct[] };
  const local = catalogProducts as Product[];
  const localBySlug = new Map(local.map((product) => [product.slug, product]));

  const rows = shopify.products.map((shopifyProduct) => {
    const slug = HANDLE_TO_SLUG[shopifyProduct.handle] ?? shopifyProduct.handle;
    const localProduct = localBySlug.get(slug);
    const realVariants = shopifyProduct.variants.filter((variant) => variant.title !== "Default Title");
    const priceVariant = shopifyProduct.variants[0];
    const price = Number(priceVariant?.price ?? 0);
    return {
      shopifyName: shopifyProduct.title,
      shopifyHandle: shopifyProduct.handle,
      proposedName: localProduct?.name ?? shopifyProduct.title,
      proposedSlug: slug,
      category: localProduct?.categoryId === "cat_fruit" ? "fruit" : "vegetables",
      variants: realVariants.length
        ? realVariants.map((variant) => `${variant.title} @ ${variant.price}`).join("; ")
        : "Default",
      price: price > 0 ? `${price.toFixed(2)} ZAR` : "Unset",
      availability: shopifyProduct.variants.some((variant) => variant.available) ? "in_stock" : "out_of_stock",
      imageMapping: localProduct?.primaryImage.src ?? "MISSING",
      seoComplete: localProduct ? seoComplete(localProduct) : false,
      validated: Boolean(localProduct && localProduct.primaryImage?.src && localProduct.description),
      notes: [
        shopifyProduct.handle !== slug ? `Normalized handle ${shopifyProduct.handle} → ${slug}` : null,
        shopifyProduct.title !== (localProduct?.name ?? shopifyProduct.title)
          ? `Normalized name ${shopifyProduct.title} → ${localProduct?.name}`
          : null,
        localProduct ? null : "No local catalogue match — skipped",
      ]
        .filter(Boolean)
        .join(". "),
    };
  });

  const markdown = [
    "# Catalogue migration report",
    "",
    "Source: Shopify `m-m-premium-produce.myshopify.com` snapshot in `data/import/shopify-products.json`.",
    "Canonical names, slugs, SEO copy and production images come from the Phase 1B catalogue, with spelling normalized.",
    "Google Drive original files are mapped to git-hosted WebP assets under `/images/products` and `/images/categories`. Drive URLs are not used at runtime.",
    "",
    `Shopify products: ${shopify.products.length}. Validated for import: ${rows.filter((row) => row.validated).length}.`,
    "",
    "| Shopify name | Canonical name | Slug | Category | Variants | Price | Availability | Image | SEO complete | Import | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.shopifyName} | ${row.proposedName} | \`${row.proposedSlug}\` | ${row.category} | ${row.variants} | ${row.price} | ${row.availability} | \`${row.imageMapping}\` | ${row.seoComplete ? "Yes" : "No"} | ${row.validated ? "Yes" : "No"} | ${row.notes || "—"} |`,
    ),
    "",
    "## Redirects created from Shopify handles",
    "",
    ...rows
      .filter((row) => row.shopifyHandle !== row.proposedSlug && row.validated)
      .map((row) => `- \`/products/${row.shopifyHandle}\` → \`/products/${row.proposedSlug}\``),
    "- `/shop/fruits` → `/shop/fruit`",
    "",
    "## Image mapping",
    "",
    "Product photography in Google Drive is stored locally as optimized WebP. `original_asset_ref` records `drive:products/<file>` plus the Shopify CDN URL from the snapshot.",
    "",
  ].join("\n");

  const out = path.join(process.cwd(), "docs/MIGRATION_REPORT.md");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, markdown);
  await writeFile(
    path.join(process.cwd(), "data/import/migration-rows.json"),
    JSON.stringify(rows, null, 2),
  );
  console.log(`Wrote ${out}`);
  console.log(stripHtml(""));
  if (!existsSync(shopifyPath)) {
    throw new Error("Missing Shopify snapshot");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
