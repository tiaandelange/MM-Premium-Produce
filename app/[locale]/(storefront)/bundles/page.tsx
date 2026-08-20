import { PageHeader } from "@/components/layout/page-header";
import { EditorialPanel } from "@/components/layout/editorial-panel";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
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

export async function generateMetadata({ params }: PageProps<"/[locale]/bundles">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].bundles;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.bundles,
    locale,
    enPath: createPaths("en").bundles,
    afPath: createPaths("af").bundles,
  });
}

export default async function BundlesPage({ params }: PageProps<"/[locale]/bundles">) {
  const locale = requireLocale((await params).locale);
  const catalog = await getCatalog(locale);
  const bundles = await catalog.listBundles();
  const messages = getMessages(locale);
  const copy = pageCopy[locale].bundles;
  const paths = createPaths(locale);
  const categories = await catalog.listCategories();
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.produceBoxes, path: paths.bundles },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          copy.h1,
          bundles.map((bundle) => ({ name: bundle.name, path: paths.bundle(bundle.slug) })),
        )}
      />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <PageSection>
        <EditorialPanel className="max-w-3xl">
          <h2 className="text-section-title">{messages.currentBoxes}</h2>
          {bundles.length ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {bundles.map((bundle) => (
                <article key={bundle.id}>
                  <h3 className="font-heading text-card-title">{bundle.name}</h3>
                  <p className="mt-2 text-muted">{bundle.shortDescription}</p>
                  <Link href={paths.bundle(bundle.slug)} className="mt-4 inline-block">
                    {bundle.name}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted">{copy.sections[0].body[0]}</p>
          )}
          <p className="mt-6 text-muted">
            <Link href={paths.shop}>{messages.shop}</Link>
            {vegetables ? (
              <>
                {" "}
                · <Link href={paths.category(vegetables.slug)}>{vegetables.name}</Link>
              </>
            ) : null}
            {fruit ? (
              <>
                {" "}
                · <Link href={paths.category(fruit.slug)}>{fruit.name}</Link>
              </>
            ) : null}
          </p>
        </EditorialPanel>
      </PageSection>
    </>
  );
}
