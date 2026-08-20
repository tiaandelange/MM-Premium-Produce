import { formatMoney } from "@/lib/utils/format";
import { getMessages } from "@/lib/i18n/messages";
import { priceUnitLabel, type PriceUnit } from "@/lib/catalog/price-unit";
import type { AppLocale } from "@/lib/i18n/config";
import type { Money } from "@/types/catalog";

export function PriceDisplay({
  price,
  compareAtPrice,
  compact = false,
  locale = "en",
  unit,
}: {
  price: Money | null;
  compareAtPrice?: Money | null;
  compact?: boolean;
  locale?: AppLocale;
  unit?: PriceUnit | null;
}) {
  const messages = getMessages(locale);
  if (!price) {
    return <span className="text-muted">{messages.priceToConfirm}</span>;
  }

  const suffix = unit ? priceUnitLabel(unit, locale) : null;

  // Use span (not p) so PriceDisplay can safely nest inside summary paragraphs.
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`${compact ? "text-base" : "text-xl"} font-semibold text-ink`}>
        {formatMoney(price, locale)}
        {suffix ? (
          <span className="ml-1 text-xs font-normal tracking-wide text-muted">{suffix}</span>
        ) : null}
      </span>
      {compareAtPrice ? (
        <span className="text-muted line-through">{formatMoney(compareAtPrice, locale)}</span>
      ) : null}
    </span>
  );
}
