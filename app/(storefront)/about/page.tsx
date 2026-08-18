import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ourStory } from "@/data/story";
import { getSiteConfig } from "@/config/site";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildOrganizationStructuredData } from "@/lib/seo/structured-data";
import Link from "next/link";

const breadcrumbItems = [
  { name: "Home", path: paths.home },
  { name: "About", path: paths.about },
];

export const metadata = buildMetadata({
  title: "About M & M Premium Produce",
  description:
    "M & M Premium Produce is a couple-run fresh produce shop. Every item is personally handpicked. Quality does matter.",
  path: paths.about,
});

export default function AboutPage() {
  const { businessName } = getSiteConfig();

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildOrganizationStructuredData()} />
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader title={`About ${businessName}`} description={ourStory.quote} />
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">{ourStory.headline}</h2>
        {ourStory.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </section>
      <section className="max-w-3xl space-y-4 text-muted">
        <h2 className="text-section-title text-ink">What you can shop for</h2>
        <p>
          Browse the <Link href={paths.shop}>fresh produce shop</Link>,{" "}
          <Link href={paths.category("vegetables")}>vegetables</Link> or{" "}
          <Link href={paths.category("fruit")}>fruit</Link>. Produce boxes will appear
          under <Link href={paths.bundles}>bundles</Link> when a box is confirmed.
          Delivery information will be published on the{" "}
          <Link href={paths.delivery}>delivery page</Link> once it is confirmed.
        </p>
      </section>
    </div>
  );
}
