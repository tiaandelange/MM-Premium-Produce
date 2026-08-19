export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "processing",
  "ready",
  "fulfilled",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "awaiting_payment",
  "paid",
  "failed",
  "cancelled",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const FULFILMENT_STATUSES = [
  "unfulfilled",
  "processing",
  "ready",
  "fulfilled",
  "cancelled",
] as const;
export type FulfilmentStatus = (typeof FULFILMENT_STATUSES)[number];

export const DELIVERY_STATUSES = [
  "unscheduled",
  "scheduled",
  "out_for_delivery",
  "delivered",
  "failed",
  "cancelled",
] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const COMMERCE_ERROR_KEYS = [
  "chooseValidOption",
  "productUnavailable",
  "insufficientStock",
  "onlyCountAvailable",
  "itemNoLongerAvailable",
  "itemNotInCatalogue",
  "productNotFound",
  "cartEmptyOrInvalid",
  "fixCartBeforeCheckout",
  "chooseValidDelivery",
  "minOrderForArea",
  "stockChanged",
  "orderCreateFailed",
  "destinationNotSupported",
  "invalidEmail",
  "invalidPhone",
  "requiredField",
] as const;
export type CommerceErrorKey = (typeof COMMERCE_ERROR_KEYS)[number];
