import { CatalogMedia } from "@/components/commerce/catalog-media";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages, interpolate } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { followStoredRedirect } from "@/lib/seo/redirects";
import { redirectIfTranslatedSlugExists } from "@/lib/i18n/entity-redirect";
import { getRequestPathname } from "@/lib/i18n/request";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";
import { TrackItemList } from "@/components/analytics/track-event";
import { analyticsItemFromProduct } from "@/lib/analytics/items";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function followRedirect(): Promise<never> {
  return followStoredRedirect(await getRequestPathname());
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop/[category]">) {
  const { locale: localeParam, category: slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const category = await catalog.getCategoryBySlug(slug);
  if (!category) {
    await redirectIfTranslatedSlugExists(locale, "category", slug);
    notFound();
  }
  const enSlug = category.alternates.find((item) => item.locale === "en" && item.status === "published")?.slug;
  const afSlug = category.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
  const paths = createPaths(locale);
  return buildMetadata({
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? fallbackSeoDescription(category.name, "category", locale),
    path: paths.category(category.slug),
    locale,
    enPath: enSlug ? createPaths("en").category(enSlug) : undefined,
    afPath: afSlug ? createPaths("af").category(afSlug) : undefined,
    indexable: category.indexable,
    ogImage: category.ogImage?.src ?? category.image.src,
    ogTitle: category.ogTitle,
    ogDescription: category.ogDescription,
    canonicalPath: category.canonicalOverride,
  });
}

export default async function CategoryPage({
  params,
}: PageProps<"/[locale]/shop/[category]">) {
  const { locale: localeParam, category: slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const category = await catalog.getCategoryBySlug(slug);
  if (!category) {
    await redirectIfTranslatedSlugExists(locale, "category", slug);
    await followRedirect();
  }
  if (!category) notFound();

  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const [products, categories, relatedGuides] = await Promise.all([
    catalog.listProducts({ categoryId: category.id }),
    catalog.listCategories(),
    (await getEditorial(locale)).listGuidesForCategory(category.id),
  ]);
  const relatedCategories = categories.filter((item) => item.id !== category.id);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.shop, path: paths.shop },
    { name: category.name, path: paths.category(category.slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          category.name,
          products.map((product) => ({ name: product.name, path: paths.product(product.slug) })),
        )}
      />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={category.seoTitle ?? category.name} description={category.shortDescription} />
        <div className="relative mt-2 aspect-[21/9] max-h-80 overflow-hidden rounded-card border border-line bg-sand">
          <CatalogMedia image={category.image} priority sizes="100vw" />
        </div>
      </PageIntro>
      <PageSection muted>
        <h2 className="text-section-title">
          {interpolate(messages.shopCategory, { name: category.name.toLowerCase() })}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} listId={category.id} listName={category.name} />
          ))}
        </div>
        <TrackItemList
          listId={category.id}
          listName={category.name}
          items={products.map((product) => analyticsItemFromProduct(product))}
        />
      </PageSection>
      <PageSection>
        <div className="max-w-3xl">
          <h2 className="text-section-title">{messages.aboutThisRange}</h2>
          <p className="mt-4 text-muted">{category.description}</p>
          <p className="mt-4">
            <Link href={paths.shop}>{messages.openFullShop}</Link>
            {" · "}
            <Link href={paths.guides}>{messages.guides}</Link>
            {" · "}
            <Link href={paths.delivery}>{messages.delivery}</Link>
          </p>
          {relatedGuides.length ? (
            <p className="mt-4 text-muted">
              {messages.relatedGuides}:{" "}
              {relatedGuides.map((guide, index) => (
                <span key={guide.id}>
                  {index ? " · " : null}
                  <Link href={paths.guide(guide.slug)}>{guide.title}</Link>
                </span>
              ))}
            </p>
          ) : null}
        </div>
        {relatedCategories.length ? (
          <section className="mt-10">
            <h2 className="text-section-title">{messages.relatedCategories}</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {relatedCategories.map((item) => (
                <li key={item.id}>
                  <Link href={paths.category(item.slug)} className="btn-secondary">
                    {interpolate(messages.shopCategory, { name: item.name.toLowerCase() })}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </PageSection>
    </>
  );
}
