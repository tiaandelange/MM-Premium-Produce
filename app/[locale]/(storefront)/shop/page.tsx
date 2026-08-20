import { CategoryCard } from "@/components/commerce/category-card";
import { CatalogueToolbar } from "@/components/commerce/catalogue-toolbar";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageIntro } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { filterAndSortProducts, parseCatalogueQuery } from "@/lib/catalog/catalogue-query";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import { TrackItemList } from "@/components/analytics/track-event";
import { analyticsItemFromProduct } from "@/lib/analytics/items";
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

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = requireLocale((await params).locale);
  const queryParams = await searchParams;
  const catalog = await getCatalog(locale);
  const messages = getMessages(locale);
  const copy = pageCopy[locale].shop;
  const paths = createPaths(locale);
  const [categories, products] = await Promise.all([catalog.listCategories(), catalog.listProducts()]);
  const query = parseCatalogueQuery(queryParams);
  const visibleProducts = filterAndSortProducts(products, query, categories);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.shop, path: paths.shop },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          copy.h1,
          visibleProducts.map((product) => ({ name: product.name, path: paths.product(product.slug) })),
        )}
      />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <section className="catalogue-category-bridge">
        <div className="site-container">
          <h2 className="text-section-title">{messages.shopByCategory}</h2>
          <div className="catalogue-category-bridge-grid mt-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      <section className="catalogue-products">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-section-title">{messages.allProducts}</h2>
            <Link href={paths.bundles} className="text-sm font-medium text-muted">
              {messages.viewProduceBoxes} · {messages.comingSoon}
            </Link>
          </div>
          <p className="mt-2 max-w-3xl text-muted">{copy.sections[0].body[0]}</p>
          <CatalogueToolbar
            locale={locale}
            action={paths.shop}
            categories={categories}
            query={query}
            resultCount={visibleProducts.length}
          />
          {visibleProducts.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} listId="shop" listName={copy.h1} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-muted">{messages.noMatchingProducts}</p>
          )}
        </div>
      </section>
      <TrackItemList
        listId="shop"
        listName={copy.h1}
        items={visibleProducts.map((product) => analyticsItemFromProduct(product))}
      />
    </>
  );
}
