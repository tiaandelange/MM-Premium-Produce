import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { guideSeeds } from "../data/editorial/guides";
import { recipeSeeds } from "../data/editorial/recipes";
import {
  articleCategories,
  articleProducts,
  articleTranslations,
  articles,
  recipeProducts,
  recipeTranslations,
  recipes,
} from "../db/schema";

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is required");
  const db = drizzle(neon(url), {
    schema: {
      articles,
      articleTranslations,
      articleProducts,
      articleCategories,
      recipes,
      recipeTranslations,
      recipeProducts,
    },
  });

  for (const article of guideSeeds) {
    await db
      .insert(articles)
      .values({
        id: article.id,
        kind: article.kind,
        status: article.status,
        imageSrc: article.imageSrc,
        imageAlt: article.translations.find((row) => row.locale === "en")?.imageAlt,
        imageWidth: article.imageWidth,
        imageHeight: article.imageHeight,
      })
      .onConflictDoUpdate({
        target: articles.id,
        set: {
          kind: article.kind,
          status: article.status,
          imageSrc: article.imageSrc,
          imageAlt: article.translations.find((row) => row.locale === "en")?.imageAlt,
          imageWidth: article.imageWidth,
          imageHeight: article.imageHeight,
          updatedAt: new Date(),
        },
      });

    for (const translation of article.translations) {
      await db
        .insert(articleTranslations)
        .values({
          articleId: article.id,
          locale: translation.locale,
          status: translation.status,
          slug: translation.slug,
          title: translation.title,
          lede: translation.lede,
          bodyJson: JSON.stringify(translation.sections),
          seoTitle: translation.seoTitle,
          seoDescription: translation.seoDescription,
          imageAlt: translation.imageAlt,
          indexable: translation.indexable,
          publishedSlug: translation.status === "published" ? translation.slug : null,
        })
        .onConflictDoUpdate({
          target: [articleTranslations.articleId, articleTranslations.locale],
          set: {
            status: translation.status,
            slug: translation.slug,
            title: translation.title,
            lede: translation.lede,
            bodyJson: JSON.stringify(translation.sections),
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            imageAlt: translation.imageAlt,
            indexable: translation.indexable,
            publishedSlug: translation.status === "published" ? translation.slug : null,
            updatedAt: new Date(),
          },
        });
    }

    await db.delete(articleProducts).where(eq(articleProducts.articleId, article.id));
    if (article.productIds.length) {
      await db.insert(articleProducts).values(
        article.productIds.map((productId) => ({ articleId: article.id, productId })),
      );
    }
    await db.delete(articleCategories).where(eq(articleCategories.articleId, article.id));
    if (article.categoryIds.length) {
      await db.insert(articleCategories).values(
        article.categoryIds.map((categoryId) => ({ articleId: article.id, categoryId })),
      );
    }
  }

  for (const recipe of recipeSeeds) {
    await db
      .insert(recipes)
      .values({
        id: recipe.id,
        status: recipe.status,
        imageSrc: recipe.imageSrc,
        imageAlt: recipe.translations.find((row) => row.locale === "en")?.imageAlt,
        imageWidth: recipe.imageWidth,
        imageHeight: recipe.imageHeight,
      })
      .onConflictDoUpdate({
        target: recipes.id,
        set: {
          status: recipe.status,
          imageSrc: recipe.imageSrc,
          imageAlt: recipe.translations.find((row) => row.locale === "en")?.imageAlt,
          imageWidth: recipe.imageWidth,
          imageHeight: recipe.imageHeight,
          updatedAt: new Date(),
        },
      });

    for (const translation of recipe.translations) {
      await db
        .insert(recipeTranslations)
        .values({
          recipeId: recipe.id,
          locale: translation.locale,
          status: translation.status,
          slug: translation.slug,
          title: translation.title,
          lede: translation.lede,
          ingredientsJson: JSON.stringify(translation.ingredients),
          stepsJson: JSON.stringify(translation.steps),
          seoTitle: translation.seoTitle,
          seoDescription: translation.seoDescription,
          imageAlt: translation.imageAlt,
          indexable: translation.indexable,
          publishedSlug: translation.status === "published" ? translation.slug : null,
        })
        .onConflictDoUpdate({
          target: [recipeTranslations.recipeId, recipeTranslations.locale],
          set: {
            status: translation.status,
            slug: translation.slug,
            title: translation.title,
            lede: translation.lede,
            ingredientsJson: JSON.stringify(translation.ingredients),
            stepsJson: JSON.stringify(translation.steps),
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            imageAlt: translation.imageAlt,
            indexable: translation.indexable,
            publishedSlug: translation.status === "published" ? translation.slug : null,
            updatedAt: new Date(),
          },
        });
    }

    await db.delete(recipeProducts).where(eq(recipeProducts.recipeId, recipe.id));
    if (recipe.productIds.length) {
      await db.insert(recipeProducts).values(
        recipe.productIds.map((productId) => ({ recipeId: recipe.id, productId })),
      );
    }
  }

  console.log(
    `Seeded ${guideSeeds.length} guides and ${recipeSeeds.length} recipes (EN + AF translations).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
