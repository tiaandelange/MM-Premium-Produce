"use client";

import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import type { AnalyticsItem } from "@/lib/analytics/items";
import type { AppLocale } from "@/lib/i18n/config";

export function RemoveFromCartForm({
  locale,
  productId,
  variantId,
  label,
  currency,
  value,
  item,
}: {
  locale: AppLocale;
  productId: string;
  variantId?: string | null;
  label: string;
  currency: string;
  value?: number;
  item: AnalyticsItem;
}) {
  return (
    <form
      action="/api/cart"
      method="post"
      onSubmit={() => {
        trackEvent(analyticsEvents.removeFromCart, {
          currency,
          value,
          items: [item],
        });
      }}
    >
      <input type="hidden" name="intent" value="remove" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={variantId ?? ""} />
      <button
        type="submit"
        className="text-sm text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      >
        {label}
      </button>
    </form>
  );
}
