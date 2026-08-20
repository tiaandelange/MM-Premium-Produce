import { CatalogMedia } from "@/components/commerce/catalog-media";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { redirectIfTranslatedSlugExists } from "@/lib/i18n/entity-redirect";
import { editorialLocalePaths } from "@/lib/seo/editorial-alternates";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildRecipeStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/recipes/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const editorial = await getEditorial(locale);
  const recipe = await editorial.getRecipeBySlug(slug);
  if (!recipe) {
    await redirectIfTranslatedSlugExists(locale, "recipe", slug);
    notFound();
  }
  const alts = editorialLocalePaths("recipe", recipe.alternates, recipe.localeIndexable);
  return buildMetadata({
    title: recipe.seoTitle,
    description: recipe.seoDescription,
    path: createPaths(locale).recipe(recipe.slug),
    locale,
    enPath: alts.enPath,
    afPath: alts.afPath,
    indexable: recipe.indexable,
    ogImage: recipe.image.src,
    ogType: "article",
  });
}

export default async function RecipePage({
  params,
}: PageProps<"/[locale]/recipes/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const editorial = await getEditorial(locale);
  const recipe = await editorial.getRecipeBySlug(slug);
  if (!recipe) {
    await redirectIfTranslatedSlugExists(locale, "recipe", slug);
    notFound();
  }
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const catalog = await getCatalog(locale);
  const [products, guides] = await Promise.all([
    Promise.all(recipe.productIds.map((id) => catalog.getProductById(id))),
    editorial.listGuides(),
  ]);
  const relatedProducts = products.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGuides = guides.filter((guide) =>
    guide.productIds.some((id) => recipe.productIds.includes(id)),
  );
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.recipes, path: paths.recipes },
    { name: recipe.title, path: paths.recipe(recipe.slug) },
  ];

  return (
    <>
      <JsonLd data={buildRecipeStructuredData(recipe)} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={recipe.title} description={recipe.lede} />
      </PageIntro>
      <PageSection>
        <figure className="content-block max-w-3xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-line bg-sand">
            <CatalogMedia image={recipe.image} sizes="(min-width: 768px) 48rem, 100vw" />
          </div>
          <figcaption className="mt-2 text-sm text-muted">{messages.imageCaptionShop}</figcaption>
        </figure>
      </PageSection>
      <PageSection muted>
        <div className="content-block">
          <h2 className="text-section-title">{messages.ingredients}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            {recipe.ingredients.map((item) => (
              <li key={item.name}>
                {item.name}
                {item.quantity ? ` — ${item.quantity}` : null}
              </li>
            ))}
          </ul>
        </div>
      </PageSection>
      <PageSection>
        <div className="content-block">
          <h2 className="text-section-title">{messages.method}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted">
            {recipe.steps.map((step) => (
              <li key={step.slice(0, 48)}>{step}</li>
            ))}
          </ol>
        </div>
      </PageSection>
      {relatedProducts.length ? (
        <PageSection muted>
          <h2 className="text-section-title">{messages.shopThisGuide}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </PageSection>
      ) : null}
      {relatedGuides.length ? (
        <PageSection>
          <div className="content-block">
            <h2 className="text-section-title">{messages.relatedGuides}</h2>
            <ul className="mt-4 space-y-2">
              {relatedGuides.map((guide) => (
                <li key={guide.id}>
                  <Link href={paths.guide(guide.slug)}>{guide.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </PageSection>
      ) : null}
    </>
  );
}
