import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PageHeader } from "@/components/layout/page-header";
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
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          copy.h1,
          guides.map((guide) => ({ name: guide.title, path: paths.guide(guide.slug) })),
        )}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={copy.h1} description={copy.intro} />
      {copy.sections.map((section) => (
        <section key={section.heading} className="max-w-3xl space-y-3 text-muted">
          <h2 className="text-section-title text-ink">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </section>
      ))}
      <ul className="grid gap-6 md:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.id} className="card-surface overflow-hidden">
            <Link href={paths.guide(guide.slug)} className="block">
              <div className="relative aspect-[16/9] bg-sand">
                <CatalogMedia image={guide.image} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <div className="space-y-2 p-5">
                <h2 className="font-heading text-card-title">{guide.title}</h2>
                <p className="text-sm text-muted">{guide.lede}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="max-w-3xl text-muted">
        <Link href={paths.recipes}>{messages.recipes}</Link>
        {" · "}
        <Link href={paths.shop}>{messages.shop}</Link>
      </p>
    </div>
  );
}
