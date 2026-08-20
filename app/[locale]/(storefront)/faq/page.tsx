import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData } from "@/lib/seo/structured-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].faq;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.faq,
    locale,
    enPath: createPaths("en").faq,
    afPath: createPaths("af").faq,
  });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].faq;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.faq, path: paths.faq },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <PageSection muted>
        <div className="faq-list">
          {copy.sections.map((item) => (
            <section key={item.heading} className="faq-item">
              <h2 className="text-section-title">{item.heading}</h2>
              <div className="mt-3 text-muted">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className="mt-3">
                  <Link href={paths.shop}>{messages.shop}</Link> ·{" "}
                  <Link href={paths.guides}>{messages.guides}</Link> ·{" "}
                  <Link href={paths.delivery}>{messages.delivery}</Link>
                </p>
              </div>
            </section>
          ))}
        </div>
      </PageSection>
    </>
  );
}
