import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { SelectItemLink } from "@/components/commerce/select-item-link";
import { analyticsItemFromProduct } from "@/lib/analytics/items";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { packQuantityLabel } from "@/lib/catalog/price-unit";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  headingLevel = "h3",
  listId,
  listName,
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
  listId?: string;
  listName?: string;
}) {
  const Heading = headingLevel;
  const paths = createPaths(product.locale);
  const messages = getMessages(product.locale);
  const soldOut = product.availability === "out_of_stock";
  const comingSoon = product.availability === "preorder";
  const unpriced = !product.price;
  const packLabel = packQuantityLabel(product);

  let badge: string | null = null;
  if (soldOut) badge = messages.soldOut;
  else if (comingSoon) badge = messages.comingSoon;
  else if (unpriced) badge = messages.priceToConfirm;

  return (
    <article className="product-card">
      <SelectItemLink
        href={paths.product(product.slug)}
        item={analyticsItemFromProduct(product)}
        listId={listId}
        listName={listName}
      >
        <div className="product-card-media">
          <CatalogMedia image={product.primaryImage} className="object-cover" />
          {badge ? <span className="product-card-badge">{badge}</span> : null}
        </div>
        <div className="product-card-body">
          <Heading className="font-heading text-card-title">{product.name}</Heading>
          {packLabel ? <p className="text-xs text-muted">{packLabel}</p> : null}
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            locale={product.locale}
            unit={product.unit}
            packSize={product.packSize}
            productId={product.id}
            compact
          />
        </div>
      </SelectItemLink>
    </article>
  );
}
