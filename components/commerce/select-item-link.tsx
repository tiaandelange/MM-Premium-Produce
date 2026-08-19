"use client";

import Link from "next/link";
import type { Route } from "next";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import type { AnalyticsItem } from "@/lib/analytics/items";

export function SelectItemLink({
  href,
  item,
  listId,
  listName,
  children,
}: {
  href: Route;
  item: AnalyticsItem;
  listId?: string;
  listName?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block text-ink hover:text-ink"
      onClick={() => {
        trackEvent(analyticsEvents.selectItem, {
          item_list_id: listId,
          item_list_name: listName,
          items: [item],
        });
      }}
    >
      {children}
    </Link>
  );
}
