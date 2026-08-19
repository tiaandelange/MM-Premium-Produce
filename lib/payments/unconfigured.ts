import type {
  PaymentAdapter,
  PaymentCreateResult,
  PaymentVerifyResult,
  PaymentWebhookResult,
} from "@/lib/payments/types";

export const unconfiguredPaymentAdapter: PaymentAdapter = {
  id: "unconfigured",
  async createPayment(): Promise<PaymentCreateResult> {
    return {
      provider: "unconfigured",
      status: "awaiting_payment",
      instruction:
        "A payment provider has not been connected yet. The order is recorded and awaiting payment confirmation from M & M Premium Produce.",
    };
  },
  async verifyPayment(): Promise<PaymentVerifyResult> {
    return { paid: false, status: "awaiting_payment" };
  },
  async handleWebhook(): Promise<PaymentWebhookResult> {
    return { ok: false, reason: "unconfigured" };
  },
  async refundPayment() {
    return { ok: false, status: "unsupported" as const };
  },
};
