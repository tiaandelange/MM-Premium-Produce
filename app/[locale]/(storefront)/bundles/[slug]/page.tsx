import { AvailabilityDisplay } from "@/components/commerce/availability-display";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductCard } from "@/components/commerce/product-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getRequestPathname } from "@/lib/i18n/request";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { followStoredRedirect } from "@/lib/seo/redirects";
import { redirectIfTranslatedSlugExists } from "@/lib/i18n/entity-redirect";
import { buildBreadcrumbStructuredData, buildBundleStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import type { Product } from "@/types/catalog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function followRedirect(): Promise<never> {
  return followStoredRedirect(await getRequestPathname());
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/bundles/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const bundle = await catalog.getBundleBySlug(slug);
  if (!bundle || bundle.status !== "active") {
    await redirectIfTranslatedSlugExists(locale, "bundle", slug);
    notFound();
  }
  const enSlug = bundle.alternates.find((item) => item.locale === "en" && item.status === "published")?.slug;
  const afSlug = bundle.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
  const paths = createPaths(locale);
  return buildMetadata({
    title: bundle.seoTitle ?? bundle.name,
    description: bundle.seoDescription ?? fallbackSeoDescription(bundle.name, "bundle", locale),
    path: paths.bundle(bundle.slug),
    locale,
    enPath: enSlug ? createPaths("en").bundle(enSlug) : undefined,
    afPath: afSlug ? createPaths("af").bundle(afSlug) : undefined,
    indexable: bundle.indexable,
    ogImage: bundle.ogImage?.src ?? bundle.primaryImage.src,
    ogTitle: bundle.ogTitle,
    ogDescription: bundle.ogDescription,
    canonicalPath: bundle.canonicalOverride,
  });
}

export default async function BundlePage({
  params,
}: PageProps<"/[locale]/bundles/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const bundle = await catalog.getBundleBySlug(slug);
  if (!bundle || bundle.status !== "active") {
    await redirectIfTranslatedSlugExists(locale, "bundle", slug);
    await followRedirect();
  }
  if (!bundle) notFound();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const components = (
    await Promise.all(bundle.items.map((item) => catalog.getProductById(item.productId)))
  ).filter((product): product is Product => product !== null && product.translationStatus === "published");
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.produceBoxes, path: paths.bundles },
    { name: bundle.name, path: paths.bundle(bundle.slug) },
  ];

  return (
    <div className="site-container space-y-12 py-12">
      <JsonLd
        data={buildBundleStructuredData(
          bundle,
          components.map((product) => product.name),
          components.map((product) => buildCanonicalUrl(paths.product(product.slug))),
        )}
      />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <article className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-sand">
          <CatalogMedia image={bundle.primaryImage} priority sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
        <div className="space-y-5">
          <header>
            <h1 className="text-page-title">{bundle.name}</h1>
            <p className="mt-3 text-lg text-muted">{bundle.shortDescription}</p>
          </header>
          <PriceDisplay price={bundle.price} compareAtPrice={bundle.compareAtPrice} locale={locale} />
          <AvailabilityDisplay status={bundle.availability} locale={locale} />
          <p>
            <span className="btn-disabled" aria-disabled="true">
              {messages.addToCart}
            </span>
          </p>
        </div>
      </article>
      <section className="max-w-3xl">
        <h2 className="text-section-title">{bundle.name}</h2>
        <p className="mt-4 text-muted">{bundle.description}</p>
      </section>
      <section>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
