import { guideSeeds } from "@/data/editorial/guides";
import { recipeSeeds } from "@/data/editorial/recipes";
import type { AppLocale } from "@/lib/i18n/config";
import type {
  ArticleSeed,
  PublicArticle,
  PublicRecipe,
  RecipeSeed,
} from "@/types/content";
import type { LocaleAlternate } from "@/types/catalog";

function alternatesFrom(
  translations: Array<{ locale: AppLocale; slug: string; status: string }>,
): LocaleAlternate[] {
  return translations.map((row) => ({
    locale: row.locale,
    slug: row.slug,
    status: row.status as LocaleAlternate["status"],
  }));
}

function isPublicArticle(seed: ArticleSeed, locale: AppLocale, includeUnpublished: boolean) {
  const translation = seed.translations.find((row) => row.locale === locale);
  if (!translation) return false;
  if (includeUnpublished) return true;
  return seed.status === "active" && translation.status === "published";
}

function mapArticle(seed: ArticleSeed, locale: AppLocale): PublicArticle | null {
  const translation = seed.translations.find((row) => row.locale === locale);
  if (!translation) return null;
  return {
    id: seed.id,
    kind: seed.kind,
    slug: translation.slug,
    title: translation.title,
    lede: translation.lede,
    sections: translation.sections,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    image: {
      src: seed.imageSrc,
      alt: translation.imageAlt,
      width: seed.imageWidth,
      height: seed.imageHeight,
    },
    indexable: translation.indexable && translation.status === "published" && seed.status === "active",
    locale,
    status: seed.status,
    translationStatus: translation.status,
    alternates: alternatesFrom(seed.translations),
    localeIndexable: Object.fromEntries(
      seed.translations.map((row) => [
        row.locale,
        row.indexable && row.status === "published" && seed.status === "active",
      ]),
    ),
    productIds: seed.productIds,
    categoryIds: seed.categoryIds,
  };
}

function isPublicRecipe(seed: RecipeSeed, locale: AppLocale, includeUnpublished: boolean) {
  const translation = seed.translations.find((row) => row.locale === locale);
  if (!translation) return false;
  if (includeUnpublished) return true;
  return seed.status === "active" && translation.status === "published";
}

function mapRecipe(seed: RecipeSeed, locale: AppLocale): PublicRecipe | null {
  const translation = seed.translations.find((row) => row.locale === locale);
  if (!translation) return null;
  return {
    id: seed.id,
    slug: translation.slug,
    title: translation.title,
    lede: translation.lede,
    ingredients: translation.ingredients,
    steps: translation.steps,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    image: {
      src: seed.imageSrc,
      alt: translation.imageAlt,
      width: seed.imageWidth,
      height: seed.imageHeight,
    },
    indexable: translation.indexable && translation.status === "published" && seed.status === "active",
    locale,
    status: seed.status,
    translationStatus: translation.status,
    alternates: alternatesFrom(seed.translations),
    localeIndexable: Object.fromEntries(
      seed.translations.map((row) => [
        row.locale,
        row.indexable && row.status === "published" && seed.status === "active",
      ]),
    ),
    productIds: seed.productIds,
  };
}

export function createFileEditorial(locale: AppLocale) {
  return {
    async listGuides(includeUnpublished = false): Promise<PublicArticle[]> {
      return guideSeeds
        .filter((seed) => isPublicArticle(seed, locale, includeUnpublished))
        .map((seed) => mapArticle(seed, locale))
        .filter((item): item is PublicArticle => Boolean(item));
    },
    async getGuideBySlug(slug: string, includeUnpublished = false): Promise<PublicArticle | null> {
      const seed = guideSeeds.find((item) =>
        item.translations.some((row) => row.locale === locale && row.slug === slug),
      );
      if (!seed || !isPublicArticle(seed, locale, includeUnpublished)) return null;
      return mapArticle(seed, locale);
    },
    async getGuideByAnySlug(slug: string): Promise<PublicArticle | null> {
      const seed = guideSeeds.find((item) => item.translations.some((row) => row.slug === slug));
      if (!seed) return null;
      return mapArticle(seed, locale);
    },
    async listGuidesForProduct(productId: string): Promise<PublicArticle[]> {
      const list = await this.listGuides();
      return list.filter((item) => item.productIds.includes(productId));
    },
    async listGuidesForCategory(categoryId: string): Promise<PublicArticle[]> {
      const list = await this.listGuides();
      return list.filter((item) => item.categoryIds.includes(categoryId));
    },
    async listRecipes(includeUnpublished = false): Promise<PublicRecipe[]> {
      return recipeSeeds
        .filter((seed) => isPublicRecipe(seed, locale, includeUnpublished))
        .map((seed) => mapRecipe(seed, locale))
        .filter((item): item is PublicRecipe => Boolean(item));
    },
    async getRecipeBySlug(slug: string, includeUnpublished = false): Promise<PublicRecipe | null> {
      const seed = recipeSeeds.find((item) =>
        item.translations.some((row) => row.locale === locale && row.slug === slug),
      );
      if (!seed || !isPublicRecipe(seed, locale, includeUnpublished)) return null;
      return mapRecipe(seed, locale);
    },
    async getRecipeByAnySlug(slug: string): Promise<PublicRecipe | null> {
      const seed = recipeSeeds.find((item) => item.translations.some((row) => row.slug === slug));
      if (!seed) return null;
      return mapRecipe(seed, locale);
    },
    async listRecipesForProduct(productId: string): Promise<PublicRecipe[]> {
      const list = await this.listRecipes();
      return list.filter((item) => item.productIds.includes(productId));
    },
  };
}

export type EditorialService = ReturnType<typeof createFileEditorial>;
