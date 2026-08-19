import { PageHeader } from "@/components/layout/page-header";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { canViewOrder } from "@/lib/commerce/order-access";
import { formatMoney } from "@/lib/utils/format";
import { getOrderById } from "@/services/orders";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const locale = requireLocale(localeParam);
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return buildMetadata({
    title: messages.orderConfirmed,
    description: messages.awaitingPayment,
    path: paths.orderConfirmation(id),
    locale,
    indexable: false,
    followWhenNoindex: false,
  });
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const locale = requireLocale(localeParam);
  if (!(await canViewOrder(id))) notFound();
  const order = await getOrderById(id);
  if (!order) notFound();
  const messages = getMessages(locale);
  const paths = createPaths(locale);

  return (
    <div className="site-container max-w-3xl space-y-8 py-12">
      <PageHeader title={messages.orderConfirmed} description={`${messages.orderNumber}: ${order.number}`} />
      <p className="text-muted">{order.paymentInstruction || messages.paymentNotConfigured}</p>
      <section className="rounded-card border border-line bg-surface p-4 text-sm">
        <h2 className="font-heading text-card-title text-ink">{messages.contactDetails}</h2>
        <p className="mt-2 text-muted">
          {order.customerFirstName} {order.customerLastName}
          <br />
          {order.customerEmail}
          {order.customerPhone ? (
            <>
              <br />
              {order.customerPhone}
            </>
          ) : null}
        </p>
      </section>
      <section className="rounded-card border border-line bg-surface p-4 text-sm">
        <h2 className="font-heading text-card-title text-ink">{messages.deliveryAddress}</h2>
        <p className="mt-2 text-muted">
          {order.deliveryLine1}
          <br />
          {[order.deliverySuburb, order.deliveryCity, order.deliveryProvince, order.deliveryPostalCode]
            .filter(Boolean)
            .join(", ")}
        </p>
      </section>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-4 py-3">
            <span>
              {item.nameSnapshot}
              {item.variantNameSnapshot ? ` · ${item.variantNameSnapshot}` : ""} × {item.quantity}
            </span>
            <span>{formatMoney({ amount: item.lineTotalAmount, currency: order.currency }, locale)}</span>
          </li>
        ))}
      </ul>
      <p className="font-medium">
        {messages.total}: {formatMoney({ amount: order.totalAmount, currency: order.currency }, locale)}
      </p>
      <Link href={paths.shop} className="btn-primary">
        {messages.backToShop}
      </Link>
    </div>
  );
}
