"use client";

import { useRef } from "react";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import type { AnalyticsItem } from "@/lib/analytics/items";

export function CheckoutAnalytics({
  items,
  value,
  currency,
  children,
}: {
  items: AnalyticsItem[];
  value?: number;
  currency: string;
  children: React.ReactNode;
}) {
  const shippingSent = useRef(false);
  const payload = { currency, value, items };

  return (
    <form
      action="/api/checkout"
      method="post"
      className="space-y-8"
      onChange={(event) => {
        const target = event.target as HTMLElement;
        const name = "name" in target ? String((target as HTMLInputElement).name || "") : "";
        if (!shippingSent.current && name.startsWith("delivery")) {
          shippingSent.current = true;
          trackEvent(analyticsEvents.addShippingInfo, {
            ...payload,
            shipping_tier: "to_be_confirmed",
          });
        }
      }}
      onSubmit={() => {
        trackEvent(analyticsEvents.addPaymentInfo, {
          ...payload,
          payment_type: "unconfigured",
        });
      }}
    >
      {children}
    </form>
  );
}
