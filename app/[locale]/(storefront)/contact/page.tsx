import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { confirmedValue, getSiteConfig } from "@/config/site";
import { pageCopy } from "@/lib/i18n/pages";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData } from "@/lib/seo/structured-data";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].contact;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.contact,
    locale,
    enPath: createPaths("en").contact,
    afPath: createPaths("af").contact,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = requireLocale((await params).locale);
  const site = getSiteConfig();
  const copy = pageCopy[locale].contact;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const email = confirmedValue(site.email);
  const phone = confirmedValue(site.phone);
  const address = confirmedValue(site.address);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.contact, path: paths.contact },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={copy.h1} description={copy.intro} />
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">{messages.publicDetails}</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium text-ink">{messages.email}</dt>
            <dd>{email ? <a href={`mailto:${email}`}>{email}</a> : messages.toBeConfirmed}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{messages.phone}</dt>
            <dd>{phone ?? messages.toBeConfirmed}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{messages.address}</dt>
            <dd>
              {address
                ? `${address.streetAddress}, ${address.locality}, ${address.region} ${address.postalCode}, ${address.country}`
                : messages.toBeConfirmed}
            </dd>
          </div>
        </dl>
        <p>
          <Link href={paths.shop}>{messages.shop}</Link> · <Link href={paths.faq}>{messages.faq}</Link>
        </p>
      </section>
    </div>
  );
}
