import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { categories, categoryTranslations, productTranslations, products } from "@/db/schema";
import { categorySeo, p1ProductSeo } from "@/data/seo/phase4b-p1";
import { afProductCopy } from "@/data/i18n/af-products";

type CatalogProduct = {
  id: string;
  seoTitle?: string;
  seoDescription?: string;
  guidance?: { storage?: string; selection?: string; typicalUses?: string };
  [key: string]: unknown;
};

async function patchCatalogJson() {
  const filePath = path.join(process.cwd(), "data", "catalog-products.json");
  const productsJson = JSON.parse(await readFile(filePath, "utf8")) as CatalogProduct[];
  for (const product of productsJson) {
    const seo = p1ProductSeo[product.id as keyof typeof p1ProductSeo];
    if (!seo) continue;
    product.seoTitle = seo.en.seoTitle;
    product.seoDescription = seo.en.seoDescription;
    product.guidance = {
      storage: seo.en.storage,
      selection: seo.en.selection,
      typicalUses: seo.en.typicalUses,
    };
  }
  await writeFile(filePath, `${JSON.stringify(productsJson, null, 2)}\n`);
}

async function applyDatabase() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn("DATABASE_URL is not set; skipped database SEO updates.");
    return;
  }

  const db = getDb();
  const now = new Date();

  for (const [productId, copy] of Object.entries(p1ProductSeo)) {
    await db
      .update(products)
      .set({
        seoTitle: copy.en.seoTitle,
        seoDescription: copy.en.seoDescription,
        storageGuidance: copy.en.storage,
        selectionGuidance: copy.en.selection,
        typicalUses: copy.en.typicalUses,
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    await db
      .update(productTranslations)
      .set({
        seoTitle: copy.en.seoTitle,
        seoDescription: copy.en.seoDescription,
        storageGuidance: copy.en.storage,
        selectionGuidance: copy.en.selection,
        typicalUses: copy.en.typicalUses,
        updatedAt: now,
      })
      .where(and(eq(productTranslations.productId, productId), eq(productTranslations.locale, "en")));

    const af = afProductCopy[productId];
    await db
      .update(productTranslations)
      .set({
        seoTitle: copy.af.seoTitle,
        seoDescription: copy.af.seoDescription,
        storageGuidance: copy.af.storage,
        selectionGuidance: copy.af.selection,
        typicalUses: copy.af.typicalUses,
        updatedAt: now,
        ...(af
          ? {
              name: af.name,
              slug: af.slug,
              publishedSlug: af.slug,
              shortDescription: af.shortDescription,
              description: af.description,
            }
          : {}),
      })
      .where(and(eq(productTranslations.productId, productId), eq(productTranslations.locale, "af")));
  }

  await db
    .update(categories)
    .set({
      shortIntroduction: categorySeo.vegetables.en.shortIntroduction,
      longContent: categorySeo.vegetables.en.longContent,
      seoTitle: categorySeo.vegetables.en.seoTitle,
      seoDescription: categorySeo.vegetables.en.seoDescription,
      featuredImageAlt: categorySeo.vegetables.en.imageAlt,
      updatedAt: now,
    })
    .where(eq(categories.id, "cat_vegetables"));

  await db
    .update(categories)
    .set({
      shortIntroduction: categorySeo.fruit.en.shortIntroduction,
      longContent: categorySeo.fruit.en.longContent,
      seoTitle: categorySeo.fruit.en.seoTitle,
      seoDescription: categorySeo.fruit.en.seoDescription,
      featuredImageAlt: categorySeo.fruit.en.imageAlt,
      updatedAt: now,
    })
    .where(eq(categories.id, "cat_fruit"));

  for (const locale of ["en", "af"] as const) {
    await db
      .update(categoryTranslations)
      .set({
        shortIntroduction: categorySeo.vegetables[locale].shortIntroduction,
        longContent: categorySeo.vegetables[locale].longContent,
        seoTitle: categorySeo.vegetables[locale].seoTitle,
        seoDescription: categorySeo.vegetables[locale].seoDescription,
        imageAlt: categorySeo.vegetables[locale].imageAlt,
        updatedAt: now,
      })
      .where(and(eq(categoryTranslations.categoryId, "cat_vegetables"), eq(categoryTranslations.locale, locale)));

    await db
      .update(categoryTranslations)
      .set({
        shortIntroduction: categorySeo.fruit[locale].shortIntroduction,
        longContent: categorySeo.fruit[locale].longContent,
        seoTitle: categorySeo.fruit[locale].seoTitle,
        seoDescription: categorySeo.fruit[locale].seoDescription,
        imageAlt: categorySeo.fruit[locale].imageAlt,
        updatedAt: now,
      })
      .where(and(eq(categoryTranslations.categoryId, "cat_fruit"), eq(categoryTranslations.locale, locale)));
  }

  console.log("Updated P1 product and category SEO in the database.");
}

async function main() {
  await patchCatalogJson();
  console.log("Patched data/catalog-products.json for P1 products.");
  await applyDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
