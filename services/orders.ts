import { desc, eq } from "drizzle-orm";
import { confirmedValue, getSiteConfig } from "@/config/site";
import { getDb } from "@/db/client";
import { customers, orderItems, orders, payments } from "@/db/schema";
import { getHydratedCart, clearCart } from "@/services/cart";
import { decrementStock, restoreStock } from "@/services/inventory";
import { getDeliveryRule, listPublishedDeliveryRules, matchDeliveryDestination, quoteDeliveryFee } from "@/services/delivery";
import { getPaymentAdapter } from "@/lib/payments";
import { createPaths } from "@/lib/i18n/paths";
import { getMessages } from "@/lib/i18n/messages";
import { isAllowedDeliveryProvince } from "@/lib/commerce/provinces";
import { localeTagFromAppLocale, appLocaleFromTag } from "@/lib/commerce/locale-tag";
import { grantOrderAccess } from "@/lib/commerce/order-access";
import type { CommerceErrorKey } from "@/lib/commerce/status";
import type { CheckoutInput, OrderRecord } from "@/types/commerce";
import type { AppLocale } from "@/lib/i18n/config";
import type { DeliveryPolicy } from "@/types/site";

function money(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  return typeof value === "number" ? value : Number(value);
}

function quoteSiteDeliveryFee(subtotal: number, policy: DeliveryPolicy): number {
  if (policy.freeDeliveryThresholdZar != null && subtotal >= policy.freeDeliveryThresholdZar) {
    return 0;
  }
  return policy.feeZar;
}

function mapOrder(
  row: typeof orders.$inferSelect,
  items: Array<typeof orderItems.$inferSelect>,
): OrderRecord {
  return {
    id: row.id,
    number: row.number,
    locale: appLocaleFromTag(row.localeTag) || row.locale,
    localeTag: row.localeTag,
    customerName: row.customerName,
    customerFirstName: row.customerFirstName,
    customerLastName: row.customerLastName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    deliveryName: row.deliveryName,
    deliveryPhone: row.deliveryPhone,
    deliveryLine1: row.deliveryLine1,
    deliverySuburb: row.deliverySuburb,
    deliveryCity: row.deliveryCity,
    deliveryProvince: row.deliveryProvince,
    deliveryPostalCode: row.deliveryPostalCode,
    deliveryNotes: row.deliveryNotes,
    deliveryWindowSnapshot: row.deliveryWindowSnapshot,
    subtotalAmount: money(row.subtotalAmount),
    deliveryFeeAmount: money(row.deliveryFeeAmount),
    discountAmount: money(row.discountAmount),
    taxAmount: money(row.taxAmount),
    totalAmount: money(row.totalAmount),
    currency: row.currency,
    paymentStatus: row.paymentStatus,
    fulfilmentStatus: row.fulfilmentStatus,
    deliveryStatus: row.deliveryStatus,
    paymentProvider: row.paymentProvider,
    paymentInstruction: row.paymentInstruction,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    items: items.map((item) => ({
      id: item.id,
      skuSnapshot: item.skuSnapshot,
      nameSnapshot: item.nameSnapshot,
      variantNameSnapshot: item.variantNameSnapshot,
      quantity: item.quantity,
      unitPriceAmount: money(item.unitPriceAmount),
      lineTotalAmount: money(item.lineTotalAmount),
    })),
  };
}

export async function createOrderFromCart(
  input: CheckoutInput,
): Promise<{ ok: true; order: OrderRecord } | { ok: false; errorKey: CommerceErrorKey; errorValues?: Record<string, string> }> {
  if (input.idempotencyKey) {
    const existing = await getOrderByIdempotencyKey(input.idempotencyKey);
    if (existing) {
      await grantOrderAccess(existing.id);
      return { ok: true, order: existing };
    }
  }

  const cart = await getHydratedCart(input.locale);
  const sellable = cart.items.filter((item) => !item.errorKey && item.unitPrice && item.maxQuantity > 0);
  if (!sellable.length) {
    return { ok: false, errorKey: "cartEmptyOrInvalid" };
  }
  if (cart.hasErrors) {
    return { ok: false, errorKey: "fixCartBeforeCheckout" };
  }

  const publishedRules = await listPublishedDeliveryRules();
  let deliveryFee = 0;
  let deliveryWindow: string | null = null;
  let matchedRuleId: string | null = null;
  const site = getSiteConfig();
  const deliveryPolicy = confirmedValue(site.deliveryPolicy);
  const deliveryScope = confirmedValue(site.deliveryScope);

  if (!isAllowedDeliveryProvince(input.deliveryProvince, input.locale, deliveryScope)) {
    return { ok: false, errorKey: "destinationNotSupported" };
  }

  if (publishedRules.length) {
    const selected = input.deliveryRuleId ? await getDeliveryRule(input.deliveryRuleId) : null;
    const matched =
      selected?.published
        ? selected
        : matchDeliveryDestination(publishedRules, {
            suburb: input.deliverySuburb,
            city: input.deliveryCity,
            postalCode: input.deliveryPostalCode,
          });
    const destinationOk = matched
      ? matchDeliveryDestination([matched], {
          suburb: input.deliverySuburb,
          city: input.deliveryCity,
          postalCode: input.deliveryPostalCode,
        })
      : null;
    if (!matched || !destinationOk) {
      return { ok: false, errorKey: "destinationNotSupported" };
    }
    if (matched.minOrder && (cart.subtotal?.amount ?? 0) < matched.minOrder.amount) {
      return {
        ok: false,
        errorKey: "minOrderForArea",
        errorValues: { amount: String(matched.minOrder.amount) },
      };
    }
    deliveryFee = quoteDeliveryFee(matched, cart.subtotal?.amount ?? 0);
    deliveryWindow =
      matched.estimatedWindow ||
      (matched.estimatedMinDays != null && matched.estimatedMaxDays != null
        ? `${matched.estimatedMinDays}-${matched.estimatedMaxDays}`
        : null);
    matchedRuleId = matched.id;
  } else if (deliveryPolicy) {
    deliveryFee = quoteSiteDeliveryFee(cart.subtotal?.amount ?? 0, deliveryPolicy);
    deliveryWindow = deliveryPolicy.timeframe;
  }

  const currency = cart.currency;
  const subtotal = cart.subtotal?.amount ?? 0;
  const discount = 0;
  const tax = 0;
  const total = subtotal + deliveryFee - discount + tax;
  const db = getDb();
  const orderId = `ord_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const number = `MM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${orderId.slice(-4).toUpperCase()}`;
  const customerId = `cus_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const accessToken = crypto.randomUUID();
  const fullName = `${input.customerFirstName} ${input.customerLastName}`.trim();

  const decremented: Array<{ productId: string; variantId: string | null; quantity: number }> = [];

  async function undoDecrement() {
    for (const taken of decremented) {
      await restoreStock(
        { ownerType: taken.variantId ? "variant" : "product", productId: taken.productId, variantId: taken.variantId },
        taken.quantity,
      );
    }
  }

  for (const line of sellable) {
    const ok = await decrementStock(
      { ownerType: line.variantId ? "variant" : "product", productId: line.productId, variantId: line.variantId },
      line.quantity,
    );
    if (!ok) {
      await undoDecrement();
      return { ok: false, errorKey: "stockChanged" };
    }
    decremented.push({ productId: line.productId, variantId: line.variantId, quantity: line.quantity });
  }

  try {
    await db.insert(customers).values({
      id: customerId,
      email: input.customerEmail.trim().toLowerCase(),
      name: fullName,
      phone: input.customerPhone?.trim() || null,
      locale: input.locale,
    });
    await db.insert(orders).values({
      id: orderId,
      number,
      customerId,
      locale: input.locale,
      localeTag: localeTagFromAppLocale(input.locale),
      customerName: fullName,
      customerFirstName: input.customerFirstName.trim(),
      customerLastName: input.customerLastName.trim(),
      customerEmail: input.customerEmail.trim().toLowerCase(),
      customerPhone: input.customerPhone?.trim() || null,
      deliveryName: fullName,
      deliveryPhone: input.customerPhone?.trim() || null,
      deliveryLine1: input.deliveryLine1.trim(),
      deliverySuburb: input.deliverySuburb?.trim() || null,
      deliveryCity: input.deliveryCity?.trim() || null,
      deliveryProvince: input.deliveryProvince?.trim() || null,
      deliveryPostalCode: input.deliveryPostalCode?.trim() || null,
      deliveryNotes: input.deliveryNotes?.trim() || null,
      deliveryRuleId: matchedRuleId,
      deliveryFeeAmount: deliveryFee.toFixed(2),
      deliveryWindowSnapshot: deliveryWindow ?? (publishedRules.length ? null : "unconfigured"),
      subtotalAmount: subtotal.toFixed(2),
      discountAmount: discount.toFixed(2),
      taxAmount: tax.toFixed(2),
      totalAmount: total.toFixed(2),
      currency,
      paymentStatus: "awaiting_payment",
      fulfilmentStatus: "unfulfilled",
      deliveryStatus: "unscheduled",
      paymentProvider: "unconfigured",
      accessToken,
      idempotencyKey: input.idempotencyKey || null,
      status: "pending_payment",
    });
    await db.insert(orderItems).values(
      sellable.map((line) => ({
        id: `oit_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
        orderId,
        productId: line.productId,
        variantId: line.variantId,
        skuSnapshot: line.sku,
        nameSnapshot: line.name,
        variantNameSnapshot: line.variantName,
        quantity: line.quantity,
        unitPriceAmount: (line.unitPrice?.amount ?? 0).toFixed(2),
        lineTotalAmount: (line.lineTotal?.amount ?? 0).toFixed(2),
        currency,
      })),
    );

    const adapter = getPaymentAdapter();
    const payment = await adapter.createPayment({
      orderId,
      amount: total,
      currency,
      customerEmail: input.customerEmail.trim().toLowerCase(),
      returnPath: createPaths(input.locale).orderConfirmation(orderId),
    });
    const instruction =
      payment.provider === "unconfigured"
        ? getMessages(input.locale).paymentNotConfigured
        : payment.instruction;
    await db.insert(payments).values({
      id: `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
      orderId,
      provider: payment.provider,
      status: payment.status,
      amount: total.toFixed(2),
      currency,
      externalRef: payment.externalRef ?? null,
    });
    await db
      .update(orders)
      .set({
        paymentStatus: payment.status,
        paymentProvider: payment.provider,
        paymentInstruction: instruction,
        status: payment.status === "paid" ? "paid" : "pending_payment",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    await clearCart();
    await grantOrderAccess(orderId);
    const created = await getOrderById(orderId);
    if (!created) return { ok: false, errorKey: "orderCreateFailed" };
    return { ok: true, order: created };
  } catch (error) {
    console.error("createOrderFromCart failed", error);
    if (input.idempotencyKey) {
      const existing = await getOrderByIdempotencyKey(input.idempotencyKey);
      if (existing) {
        await undoDecrement();
        await grantOrderAccess(existing.id);
        return { ok: true, order: existing };
      }
    }
    await undoDecrement();
    return { ok: false, errorKey: "orderCreateFailed" };
  }
}

export async function applyProviderPayment(input: {
  orderId: string;
  status: "paid" | "failed" | "awaiting_payment";
  provider?: string;
  externalRef?: string;
}): Promise<{ ok: true; duplicate: boolean } | { ok: false }> {
  const db = getDb();
  const order = await getOrderById(input.orderId);
  if (!order) return { ok: false };

  if (input.externalRef) {
    const [existingRef] = await db
      .select()
      .from(payments)
      .where(eq(payments.externalRef, input.externalRef))
      .limit(1);
    if (existingRef && existingRef.status === input.status) {
      return { ok: true, duplicate: true };
    }
  }

  if (order.paymentStatus === input.status) {
    return { ok: true, duplicate: true };
  }

  if (order.paymentStatus === "paid" && input.status === "paid") {
    return { ok: true, duplicate: true };
  }

  const [paymentRow] = await db.select().from(payments).where(eq(payments.orderId, input.orderId)).limit(1);
  if (paymentRow) {
    await db
      .update(payments)
      .set({
        status: input.status,
        provider: input.provider || paymentRow.provider,
        externalRef: input.externalRef ?? paymentRow.externalRef,
        processedAt: new Date(),
      })
      .where(eq(payments.id, paymentRow.id));
  } else {
    await db.insert(payments).values({
      id: `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
      orderId: input.orderId,
      provider: input.provider || order.paymentProvider,
      status: input.status,
      amount: order.totalAmount.toFixed(2),
      currency: order.currency,
      externalRef: input.externalRef ?? null,
      processedAt: new Date(),
    });
  }
  await updateOrderStatuses({
    id: input.orderId,
    paymentStatus: input.status === "awaiting_payment" ? "awaiting_payment" : input.status,
  });
  return { ok: true, duplicate: false };
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!row) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return mapOrder(row, items);
}

export async function getOrderByIdempotencyKey(key: string): Promise<OrderRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(orders).where(eq(orders.idempotencyKey, key)).limit(1);
  if (!row) return null;
  return getOrderById(row.id);
}

export async function listOrders(): Promise<OrderRecord[]> {
  const db = getDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const items = await db.select().from(orderItems);
  return rows.map((row) => mapOrder(row, items.filter((item) => item.orderId === row.id)));
}

export async function updateOrderStatuses(input: {
  id: string;
  paymentStatus?: string;
  fulfilmentStatus?: string;
  deliveryStatus?: string;
}): Promise<void> {
  const db = getDb();
  const patch: Partial<typeof orders.$inferInsert> = { updatedAt: new Date() };
  if (input.paymentStatus) patch.paymentStatus = input.paymentStatus;
  if (input.fulfilmentStatus) patch.fulfilmentStatus = input.fulfilmentStatus;
  if (input.deliveryStatus) patch.deliveryStatus = input.deliveryStatus;
  if (input.paymentStatus === "paid") patch.status = "paid";
  if (input.fulfilmentStatus === "processing") patch.status = "processing";
  if (input.fulfilmentStatus === "ready") patch.status = "ready";
  if (input.fulfilmentStatus === "fulfilled") patch.status = "fulfilled";
  if (input.fulfilmentStatus === "cancelled" || input.paymentStatus === "cancelled") patch.status = "cancelled";
  if (input.paymentStatus === "refunded") patch.status = "refunded";
  await db.update(orders).set(patch).where(eq(orders.id, input.id));
}

export function orderConfirmationPath(locale: AppLocale, id: string) {
  return createPaths(locale).orderConfirmation(id);
}
