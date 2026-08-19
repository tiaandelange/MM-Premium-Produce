import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  bundleImages,
  bundleItems,
  bundleTranslations,
  bundles,
  categories,
  categoryTranslations,
  collectionProducts,
  inventory,
  mediaAssets,
  productImages,
  productCategories,
  productTranslations,
  productVariants,
  products,
} from "@/db/schema";
import type { AppLocale, TranslationStatus } from "@/lib/i18n/config";
import { hasMinimumIndexableContent } from "@/lib/catalog/quality";
import { recordLocalizedSlugRedirect } from "@/lib/seo/redirects";
import { toSeoSlug } from "@/lib/utils/slug";
import type { AvailabilityStatus, EntityStatus } from "@/types/catalog";

export async function getProductTranslation(productId: string, locale: AppLocale) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(productTranslations)
    .where(and(eq(productTranslations.productId, productId), eq(productTranslations.locale, locale)))
    .limit(1);
  return row ?? null;
}

export async function getCategoryTranslation(categoryId: string, locale: AppLocale) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(categoryTranslations)
    .where(and(eq(categoryTranslations.categoryId, categoryId), eq(categoryTranslations.locale, locale)))
    .limit(1);
  return row ?? null;
}

export async function getBundleTranslation(bundleId: string, locale: AppLocale) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(bundleTranslations)
    .where(and(eq(bundleTranslations.bundleId, bundleId), eq(bundleTranslations.locale, locale)))
    .limit(1);
  return row ?? null;
}

function now() {
  return new Date();
}

function numericOrNull(value?: string) {
  if (!value?.trim()) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount.toFixed(2);
}

function newId(prefix: string, slug: string) {
  return `${prefix}_${slug}`.replace(/[^a-z0-9_]+/g, "_");
}

export type SavedProductInput = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  status: EntityStatus;
  shortDescription: string;
  description: string;
  categoryId: string;
  collectionIds: string[];
  tags: string[];
  price?: string;
  compareAtPrice?: string;
  unit?: string;
  packSize?: string;
  availability: AvailabilityStatus;
  stockQuantity?: string;
  featured: boolean;
  indexable: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalOverride?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageSrc?: string;
  primaryImageSrc: string;
  primaryImageAlt: string;
  additionalImages: Array<{ src: string; alt: string }>;
  variants: Array<{
    id?: string;
    name: string;
    slug: string;
    price?: string;
    availability: AvailabilityStatus;
    packSize?: string;
    imageSrc?: string;
  }>;
  storageGuidance?: string;
  selectionGuidance?: string;
  typicalUses?: string;
  seasonality?: string;
  origin?: string;
  translations?: {
    en?: ProductTranslationInput;
    af?: ProductTranslationInput;
  };
};

export type ProductTranslationInput = {
  status: TranslationStatus;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalOverride?: string;
  imageAlt?: string;
  indexable: boolean;
  storageGuidance?: string;
  selectionGuidance?: string;
  typicalUses?: string;
};

export async function saveProduct(input: SavedProductInput) {
  const db = getDb();
  const slug = toSeoSlug(input.slug);
  const id = input.id || newId("prod", slug);
  const quality = hasMinimumIndexableContent({
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    categoryId: input.categoryId,
    imageSrc: input.primaryImageSrc,
    imageAlt: input.primaryImageAlt,
  });
  const indexable = input.indexable && input.status === "active" && quality;
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);

  if (existing && existing.publishedSlug && existing.publishedSlug !== slug && existing.status === "active") {
    await recordLocalizedSlugRedirect({
      locale: "en",
      kind: "product",
      oldSlug: existing.publishedSlug,
      newSlug: slug,
      entityId: id,
    });
  } else if (existing && existing.slug !== slug && (existing.status === "active" || existing.publishedSlug)) {
    await recordLocalizedSlugRedirect({
      locale: "en",
      kind: "product",
      oldSlug: existing.slug,
      newSlug: slug,
      entityId: id,
    });
  }

  const publishedSlug =
    input.status === "active" ? slug : existing?.publishedSlug ?? null;

  const values = {
    id,
    sku: input.sku,
    slug,
    name: input.name,
    status: input.status,
    shortDescription: input.shortDescription,
    description: input.description,
    primaryCategoryId: input.categoryId,
    tags: input.tags,
    priceAmount: numericOrNull(input.price),
    compareAtAmount: numericOrNull(input.compareAtPrice),
    unit: input.unit ?? null,
    packSize: input.packSize ?? null,
    featured: input.featured,
    availability: input.availability,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    canonicalOverride: input.canonicalOverride ?? null,
    ogTitle: input.ogTitle ?? null,
    ogDescription: input.ogDescription ?? null,
    ogImageSrc: input.ogImageSrc ?? null,
    indexable,
    storageGuidance: input.storageGuidance ?? null,
    selectionGuidance: input.selectionGuidance ?? null,
    typicalUses: input.typicalUses ?? null,
    seasonality: input.seasonality ?? null,
    origin: input.origin ?? null,
    publishedSlug,
    updatedAt: now(),
  };

  if (existing) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    await db.insert(products).values({ ...values, createdAt: now() });
  }

  await db.delete(productCategories).where(eq(productCategories.productId, id));
  await db.insert(productCategories).values({
    productId: id,
    categoryId: input.categoryId,
    isPrimary: true,
  });

  await db.delete(collectionProducts).where(eq(collectionProducts.productId, id));
  if (input.collectionIds.length) {
    await db.insert(collectionProducts).values(
      input.collectionIds.map((collectionId, index) => ({
        collectionId,
        productId: id,
        sortOrder: index,
      })),
    );
  }

  await db.delete(productImages).where(eq(productImages.productId, id));
  const imageRows = [
    {
      id: `${id}_img_primary`,
      productId: id,
      src: input.primaryImageSrc,
      alt: input.primaryImageAlt,
      width: 1200,
      height: 1200,
      displayOrder: 0,
      isPrimary: true,
      originalAssetRef: input.primaryImageSrc,
    },
    ...input.additionalImages.map((image, index) => ({
      id: `${id}_img_${index + 1}`,
      productId: id,
      src: image.src,
      alt: image.alt || input.primaryImageAlt,
      width: 1200,
      height: 1200,
      displayOrder: index + 1,
      isPrimary: false,
      originalAssetRef: image.src,
    })),
  ];
  await db.insert(productImages).values(imageRows);

  await db.delete(productVariants).where(eq(productVariants.productId, id));
  if (input.variants.length) {
    await db.insert(productVariants).values(
      input.variants.map((variant, index) => {
        const variantSlug = toSeoSlug(variant.slug || variant.name);
        return {
          id: variant.id || `${id}_var_${variantSlug}`,
          productId: id,
          slug: variantSlug,
          name: variant.name,
          priceAmount: numericOrNull(variant.price),
          availability: variant.availability,
          packSize: variant.packSize ?? null,
          imageSrc: variant.imageSrc ?? null,
          sortOrder: index,
        };
      }),
    );
  }

  const stock = input.stockQuantity?.trim() ? Number(input.stockQuantity) : null;
  await db.delete(inventory).where(and(eq(inventory.productId, id), eq(inventory.ownerType, "product")));
  if (stock !== null && Number.isFinite(stock)) {
    await db.insert(inventory).values({
      id: `${id}_inv`,
      ownerType: "product",
      productId: id,
      quantity: Math.max(0, Math.round(stock)),
      reserved: 0,
    });
  }

  const englishTranslation: ProductTranslationInput = {
    status: input.status === "active" ? "published" : "draft",
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    ogTitle: input.ogTitle,
    ogDescription: input.ogDescription,
    canonicalOverride: input.canonicalOverride,
    imageAlt: input.primaryImageAlt,
    indexable: input.indexable,
    storageGuidance: input.storageGuidance,
    selectionGuidance: input.selectionGuidance,
    typicalUses: input.typicalUses,
  };
  await upsertProductTranslation(id, "en", englishTranslation, input.status, quality);
  if (input.translations?.af?.name && input.translations.af.slug) {
    await upsertProductTranslation(id, "af", input.translations.af, input.status, quality);
  }

  return { id, indexable, quality };
}

async function upsertProductTranslation(
  productId: string,
  locale: AppLocale,
  input: ProductTranslationInput,
  entityStatus: EntityStatus,
  sharedQuality: boolean,
) {
  const db = getDb();
  const slug = toSeoSlug(input.slug || input.name);
  const quality = hasMinimumIndexableContent({
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    categoryId: "ok",
    imageSrc: "ok",
    imageAlt: input.imageAlt || "alt text ok",
  });
  const indexable =
    input.indexable && input.status === "published" && entityStatus === "active" && quality && sharedQuality;
  const [existing] = await db
    .select()
    .from(productTranslations)
    .where(and(eq(productTranslations.productId, productId), eq(productTranslations.locale, locale)))
    .limit(1);
  if (existing?.publishedSlug && existing.publishedSlug !== slug && existing.status === "published") {
    await recordLocalizedSlugRedirect({
      locale,
      kind: "product",
      oldSlug: existing.publishedSlug,
      newSlug: slug,
      entityId: productId,
    });
  }
  const values = {
    productId,
    locale,
    status: input.status,
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    storageGuidance: input.storageGuidance ?? null,
    selectionGuidance: input.selectionGuidance ?? null,
    typicalUses: input.typicalUses ?? null,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    canonicalOverride: input.canonicalOverride ?? null,
    ogTitle: input.ogTitle ?? null,
    ogDescription: input.ogDescription ?? null,
    imageAlt: input.imageAlt ?? null,
    indexable,
    publishedSlug: input.status === "published" ? slug : existing?.publishedSlug ?? null,
    updatedAt: now(),
  };
  if (existing) {
    await db
      .update(productTranslations)
      .set(values)
      .where(and(eq(productTranslations.productId, productId), eq(productTranslations.locale, locale)));
  } else {
    await db.insert(productTranslations).values({ ...values, createdAt: now() });
  }
}

export type CategoryTranslationInput = {
  status: TranslationStatus;
  name: string;
  slug: string;
  shortIntroduction: string;
  longContent: string;
  seoTitle?: string;
  seoDescription?: string;
  imageAlt?: string;
  indexable: boolean;
};

export type BundleTranslationInput = {
  status: TranslationStatus;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  imageAlt?: string;
  indexable: boolean;
};

export async function saveCategory(input: {
  id?: string;
  name: string;
  slug: string;
  shortIntroduction: string;
  longContent: string;
  featuredImageSrc: string;
  featuredImageAlt: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageSrc?: string;
  indexable: boolean;
  featured: boolean;
  sortOrder: number;
  translations?: {
    af?: CategoryTranslationInput;
  };
}) {
  const db = getDb();
  const slug = toSeoSlug(input.slug);
  const id = input.id || newId("cat", slug);
  const [existing] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (existing?.publishedSlug && existing.publishedSlug !== slug) {
    await recordLocalizedSlugRedirect({
      locale: "en",
      kind: "category",
      oldSlug: existing.publishedSlug,
      newSlug: slug,
      entityId: id,
    });
  } else if (existing && existing.slug !== slug) {
    await recordLocalizedSlugRedirect({
      locale: "en",
      kind: "category",
      oldSlug: existing.slug,
      newSlug: slug,
      entityId: id,
    });
  }

  const values = {
    id,
    slug,
    name: input.name,
    shortIntroduction: input.shortIntroduction,
    longContent: input.longContent,
    featuredImageSrc: input.featuredImageSrc,
    featuredImageAlt: input.featuredImageAlt,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    ogImageSrc: input.ogImageSrc ?? null,
    indexable: input.indexable,
    featured: input.featured,
    sortOrder: input.sortOrder,
    publishedSlug: slug,
    updatedAt: now(),
  };

  if (existing) {
    await db.update(categories).set(values).where(eq(categories.id, id));
  } else {
    await db.insert(categories).values(values);
  }

  await upsertCategoryTranslation(id, "en", {
    status: "published",
    name: input.name,
    slug,
    shortIntroduction: input.shortIntroduction,
    longContent: input.longContent,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    imageAlt: input.featuredImageAlt,
    indexable: input.indexable,
  });
  if (input.translations?.af?.name && input.translations.af.slug) {
    await upsertCategoryTranslation(id, "af", input.translations.af);
  }
  return { id };
}

async function upsertCategoryTranslation(
  categoryId: string,
  locale: AppLocale,
  input: CategoryTranslationInput,
) {
  const db = getDb();
  const slug = toSeoSlug(input.slug || input.name);
  const [existing] = await db
    .select()
    .from(categoryTranslations)
    .where(and(eq(categoryTranslations.categoryId, categoryId), eq(categoryTranslations.locale, locale)))
    .limit(1);
  if (existing?.publishedSlug && existing.publishedSlug !== slug && existing.status === "published") {
    await recordLocalizedSlugRedirect({
      locale,
      kind: "category",
      oldSlug: existing.publishedSlug,
      newSlug: slug,
      entityId: categoryId,
    });
  }
  const values = {
    categoryId,
    locale,
    status: input.status,
    name: input.name,
    slug,
    shortIntroduction: input.shortIntroduction,
    longContent: input.longContent,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    imageAlt: input.imageAlt ?? null,
    indexable: input.indexable && input.status === "published",
    publishedSlug: input.status === "published" ? slug : existing?.publishedSlug ?? null,
    updatedAt: now(),
  };
  if (existing) {
    await db
      .update(categoryTranslations)
      .set(values)
      .where(and(eq(categoryTranslations.categoryId, categoryId), eq(categoryTranslations.locale, locale)));
  } else {
    await db.insert(categoryTranslations).values({ ...values, createdAt: now() });
  }
}

export async function saveBundle(input: {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  status: EntityStatus;
  shortDescription: string;
  description: string;
  price?: string;
  availability: AvailabilityStatus;
  featured: boolean;
  indexable: boolean;
  seoTitle?: string;
  seoDescription?: string;
  primaryImageSrc: string;
  primaryImageAlt: string;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  translations?: {
    af?: BundleTranslationInput;
  };
}) {
  const db = getDb();
  const slug = toSeoSlug(input.slug);
  const id = input.id || newId("bundle", slug);
  const [existing] = await db.select().from(bundles).where(eq(bundles.id, id)).limit(1);
  if (existing && existing.slug !== slug && (existing.status === "active" || existing.publishedSlug)) {
    await recordLocalizedSlugRedirect({
      locale: "en",
      kind: "bundle",
      oldSlug: existing.publishedSlug ?? existing.slug,
      newSlug: slug,
      entityId: id,
    });
  }

  const quality = hasMinimumIndexableContent({
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    categoryId: "bundle",
    imageSrc: input.primaryImageSrc,
    imageAlt: input.primaryImageAlt,
  });
  const indexable = input.indexable && input.status === "active" && quality && input.items.length > 0;

  const values = {
    id,
    sku: input.sku,
    slug,
    name: input.name,
    status: input.status,
    shortDescription: input.shortDescription,
    description: input.description,
    priceAmount: numericOrNull(input.price),
    featured: input.featured,
    availability: input.availability,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    indexable,
    publishedSlug: input.status === "active" ? slug : existing?.publishedSlug ?? null,
    updatedAt: now(),
  };

  if (existing) {
    await db.update(bundles).set(values).where(eq(bundles.id, id));
  } else {
    await db.insert(bundles).values(values);
  }

  await db.delete(bundleItems).where(eq(bundleItems.bundleId, id));
  if (input.items.length) {
    await db.insert(bundleItems).values(
      input.items.map((item, index) => ({
        id: `${id}_item_${item.productId}_${index}`,
        bundleId: id,
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        sortOrder: index,
      })),
    );
  }

  await db.delete(bundleImages).where(eq(bundleImages.bundleId, id));
  await db.insert(bundleImages).values({
    id: `${id}_img_primary`,
    bundleId: id,
    src: input.primaryImageSrc,
    alt: input.primaryImageAlt,
    width: 1200,
    height: 1200,
    displayOrder: 0,
    isPrimary: true,
    originalAssetRef: input.primaryImageSrc,
  });

  await upsertBundleTranslation(id, "en", {
    status: input.status === "active" ? "published" : "draft",
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    imageAlt: input.primaryImageAlt,
    indexable,
  });
  if (input.translations?.af?.name && input.translations.af.slug) {
    await upsertBundleTranslation(id, "af", input.translations.af);
  }

  return { id, indexable };
}

async function upsertBundleTranslation(
  bundleId: string,
  locale: AppLocale,
  input: BundleTranslationInput,
) {
  const db = getDb();
  const slug = toSeoSlug(input.slug || input.name);
  const [existing] = await db
    .select()
    .from(bundleTranslations)
    .where(and(eq(bundleTranslations.bundleId, bundleId), eq(bundleTranslations.locale, locale)))
    .limit(1);
  if (existing?.publishedSlug && existing.publishedSlug !== slug && existing.status === "published") {
    await recordLocalizedSlugRedirect({
      locale,
      kind: "bundle",
      oldSlug: existing.publishedSlug,
      newSlug: slug,
      entityId: bundleId,
    });
  }
  const values = {
    bundleId,
    locale,
    status: input.status,
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    imageAlt: input.imageAlt ?? null,
    indexable: input.indexable && input.status === "published",
    publishedSlug: input.status === "published" ? slug : existing?.publishedSlug ?? null,
    updatedAt: now(),
  };
  if (existing) {
    await db
      .update(bundleTranslations)
      .set(values)
      .where(and(eq(bundleTranslations.bundleId, bundleId), eq(bundleTranslations.locale, locale)));
  } else {
    await db.insert(bundleTranslations).values({ ...values, createdAt: now() });
  }
}

export async function saveMediaAsset(input: {
  originalFilename: string;
  originalAssetRef?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  mimeType?: string;
}) {
  const db = getDb();
  const id = newId("media", toSeoSlug(input.originalFilename.replace(/\.[^.]+$/, "")) + `_${Date.now()}`);
  await db.insert(mediaAssets).values({
    id,
    originalFilename: input.originalFilename,
    originalAssetRef: input.originalAssetRef ?? null,
    src: input.src,
    alt: input.alt,
    width: input.width,
    height: input.height,
    mimeType: input.mimeType ?? null,
  });
  return id;
}

export async function listMediaAssets() {
  const db = getDb();
  return db.select().from(mediaAssets);
}
