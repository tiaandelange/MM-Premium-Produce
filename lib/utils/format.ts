import { getMessages } from "@/lib/i18n/messages";
import { localeMeta, type AppLocale } from "@/lib/i18n/config";
import type { AvailabilityStatus, Money } from "@/types/catalog";

export function formatMoney(money: Money, locale: AppLocale = "en"): string {
  const amount = Number(money.amount);
  if (money.currency === "ZAR") {
    const [whole, fraction] = amount.toFixed(2).split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `R ${grouped},${fraction}`;
  }
  try {
    return new Intl.NumberFormat(localeMeta[locale].htmlLang, {
      style: "currency",
      currency: money.currency,
    }).format(amount);
  } catch {
    return `${money.currency} ${amount.toFixed(2)}`;
  }
}

export function availabilityLabel(status: AvailabilityStatus, locale: AppLocale = "en"): string {
  const messages = getMessages(locale);
  switch (status) {
    case "in_stock":
      return messages.inStock;
    case "out_of_stock":
      return messages.outOfStock;
    case "preorder":
      return messages.preorder;
    case "discontinued":
      return messages.discontinued;
    default:
      return messages.availabilityUnknown;
  }
}
