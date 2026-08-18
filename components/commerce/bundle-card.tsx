import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { paths } from "@/lib/routes";
import type { Bundle } from "@/types/catalog";

export function BundleCard({
  bundle,
  headingLevel = "h3",
}: {
  bundle: Bundle;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="card-surface overflow-hidden">
      <Link href={paths.bundle(bundle.slug)} className="block text-ink hover:text-ink">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <CatalogMedia image={bundle.primaryImage} />
        </div>
        <div className="space-y-2 p-5">
          <Heading className="font-heading text-card-title">{bundle.name}</Heading>
          <p className="text-sm text-muted">{bundle.shortDescription}</p>
          <PriceDisplay price={bundle.price} compareAtPrice={bundle.compareAtPrice} />
          <span className="inline-block text-sm font-medium text-leaf">
            View {bundle.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
