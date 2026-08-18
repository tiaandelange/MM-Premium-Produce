import { AvailabilityDisplay } from "@/components/commerce/availability-display";
import { PriceDisplay } from "@/components/commerce/price-display";
import type { Product } from "@/types/catalog";

export function ProductOptions({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  if (!variants.length) return null;

  return (
    <section>
      <p className="font-heading text-card-title text-ink">Available options</p>
      <p className="mt-1 text-sm text-muted">
        Options are listed for browsing. Selecting and adding to a basket will be added
        in a later phase.
      </p>
      <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-surface">
        {variants.map((variant) => (
          <li key={variant.id} id={variant.slug} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium text-ink">{variant.name}</p>
              {variant.packSize ? (
                <p className="text-sm text-muted">Pack: {variant.packSize}</p>
              ) : null}
            </div>
            <div className="text-right">
              <PriceDisplay price={variant.price} compact />
              <AvailabilityDisplay status={variant.availability} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
