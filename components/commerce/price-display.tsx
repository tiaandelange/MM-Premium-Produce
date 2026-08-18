import { formatMoney } from "@/lib/utils/format";
import type { Money } from "@/types/catalog";

export function PriceDisplay({
  price,
  compareAtPrice,
  compact = false,
}: {
  price: Money | null;
  compareAtPrice?: Money | null;
  compact?: boolean;
}) {
  if (!price) {
    return <p className="text-muted">Price to be confirmed</p>;
  }

  return (
    <p className="flex flex-wrap items-baseline gap-3">
      <span className={`${compact ? "text-base" : "text-xl"} font-semibold text-ink`}>
        {formatMoney(price)}
      </span>
      {compareAtPrice ? (
        <span className="text-muted line-through">{formatMoney(compareAtPrice)}</span>
      ) : null}
    </p>
  );
}
