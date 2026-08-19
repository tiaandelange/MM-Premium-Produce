"use client";

import { useEffect } from "react";
import { analyticsEvents, type AnalyticsEventName } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import type { AnalyticsItem } from "@/lib/analytics/items";

export function TrackEvent({
  event,
  params,
  onceKey,
}: {
  event: AnalyticsEventName;
  params: Record<string, unknown>;
  onceKey?: string;
}) {
  const serialized = JSON.stringify(params);
  useEffect(() => {
    if (onceKey) {
      const storageKey = `mm_ga4:${onceKey}`;
      try {
        if (sessionStorage.getItem(storageKey)) return;
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* private mode */
      }
    }
    trackEvent(event, JSON.parse(serialized) as Record<string, unknown>);
  }, [event, onceKey, serialized]);
  return null;
}

export function TrackItemList({
  listId,
  listName,
  items,
}: {
  listId: string;
  listName: string;
  items: AnalyticsItem[];
}) {
  return (
    <TrackEvent
      event={analyticsEvents.viewItemList}
      onceKey={`view_item_list:${listId}`}
      params={{ item_list_id: listId, item_list_name: listName, items }}
    />
  );
}

export function TrackViewItem({ items, value, currency }: { items: AnalyticsItem[]; value?: number; currency?: string }) {
  return (
    <TrackEvent
      event={analyticsEvents.viewItem}
      onceKey={`view_item:${items[0]?.item_id ?? "unknown"}`}
      params={{ currency: currency ?? "ZAR", value, items }}
    />
  );
}

export function TrackViewCart({ items, value, currency }: { items: AnalyticsItem[]; value?: number; currency?: string }) {
  return (
    <TrackEvent
      event={analyticsEvents.viewCart}
      params={{ currency: currency ?? "ZAR", value, items }}
    />
  );
}

export function TrackBeginCheckout({
  items,
  value,
  currency,
}: {
  items: AnalyticsItem[];
  value?: number;
  currency?: string;
}) {
  return (
    <TrackEvent
      event={analyticsEvents.beginCheckout}
      params={{ currency: currency ?? "ZAR", value, items }}
    />
  );
}
