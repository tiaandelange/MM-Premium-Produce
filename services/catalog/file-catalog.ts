import { bundles as bundleRecords } from "@/data/bundles";
import { categories as categoryRecords } from "@/data/categories";
import { collections as collectionRecords } from "@/data/collections";
import { afProductCopy } from "@/data/i18n/af-products";
import { products as productRecords } from "@/data/products";
import { categorySeo, p1ProductSeo } from "@/data/seo/phase4b-p1";
import type { AppLocale } from "@/lib/i18n/config";
import type { CatalogService, ProductListOptions } from "@/services/catalog/types";
import type { Category, Product } from "@/types/catalog";

type P1LocaleCopy = {
  seoTitle: string;
  seoDescription: string;
  storage: string;
  selection: string;
  typicalUses: string;
};

function p1For(productId: string, locale: AppLocale): P1LocaleCopy | undefined {
  const entry = p1ProductSeo[productId as keyof typeof p1ProductSeo];
  return entry?.[locale];
}

function localizeProduct(product: Product, locale: AppLocale): Product {
  const af = locale === "af" ? afProductCopy[product.id] : undefined;
  const p1 = p1For(product.id, locale);
  const guidance = p1
    ? {
        storage: p1.storage,
        selection: p1.selection,
        typicalUses: p1.typicalUses,
      }
    : product.guidance;

  const enSlug = product.slug;
  const afSlug = afProductCopy[product.id]?.slug ?? product.slug;
  const alternates = [
    { locale: "en" as const, slug: enSlug, status: "published" as const },
    { locale: "af" as const, slug: afSlug, status: "published" as const },
  ];

  return {
    ...product,
    locale,
    translationStatus: "published",
    alternates,
    name: af?.name ?? product.name,
    slug: af?.slug ?? product.slug,
    shortDescription: af?.shortDescription ?? product.shortDescription,
    description: af?.description ?? product.description,
    seoTitle: p1?.seoTitle ?? af?.seoTitle ?? product.seoTitle,
    seoDescription: p1?.seoDescription ?? af?.seoDescription ?? product.seoDescription,
    guidance,
    primaryImage: {
      ...product.primaryImage,
      alt: af ? `${af.name} van M & M Premium Produce` : product.primaryImage.alt,
    },
    images: product.images.map((image) => ({
      ...image,
      alt: af ? `${af.name} van M & M Premium Produce` : image.alt,
    })),
  };
}

function localizeCategory(category: Category, locale: AppLocale): Category {
  const key = category.id === "cat_fruit" ? "fruit" : category.id === "cat_vegetables" ? "vegetables" : null;
  if (!key) return { ...category, locale };
  const copy = categorySeo[key][locale];
  const slug =
    category.alternates.find((item) => item.locale === locale && item.status === "published")?.slug ?? category.slug;
  return {
    ...category,
    locale,
    translationStatus: "published",
    slug,
    name: locale === "af" ? (key === "fruit" ? "Vrugte" : "Groente") : category.name,
    shortDescription: copy.shortIntroduction,
    description: copy.longContent,
    seoTitle: copy.seoTitle,
    seoDescription: copy.seoDescription,
    image: { ...category.image, alt: copy.imageAlt },
  };
}

function isPublicProduct(product: Product, includeInactive = false): boolean {
  if (includeInactive) return true;
  return product.status === "active";
}

export function createFileCatalog(locale: AppLocale): CatalogService {
  const products = productRecords.map((product) => localizeProduct(product, locale));
  const categories = categoryRecords.map((category) => localizeCategory(category, locale));

  return {
    async listProducts(options: ProductListOptions = {}) {
      return products.filter((product) => {
        if (!isPublicProduct(product, options.includeInactive)) return false;
        if (options.categoryId && product.categoryId !== options.categoryId) return false;
        if (options.collectionId && !product.collectionIds.includes(options.collectionId)) {
          return false;
        }
        if (options.featured !== undefined && product.featured !== options.featured) return false;
        return true;
      });
    },

    async getProductById(id) {
      return products.find((product) => product.id === id) ?? null;
    },

    async getProductBySlug(slug) {
      return products.find((product) => product.slug === slug) ?? null;
    },

    async listCategories() {
      return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    },

    async getCategoryById(id) {
      return categories.find((category) => category.id === id) ?? null;
    },

    async getCategoryBySlug(slug) {
      return categories.find((category) => category.slug === slug) ?? null;
    },

    async listCollections(options = {}) {
      if (options.includeNonIndexable) return collectionRecords;
      return collectionRecords.filter((collection) => collection.indexable);
    },

    async getCollectionBySlug(slug) {
      return collectionRecords.find((collection) => collection.slug === slug) ?? null;
    },

    async listBundles() {
      return bundleRecords;
    },

    async getBundleById(id) {
      return bundleRecords.find((bundle) => bundle.id === id) ?? null;
    },

    async getBundleBySlug(slug) {
      return bundleRecords.find((bundle) => bundle.slug === slug) ?? null;
    },

    async listBundlesContainingProduct(productId) {
      return bundleRecords.filter((bundle) =>
        bundle.items.some((item) => item.productId === productId),
      );
    },

    async listRelatedProducts(product, limit = 3) {
      return products
        .filter(
          (candidate) =>
            candidate.id !== product.id &&
            candidate.status === "active" &&
            candidate.categoryId === product.categoryId,
        )
        .sort((a, b) => Number(b.availability === "in_stock") - Number(a.availability === "in_stock"))
        .slice(0, limit);
    },
  };
}

export const fileCatalog = createFileCatalog("en");
