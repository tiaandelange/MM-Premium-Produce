"use client";

import { useEffect } from "react";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import { purchasePayload } from "@/lib/analytics/items";
import type { OrderRecord } from "@/types/commerce";

const COOKIE_PREFIX = "mm_ga4_purchase_";

function alreadyTracked(orderId: string): boolean {
  try {
    if (sessionStorage.getItem(`${COOKIE_PREFIX}${orderId}`)) return true;
  } catch {
    /* ignore */
  }
  return document.cookie.includes(`${COOKIE_PREFIX}${orderId}=1`);
}

function markTracked(orderId: string) {
  try {
    sessionStorage.setItem(`${COOKIE_PREFIX}${orderId}`, "1");
  } catch {
    /* ignore */
  }
  document.cookie = `${COOKIE_PREFIX}${orderId}=1; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function PurchaseEvent({
  order,
}: {
  order: Pick<OrderRecord, "id" | "number" | "currency" | "totalAmount" | "items">;
}) {
  useEffect(() => {
    if (alreadyTracked(order.id)) return;
    trackEvent(analyticsEvents.purchase, purchasePayload(order));
    markTracked(order.id);
  }, [order]);
  return null;
}
