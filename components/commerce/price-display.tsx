import { formatMoney } from "@/lib/utils/format";
import { getMessages } from "@/lib/i18n/messages";
import {
  resolveDisplayPrice,
  sellingUnitForDisplay,
} from "@/lib/catalog/price-display-model";
import { priceUnitLabel, type PriceUnit } from "@/lib/catalog/price-unit";
import type { AppLocale } from "@/lib/i18n/config";
import type { Money } from "@/types/catalog";

export function PriceDisplay({
  price,
  compareAtPrice,
  compact = false,
  locale = "en",
  unit,
  packSize,
  productId,
  showComparison = true,
}: {
  price: Money | null;
  compareAtPrice?: Money | null;
  compact?: boolean;
  locale?: AppLocale;
  unit?: PriceUnit | string | null;
  packSize?: string | null;
  productId?: string;
  showComparison?: boolean;
}) {
  const messages = getMessages(locale);
  const display = resolveDisplayPrice({
    price,
    unit: typeof unit === "string" ? unit : unit ?? null,
    packSize,
    productId,
  });

  if (!display.sellingPrice) {
    return <span className="text-muted">{messages.priceToConfirm}</span>;
  }

  const suffixUnit = sellingUnitForDisplay(display.sellingUnit, display.packLabel);
  const suffix = suffixUnit ? priceUnitLabel(suffixUnit, locale) : null;

  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`${compact ? "text-base" : "text-xl"} font-semibold text-ink`}>
          {formatMoney(display.sellingPrice, locale)}
          {suffix ? (
            <span className="ml-1 text-xs font-normal tracking-wide text-muted">{suffix}</span>
          ) : null}
        </span>
        {compareAtPrice ? (
          <span className="text-muted line-through">{formatMoney(compareAtPrice, locale)}</span>
        ) : null}
      </span>
      {showComparison && display.comparisonPer100g ? (
        <span className="text-xs text-muted">
          {formatMoney(display.comparisonPer100g, locale)} {messages.comparisonPer100g}
        </span>
      ) : null}
    </span>
  );
}
