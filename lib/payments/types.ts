export type PaymentProviderId = "unconfigured";

export type PaymentCreateInput = {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  returnPath: string;
};

export type PaymentCreateResult = {
  provider: PaymentProviderId;
  status: "awaiting_payment" | "paid" | "failed";
  instruction: string;
  redirectUrl?: string;
  externalRef?: string;
};

export type PaymentVerifyInput = {
  orderId: string;
  externalRef?: string;
};

export type PaymentVerifyResult = {
  paid: boolean;
  status: PaymentCreateResult["status"];
  externalRef?: string;
};

export type PaymentWebhookResult = {
  ok: boolean;
  duplicate?: boolean;
  orderId?: string;
  status?: PaymentCreateResult["status"];
  externalRef?: string;
  reason?: string;
};

export type PaymentRefundInput = {
  orderId: string;
  amount?: number;
};

export type PaymentAdapter = {
  id: PaymentProviderId;
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
  verifyPayment(input: PaymentVerifyInput): Promise<PaymentVerifyResult>;
  handleWebhook(input: { headers: Headers; rawBody: string }): Promise<PaymentWebhookResult>;
  refundPayment(input: PaymentRefundInput): Promise<{ ok: boolean; status: "refunded" | "unsupported" }>;
};
