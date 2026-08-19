import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import { categories as categorySeed } from "../data/categories";
import { collections as collectionSeed } from "../data/collections";
import catalogProducts from "../data/catalog-products.json";
import {
  adminUsers,
  bundleImages,
  bundleItems,
  bundles,
  categories,
  collectionProducts,
  collections,
  inventory,
  mediaAssets,
  productCategories,
  productImages,
  productVariants,
  products,
  redirects,
} from "../db/schema";
import { hasMinimumIndexableContent } from "../lib/catalog/quality";
import type { Product } from "../types/catalog";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    available: boolean;
    compare_at_price: string | null;
    grams: number;
  }>;
  images: Array<{ src: string; width: number; height: number }>;
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

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  return drizzle(neon(url));
}

async function main() {
  const db = getDb();
  const shopify = JSON.parse(
    readFileSync(path.join(process.cwd(), "data/import/shopify-products.json"), "utf8"),
  ) as { products: ShopifyProduct[] };
  const localProducts = catalogProducts as Product[];
  const shopifyBySlug = new Map(
    shopify.products.map((product) => [HANDLE_TO_SLUG[product.handle] ?? product.handle, product]),
  );

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");

  await db.delete(bundleItems);
  await db.delete(bundleImages);
  await db.delete(inventory);
  await db.delete(collectionProducts);
  await db.delete(productCategories);
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(bundles);
  await db.delete(products);
  await db.delete(collections);
  await db.delete(categories);
  await db.delete(mediaAssets);
  await db.delete(redirects);
  await db.delete(adminUsers);

  await db.insert(adminUsers).values({
    id: "admin_primary",
    email,
    passwordHash: await hash(password, 12),
    name: process.env.ADMIN_NAME ?? "Administrator",
    role: "admin",
  });

  for (const category of categorySeed) {
    await db.insert(categories).values({
      id: category.id,
      slug: category.slug,
      name: category.name,
      shortIntroduction: category.shortDescription,
      longContent: category.description,
      featuredImageSrc: category.image.src,
      featuredImageAlt: category.image.alt,
      featuredImageWidth: category.image.width,
      featuredImageHeight: category.image.height,
      seoTitle: category.seoTitle ?? null,
      seoDescription: category.seoDescription ?? null,
      ogImageSrc: category.image.src,
      featured: category.featured,
      indexable: category.indexable,
      isSample: category.isSample,
      sortOrder: category.sortOrder,
      publishedSlug: category.slug,
    });
    await db.insert(mediaAssets).values({
      id: `media_${category.id}`,
      originalFilename: category.image.src.split("/").at(-1) ?? "category.webp",
      originalAssetRef: `drive:categories/${category.image.src.split("/").at(-1)}`,
      src: category.image.src,
      alt: category.image.alt,
      width: category.image.width,
      height: category.image.height,
      mimeType: "image/webp",
    });
  }

  for (const collection of collectionSeed) {
    await db.insert(collections).values({
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      description: collection.description,
      imageSrc: collection.image?.src ?? null,
      imageAlt: collection.image?.alt ?? null,
      imageWidth: collection.image?.width ?? null,
      imageHeight: collection.image?.height ?? null,
      seoTitle: collection.seoTitle ?? null,
      seoDescription: collection.seoDescription ?? null,
      featured: collection.featured,
      indexable: collection.indexable,
      isSample: collection.isSample,
    });
  }

  for (const product of localProducts) {
    const shopifyProduct = shopifyBySlug.get(product.slug);
    const quality = hasMinimumIndexableContent({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId: product.categoryId,
      imageSrc: product.primaryImage.src,
      imageAlt: product.primaryImage.alt,
    });
    const liveAvailable = shopifyProduct?.variants.some((variant) => variant.available);
    const availability = liveAvailable === undefined ? product.availability : liveAvailable ? "in_stock" : "out_of_stock";
    const livePrice = shopifyProduct?.variants.find((variant) => Number(variant.price) > 0);
    const priceAmount = livePrice ? livePrice.price : (product.price?.amount?.toFixed(2) ?? null);

    await db.insert(products).values({
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      status: "active",
      shortDescription: product.shortDescription,
      description: product.description,
      primaryCategoryId: product.categoryId,
      tags: product.tags,
      priceAmount,
      priceCurrency: product.price?.currency ?? "ZAR",
      compareAtAmount: product.compareAtPrice?.amount?.toFixed(2) ?? null,
      unit: product.unit ?? null,
      packSize: product.packSize ?? null,
      weightGrams: product.weightGrams ?? (shopifyProduct?.variants[0]?.grams || null),
      featured: product.featured,
      availability,
      seoTitle: product.seoTitle ?? null,
      seoDescription: product.seoDescription ?? null,
      indexable: product.indexable && quality,
      isSample: false,
      productType: product.productType ?? null,
      shopifyProductId: shopifyProduct ? String(shopifyProduct.id) : null,
      shopifyHandle: shopifyProduct?.handle ?? null,
      publishedSlug: product.slug,
    });

    await db.insert(productCategories).values({
      productId: product.id,
      categoryId: product.categoryId,
      isPrimary: true,
    });

    for (const [index, image] of product.images.entries()) {
      const filename = image.src.split("/").at(-1) ?? "image.webp";
      await db.insert(productImages).values({
        id: `${product.id}_img_${index}`,
        productId: product.id,
        originalAssetRef: [
          `drive:products/${filename}`,
          shopifyProduct?.images[index]?.src ? `shopify:${shopifyProduct.images[index].src}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        src: image.src,
        alt: image.alt,
        width: image.width,
        height: image.height,
        displayOrder: index,
        isPrimary: image.src === product.primaryImage.src,
      });
      await db.insert(mediaAssets).values({
        id: `media_${product.id}_${index}`,
        originalFilename: filename,
        originalAssetRef: `drive:products/${filename}`,
        src: image.src,
        alt: image.alt,
        width: image.width,
        height: image.height,
        mimeType: "image/webp",
      });
    }

    if (product.variants?.length) {
      await db.insert(productVariants).values(
        product.variants.map((variant, index) => ({
          id: variant.id,
          productId: product.id,
          slug: variant.slug,
          name: variant.name,
          priceAmount: variant.price?.amount?.toFixed(2) ?? null,
          priceCurrency: variant.price?.currency ?? "ZAR",
          availability: variant.availability,
          packSize: variant.packSize ?? null,
          imageSrc: variant.image?.src ?? null,
          imageAlt: variant.image?.alt ?? null,
          imageWidth: variant.image?.width ?? null,
          imageHeight: variant.image?.height ?? null,
          sortOrder: index,
          shopifyVariantId: shopifyProduct?.variants[index] ? String(shopifyProduct.variants[index].id) : null,
        })),
      );
    }

    if (product.stockQuantity !== null && product.stockQuantity !== undefined) {
      await db.insert(inventory).values({
        id: `${product.id}_inv`,
        ownerType: "product",
        productId: product.id,
        quantity: product.stockQuantity,
        reserved: 0,
      });
    }
  }

  for (const collection of collectionSeed) {
    if (!collection.productIds.length) continue;
    await db.insert(collectionProducts).values(
      collection.productIds.map((productId, index) => ({
        collectionId: collection.id,
        productId,
        sortOrder: index,
      })),
    );
  }

  const redirectRows = [
    { fromPath: "/shop/fruits", toPath: "/shop/fruit" },
    ...shopify.products
      .map((product) => {
        const slug = HANDLE_TO_SLUG[product.handle] ?? product.handle;
        if (slug === product.handle) return null;
        return { fromPath: `/products/${product.handle}`, toPath: `/products/${slug}` };
      })
      .filter((row): row is { fromPath: string; toPath: string } => Boolean(row)),
  ];

  await db.insert(redirects).values(
    redirectRows.map((row) => ({
      id: `redir_${randomUUID()}`,
      fromPath: row.fromPath,
      toPath: row.toPath,
      permanent: true,
      entityType: (row.fromPath.startsWith("/shop/") ? "category" : "product") as "category" | "product",
    })),
  );

  console.log(`Imported ${localProducts.length} products, ${categorySeed.length} categories, ${redirectRows.length} redirects.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
