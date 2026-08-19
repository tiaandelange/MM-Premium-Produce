import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildOrganizationStructuredData } from "@/lib/seo/structured-data";
import { getSiteConfig } from "@/config/site";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].about;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.about,
    locale,
    enPath: createPaths("en").about,
    afPath: createPaths("af").about,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = requireLocale((await params).locale);
  const { businessName } = getSiteConfig();
  const copy = pageCopy[locale].about;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const catalog = await getCatalog(locale);
  const categories = await catalog.listCategories();
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.about, path: paths.about },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildOrganizationStructuredData(locale)} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={copy.h1} description={copy.intro} />
      {copy.sections.map((section) => (
        <section key={section.heading} className="max-w-3xl space-y-4 text-muted">
          <h2 className="text-section-title text-ink">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </section>
      ))}
      <p className="max-w-3xl text-muted">
        <Link href={paths.shop}>{messages.shop}</Link>
        {vegetables ? (
          <>
            , <Link href={paths.category(vegetables.slug)}>{vegetables.name}</Link>
          </>
        ) : null}
        {fruit ? (
          <>
            , <Link href={paths.category(fruit.slug)}>{fruit.name}</Link>
          </>
        ) : null}
        , <Link href={paths.bundles}>{messages.produceBoxes}</Link>,{" "}
        <Link href={paths.delivery}>{messages.delivery}</Link>. {businessName}.
      </p>
    </div>
  );
}
