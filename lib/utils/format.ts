import type { AvailabilityStatus, Money } from "@/types/catalog";

export function formatMoney(money: Money): string {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: money.currency,
    }).format(money.amount);
  } catch {
    return `${money.currency} ${money.amount.toFixed(2)}`;
  }
}

export function availabilityLabel(status: AvailabilityStatus): string {
  switch (status) {
    case "in_stock":
      return "In stock";
    case "out_of_stock":
      return "Out of stock";
    case "preorder":
      return "Available to pre-order";
    case "discontinued":
      return "Discontinued";
    default:
      return "Availability to be confirmed";
  }
}
