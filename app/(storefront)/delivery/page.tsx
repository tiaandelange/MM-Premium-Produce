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
  { name: "Delivery", path: paths.delivery },
];

export const metadata = buildMetadata({
  title: "Delivery Information",
  description:
    "Delivery areas, times and fees for M & M Premium Produce will be published here once they are confirmed.",
  path: paths.delivery,
});

export default function DeliveryPage() {
  const site = getSiteConfig();
  const areas = confirmedValue(site.deliveryAreas);

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Delivery information"
        description="This page will hold delivery areas, times and any collection options. Those details are not public yet."
      />
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">Current status</h2>
        {areas?.length ? (
          <ul className="list-disc pl-5">
            {areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        ) : (
          <p>
            Delivery areas and time slots have not been confirmed, so they are not shown
            here. When they are available, this page will be the canonical place to read
            them. In the meantime you can still{" "}
            <Link href={paths.shop}>browse the shop</Link> and{" "}
            <Link href={paths.contact}>use the contact page</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
