import { CategoryCard } from "@/components/commerce/category-card";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].shop;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.shop,
    locale,
    enPath: createPaths("en").shop,
    afPath: createPaths("af").shop,
  });
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  const locale = requireLocale((await params).locale);
  const catalog = await getCatalog(locale);
  const messages = getMessages(locale);
  const copy = pageCopy[locale].shop;
  const paths = createPaths(locale);
  const [categories, products] = await Promise.all([catalog.listCategories(), catalog.listProducts()]);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.shop, path: paths.shop },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          copy.h1,
          products.map((product) => ({ name: product.name, path: paths.product(product.slug) })),
        )}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={copy.h1} description={copy.intro} />
      <section>
        <h2 className="text-section-title">{messages.shopByCategory}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-section-title">{messages.allProducts}</h2>
          <Link href={paths.bundles} className="text-sm font-medium">
            {messages.viewProduceBoxes}
          </Link>
        </div>
        <p className="mt-2 max-w-3xl text-muted">{copy.sections[0].body[0]}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
