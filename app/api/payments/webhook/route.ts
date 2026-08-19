import { NextRequest, NextResponse } from "next/server";
import { getPaymentAdapter } from "@/lib/payments";
import { applyProviderPayment } from "@/services/orders";

export async function POST(request: NextRequest) {
  const adapter = getPaymentAdapter();
  const rawBody = await request.text();
  const result = await adapter.handleWebhook({ headers: request.headers, rawBody });
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason ?? "rejected" }, { status: 400 });
  }
  if (result.orderId && result.status && result.status !== "awaiting_payment") {
    const applied = await applyProviderPayment({
      orderId: result.orderId,
      status: result.status,
      provider: adapter.id,
      externalRef: result.externalRef,
    });
    if (!applied.ok) {
      return NextResponse.json({ ok: false, reason: "order_not_found" }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      duplicate: applied.duplicate,
      orderId: result.orderId,
      status: result.status,
    });
  }
  return NextResponse.json({
    ok: true,
    duplicate: Boolean(result.duplicate),
    orderId: result.orderId ?? null,
    status: result.status ?? null,
  });
}
