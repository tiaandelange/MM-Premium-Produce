import { PageHeader } from "@/components/layout/page-header";
import { EditorialPanel } from "@/components/layout/editorial-panel";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { legalCopy, type LegalPageKey } from "@/lib/i18n/legal";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export function createLegalPage(key: LegalPageKey) {
  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = requireLocale((await params).locale);
    const copy = legalCopy[locale][key];
    const paths = createPaths(locale);
    const path =
      key === "privacy" ? paths.privacy : key === "terms" ? paths.terms : paths.returns;
    return buildMetadata({
      title: copy.title,
      description: copy.description,
      path,
      locale,
      enPath: key === "privacy" ? createPaths("en").privacy : key === "terms" ? createPaths("en").terms : createPaths("en").returns,
      afPath: key === "privacy" ? createPaths("af").privacy : key === "terms" ? createPaths("af").terms : createPaths("af").returns,
      indexable: false,
      followWhenNoindex: false,
    });
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const locale = requireLocale((await params).locale);
    const copy = legalCopy[locale][key];
    const messages = getMessages(locale);
    const paths = createPaths(locale);
    const path =
      key === "privacy" ? paths.privacy : key === "terms" ? paths.terms : paths.returns;
    const breadcrumbItems = [
      { name: messages.home, path: paths.home },
      { name: copy.h1, path },
    ];

    return (
      <>
        <PageIntro>
          <Breadcrumbs items={breadcrumbItems} />
          <PageHeader title={copy.h1} description={copy.intro} />
        </PageIntro>
        <PageSection>
          <EditorialPanel className="max-w-3xl space-y-8">
            <p className="text-sm text-muted">{messages.legalDraftNotice}</p>
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-section-title text-ink">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="mt-3 text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <p className="text-sm">
              <Link href={paths.contact}>{messages.contact}</Link>
              {" · "}
              <Link href={paths.delivery}>{messages.delivery}</Link>
              {" · "}
              <Link href={paths.shop}>{messages.shop}</Link>
            </p>
          </EditorialPanel>
        </PageSection>
      </>
    );
  }

  return { generateMetadata, Page };
}
