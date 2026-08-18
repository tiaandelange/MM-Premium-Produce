import { cache } from "react";
import { bundles as bundleRecords } from "@/data/bundles";
import { categories as categoryRecords } from "@/data/categories";
import { collections as collectionRecords } from "@/data/collections";
import { products as productRecords } from "@/data/products";
import type { CatalogService, ProductListOptions } from "@/services/catalog/types";
import type { Product } from "@/types/catalog";

function isPublicProduct(product: Product, includeInactive = false): boolean {
  if (includeInactive) return true;
  return product.status === "active";
}

export const fileCatalog: CatalogService = {
  async listProducts(options: ProductListOptions = {}) {
    return productRecords.filter((product) => {
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
    return productRecords.find((product) => product.id === id) ?? null;
  },

  async getProductBySlug(slug) {
    return productRecords.find((product) => product.slug === slug) ?? null;
  },

  async listCategories() {
    return [...categoryRecords].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getCategoryById(id) {
    return categoryRecords.find((category) => category.id === id) ?? null;
  },

  async getCategoryBySlug(slug) {
    return categoryRecords.find((category) => category.slug === slug) ?? null;
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
    return productRecords
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

export const getCatalog = cache(async (): Promise<CatalogService> => fileCatalog);
