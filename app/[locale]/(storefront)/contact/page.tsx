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
import Link from "next/link";

export const dynamic = "force-dynamic";

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

function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = requireLocale((await params).locale);
  const site = getSiteConfig();
  const copy = pageCopy[locale].contact;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const email = confirmedValue(site.email);
  const phone = confirmedValue(site.phone);
  const whatsapp = confirmedValue(site.whatsapp);
  const address = site.publishPublicAddress ? confirmedValue(site.address) : null;
  const supportHours = confirmedValue(site.supportHours);
  const tradingName = confirmedValue(site.tradingName) ?? site.businessName;
  const legalName = confirmedValue(site.legalName);
  const founders = confirmedValue(site.founders);
  const deliveryPolicy = confirmedValue(site.deliveryPolicy);
  const hasPublicDetails = Boolean(email || phone || whatsapp || address || supportHours || legalName);
  const breadcrumbItems = [
    { name: messages.home, path: paths.home },
    { name: messages.contact, path: paths.contact },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <PageIntro>
        <Breadcrumbs items={breadcrumbItems} />
        <PageHeader title={copy.h1} description={copy.intro} />
      </PageIntro>
      <PageSection>
        <EditorialPanel className="max-w-3xl">
          {hasPublicDetails ? (
            <>
              <h2 className="text-section-title text-ink">{messages.publicDetails}</h2>
              <dl className="mt-4 space-y-4 text-muted">
                <div>
                  <dt className="font-medium text-ink">{messages.tradingName}</dt>
                  <dd>{tradingName}</dd>
                </div>
                {legalName ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.legalEntity}</dt>
                    <dd>{legalName}</dd>
                  </div>
                ) : null}
                {founders ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.owners}</dt>
                    <dd>{founders}</dd>
                  </div>
                ) : null}
                {email ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.email}</dt>
                    <dd>
                      <a href={`mailto:${email}`}>{email}</a>
                    </dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.phone}</dt>
                    <dd>
                      <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                    </dd>
                  </div>
                ) : null}
                {whatsapp ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.whatsapp}</dt>
                    <dd>
                      <a href={whatsappHref(whatsapp)} rel="noopener noreferrer" target="_blank">
                        {whatsapp}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {address ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.address}</dt>
                    <dd>
                      {`${address.streetAddress}, ${address.locality}, ${address.region} ${address.postalCode}, ${address.country}`}
                    </dd>
                  </div>
                ) : null}
                {supportHours ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.supportHours}</dt>
                    <dd>{supportHours}</dd>
                  </div>
                ) : null}
                {deliveryPolicy ? (
                  <div>
                    <dt className="font-medium text-ink">{messages.serviceArea}</dt>
                    <dd>
                      {deliveryPolicy.coverage} · {deliveryPolicy.method} · {deliveryPolicy.timeframe}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </>
          ) : (
            <>
              <h2 className="text-section-title text-ink">{messages.contactUnavailableTitle}</h2>
              <p className="mt-4 text-muted">{messages.contactUnavailableBody}</p>
            </>
          )}
          <p className="mt-6">
            <Link href={paths.shop}>{messages.shop}</Link> · <Link href={paths.faq}>{messages.faq}</Link> ·{" "}
            <Link href={paths.delivery}>{messages.delivery}</Link>
          </p>
        </EditorialPanel>
      </PageSection>
    </>
  );
}
