import { unconfiguredPaymentAdapter } from "@/lib/payments/unconfigured";
import type { PaymentAdapter, PaymentProviderId } from "@/lib/payments/types";

const adapters: Record<PaymentProviderId, PaymentAdapter> = {
  unconfigured: unconfiguredPaymentAdapter,
};

export function getPaymentAdapter(): PaymentAdapter {
  const configured = process.env.PAYMENT_PROVIDER?.trim();
  if (!configured || configured === "unconfigured" || configured === "none") {
    return adapters.unconfigured;
  }
  return adapters.unconfigured;
}
