import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { paths } from "@/lib/routes";
import { buildMetadata, fallbackSeoDescription } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  const categories = await catalog.listCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const catalog = await getCatalog();
  const category = await catalog.getCategoryBySlug(slug);
  if (!category) notFound();

  return buildMetadata({
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? fallbackSeoDescription(category.name, "category"),
    path: paths.category(category.slug),
    indexable: category.indexable,
    ogImage: category.image.src,
  });
}

export default async function CategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const catalog = await getCatalog();
  const category = await catalog.getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    catalog.listProducts({ categoryId: category.id }),
    catalog.listCategories(),
  ]);
  const relatedCategories = categories.filter((item) => item.id !== category.id);
  const breadcrumbItems = [
    { name: "Home", path: paths.home },
    { name: "Shop", path: paths.shop },
    { name: category.name, path: paths.category(category.slug) },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          category.name,
          products.map((product) => ({
            name: product.name,
            path: paths.product(product.slug),
          })),
        )}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={category.name === "Vegetables" ? "Fresh Vegetables" : `Fresh ${category.name}`}
        description={category.shortDescription}
      />

      <section>
        <h2 className="text-section-title">Shop {category.name.toLowerCase()}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl">
        <h2 className="text-section-title">About this range</h2>
        <p className="mt-4 text-muted">{category.description}</p>
      </section>

      {relatedCategories.length ? (
        <section>
          <h2 className="text-section-title">Related categories</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {relatedCategories.map((item) => (
              <li key={item.id}>
                <Link href={paths.category(item.slug)} className="btn-secondary">
                  Shop {item.name.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
