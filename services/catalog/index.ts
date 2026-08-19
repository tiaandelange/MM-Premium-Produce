import { createFileCatalog } from "@/services/catalog/file-catalog";
import { getCatalog as getDbCatalog } from "@/services/catalog/db-catalog";
import type { AppLocale } from "@/lib/i18n/config";
import type { CatalogService } from "@/services/catalog/types";

export type { CatalogService, ProductListOptions } from "@/services/catalog/types";

function wrapWithFileFallback(database: CatalogService, locale: AppLocale): CatalogService {
  const fallback = createFileCatalog(locale);
  const wrap = <Args extends unknown[], Result>(
    query: (...args: Args) => Promise<Result>,
    fallbackQuery: (...args: Args) => Promise<Result>,
  ) => {
    return async (...args: Args): Promise<Result> => {
      try {
        return await query(...args);
      } catch (error) {
        console.error("Catalogue database request failed; using the file catalogue.", error);
        return fallbackQuery(...args);
      }
    };
  };

  return {
    listProducts: wrap(database.listProducts.bind(database), fallback.listProducts.bind(fallback)),
    getProductById: wrap(database.getProductById.bind(database), fallback.getProductById.bind(fallback)),
    getProductBySlug: wrap(database.getProductBySlug.bind(database), fallback.getProductBySlug.bind(fallback)),
    listCategories: wrap(database.listCategories.bind(database), fallback.listCategories.bind(fallback)),
    getCategoryById: wrap(database.getCategoryById.bind(database), fallback.getCategoryById.bind(fallback)),
    getCategoryBySlug: wrap(database.getCategoryBySlug.bind(database), fallback.getCategoryBySlug.bind(fallback)),
    listCollections: wrap(database.listCollections.bind(database), fallback.listCollections.bind(fallback)),
    getCollectionBySlug: wrap(
      database.getCollectionBySlug.bind(database),
      fallback.getCollectionBySlug.bind(fallback),
    ),
    listBundles: wrap(database.listBundles.bind(database), fallback.listBundles.bind(fallback)),
    getBundleById: wrap(database.getBundleById.bind(database), fallback.getBundleById.bind(fallback)),
    getBundleBySlug: wrap(database.getBundleBySlug.bind(database), fallback.getBundleBySlug.bind(fallback)),
    listBundlesContainingProduct: wrap(
      database.listBundlesContainingProduct.bind(database),
      fallback.listBundlesContainingProduct.bind(fallback),
    ),
    listRelatedProducts: wrap(
      database.listRelatedProducts.bind(database),
      fallback.listRelatedProducts.bind(fallback),
    ),
  };
}

export async function getCatalog(locale: AppLocale = "en"): Promise<CatalogService> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn("DATABASE_URL is not set; using the file catalogue.");
    return createFileCatalog(locale);
  }

  return wrapWithFileFallback(await getDbCatalog(locale), locale);
}
