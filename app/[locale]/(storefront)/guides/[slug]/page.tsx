import { CatalogMedia } from "@/components/commerce/catalog-media";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { redirectIfTranslatedSlugExists } from "@/lib/i18n/entity-redirect";
import { editorialLocalePaths } from "@/lib/seo/editorial-alternates";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildArticleStructuredData, buildBreadcrumbStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const editorial = await getEditorial(locale);
  const guide = await editorial.getGuideBySlug(slug);
  if (!guide) {
    await redirectIfTranslatedSlugExists(locale, "guide", slug);
    notFound();
  }
  const alts = editorialLocalePaths("guide", guide.alternates, guide.localeIndexable);
  return buildMetadata({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: createPaths(locale).guide(guide.slug),
    locale,
    enPath: alts.enPath,
    afPath: alts.afPath,
    indexable: guide.indexable,
    ogImage: guide.image.src,
    ogType: "article",
  });
}

export default async function GuidePage({
  params,
}: PageProps<"/[locale]/guides/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const editorial = await getEditorial(locale);
  const guide = await editorial.getGuideBySlug(slug);
  if (!guide) {
    await redirectIfTranslatedSlugExists(locale, "guide", slug);
    notFound();
  }
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const catalog = await getCatalog(locale);
  const [products, categories, relatedGuides, allRecipes] = await Promise.all([
    Promise.all(guide.productIds.map((id) => catalog.getProductById(id))),
    Promise.all(guide.categoryIds.map((id) => catalog.getCategoryById(id))),
    editorial.listGuides(),
    editorial.listRecipes(),
  ]);
  const relatedProducts = products.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedCategories = categories.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const otherGuides = relatedGuides.filter((item) => item.id !== guide.id).slice(0, 4);
  const relatedRecipes = allRecipes.filter((recipe) =>
    recipe.productIds.some((id) => guide.productIds.includes(id)),
  );
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.guides, path: paths.guides },
    { name: guide.title, path: paths.guide(guide.slug) },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildArticleStructuredData(guide)} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={guide.title} description={guide.lede} />
      <figure className="max-w-3xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-line bg-sand">
          <CatalogMedia image={guide.image} sizes="(min-width: 768px) 48rem, 100vw" />
        </div>
        <figcaption className="mt-2 text-sm text-muted">{messages.imageCaptionShop}</figcaption>
      </figure>
      {guide.sections.map((section) => (
        <section key={section.heading} className="max-w-3xl space-y-3 text-muted">
          <h2 className="text-section-title text-ink">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </section>
      ))}
      {relatedProducts.length ? (
        <section>
          <h2 className="text-section-title">{messages.shopThisGuide}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
      {relatedCategories.length ? (
        <p className="max-w-3xl">
          {messages.relatedCategories}:{" "}
          {relatedCategories.map((category, index) => (
            <span key={category.id}>
              {index ? " · " : null}
              <Link href={paths.category(category.slug)}>{category.name}</Link>
            </span>
          ))}
        </p>
      ) : null}
      {relatedRecipes.length ? (
        <section className="max-w-3xl">
          <h2 className="text-section-title">{messages.relatedRecipes}</h2>
          <ul className="mt-4 space-y-2">
            {relatedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <Link href={paths.recipe(recipe.slug)}>{recipe.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {otherGuides.length ? (
        <section className="max-w-3xl">
          <h2 className="text-section-title">{messages.moreGuides}</h2>
          <ul className="mt-4 space-y-2">
            {otherGuides.map((item) => (
              <li key={item.id}>
                <Link href={paths.guide(item.slug)}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
