import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/seo/structured-data";
import { getCatalog } from "@/services/catalog";
import Link from "next/link";

const breadcrumbItems = [
  { name: "Home", path: paths.home },
  { name: "Produce boxes", path: paths.bundles },
];

export const metadata = buildMetadata({
  title: "Produce Boxes & Bundles",
  description:
    "Produce boxes from M & M Premium Produce will be listed here when a box is confirmed for sale. Until then, shop fruit and vegetables as individual products.",
  path: paths.bundles,
});

export default async function BundlesPage() {
  const catalog = await getCatalog();
  const bundles = await catalog.listBundles();

  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <JsonLd
        data={buildItemListStructuredData(
          "Produce boxes",
          bundles.map((bundle) => ({
            name: bundle.name,
            path: paths.bundle(bundle.slug),
          })),
        )}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Produce Boxes & Bundles"
        description="Produce boxes will be catalogue items in their own right, with links to the fruit and vegetables inside them."
      />
      <section>
        <h2 className="text-section-title">Current boxes</h2>
        {bundles.length ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {bundles.map((bundle) => (
              <article key={bundle.id} className="card-surface p-6">
                <h3 className="font-heading text-card-title">{bundle.name}</h3>
                <p className="mt-2 text-muted">{bundle.shortDescription}</p>
                <Link href={paths.bundle(bundle.slug)} className="mt-4 inline-block">
                  View {bundle.name}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-3xl text-muted">
            No produce boxes are listed for sale yet. When a box is confirmed, it will
            appear here with its own page. Until then,{" "}
            <Link href={paths.shop}>shop fruit and vegetables</Link> as individual
            products.
          </p>
        )}
      </section>
      <p className="text-muted">
        Prefer to choose item by item?{" "}
        <Link href={paths.shop}>Open the fresh produce shop</Link>.
      </p>
    </div>
  );
}
