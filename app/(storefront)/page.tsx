import { CategoryCard } from "@/components/commerce/category-card";
import { NewsletterSignup } from "@/components/commerce/newsletter-signup";
import { ProductCard } from "@/components/commerce/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { ourStory } from "@/data/story";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildItemListStructuredData, buildOrganizationStructuredData } from "@/lib/seo/structured-data";
import { getSiteConfig } from "@/config/site";
import { paths } from "@/lib/routes";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Fresh Fruit & Vegetables | M & M Premium Produce",
  description:
    "Shop personally handpicked fresh fruit and vegetables from M & M Premium Produce. Quality does matter.",
  path: paths.home,
  absoluteTitle: true,
});

export default async function HomePage() {
  const catalog = await getCatalog();
  const site = getSiteConfig();
  const [categories, products, bundles] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts({ featured: true }),
    catalog.listBundles(),
  ]);
  const vegetables = categories.find((category) => category.slug === "vegetables");

  return (
    <>
      <JsonLd data={buildOrganizationStructuredData()} />
      <JsonLd
        data={buildItemListStructuredData(
          "Shop by category",
          categories.map((category) => ({
            name: category.name,
            path: paths.category(category.slug),
          })),
        )}
      />

      <section className="border-b border-line bg-sand">
        <div className="site-container grid gap-8 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:py-16">
          <header>
            <p className="text-label font-semibold uppercase tracking-[0.18em] text-leaf">
              {site.businessName}
            </p>
            <h1 className="mt-4 max-w-3xl text-display">
              Personally handpicked fresh fruit and vegetables
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              High-quality fruit and vegetables at prices meant to be accessible. Every
              item is handpicked by us. “{ourStory.quote}”
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={paths.shop} className="btn-primary">
                Shop fresh produce
              </Link>
              <Link href={paths.category("vegetables")} className="btn-secondary">
                Shop vegetables
              </Link>
            </div>
          </header>
          {vegetables ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface">
              <CatalogMedia
                image={vegetables.image}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="site-container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-section-title">Shop by category</h2>
            <p className="mt-2 text-muted">Start with fruit or vegetables, then open any product page.</p>
          </div>
          <Link href={paths.shop} className="hidden text-sm font-medium sm:inline">
            Open the full shop
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
          <h2 className="text-section-title">Featured produce</h2>
          <p className="mt-2 max-w-2xl text-muted">
            A selection of products from the current range. Stock changes, so check each
            product page for availability.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16">
        <h2 className="text-section-title">Produce boxes</h2>
        {bundles.length ? (
          <>
            <p className="mt-2 max-w-2xl text-muted">
              Curated boxes are listed as their own products and still link back to the
              fruit and vegetables inside them.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {bundles.map((bundle) => (
                <article key={bundle.id} className="card-surface p-6">
                  <h3 className="font-heading text-card-title">{bundle.name}</h3>
                  <p className="mt-2 text-muted">{bundle.shortDescription}</p>
                  <Link href={paths.bundle(bundle.slug)} className="mt-4 inline-block">
                    View {bundle.name}
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 max-w-2xl text-muted">
            Produce boxes are not listed for sale yet. The{" "}
            <Link href={paths.bundles}>produce boxes page</Link> will show them when a
            box is confirmed. Until then, shop{" "}
            <Link href={paths.category("fruit")}>fresh fruit</Link> and{" "}
            <Link href={paths.category("vegetables")}>fresh vegetables</Link> as
            individual products.
          </p>
        )}
      </section>

      <section className="border-y border-line bg-sand py-16">
        <div className="site-container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-section-title">{ourStory.headline}</h2>
            {ourStory.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-4 text-muted">
                {paragraph}
              </p>
            ))}
            <p className="mt-6">
              <Link href={paths.about}>Read the full story</Link>
            </p>
          </div>
          <div>
            <h2 className="text-section-title">Quality you can trust</h2>
            <ul className="mt-6 space-y-4 text-muted">
              <li>Every item is personally handpicked.</li>
              <li>Fruit and vegetables are sold as individual products with their own pages.</li>
              <li>Prices are shown in South African rand where a selling price is listed.</li>
            </ul>
            <p className="mt-6 font-heading text-lg text-ink">“{ourStory.quote}”</p>
          </div>
        </div>
      </section>

      <section className="site-container py-16">
        <h2 className="text-section-title">Shop fresh produce online</h2>
        <p className="mt-4 max-w-3xl text-muted">
          Move from the <Link href={paths.shop}>fresh produce shop</Link> into{" "}
          <Link href={paths.category("vegetables")}>fresh vegetables</Link> or{" "}
          <Link href={paths.category("fruit")}>fresh fruit</Link>, then open a specific
          item. Delivery areas will be published on the{" "}
          <Link href={paths.delivery}>delivery page</Link> once they are confirmed. For
          now, <Link href={paths.contact}>contact</Link> is the place for public details
          as they become available.
        </p>
      </section>

      <NewsletterSignup />
    </>
  );
}
