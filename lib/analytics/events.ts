export const analyticsEvents = {
  viewItemList: "view_item_list",
  selectItem: "select_item",
  viewItem: "view_item",
  addToCart: "add_to_cart",
  removeFromCart: "remove_from_cart",
  viewCart: "view_cart",
  beginCheckout: "begin_checkout",
  addShippingInfo: "add_shipping_info",
  addPaymentInfo: "add_payment_info",
  purchase: "purchase",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export const ANALYTICS_CONSENT_COOKIE = "mm_analytics_consent";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

export function isGaConfigured(): boolean {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
}

export type AnalyticsConsent = "granted" | "denied";
