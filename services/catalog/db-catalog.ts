import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  bundleImages,
  bundleItems,
  bundleTranslations,
  bundles,
  categories,
  categoryTranslations,
  collectionProducts,
  collectionTranslations,
  collections,
  inventory,
  productImages,
  productTranslations,
  productVariants,
  products,
} from "@/db/schema";
import type { AppLocale } from "@/lib/i18n/config";
import { mapBundle, mapCategory, mapCollection, mapProduct, mapVariant } from "@/services/catalog/mappers";
import type { CatalogService, ProductListOptions } from "@/services/catalog/types";
import { availabilityFromStock, availableQuantity } from "@/lib/commerce/availability";
import type { LocaleAlternate, Product, TranslationStatus } from "@/types/catalog";

type TranslationRow = typeof productTranslations.$inferSelect;

function isPublished(status: TranslationStatus, includeInactive: boolean) {
  return includeInactive || status === "published";
}

function alternatesFrom(
  rows: Array<{ locale: AppLocale; slug: string; status: TranslationStatus }>,
): LocaleAlternate[] {
  return rows.map((row) => ({ locale: row.locale, slug: row.slug, status: row.status }));
}

function overlayProduct(row: typeof products.$inferSelect, translation: TranslationRow) {
  return {
    ...row,
    slug: translation.slug,
    name: translation.name,
    shortDescription: translation.shortDescription,
    description: translation.description,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    canonicalOverride: translation.canonicalOverride,
    ogTitle: translation.ogTitle,
    ogDescription: translation.ogDescription,
    indexable: translation.indexable && translation.status === "published",
    storageGuidance: translation.storageGuidance ?? row.storageGuidance,
    selectionGuidance: translation.selectionGuidance ?? row.selectionGuidance,
    typicalUses: translation.typicalUses ?? row.typicalUses,
  };
}

export function createDbCatalog(locale: AppLocale): CatalogService {
  async function assembleProducts(
    rows: (typeof products.$inferSelect)[],
    translations: TranslationRow[],
    allTranslations: TranslationRow[],
    includeInactive = false,
  ): Promise<Product[]> {
    if (!rows.length) return [];
    const db = getDb();
    const [images, variants, memberships, stockRows] = await Promise.all([
      db.select().from(productImages),
      db.select().from(productVariants).orderBy(asc(productVariants.sortOrder)),
      db.select().from(collectionProducts),
      db.select().from(inventory),
    ]);

    return rows.flatMap((product) => {
      const translation =
        translations.find((row) => row.productId === product.id) ??
        (locale === "en"
          ? ({
              productId: product.id,
              locale: "en",
              status: product.status === "active" ? "published" : "draft",
              name: product.name,
              slug: product.slug,
              shortDescription: product.shortDescription,
              description: product.description,
              storageGuidance: product.storageGuidance,
              selectionGuidance: product.selectionGuidance,
              typicalUses: product.typicalUses,
              seoTitle: product.seoTitle,
              seoDescription: product.seoDescription,
              canonicalOverride: product.canonicalOverride,
              ogTitle: product.ogTitle,
              ogDescription: product.ogDescription,
              imageAlt: null,
              indexable: product.indexable,
              publishedSlug: product.publishedSlug,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            } satisfies TranslationRow)
          : undefined);
      if (!translation || !isPublished(translation.status, includeInactive)) return [];
      const productImagesForRow = images
        .filter((image) => image.productId === product.id)
        .map((image) =>
          translation.imageAlt
            ? { ...image, alt: translation.imageAlt }
            : image,
        );
      const productVariantsForRow = variants
        .filter((variant) => variant.productId === product.id)
        .map((variant) => {
          const mapped = mapVariant(variant);
          const variantStock = stockRows.find(
            (row) => row.ownerType === "variant" && row.variantId === variant.id,
          );
          const available = variantStock
            ? availableQuantity(variantStock.quantity, variantStock.reserved)
            : null;
          return {
            ...mapped,
            stockQuantity: available,
            availability: availabilityFromStock(mapped.availability, available),
          };
        });
      const collectionIds = memberships
        .filter((membership) => membership.productId === product.id)
        .map((membership) => membership.collectionId);
      const stock = stockRows.find(
        (row) => row.ownerType === "product" && row.productId === product.id,
      );
      const available = stock ? availableQuantity(stock.quantity, stock.reserved) : null;
      const mapped = mapProduct({
        product: overlayProduct(product, translation),
        images: productImagesForRow,
        variants: productVariantsForRow,
        collectionIds,
        stockQuantity: available,
      });
      mapped.availability = availabilityFromStock(mapped.availability, available);
      mapped.stockQuantity = available;
      return [
        {
          ...mapped,
          locale,
          translationStatus: translation.status,
          alternates: alternatesFrom(
            allTranslations.filter((row) => row.productId === product.id),
          ),
        },
      ];
    });
  }

  return {
    async listProducts(options: ProductListOptions = {}) {
      const db = getDb();
      const [rows, translations, allTranslations] = await Promise.all([
        db.select().from(products).orderBy(asc(products.name)),
        db.select().from(productTranslations).where(eq(productTranslations.locale, locale)),
        db.select().from(productTranslations),
      ]);
      const mapped = await assembleProducts(rows, translations, allTranslations, options.includeInactive);
      return mapped.filter((product) => {
        if (!options.includeInactive && product.status !== "active") return false;
        if (options.categoryId && product.categoryId !== options.categoryId) return false;
        if (options.collectionId && !product.collectionIds.includes(options.collectionId)) {
          return false;
        }
        if (options.featured !== undefined && product.featured !== options.featured) return false;
        return true;
      });
    },

    async getProductById(id) {
      const db = getDb();
      const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!row) return null;
      const [translations, allTranslations] = await Promise.all([
        db.select().from(productTranslations).where(and(eq(productTranslations.productId, id), eq(productTranslations.locale, locale))),
        db.select().from(productTranslations).where(eq(productTranslations.productId, id)),
      ]);
      const [product] = await assembleProducts([row], translations, allTranslations, true);
      return product ?? null;
    },

    async getProductBySlug(slug) {
      const db = getDb();
      const [translation] = await db
        .select()
        .from(productTranslations)
        .where(and(eq(productTranslations.locale, locale), eq(productTranslations.slug, slug)))
        .limit(1);
      if (translation) {
        if (translation.status !== "published") return null;
        const [row] = await db.select().from(products).where(eq(products.id, translation.productId)).limit(1);
        if (!row || row.status !== "active") return null;
        const allTranslations = await db
          .select()
          .from(productTranslations)
          .where(eq(productTranslations.productId, row.id));
        const [product] = await assembleProducts([row], [translation], allTranslations);
        return product ?? null;
      }
      if (locale !== "en") return null;
      const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
      if (!row || row.status !== "active") return null;
      const allTranslations = await db
        .select()
        .from(productTranslations)
        .where(eq(productTranslations.productId, row.id));
      const [product] = await assembleProducts([row], [], allTranslations);
      return product ?? null;
    },

    async listCategories() {
      const db = getDb();
      const [rows, translations, allTranslations] = await Promise.all([
        db.select().from(categories).orderBy(asc(categories.sortOrder)),
        db.select().from(categoryTranslations).where(eq(categoryTranslations.locale, locale)),
        db.select().from(categoryTranslations),
      ]);
      return rows.flatMap((row) => {
        const translation = translations.find((item) => item.categoryId === row.id) ??
          (locale === "en"
            ? {
                categoryId: row.id,
                locale: "en" as const,
                status: "published" as const,
                name: row.name,
                slug: row.slug,
                shortIntroduction: row.shortIntroduction,
                longContent: row.longContent,
                seoTitle: row.seoTitle,
                seoDescription: row.seoDescription,
                canonicalOverride: row.canonicalOverride,
                ogTitle: row.ogTitle,
                ogDescription: row.ogDescription,
                imageAlt: null,
                indexable: row.indexable,
                publishedSlug: row.publishedSlug,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
              }
            : undefined);
        if (!translation || translation.status !== "published") return [];
        return [
          {
            ...mapCategory({
              ...row,
              slug: translation.slug,
              name: translation.name,
              shortIntroduction: translation.shortIntroduction,
              longContent: translation.longContent,
              featuredImageAlt: translation.imageAlt || row.featuredImageAlt,
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              canonicalOverride: translation.canonicalOverride,
              ogTitle: translation.ogTitle,
              ogDescription: translation.ogDescription,
              indexable: translation.indexable && translation.status === "published",
            }),
            locale,
            translationStatus: translation.status,
            alternates: alternatesFrom(
              allTranslations.filter((item) => item.categoryId === row.id),
            ),
          },
        ];
      });
    },

    async getCategoryById(id) {
      const categoriesForLocale = await this.listCategories();
      return categoriesForLocale.find((category) => category.id === id) ?? null;
    },

    async getCategoryBySlug(slug) {
      const categoriesForLocale = await this.listCategories();
      return categoriesForLocale.find((category) => category.slug === slug) ?? null;
    },

    async listCollections(options = {}) {
      const db = getDb();
      const [rows, translations, memberships] = await Promise.all([
        db.select().from(collections),
        db.select().from(collectionTranslations).where(eq(collectionTranslations.locale, locale)),
        db.select().from(collectionProducts),
      ]);
      const mapped = rows.flatMap((row) => {
        const translation = translations.find((item) => item.collectionId === row.id) ??
          (locale === "en"
            ? {
                collectionId: row.id,
                locale: "en" as const,
                status: "published" as const,
                name: row.name,
                slug: row.slug,
                description: row.description,
                seoTitle: row.seoTitle,
                seoDescription: row.seoDescription,
                imageAlt: row.imageAlt,
                indexable: row.indexable,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
              }
            : undefined);
        if (!translation || (translation.status !== "published" && !options.includeNonIndexable)) {
          return [];
        }
        return [
          {
            ...mapCollection(
              {
                ...row,
                slug: translation.slug,
                name: translation.name,
                description: translation.description,
                imageAlt: translation.imageAlt || row.imageAlt,
                seoTitle: translation.seoTitle,
                seoDescription: translation.seoDescription,
                indexable: translation.indexable && translation.status === "published",
              },
              memberships
                .filter((membership) => membership.collectionId === row.id)
                .map((membership) => membership.productId),
            ),
            locale,
            translationStatus: translation.status,
          },
        ];
      });
      if (options.includeNonIndexable) return mapped;
      return mapped.filter((collection) => collection.indexable);
    },

    async getCollectionBySlug(slug) {
      const collectionsForLocale = await this.listCollections({ includeNonIndexable: true });
      return collectionsForLocale.find((collection) => collection.slug === slug) ?? null;
    },

    async listBundles(options = {}) {
      const db = getDb();
      const [rows, translations, allTranslations] = await Promise.all([
        db.select().from(bundles).orderBy(asc(bundles.name)),
        db.select().from(bundleTranslations).where(eq(bundleTranslations.locale, locale)),
        db.select().from(bundleTranslations),
      ]);
      const assembled = await assembleBundles(rows, translations, allTranslations, locale, options.includeInactive);
      return assembled;
    },

    async getBundleById(id) {
      const db = getDb();
      const [row] = await db.select().from(bundles).where(eq(bundles.id, id)).limit(1);
      if (!row) return null;
      const [translations, allTranslations] = await Promise.all([
        db.select().from(bundleTranslations).where(and(eq(bundleTranslations.bundleId, id), eq(bundleTranslations.locale, locale))),
        db.select().from(bundleTranslations).where(eq(bundleTranslations.bundleId, id)),
      ]);
      const [bundle] = await assembleBundles([row], translations, allTranslations, locale, true);
      return bundle ?? null;
    },

    async getBundleBySlug(slug) {
      const db = getDb();
      const [translation] = await db
        .select()
        .from(bundleTranslations)
        .where(and(eq(bundleTranslations.locale, locale), eq(bundleTranslations.slug, slug)))
        .limit(1);
      if (!translation || translation.status !== "published") return null;
      const [row] = await db.select().from(bundles).where(eq(bundles.id, translation.bundleId)).limit(1);
      if (!row || row.status !== "active") return null;
      const allTranslations = await db
        .select()
        .from(bundleTranslations)
        .where(eq(bundleTranslations.bundleId, row.id));
      const [bundle] = await assembleBundles([row], [translation], allTranslations, locale);
      return bundle ?? null;
    },

    async listBundlesContainingProduct(productId) {
      const db = getDb();
      const items = await db.select().from(bundleItems).where(eq(bundleItems.productId, productId));
      const bundleIds = [...new Set(items.map((item) => item.bundleId))];
      if (!bundleIds.length) return [];
      const listed = await this.listBundles();
      return listed.filter((bundle) => bundleIds.includes(bundle.id));
    },

    async listRelatedProducts(product, limit = 3) {
      const related = (await this.listProducts({ categoryId: product.categoryId })).filter(
        (item) => item.id !== product.id,
      );
      return related
        .sort((a, b) => Number(b.availability === "in_stock") - Number(a.availability === "in_stock"))
        .slice(0, limit);
    },
  };
}

async function assembleBundles(
  rows: (typeof bundles.$inferSelect)[],
  translations: (typeof bundleTranslations.$inferSelect)[],
  allTranslations: (typeof bundleTranslations.$inferSelect)[],
  locale: AppLocale,
  includeInactive = false,
) {
  if (!rows.length) return [];
  const db = getDb();
  const [items, images] = await Promise.all([
    db.select().from(bundleItems).orderBy(asc(bundleItems.sortOrder)),
    db.select().from(bundleImages),
  ]);

  return rows.flatMap((bundle) => {
    const translation =
      translations.find((row) => row.bundleId === bundle.id) ??
      (locale === "en"
        ? {
            bundleId: bundle.id,
            locale: "en" as const,
            status: (bundle.status === "active" ? "published" : "draft") as TranslationStatus,
            name: bundle.name,
            slug: bundle.slug,
            shortDescription: bundle.shortDescription,
            description: bundle.description,
            seoTitle: bundle.seoTitle,
            seoDescription: bundle.seoDescription,
            canonicalOverride: bundle.canonicalOverride,
            ogTitle: bundle.ogTitle,
            ogDescription: bundle.ogDescription,
            imageAlt: null,
            indexable: bundle.indexable,
            publishedSlug: bundle.publishedSlug,
            createdAt: bundle.createdAt,
            updatedAt: bundle.updatedAt,
          }
        : undefined);
    if (!translation || !isPublished(translation.status, includeInactive)) return [];
    if (!includeInactive && bundle.status !== "active") return [];
    const mapped = mapBundle({
      bundle: {
        ...bundle,
        slug: translation.slug,
        name: translation.name,
        shortDescription: translation.shortDescription,
        description: translation.description,
        seoTitle: translation.seoTitle,
        seoDescription: translation.seoDescription,
        canonicalOverride: translation.canonicalOverride,
        ogTitle: translation.ogTitle,
        ogDescription: translation.ogDescription,
        indexable: translation.indexable && translation.status === "published",
      },
      items: items.filter((item) => item.bundleId === bundle.id),
      images: images
        .filter((image) => image.bundleId === bundle.id)
        .map((image) => (translation.imageAlt ? { ...image, alt: translation.imageAlt } : image)),
    });
    return [
      {
        ...mapped,
        locale,
        translationStatus: translation.status,
        alternates: alternatesFrom(allTranslations.filter((row) => row.bundleId === bundle.id)),
      },
    ];
  });
}

export async function getCatalog(locale: AppLocale = "en"): Promise<CatalogService> {
  return createDbCatalog(locale);
}
