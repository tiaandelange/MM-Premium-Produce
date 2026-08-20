import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { pageCopy } from "@/lib/i18n/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getEditorial } from "@/services/editorial";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/guides">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].guides;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.guides,
    locale,
    enPath: createPaths("en").guides,
    afPath: createPaths("af").guides,
  });
}

export default async function GuidesIndexPage({ params }: PageProps<"/[locale]/guides">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].guides;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const editorial = await getEditorial(locale);
  const guides = await editorial.listGuides();
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.guides, path: paths.guides },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          copy.h1,
          guides.map((guide) => ({ name: guide.title, path: paths.guide(guide.slug) })),
        )}
      />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      {copy.sections.map((section, index) => (
        <PageSection key={section.heading} muted={index % 2 === 1}>
          <div className="content-block">
            <h2 className="text-section-title text-ink">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </PageSection>
      ))}
      <PageSection>
        <ul className="content-index">
          {guides.map((guide) => (
            <li key={guide.id} className="content-index-card">
              <Link href={paths.guide(guide.slug)} className="content-index-card-link">
                <div className="content-index-card-media">
                  <CatalogMedia image={guide.image} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
                <div className="content-index-card-body">
                  <h2 className="font-heading text-card-title">{guide.title}</h2>
                  <p className="text-sm text-muted">{guide.lede}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="content-block mt-8 text-muted">
          <Link href={paths.recipes}>{messages.recipes}</Link>
          {" · "}
          <Link href={paths.shop}>{messages.shop}</Link>
        </p>
      </PageSection>
    </>
  );
}
