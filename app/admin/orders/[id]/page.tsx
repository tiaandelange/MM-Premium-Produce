import { updateOrderStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/guards";
import { DELIVERY_STATUSES, FULFILMENT_STATUSES, PAYMENT_STATUSES } from "@/lib/commerce/status";
import { formatMoney } from "@/lib/utils/format";
import { getOrderById } from "@/services/orders";
import { notFound } from "next/navigation";

export const metadata = { title: "Order" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-page-title">{order.number}</h1>
        <p className="mt-2 text-muted">
          {order.customerFirstName} {order.customerLastName} · {order.customerEmail} · {order.localeTag} ·{" "}
          {order.createdAt.slice(0, 10)}
        </p>
        <p className="mt-1 text-sm text-muted">
          Payment {order.paymentStatus} · Fulfilment {order.fulfilmentStatus} · Order {order.status}
        </p>
      </header>
      <section className="card-surface p-5">
        <h2 className="font-heading text-card-title">Delivery snapshot</h2>
        <p className="mt-2 text-sm text-muted">
          {order.deliveryLine1}
          <br />
          {[order.deliverySuburb, order.deliveryCity, order.deliveryProvince, order.deliveryPostalCode]
            .filter(Boolean)
            .join(", ")}
          {order.deliveryWindowSnapshot ? (
            <>
              <br />
              Window: {order.deliveryWindowSnapshot}
            </>
          ) : null}
        </p>
      </section>
      <section className="card-surface p-5">
        <h2 className="font-heading text-card-title">Items</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.nameSnapshot}
                {item.variantNameSnapshot ? ` · ${item.variantNameSnapshot}` : ""} × {item.quantity} ({item.skuSnapshot})
              </span>
              <span>{formatMoney({ amount: item.lineTotalAmount, currency: order.currency })}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-medium">
          Total {formatMoney({ amount: order.totalAmount, currency: order.currency })}
        </p>
      </section>
      <form action={updateOrderStatusAction} className="card-surface grid gap-4 p-5 md:grid-cols-3">
        <input type="hidden" name="id" value={order.id} />
        <label className="space-y-1 text-sm">
          Payment
          <select name="paymentStatus" defaultValue={order.paymentStatus} className="w-full rounded-sm border border-line px-3 py-2">
            {PAYMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          Fulfilment
          <select name="fulfilmentStatus" defaultValue={order.fulfilmentStatus} className="w-full rounded-sm border border-line px-3 py-2">
            {FULFILMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          Delivery
          <select name="deliveryStatus" defaultValue={order.deliveryStatus} className="w-full rounded-sm border border-line px-3 py-2">
            {DELIVERY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-3">
          <button type="submit" className="btn-primary">
            Update statuses
          </button>
        </div>
      </form>
    </div>
  );
}
