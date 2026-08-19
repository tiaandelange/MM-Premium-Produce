import { HomeApproach } from "@/components/home/approach";
import { HomeHero } from "@/components/home/hero";
import { CategoryCard } from "@/components/commerce/category-card";
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

      <section className="site-container py-16 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-section-title">{messages.shopByCategory}</h2>
          </div>
          <Link href={paths.shop} className="hidden text-sm font-medium sm:inline">
            {messages.openFullShop}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} headingLevel="h3" />
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="site-container">
          <h2 className="text-section-title">{messages.featuredProduce}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16">
        <h2 className="text-section-title">{messages.produceBoxes}</h2>
        {bundles.length ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {bundles.map((bundle) => (
              <article key={bundle.id} className="card-surface p-6">
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
      </section>

      <section className="border-y border-line bg-sand py-16">
        <div className="site-container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-section-title">{pageCopy[locale].about.sections[0].heading}</h2>
            {pageCopy[locale].about.sections[0].body.slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-4 text-muted">
                {paragraph}
              </p>
            ))}
            <p className="mt-6">
              <Link href={paths.about}>{messages.about}</Link>
            </p>
          </div>
          <div>
            <h2 className="text-section-title">{copy.sections[0].heading}</h2>
            <ul className="mt-6 space-y-4 text-muted">
              {copy.sections[0].body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="site-container py-16">
        <h2 className="text-section-title">{copy.sections[1].heading}</h2>
        <p className="mt-4 max-w-3xl text-muted">
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
          . <Link href={paths.delivery}>{messages.delivery}</Link>.{" "}
          <Link href={paths.contact}>{messages.contact}</Link>.
        </p>
      </section>

      <NewsletterSignup locale={locale} />
    </>
  );
}
