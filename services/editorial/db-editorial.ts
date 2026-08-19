import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  articleCategories,
  articleProducts,
  articleTranslations,
  articles,
  recipeProducts,
  recipeTranslations,
  recipes,
} from "@/db/schema";
import type { AppLocale } from "@/lib/i18n/config";
import type { EditorialService } from "@/services/editorial/file-editorial";
import type { ArticleSection, PublicArticle, PublicRecipe, RecipeIngredient } from "@/types/content";
import type { LocaleAlternate, TranslationStatus } from "@/types/catalog";

function parseSections(raw: string): ArticleSection[] {
  try {
    const value = JSON.parse(raw) as ArticleSection[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function parseIngredients(raw: string): RecipeIngredient[] {
  try {
    const value = JSON.parse(raw) as RecipeIngredient[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function parseSteps(raw: string): string[] {
  try {
    const value = JSON.parse(raw) as string[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function isVisible(status: TranslationStatus, includeUnpublished: boolean) {
  return includeUnpublished || status === "published";
}

export function createDbEditorial(locale: AppLocale): EditorialService {
  async function loadGuide(articleId: string, includeUnpublished: boolean): Promise<PublicArticle | null> {
    const db = getDb();
    const [article] = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
    if (!article) return null;
    if (!includeUnpublished && article.status !== "active") return null;

    const translations = await db
      .select()
      .from(articleTranslations)
      .where(eq(articleTranslations.articleId, articleId));
    const translation = translations.find((row) => row.locale === locale);
    if (!translation || !isVisible(translation.status, includeUnpublished)) return null;

    const [productRows, categoryRows] = await Promise.all([
      db.select().from(articleProducts).where(eq(articleProducts.articleId, articleId)),
      db.select().from(articleCategories).where(eq(articleCategories.articleId, articleId)),
    ]);

    return {
      id: article.id,
      kind: "guide",
      slug: translation.slug,
      title: translation.title,
      lede: translation.lede,
      sections: parseSections(translation.bodyJson),
      seoTitle: translation.seoTitle ?? translation.title,
      seoDescription: translation.seoDescription ?? translation.lede,
      image: {
        src: article.imageSrc ?? "/images/categories/vegetables.webp",
        alt: translation.imageAlt ?? translation.title,
        width: article.imageWidth ?? 1600,
        height: article.imageHeight ?? 1067,
      },
      indexable: translation.indexable && translation.status === "published" && article.status === "active",
      locale,
      status: article.status,
      translationStatus: translation.status,
      alternates: translations.map((row) => ({
        locale: row.locale,
        slug: row.slug,
        status: row.status,
      })) as LocaleAlternate[],
      localeIndexable: Object.fromEntries(
        translations.map((row) => [
          row.locale,
          row.indexable && row.status === "published" && article.status === "active",
        ]),
      ),
      productIds: productRows.map((row) => row.productId),
      categoryIds: categoryRows.map((row) => row.categoryId),
      updatedAt: translation.updatedAt?.toISOString(),
    };
  }

  async function loadRecipe(recipeId: string, includeUnpublished: boolean): Promise<PublicRecipe | null> {
    const db = getDb();
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, recipeId)).limit(1);
    if (!recipe) return null;
    if (!includeUnpublished && recipe.status !== "active") return null;

    const translations = await db
      .select()
      .from(recipeTranslations)
      .where(eq(recipeTranslations.recipeId, recipeId));
    const translation = translations.find((row) => row.locale === locale);
    if (!translation || !isVisible(translation.status, includeUnpublished)) return null;

    const productRows = await db.select().from(recipeProducts).where(eq(recipeProducts.recipeId, recipeId));

    return {
      id: recipe.id,
      slug: translation.slug,
      title: translation.title,
      lede: translation.lede,
      ingredients: parseIngredients(translation.ingredientsJson),
      steps: parseSteps(translation.stepsJson),
      seoTitle: translation.seoTitle ?? translation.title,
      seoDescription: translation.seoDescription ?? translation.lede,
      image: {
        src: recipe.imageSrc ?? "/images/categories/vegetables.webp",
        alt: translation.imageAlt ?? translation.title,
        width: recipe.imageWidth ?? 1600,
        height: recipe.imageHeight ?? 1067,
      },
      indexable: translation.indexable && translation.status === "published" && recipe.status === "active",
      locale,
      status: recipe.status,
      translationStatus: translation.status,
      alternates: translations.map((row) => ({
        locale: row.locale,
        slug: row.slug,
        status: row.status,
      })) as LocaleAlternate[],
      localeIndexable: Object.fromEntries(
        translations.map((row) => [
          row.locale,
          row.indexable && row.status === "published" && recipe.status === "active",
        ]),
      ),
      productIds: productRows.map((row) => row.productId),
      updatedAt: translation.updatedAt?.toISOString(),
    };
  }

  return {
    async listGuides(includeUnpublished = false) {
      const db = getDb();
      const rows = await db.select().from(articles);
      const items = await Promise.all(rows.map((row) => loadGuide(row.id, includeUnpublished)));
      return items.filter((item): item is PublicArticle => Boolean(item));
    },
    async getGuideBySlug(slug, includeUnpublished = false) {
      const db = getDb();
      const [row] = await db
        .select()
        .from(articleTranslations)
        .where(and(eq(articleTranslations.locale, locale), eq(articleTranslations.slug, slug)))
        .limit(1);
      if (!row) return null;
      return loadGuide(row.articleId, includeUnpublished);
    },
    async getGuideByAnySlug(slug) {
      const db = getDb();
      const [row] = await db.select().from(articleTranslations).where(eq(articleTranslations.slug, slug)).limit(1);
      if (!row) return null;
      return loadGuide(row.articleId, true);
    },
    async listGuidesForProduct(productId) {
      const db = getDb();
      const links = await db.select().from(articleProducts).where(eq(articleProducts.productId, productId));
      const items = await Promise.all(links.map((link) => loadGuide(link.articleId, false)));
      return items.filter((item): item is PublicArticle => Boolean(item));
    },
    async listGuidesForCategory(categoryId) {
      const db = getDb();
      const links = await db.select().from(articleCategories).where(eq(articleCategories.categoryId, categoryId));
      const items = await Promise.all(links.map((link) => loadGuide(link.articleId, false)));
      return items.filter((item): item is PublicArticle => Boolean(item));
    },
    async listRecipes(includeUnpublished = false) {
      const db = getDb();
      const rows = await db.select().from(recipes);
      const items = await Promise.all(rows.map((row) => loadRecipe(row.id, includeUnpublished)));
      return items.filter((item): item is PublicRecipe => Boolean(item));
    },
    async getRecipeBySlug(slug, includeUnpublished = false) {
      const db = getDb();
      const [row] = await db
        .select()
        .from(recipeTranslations)
        .where(and(eq(recipeTranslations.locale, locale), eq(recipeTranslations.slug, slug)))
        .limit(1);
      if (!row) return null;
      return loadRecipe(row.recipeId, includeUnpublished);
    },
    async getRecipeByAnySlug(slug) {
      const db = getDb();
      const [row] = await db.select().from(recipeTranslations).where(eq(recipeTranslations.slug, slug)).limit(1);
      if (!row) return null;
      return loadRecipe(row.recipeId, true);
    },
    async listRecipesForProduct(productId) {
      const db = getDb();
      const links = await db.select().from(recipeProducts).where(eq(recipeProducts.productId, productId));
      const items = await Promise.all(links.map((link) => loadRecipe(link.recipeId, false)));
      return items.filter((item): item is PublicRecipe => Boolean(item));
    },
  };
}
