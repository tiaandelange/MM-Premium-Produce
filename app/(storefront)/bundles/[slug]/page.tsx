import { AvailabilityDisplay } from "@/components/commerce/availability-display";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductCard } from "@/components/commerce/product-card";
import { SampleNotice } from "@/components/commerce/sample-notice";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { paths } from "@/lib/routes";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildBundleStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import type { Product } from "@/types/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  const bundles = await catalog.listBundles();
  return bundles.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/bundles/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const bundle = await catalog.getBundleBySlug(slug);
  if (!bundle) notFound();

  return buildMetadata({
    title: bundle.seoTitle ?? bundle.name,
    description: bundle.seoDescription ?? fallbackSeoDescription(bundle.name, "bundle"),
    path: paths.bundle(bundle.slug),
    indexable: bundle.indexable,
    ogImage: bundle.primaryImage.src,
  });
}

export default async function BundlePage({
  params,
}: PageProps<"/bundles/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const bundle = await catalog.getBundleBySlug(slug);
  if (!bundle) notFound();

  const components = (
    await Promise.all(bundle.items.map((item) => catalog.getProductById(item.productId)))
  ).filter((product): product is Product => Boolean(product));

  const breadcrumbItems = [
    { name: "Home", path: paths.home },
    { name: "Produce boxes", path: paths.bundles },
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
          {bundle.isSample ? <SampleNotice entityLabel="produce box" /> : null}
          <PriceDisplay price={bundle.price} compareAtPrice={bundle.compareAtPrice} />
          <AvailabilityDisplay status={bundle.availability} />
          <p className="text-sm text-muted">SKU: {bundle.sku}</p>
          <p>
            <span className="btn-disabled" aria-disabled="true">
              Add box to basket — coming in a later phase
            </span>
          </p>
        </div>
      </article>

      <section className="max-w-3xl">
        <h2 className="text-section-title">About this box</h2>
        <p className="mt-4 text-muted">{bundle.description}</p>
      </section>

      <section>
        <h2 className="text-section-title">What is included</h2>
        <ul className="mt-4 space-y-2 text-muted">
          {bundle.items.map((item) => {
            const product = components.find((entry) => entry.id === item.productId);
            if (!product) return null;
            return (
              <li key={`${item.productId}-${item.quantity}`}>
                {item.quantity} ×{" "}
                <Link href={paths.product(product.slug)}>{product.name}</Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <p className="text-muted">
        Looking for a single category instead?{" "}
        <Link href={paths.category("vegetables")}>Shop fresh vegetables</Link> or{" "}
        <Link href={paths.category("fruit")}>shop fresh fruit</Link>.
      </p>
    </div>
  );
}
