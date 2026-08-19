import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeTagFromAppLocale } from "@/lib/commerce/locale-tag";
import type { OrderRecord } from "@/types/commerce";

export type OrderEmailEvent = "received" | "paid" | "processing" | "dispatched" | "cancelled";

export type OrderEmailContent = {
  locale: AppLocale;
  localeTag: string;
  event: OrderEmailEvent;
  subject: string;
  preheader: string;
  heading: string;
  body: string;
  orderNumber: string;
};

const eventCopy: Record<
  AppLocale,
  Record<OrderEmailEvent, { subject: string; preheader: string; heading: string; body: string }>
> = {
  en: {
    received: {
      subject: "We have received your order",
      preheader: "Your M & M Premium Produce order is recorded.",
      heading: "Order received",
      body: "Thank you. We have recorded your order and will confirm payment and delivery next.",
    },
    paid: {
      subject: "Payment received for your order",
      preheader: "Your M & M Premium Produce order is paid.",
      heading: "Payment received",
      body: "Thank you. Payment for this order has been confirmed.",
    },
    processing: {
      subject: "Your order is being prepared",
      preheader: "We are packing your fresh produce.",
      heading: "Order in progress",
      body: "We are preparing your order.",
    },
    dispatched: {
      subject: "Your order is on its way",
      preheader: "Your M & M Premium Produce order has been dispatched.",
      heading: "Order dispatched",
      body: "Your order has left for delivery.",
    },
    cancelled: {
      subject: "Your order has been cancelled",
      preheader: "This M & M Premium Produce order was cancelled.",
      heading: "Order cancelled",
      body: "This order has been cancelled. Contact us if you need help.",
    },
  },
  af: {
    received: {
      subject: "Ons het jou bestelling ontvang",
      preheader: "Jou M & M Premium Produce-bestelling is aangeteken.",
      heading: "Bestelling ontvang",
      body: "Dankie. Ons het jou bestelling aangeteken en sal betaling en aflewering volgende bevestig.",
    },
    paid: {
      subject: "Betaling ontvang vir jou bestelling",
      preheader: "Jou M & M Premium Produce-bestelling is betaal.",
      heading: "Betaling ontvang",
      body: "Dankie. Betaling vir hierdie bestelling is bevestig.",
    },
    processing: {
      subject: "Jou bestelling word voorberei",
      preheader: "Ons pak jou vars produkte.",
      heading: "Bestelling in proses",
      body: "Ons berei jou bestelling voor.",
    },
    dispatched: {
      subject: "Jou bestelling is onderweg",
      preheader: "Jou M & M Premium Produce-bestelling is uitgestuur.",
      heading: "Bestelling uitgestuur",
      body: "Jou bestelling is op pad vir aflewering.",
    },
    cancelled: {
      subject: "Jou bestelling is gekanselleer",
      preheader: "Hierdie M & M Premium Produce-bestelling is gekanselleer.",
      heading: "Bestelling gekanselleer",
      body: "Hierdie bestelling is gekanselleer. Kontak ons as jy hulp nodig het.",
    },
  },
};

export function buildOrderEmail(order: OrderRecord, event: OrderEmailEvent): OrderEmailContent {
  const locale = order.locale;
  const copy = eventCopy[locale][event];
  const messages = getMessages(locale);
  return {
    locale,
    localeTag: order.localeTag || localeTagFromAppLocale(locale),
    event,
    subject: `${copy.subject} (${messages.orderNumber} ${order.number})`,
    preheader: copy.preheader,
    heading: copy.heading,
    body: copy.body,
    orderNumber: order.number,
  };
}

export function isTransactionalEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.TRANSACTIONAL_FROM_EMAIL?.trim());
}

/**
 * Transactional sending is not connected. Callers must not treat a successful
 * order as proof that email was delivered.
 */
export async function queueOrderEmail(
  order: OrderRecord,
  event: OrderEmailEvent,
): Promise<{ queued: false; reason: "not_configured" }> {
  void order;
  void event;
  return { queued: false, reason: "not_configured" };
}
