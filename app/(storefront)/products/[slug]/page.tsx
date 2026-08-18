import { AvailabilityDisplay } from "@/components/commerce/availability-display";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { ProductOptions } from "@/components/commerce/product-options";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { paths } from "@/lib/routes";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildProductStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  const products = await catalog.listProducts({ includeInactive: true });
  return products
    .filter((product) => product.status === "active")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = await catalog.getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? fallbackSeoDescription(product.name, "product"),
    path: paths.product(product.slug),
    indexable: product.indexable,
    ogImage: product.primaryImage.src,
  });
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = await catalog.getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  const [category, related] = await Promise.all([
    catalog.getCategoryById(product.categoryId),
    catalog.listRelatedProducts(product, 3),
  ]);

  const breadcrumbItems = [
    { name: "Home", path: paths.home },
    { name: "Shop", path: paths.shop },
    ...(category
      ? [{ name: category.name, path: paths.category(category.slug) }]
      : []),
    { name: product.name, path: paths.product(product.slug) },
  ];

  return (
    <div className="site-container space-y-12 py-12">
      <JsonLd data={buildProductStructuredData(product)} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      <article className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="space-y-5">
          <header>
            <h1 className="text-page-title">{product.name}</h1>
            <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>
          </header>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          <AvailabilityDisplay status={product.availability} />
          {product.packSize || product.unit ? (
            <p className="text-sm text-muted">
              {product.packSize ? `Pack size: ${product.packSize}` : null}
              {product.packSize && product.unit ? " · " : null}
              {product.unit ? `Unit: ${product.unit}` : null}
            </p>
          ) : null}
          <ProductOptions product={product} />
          {category ? (
            <p>
              Category:{" "}
              <Link href={paths.category(category.slug)}>Shop {category.name.toLowerCase()}</Link>
            </p>
          ) : null}
          <p>
            <span className="btn-disabled" aria-disabled="true">
              Add to basket — coming in a later phase
            </span>
          </p>
        </div>
      </article>

      <section className="max-w-3xl">
        <h2 className="text-section-title">Product details</h2>
        <p className="mt-4 text-muted">{product.description}</p>
      </section>

      {related.length ? (
        <section>
          <h2 className="text-section-title">Related fresh produce</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-muted">
        Browse more in the <Link href={paths.shop}>fresh produce shop</Link>
        {category ? (
          <>
            {" "}
            or <Link href={paths.category(category.slug)}>{category.name.toLowerCase()}</Link>
          </>
        ) : null}
        .
      </p>
    </div>
  );
}
