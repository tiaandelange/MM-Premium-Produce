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
import { formatMoney } from "@/lib/utils/format";
import { listPublishedDeliveryRules } from "@/services/delivery";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/[locale]/delivery">) {
  const locale = requireLocale((await params).locale);
  const copy = pageCopy[locale].delivery;
  const paths = createPaths(locale);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: paths.delivery,
    locale,
    enPath: createPaths("en").delivery,
    afPath: createPaths("af").delivery,
  });
}

export default async function DeliveryPage({ params }: PageProps<"/[locale]/delivery">) {
  const locale = requireLocale((await params).locale);
  const site = getSiteConfig();
  const copy = pageCopy[locale].delivery;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const areas = confirmedValue(site.deliveryAreas);
  const rules = await listPublishedDeliveryRules();
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.delivery, path: paths.delivery },
  ];

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={copy.h1} description={copy.intro} />
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">{messages.currentStatus}</h2>
        {rules.length ? (
          <ul className="space-y-3">
            {rules.map((rule) => (
              <li key={rule.id}>
                <strong className="text-ink">{rule.name}</strong>
                {rule.suburb || rule.postalCode ? ` · ${[rule.suburb, rule.postalCode].filter(Boolean).join(" ")}` : ""}
                {` · ${formatMoney(rule.fee, locale)}`}
                {rule.estimatedWindow ? ` · ${rule.estimatedWindow}` : ""}
              </li>
            ))}
          </ul>
        ) : areas?.length ? (
          <ul className="list-disc pl-5">
            {areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        ) : (
          <p>
            {copy.sections[0].body[0]}{" "}
            <Link href={paths.shop}>{messages.shop}</Link> · <Link href={paths.contact}>{messages.contact}</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
