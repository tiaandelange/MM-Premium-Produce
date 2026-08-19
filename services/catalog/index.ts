import { getCatalog as getDbCatalog } from "@/services/catalog/db-catalog";
import { fileCatalog } from "@/services/catalog/file-catalog";
import type { AppLocale } from "@/lib/i18n/config";
import type { CatalogService } from "@/services/catalog/types";

export type { CatalogService, ProductListOptions } from "@/services/catalog/types";

function wrapWithFileFallback(database: CatalogService): CatalogService {
  const wrap = <Args extends unknown[], Result>(
    query: (...args: Args) => Promise<Result>,
    fallback: (...args: Args) => Promise<Result>,
  ) => {
    return async (...args: Args): Promise<Result> => {
      try {
        return await query(...args);
      } catch (error) {
        console.error("Catalogue database request failed; using the file catalogue.", error);
        return fallback(...args);
      }
    };
  };

  return {
    listProducts: wrap(database.listProducts.bind(database), fileCatalog.listProducts.bind(fileCatalog)),
    getProductById: wrap(database.getProductById.bind(database), fileCatalog.getProductById.bind(fileCatalog)),
    getProductBySlug: wrap(database.getProductBySlug.bind(database), fileCatalog.getProductBySlug.bind(fileCatalog)),
    listCategories: wrap(database.listCategories.bind(database), fileCatalog.listCategories.bind(fileCatalog)),
    getCategoryById: wrap(database.getCategoryById.bind(database), fileCatalog.getCategoryById.bind(fileCatalog)),
    getCategoryBySlug: wrap(database.getCategoryBySlug.bind(database), fileCatalog.getCategoryBySlug.bind(fileCatalog)),
    listCollections: wrap(database.listCollections.bind(database), fileCatalog.listCollections.bind(fileCatalog)),
    getCollectionBySlug: wrap(
      database.getCollectionBySlug.bind(database),
      fileCatalog.getCollectionBySlug.bind(fileCatalog),
    ),
    listBundles: wrap(database.listBundles.bind(database), fileCatalog.listBundles.bind(fileCatalog)),
    getBundleById: wrap(database.getBundleById.bind(database), fileCatalog.getBundleById.bind(fileCatalog)),
    getBundleBySlug: wrap(database.getBundleBySlug.bind(database), fileCatalog.getBundleBySlug.bind(fileCatalog)),
    listBundlesContainingProduct: wrap(
      database.listBundlesContainingProduct.bind(database),
      fileCatalog.listBundlesContainingProduct.bind(fileCatalog),
    ),
    listRelatedProducts: wrap(
      database.listRelatedProducts.bind(database),
      fileCatalog.listRelatedProducts.bind(fileCatalog),
    ),
  };
}

export async function getCatalog(locale: AppLocale = "en"): Promise<CatalogService> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn("DATABASE_URL is not set; using the file catalogue.");
    return fileCatalog;
  }

  return wrapWithFileFallback(await getDbCatalog(locale));
}
