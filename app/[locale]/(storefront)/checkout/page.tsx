import { PriceDisplay } from "@/components/commerce/price-display";
import { PlaceOrderButton } from "@/components/commerce/place-order-button";
import { CheckoutAnalytics } from "@/components/analytics/checkout-analytics";
import { TrackBeginCheckout } from "@/components/analytics/track-event";
import { analyticsItemsFromCart, analyticsValue } from "@/lib/analytics/items";
import { PageHeader } from "@/components/layout/page-header";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { saProvinceOptions } from "@/lib/commerce/provinces";
import { resolveCommerceNotice } from "@/lib/commerce/errors";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHydratedCart } from "@/services/cart";
import { listPublishedDeliveryRules } from "@/services/delivery";
import { formatMoney } from "@/lib/utils/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return buildMetadata({
    title: messages.checkout,
    description: messages.orderSummary,
    path: paths.checkout,
    locale,
    enPath: createPaths("en").checkout,
    afPath: createPaths("af").checkout,
    indexable: false,
    followWhenNoindex: false,
  });
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        className="field-control w-full"
      />
    </label>
  );
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = requireLocale((await params).locale);
  const query = await searchParams;
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const [cart, rules] = await Promise.all([getHydratedCart(locale), listPublishedDeliveryRules()]);
  const error = resolveCommerceNotice(locale, typeof query.error === "string" ? query.error : null);
  const provinces = saProvinceOptions(locale);
  const idempotencyKey = crypto.randomUUID();
  const checkoutItems = analyticsItemsFromCart(cart);
  const checkoutValue = analyticsValue(checkoutItems);

  if (!cart.items.length) {
    return (
      <div className="site-container space-y-6 py-12">
        <PageHeader title={messages.checkout} />
        <p className="text-muted">{messages.emptyCart}</p>
        <Link href={paths.cart} className="btn-primary">
          {messages.cart}
        </Link>
      </div>
    );
  }

  return (
    <div className="site-container grid gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-8">
        <PageHeader title={messages.checkout} />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <TrackBeginCheckout items={checkoutItems} value={checkoutValue} currency={cart.currency} />
        <CheckoutAnalytics items={checkoutItems} value={checkoutValue} currency={cart.currency}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <section className="space-y-4">
            <h2 className="text-section-title">{messages.contactDetails}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={messages.firstName} name="customerFirstName" autoComplete="given-name" />
              <Field label={messages.lastName} name="customerLastName" autoComplete="family-name" />
            </div>
            <Field label={messages.email} name="customerEmail" type="email" autoComplete="email" />
            <Field label={messages.phone} name="customerPhone" type="tel" autoComplete="tel" />
          </section>
          <section className="space-y-4">
            <h2 className="text-section-title">{messages.deliveryAddress}</h2>
            <Field label={messages.addressLine} name="deliveryLine1" autoComplete="address-line1" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={messages.suburb} name="deliverySuburb" autoComplete="address-level3" />
              <Field label={messages.city} name="deliveryCity" autoComplete="address-level2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-ink">{messages.province}</span>
                <input
                  required
                  name="deliveryProvince"
                  list="sa-provinces"
                  autoComplete="address-level1"
                  className="field-control w-full"
                />
                <datalist id="sa-provinces">
                  {provinces.map((province) => (
                    <option key={province} value={province} />
                  ))}
                </datalist>
              </label>
              <Field label={messages.postalCode} name="deliveryPostalCode" autoComplete="postal-code" />
            </div>
            {rules.length ? (
              <div className="rounded-sm border border-line bg-surface p-4 text-sm text-muted">
                <p className="font-medium text-ink">{messages.servedAreas}</p>
                <ul className="mt-2 list-disc pl-5">
                  {rules.map((rule) => (
                    <li key={rule.id}>
                      {rule.name}
                      {rule.suburb ? ` · ${rule.suburb}` : ""}
                      {rule.postalCode ? ` · ${rule.postalCode}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted">{messages.noDeliveryRules}</p>
            )}
            <label className="block space-y-1">
              <span className="text-sm font-medium text-ink">{messages.deliveryNotes}</span>
              <textarea
                name="deliveryNotes"
                rows={3}
                className="field-control w-full min-h-24"
              />
            </label>
          </section>
          <PlaceOrderButton label={messages.placeOrder} pendingLabel={messages.placingOrder} />
        </CheckoutAnalytics>
      </div>
      <aside className="card-surface h-fit space-y-4 p-5">
        <h2 className="font-heading text-card-title text-ink">{messages.orderSummary}</h2>
        <ul className="space-y-2 text-sm">
          {cart.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3">
              <span>
                {item.name}
                {item.variantName ? ` · ${item.variantName}` : ""} × {item.quantity}
              </span>
              {item.lineTotal ? <PriceDisplay price={item.lineTotal} compact locale={locale} /> : null}
            </li>
          ))}
        </ul>
        <p className="flex justify-between text-sm">
          <span>{messages.subtotal}</span>
          {cart.subtotal ? <PriceDisplay price={cart.subtotal} compact locale={locale} /> : null}
        </p>
        <p className="flex justify-between text-sm">
          <span>{messages.deliveryFee}</span>
          <span>
            {rules.length ? messages.deliveryFeePending : formatMoney({ amount: 0, currency: cart.currency }, locale)}
          </span>
        </p>
        <p className="flex justify-between font-medium">
          <span>{messages.total}</span>
          <span>
            {rules.length
              ? messages.totalConfirmedOnOrder
              : formatMoney({ amount: cart.subtotal?.amount ?? 0, currency: cart.currency }, locale)}
          </span>
        </p>
        <p className="text-sm text-muted">{messages.paymentNotConfigured}</p>
      </aside>
    </div>
  );
}
