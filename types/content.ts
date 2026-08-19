import type { AppLocale } from "@/lib/i18n/config";
import type { CatalogImage, LocaleAlternate } from "@/types/catalog";

export type ContentStatus = "draft" | "published";

export type ArticleSection = {
  heading: string;
  body: string[];
};

export type ArticleKind = "guide";

export type PublicArticle = {
  id: string;
  kind: ArticleKind;
  slug: string;
  title: string;
  lede: string;
  sections: ArticleSection[];
  seoTitle: string;
  seoDescription: string;
  image: CatalogImage;
  indexable: boolean;
  locale: AppLocale;
  status: "active" | "draft" | "archived";
  translationStatus: "draft" | "ready" | "published";
  alternates: LocaleAlternate[];
  localeIndexable: Partial<Record<AppLocale, boolean>>;
  productIds: string[];
  categoryIds: string[];
  updatedAt?: string;
};

export type RecipeIngredient = {
  name: string;
  quantity?: string;
};

export type PublicRecipe = {
  id: string;
  slug: string;
  title: string;
  lede: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  seoTitle: string;
  seoDescription: string;
  image: CatalogImage;
  indexable: boolean;
  locale: AppLocale;
  status: "active" | "draft" | "archived";
  translationStatus: "draft" | "ready" | "published";
  alternates: LocaleAlternate[];
  localeIndexable: Partial<Record<AppLocale, boolean>>;
  productIds: string[];
  updatedAt?: string;
};

export type ArticleTranslationSeed = {
  locale: AppLocale;
  status: "draft" | "ready" | "published";
  slug: string;
  title: string;
  lede: string;
  sections: ArticleSection[];
  seoTitle: string;
  seoDescription: string;
  imageAlt: string;
  indexable: boolean;
};

export type ArticleSeed = {
  id: string;
  kind: ArticleKind;
  status: "draft" | "active" | "archived";
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  productIds: string[];
  categoryIds: string[];
  translations: ArticleTranslationSeed[];
};

export type RecipeTranslationSeed = {
  locale: AppLocale;
  status: "draft" | "ready" | "published";
  slug: string;
  title: string;
  lede: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  seoTitle: string;
  seoDescription: string;
  imageAlt: string;
  indexable: boolean;
};

export type RecipeSeed = {
  id: string;
  status: "draft" | "active" | "archived";
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  productIds: string[];
  translations: RecipeTranslationSeed[];
};
