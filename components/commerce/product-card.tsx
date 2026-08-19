import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { resolvePriceUnit } from "@/lib/catalog/price-unit";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  headingLevel = "h3",
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const paths = createPaths(product.locale);
  const messages = getMessages(product.locale);
  const soldOut = product.availability === "out_of_stock";

  return (
    <article className="product-card">
      <Link href={paths.product(product.slug)} className="block text-ink hover:text-ink">
        <div className="product-card-media">
          <CatalogMedia image={product.primaryImage} className="object-cover" />
          {soldOut ? <span className="product-card-badge">{messages.soldOut}</span> : null}
        </div>
        <div className="product-card-body">
          <Heading className="font-heading text-card-title">{product.name}</Heading>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            locale={product.locale}
            unit={resolvePriceUnit({ unit: product.unit, packSize: product.packSize, productId: product.id })}
          />
        </div>
      </Link>
    </article>
  );
}
