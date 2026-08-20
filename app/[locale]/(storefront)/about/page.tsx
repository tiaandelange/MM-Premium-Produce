import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
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

export const dynamic = "force-dynamic";

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
    <>
      <JsonLd data={buildOrganizationStructuredData(locale)} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <PageSection>
        <figure className="about-pullquote">
          <blockquote>“{copy.intro}”</blockquote>
          <figcaption>{businessName}</figcaption>
        </figure>
        <div className="about-story-grid mt-10">
          {copy.sections.map((section, index) => (
            <section
              key={section.heading}
              className={index === 0 ? "about-story-primary" : "about-story-secondary"}
            >
              <h2 className="text-section-title text-ink">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 max-w-prose">
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
      </PageSection>
    </>
  );
}
