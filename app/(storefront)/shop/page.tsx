import { CategoryCard } from "@/components/commerce/category-card";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";

const breadcrumbItems = [
  { name: "Home", path: paths.home },
  { name: "Shop", path: paths.shop },
];

export const metadata = buildMetadata({
  title: "Fresh Produce Shop",
  description:
    "Shop fresh fruit and vegetables from M & M Premium Produce. Browse categories and open any product from a crawlable catalogue page.",
  path: paths.shop,
});

export default async function ShopPage() {
  const catalog = await getCatalog();
  const [categories, products] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts(),
  ]);

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          "Fresh produce products",
          products.map((product) => ({
            name: product.name,
            path: paths.product(product.slug),
          })),
        )}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Fresh Produce Shop"
        description="Browse fruit and vegetables from this catalogue page. Category links are the indexable way to filter the range."
      />

      <section>
        <h2 className="text-section-title">Shop by category</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-section-title">All products</h2>
          <Link href={paths.bundles} className="text-sm font-medium">
            View produce boxes
          </Link>
        </div>
        <p className="mt-2 max-w-3xl text-muted">
          Every product below is linked with a standard URL. Sorting and availability
          filters, when added, will stay on this same canonical shop page.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
