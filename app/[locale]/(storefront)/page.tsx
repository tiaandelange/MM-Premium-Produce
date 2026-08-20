import { HomeApproach } from "@/components/home/approach";
import { HomeCatalogue } from "@/components/home/catalogue";
import { HomeHero } from "@/components/home/hero";
import { CategoryCard } from "@/components/commerce/category-card";
import { EditorialPanel } from "@/components/layout/editorial-panel";
import { NewsletterSignup } from "@/components/commerce/newsletter-signup";
import { ProductCard } from "@/components/commerce/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages, interpolate } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildItemListStructuredData, buildOrganizationStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import { TrackItemList } from "@/components/analytics/track-event";
import { analyticsItemFromProduct } from "@/lib/analytics/items";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].home;
  const paths = createPaths(locale);
  const en = createPaths("en");
  const af = createPaths("af");
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.home,
    locale,
    enPath: en.home,
    afPath: af.home,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = requireLocale((await params).locale);
  const catalog = await getCatalog(locale);
  const messages = getMessages(locale);
  const copy = pageCopy[locale].home;
  const paths = createPaths(locale);
  const [categories, products, bundles] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts({ featured: true }),
    catalog.listBundles(),
  ]);
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const featuredInStock = products.filter((product) => product.availability === "in_stock");
  const featured = featuredInStock.length ? featuredInStock : products;

  return (
    <>
      <JsonLd data={buildOrganizationStructuredData(locale)} />
      <JsonLd
        data={buildItemListStructuredData(
          messages.shopByCategory,
          categories.map((category) => ({
            name: category.name,
            path: paths.category(category.slug),
          })),
        )}
      />

      <HomeHero locale={locale} />
      <HomeApproach locale={locale} />

      <HomeCatalogue heading={messages.shopByCategory} shopHref={paths.shop} shopLabel={messages.openFullShop}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} headingLevel="h3" />
        ))}
      </HomeCatalogue>

      <section className="home-featured">
        <div className="site-container">
          <h2 className="text-section-title">{messages.featuredProduce}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                listId="featured"
                listName={messages.featuredProduce}
              />
            ))}
          </div>
          <TrackItemList
            listId="featured"
            listName={messages.featuredProduce}
            items={featured.map((product) => analyticsItemFromProduct(product))}
          />
        </div>
      </section>

      <section className="home-bundles-preview" aria-labelledby="home-bundles-heading">
        <div className="home-bundles-preview-inner">
          <EditorialPanel>
            <h2 id="home-bundles-heading" className="text-section-title">
              {messages.produceBoxes}
            </h2>
            {bundles.length ? (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {bundles.map((bundle) => (
                  <article key={bundle.id}>
                    <h3 className="font-heading text-card-title">{bundle.name}</h3>
                    <p className="mt-2 text-muted">{bundle.shortDescription}</p>
                    <Link href={paths.bundle(bundle.slug)} className="mt-4 inline-block">
                      {interpolate(messages.viewBox, { name: bundle.name })}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 max-w-2xl text-muted">{pageCopy[locale].bundles.sections[0].body[0]}</p>
            )}
            <p className="mt-6">
              <Link href={paths.bundles}>{messages.viewProduceBoxes}</Link>
            </p>
          </EditorialPanel>
        </div>
      </section>

      <section className="home-story" aria-labelledby="home-story-heading">
        <div className="site-container home-story-inner">
          <div className="home-story-grid">
            <div>
              <h2 id="home-story-heading" className="text-section-title">
                {pageCopy[locale].about.sections[0].heading}
              </h2>
              {pageCopy[locale].about.sections[0].body.slice(0, 2).map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose text-muted">
                  {paragraph}
                </p>
              ))}
              <p className="mt-6">
                <Link href={paths.about}>{messages.about}</Link>
              </p>
            </div>
            <div className="home-story-column--quality">
              <h2 className="text-section-title">{copy.sections[0].heading}</h2>
              <ul className="home-story-list">
                {copy.sections[0].body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="home-seo-support" aria-labelledby="home-seo-heading">
        <h2 id="home-seo-heading" className="text-section-title">
          {copy.sections[1].heading}
        </h2>
        <p className="mt-4 text-muted">
          {copy.sections[1].body[0]}{" "}
          <Link href={paths.shop}>{messages.shop}</Link>
          {vegetables ? (
            <>
              , <Link href={paths.category(vegetables.slug)}>{vegetables.name.toLowerCase()}</Link>
            </>
          ) : null}
          {fruit ? (
            <>
              , <Link href={paths.category(fruit.slug)}>{fruit.name.toLowerCase()}</Link>
            </>
          ) : null}
          .
        </p>
        <p className="home-seo-support-links text-muted">
          <Link href={paths.guides}>{messages.guides}</Link>
          <span aria-hidden="true">·</span>
          <Link href={paths.delivery}>{messages.delivery}</Link>
          <span aria-hidden="true">·</span>
          <Link href={paths.contact}>{messages.contact}</Link>
        </p>
      </section>

      <NewsletterSignup locale={locale} />
    </>
  );
}
