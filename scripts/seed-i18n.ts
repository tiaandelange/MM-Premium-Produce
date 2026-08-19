import { getDb } from "@/db/client";
import {
  bundleTranslations,
  bundles,
  categories,
  categoryTranslations,
  collectionTranslations,
  collections,
  productTranslations,
  products,
  redirects,
} from "@/db/schema";
import { afProductCopy } from "@/data/i18n/af-products";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();
  const productRows = await db.select().from(products);
  for (const product of productRows) {
    await db
      .insert(productTranslations)
      .values({
        productId: product.id,
        locale: "en",
        status: product.status === "active" ? "published" : "draft",
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        storageGuidance: product.storageGuidance,
        selectionGuidance: product.selectionGuidance,
        typicalUses: product.typicalUses,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        canonicalOverride: product.canonicalOverride,
        ogTitle: product.ogTitle,
        ogDescription: product.ogDescription,
        indexable: product.indexable,
        publishedSlug: product.publishedSlug ?? product.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    const af = afProductCopy[product.id];
    if (af) {
      await db
        .insert(productTranslations)
        .values({
          productId: product.id,
          locale: "af",
          status: "published",
          name: af.name,
          slug: af.slug,
          shortDescription: af.shortDescription,
          description: af.description,
          seoTitle: af.seoTitle ?? null,
          seoDescription: af.seoDescription ?? null,
          imageAlt: `${af.name} van M & M Premium Produce`,
          indexable: product.indexable,
          publishedSlug: af.slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }
  }

  const categoryRows = await db.select().from(categories);
  for (const category of categoryRows) {
    await db
      .insert(categoryTranslations)
      .values({
        categoryId: category.id,
        locale: "en",
        status: "published",
        name: category.name,
        slug: category.slug,
        shortIntroduction: category.shortIntroduction,
        longContent: category.longContent,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        imageAlt: category.featuredImageAlt,
        indexable: category.indexable,
        publishedSlug: category.publishedSlug ?? category.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  await db.insert(categoryTranslations).values([
    {
      categoryId: "cat_fruit",
      locale: "af",
      status: "published",
      name: "Vrugte",
      slug: "vrugte",
      shortIntroduction: "Daaglikse vrugte as afsonderlike produkte, van appels tot seisoenale sitrus en bessies.",
      longContent:
        "Elke vrug het sy eie blad vir pakgrootte, prys en of dit in voorraad is. Beskikbaarheid verander met die seisoen. Groente staan in die groentewinkel.",
      seoTitle: "Vars vrugte",
      seoDescription:
        "Koop vars vrugte by M & M Premium Produce. Appels het variëteite; ander vrugte verskyn wanneer dit in die katalogus is.",
      imageAlt: "Vars vrugte van M & M Premium Produce",
      indexable: true,
      publishedSlug: "vrugte",
    },
    {
      categoryId: "cat_vegetables",
      locale: "af",
      status: "published",
      name: "Groente",
      slug: "groente",
      shortIntroduction: "Blaargroente, wortelgewasse, uie en alledaagse kookgroente, elk as ’n eie produk.",
      longContent:
        "Hierdie reeks is vir weeklikse kookgroente — aartappels, wortels, uie, spinasie, slaai, komkommer en soortgelyke stapels. Maak enige item oop vir pakgrootte, prys en beskikbaarheid. Vrugte staan apart in die vrugtewinkel.",
      seoTitle: "Vars groente",
      seoDescription:
        "Koop vars groente by M & M Premium Produce: aartappels, wortels, spinasie, slaai, uie en alledaagse kookgroente. Elke item het sy eie blad met pakgrootte en prys.",
      imageAlt: "Vars groente van M & M Premium Produce",
      indexable: true,
      publishedSlug: "groente",
    },
  ]).onConflictDoNothing();

  const collectionRows = await db.select().from(collections);
  for (const collection of collectionRows) {
    await db
      .insert(collectionTranslations)
      .values({
        collectionId: collection.id,
        locale: "en",
        status: "published",
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        seoTitle: collection.seoTitle,
        seoDescription: collection.seoDescription,
        imageAlt: collection.imageAlt,
        indexable: collection.indexable,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  const bundleRows = await db.select().from(bundles);
  for (const bundle of bundleRows) {
    await db
      .insert(bundleTranslations)
      .values({
        bundleId: bundle.id,
        locale: "en",
        status: bundle.status === "active" ? "published" : "draft",
        name: bundle.name,
        slug: bundle.slug,
        shortDescription: bundle.shortDescription,
        description: bundle.description,
        seoTitle: bundle.seoTitle,
        seoDescription: bundle.seoDescription,
        indexable: bundle.indexable,
        publishedSlug: bundle.publishedSlug ?? bundle.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  const redirectRows = await db.select().from(redirects);
  for (const row of redirectRows) {
    const fromPath = row.fromPath.startsWith("/en/") || row.fromPath.startsWith("/af/")
      ? row.fromPath
      : `/en${row.fromPath}`;
    const toPath = row.toPath.startsWith("/en/") || row.toPath.startsWith("/af/")
      ? row.toPath
      : `/en${row.toPath}`;
    if (fromPath !== row.fromPath || toPath !== row.toPath) {
      await db.update(redirects).set({ fromPath, toPath, updatedAt: new Date() }).where(eq(redirects.id, row.id));
    }
  }

  console.log(`Seeded translations for ${productRows.length} products and ${categoryRows.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
