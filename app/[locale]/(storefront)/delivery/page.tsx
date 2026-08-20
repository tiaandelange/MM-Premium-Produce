import { PageHeader } from "@/components/layout/page-header";
import { EditorialPanel } from "@/components/layout/editorial-panel";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
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

export const dynamic = "force-dynamic";

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
  const policy = confirmedValue(site.deliveryPolicy);
  const areas = confirmedValue(site.deliveryAreas);
  const rules = await listPublishedDeliveryRules();
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.delivery, path: paths.delivery },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <PageSection>
        <EditorialPanel className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-section-title text-ink">{messages.currentStatus}</h2>
            {policy ? (
              <dl className="mt-4 space-y-3 text-muted">
                <div>
                  <dt className="font-medium text-ink">{messages.serviceArea}</dt>
                  <dd>{policy.coverage}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">{messages.deliveryMethod}</dt>
                  <dd>{policy.method}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">{messages.deliveryTimeframe}</dt>
                  <dd>{policy.timeframe}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">{messages.deliveryFee}</dt>
                  <dd>
                    {formatMoney({ amount: policy.feeZar, currency: "ZAR" }, locale)}
                    {policy.freeDeliveryThresholdZar != null
                      ? ` · ${messages.freeDeliveryFrom} ${formatMoney({ amount: policy.freeDeliveryThresholdZar, currency: "ZAR" }, locale)}`
                      : null}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">{messages.deliveryExclusions}</dt>
                  <dd>
                    {policy.exclusions}
                    {policy.maxDistanceKm != null
                      ? ` · ${messages.deliveryDistanceLimit.replace("{km}", String(policy.maxDistanceKm))}`
                      : null}
                  </dd>
                </div>
              </dl>
            ) : areas?.length ? (
              <ul className="mt-4 list-disc pl-5 text-muted">
                {areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-muted">{copy.sections[0].body[0]}</p>
            )}
          </section>

          {rules.length ? (
            <section>
              <h2 className="text-section-title text-ink">{messages.servedAreas}</h2>
              <ul className="mt-4 space-y-3 text-muted">
                {rules.map((rule) => (
                  <li key={rule.id}>
                    <strong className="text-ink">{rule.name}</strong>
                    {rule.suburb || rule.postalCode
                      ? ` · ${[rule.suburb, rule.postalCode].filter(Boolean).join(" ")}`
                      : ""}
                    {` · ${formatMoney(rule.fee, locale)}`}
                    {rule.estimatedWindow ? ` · ${rule.estimatedWindow}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="text-sm">
            <Link href={paths.shop}>{messages.shop}</Link> · <Link href={paths.contact}>{messages.contact}</Link> ·{" "}
            <Link href={paths.returns}>{messages.deliveryAndReturns}</Link>
          </p>
        </EditorialPanel>
      </PageSection>
    </>
  );
}
