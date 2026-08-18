/**
 * Planned GA4 ecommerce event names. Do not install analytics scripts in Phase 1.
 */
export const analyticsEvents = {
  viewItem: "view_item",
  viewItemList: "view_item_list",
  selectItem: "select_item",
  addToCart: "add_to_cart",
  viewCart: "view_cart",
  beginCheckout: "begin_checkout",
  purchase: "purchase",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];
