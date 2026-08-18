import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { confirmedValue, getSiteConfig } from "@/config/site";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData } from "@/lib/seo/structured-data";
import Link from "next/link";

const breadcrumbItems = [
  { name: "Home", path: paths.home },
  { name: "Contact", path: paths.contact },
];

export const metadata = buildMetadata({
  title: "Contact M & M Premium Produce",
  description:
    "Public contact details for M & M Premium Produce will appear here once they are confirmed.",
  path: paths.contact,
});

export default function ContactPage() {
  const site = getSiteConfig();
  const email = confirmedValue(site.email);
  const phone = confirmedValue(site.phone);
  const address = confirmedValue(site.address);

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Contact"
        description="Use this page for confirmed public contact details. A message form and order support will be added in a later phase."
      />
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">Public details</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium text-ink">Email</dt>
            <dd>
              {email ? <a href={`mailto:${email}`}>{email}</a> : "To be confirmed"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Phone</dt>
            <dd>{phone ?? "To be confirmed"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Address</dt>
            <dd>
              {address
                ? `${address.streetAddress}, ${address.locality}, ${address.region} ${address.postalCode}, ${address.country}`
                : "To be confirmed"}
            </dd>
          </div>
        </dl>
        <p>
          While contact details are being confirmed, you can still{" "}
          <Link href={paths.shop}>browse fresh produce</Link> and read{" "}
          <Link href={paths.faq}>frequently asked questions</Link>.
        </p>
      </section>
    </div>
  );
}
