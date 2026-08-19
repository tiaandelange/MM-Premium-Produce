import type { AppLocale } from "@/lib/i18n/config";
import type { Bundle, Category, Collection, Product } from "@/types/catalog";

export type ProductListOptions = {
  categoryId?: string;
  collectionId?: string;
  featured?: boolean;
  includeInactive?: boolean;
};

export type CatalogService = {
  listProducts(options?: ProductListOptions): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  listCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  listCollections(options?: { includeNonIndexable?: boolean }): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | null>;
  listBundles(options?: { includeInactive?: boolean }): Promise<Bundle[]>;
  getBundleById(id: string): Promise<Bundle | null>;
  getBundleBySlug(slug: string): Promise<Bundle | null>;
  listBundlesContainingProduct(productId: string): Promise<Bundle[]>;
  listRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
};

export type AdminTranslationCopy = {
  locale: AppLocale;
  status: "draft" | "ready" | "published";
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalOverride?: string | null;
  imageAlt?: string;
  indexable: boolean;
  storageGuidance?: string;
  selectionGuidance?: string;
  typicalUses?: string;
};
