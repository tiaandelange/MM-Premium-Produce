import { AvailabilityDisplay } from "@/components/commerce/availability-display";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { ProductOptions } from "@/components/commerce/product-options";
import { AddToCartForm } from "@/components/commerce/add-to-cart-form";
import { CartNotice } from "@/components/commerce/cart-notice";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getRequestPathname } from "@/lib/i18n/request";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { followStoredRedirect } from "@/lib/seo/redirects";
import { packQuantityLabel, priceUnitLabel, resolvePriceUnit } from "@/lib/catalog/price-unit";
import { redirectIfTranslatedSlugExists } from "@/lib/i18n/entity-redirect";
import { buildBreadcrumbStructuredData, buildProductStructuredData } from "@/lib/seo/structured-data";
import { TrackViewItem } from "@/components/analytics/track-event";
import { analyticsItemFromProduct, analyticsValue } from "@/lib/analytics/items";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function followRedirect(): Promise<never> {
  return followStoredRedirect(await getRequestPathname());
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const product = await catalog.getProductBySlug(slug);
  if (!product || product.status !== "active") {
    await redirectIfTranslatedSlugExists(locale, "product", slug);
    notFound();
  }
  const enSlug = product.alternates.find((item) => item.locale === "en" && item.status === "published")?.slug;
  const afSlug = product.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
  const paths = createPaths(locale);
  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? fallbackSeoDescription(product.name, "product", locale),
    path: paths.product(product.slug),
    locale,
    enPath: enSlug ? createPaths("en").product(enSlug) : undefined,
    afPath: afSlug ? createPaths("af").product(afSlug) : undefined,
    indexable: product.indexable,
    ogImage: product.ogImage?.src ?? product.primaryImage.src,
    ogTitle: product.ogTitle,
    ogDescription: product.ogDescription,
    canonicalPath: product.canonicalOverride,
  });
}

export default async function ProductPage({
  params,
}: PageProps<"/[locale]/products/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const catalog = await getCatalog(locale);
  const product = await catalog.getProductBySlug(slug);
  if (!product || product.status !== "active") {
    await redirectIfTranslatedSlugExists(locale, "product", slug);
    await followRedirect();
  }
  if (!product) notFound();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const [category, related, guides, recipes] = await Promise.all([
    catalog.getCategoryById(product.categoryId),
    catalog.listRelatedProducts(product, 3),
    (await getEditorial(locale)).listGuidesForProduct(product.id),
    (await getEditorial(locale)).listRecipesForProduct(product.id),
  ]);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.shop, path: paths.shop },
    ...(category ? [{ name: category.name, path: paths.category(category.slug) }] : []),
    { name: product.name, path: paths.product(product.slug) },
  ];
  const sellingUnit = resolvePriceUnit({ unit: product.unit, packSize: product.packSize, productId: product.id });
  const packLabel = packQuantityLabel(product);
  const viewItem = analyticsItemFromProduct(product, product.variants?.[0]);

  return (
    <div className="site-container space-y-12 py-12">
      <JsonLd data={buildProductStructuredData(product)} />
      <TrackViewItem
        items={[viewItem]}
        value={analyticsValue([viewItem])}
        currency={product.price?.currency ?? "ZAR"}
      />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <article className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="space-y-5">
          <header>
            <h1 className="text-page-title">{product.name}</h1>
            <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>
          </header>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            locale={locale}
            unit={sellingUnit}
          />
          <AvailabilityDisplay status={product.availability} locale={locale} />
          <p className="text-sm text-muted">
            {packLabel ? `${messages.packSize}: ${packLabel} · ` : null}
            {messages.unit}: {priceUnitLabel(sellingUnit, locale)}
          </p>
          <ProductOptions product={product} />
          {category ? (
            <p>
              {messages.categoryLabel}:{" "}
              <Link href={paths.category(category.slug)}>
                {category.name}
              </Link>
              {" · "}
              <Link href={paths.shop}>{messages.shop}</Link>
              {" · "}
              <Link href={paths.delivery}>{messages.deliveryInformation}</Link>
            </p>
          ) : (
            <p>
              <Link href={paths.shop}>{messages.shop}</Link>
              {" · "}
              <Link href={paths.delivery}>{messages.deliveryInformation}</Link>
            </p>
          )}
          <CartNotice locale={locale} />
          <AddToCartForm product={product} />
        </div>
      </article>
      <section className="max-w-3xl">
        <h2 className="text-section-title">{messages.productDetails}</h2>
        <p className="mt-4 text-muted">{product.description}</p>
      </section>
      {product.guidance?.storage ||
      product.guidance?.selection ||
      product.guidance?.typicalUses ||
      product.guidance?.seasonality ||
      product.guidance?.origin ||
      guides.length ||
      recipes.length ? (
        <section className="max-w-3xl space-y-4">
          <h2 className="text-section-title">{messages.howToUse}</h2>
          {product.guidance?.origin ? (
            <p className="text-muted">
              <strong>{messages.origin}:</strong> {product.guidance.origin}
            </p>
          ) : null}
          {product.guidance?.seasonality ? (
            <p className="text-muted">
              <strong>{messages.seasonality}:</strong> {product.guidance.seasonality}
            </p>
          ) : null}
          {product.guidance?.selection ? (
            <p className="text-muted">
              <strong>{messages.selection}:</strong> {product.guidance.selection}
            </p>
          ) : null}
          {product.guidance?.storage ? (
            <p className="text-muted">
              <strong>{messages.storage}:</strong> {product.guidance.storage}
            </p>
          ) : null}
          {guides.length ? (
            <p className="text-muted">
              {messages.relatedGuides}:{" "}
              {guides.map((guide, index) => (
                <span key={guide.id}>
                  {index ? " · " : null}
                  <Link href={paths.guide(guide.slug)}>{guide.title}</Link>
                </span>
              ))}
            </p>
          ) : null}
          {recipes.length ? (
            <p className="text-muted">
              {messages.relatedRecipes}:{" "}
              {recipes.map((recipe, index) => (
                <span key={recipe.id}>
                  {index ? " · " : null}
                  <Link href={paths.recipe(recipe.slug)}>{recipe.title}</Link>
                </span>
              ))}
            </p>
          ) : null}
          {product.guidance?.typicalUses ? (
            <p className="text-muted">
              <strong>{messages.typicalUses}:</strong> {product.guidance.typicalUses}
            </p>
          ) : null}
        </section>
      ) : null}
      {related.length ? (
        <section>
          <h2 className="text-section-title">{messages.relatedProducts}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
