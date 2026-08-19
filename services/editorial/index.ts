import type { AppLocale } from "@/lib/i18n/config";
import { createDbEditorial } from "@/services/editorial/db-editorial";
import { createFileEditorial, type EditorialService } from "@/services/editorial/file-editorial";

export type { EditorialService } from "@/services/editorial/file-editorial";

export async function getEditorial(locale: AppLocale = "en"): Promise<EditorialService> {
  if (!process.env.DATABASE_URL?.trim()) {
    return createFileEditorial(locale);
  }

  const database = createDbEditorial(locale);
  const fallback = createFileEditorial(locale);

  return {
    async listGuides(includeUnpublished = false) {
      try {
        const rows = await database.listGuides(includeUnpublished);
        if (rows.length) return rows;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.listGuides(includeUnpublished);
    },
    async getGuideBySlug(slug, includeUnpublished = false) {
      try {
        const row = await database.getGuideBySlug(slug, includeUnpublished);
        if (row) return row;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.getGuideBySlug(slug, includeUnpublished);
    },
    async getGuideByAnySlug(slug) {
      try {
        const row = await database.getGuideByAnySlug(slug);
        if (row) return row;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.getGuideByAnySlug(slug);
    },
    async listGuidesForProduct(productId) {
      try {
        const rows = await database.listGuidesForProduct(productId);
        if (rows.length) return rows;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.listGuidesForProduct(productId);
    },
    async listGuidesForCategory(categoryId) {
      try {
        const rows = await database.listGuidesForCategory(categoryId);
        if (rows.length) return rows;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.listGuidesForCategory(categoryId);
    },
    async listRecipes(includeUnpublished = false) {
      try {
        const rows = await database.listRecipes(includeUnpublished);
        if (rows.length) return rows;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.listRecipes(includeUnpublished);
    },
    async getRecipeBySlug(slug, includeUnpublished = false) {
      try {
        const row = await database.getRecipeBySlug(slug, includeUnpublished);
        if (row) return row;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.getRecipeBySlug(slug, includeUnpublished);
    },
    async getRecipeByAnySlug(slug) {
      try {
        const row = await database.getRecipeByAnySlug(slug);
        if (row) return row;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.getRecipeByAnySlug(slug);
    },
    async listRecipesForProduct(productId) {
      try {
        const rows = await database.listRecipesForProduct(productId);
        if (rows.length) return rows;
      } catch (error) {
        console.error("Editorial database request failed; using file editorial.", error);
      }
      return fallback.listRecipesForProduct(productId);
    },
  };
}
