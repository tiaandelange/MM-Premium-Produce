import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { availabilityLabel } from "@/lib/utils/format";
import { paths } from "@/lib/routes";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  headingLevel = "h3",
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="card-surface overflow-hidden">
      <Link href={paths.product(product.slug)} className="block text-ink hover:text-ink">
        <div className="relative aspect-square overflow-hidden bg-sand">
          <CatalogMedia image={product.primaryImage} className="object-contain p-3" />
        </div>
        <div className="space-y-2 p-4">
          <Heading className="font-heading text-card-title">{product.name}</Heading>
          <p className="text-sm text-muted">{product.shortDescription}</p>
          {product.packSize ? (
            <p className="text-sm text-muted">Pack: {product.packSize}</p>
          ) : null}
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          <p className="text-sm text-muted">{availabilityLabel(product.availability)}</p>
          <span className="inline-block text-sm font-medium text-leaf">
            View {product.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
