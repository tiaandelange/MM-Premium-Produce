import { requireAdmin } from "@/lib/auth/guards";
import { paths } from "@/lib/routes";
import { formatMoney } from "@/lib/utils/format";
import { listOrders } from "@/services/orders";
import Link from "next/link";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await listOrders();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Orders</h1>
        <p className="mt-3 text-muted">Line items are stored as snapshots and are not rewritten when the catalogue changes.</p>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Fulfilment</th>
              <th className="px-4 py-3">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line">
                <td className="px-4 py-3">
                  <Link href={paths.adminOrder(order.id)}>{order.number}</Link>
                </td>
                <td className="px-4 py-3">{order.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3">{order.customerName || `${order.customerFirstName} ${order.customerLastName}`}</td>
                <td className="px-4 py-3">{order.localeTag}</td>
                <td className="px-4 py-3">{formatMoney({ amount: order.totalAmount, currency: order.currency })}</td>
                <td className="px-4 py-3">{order.paymentStatus}</td>
                <td className="px-4 py-3">{order.fulfilmentStatus}</td>
                <td className="px-4 py-3">{order.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 ? <p className="text-muted">No orders yet.</p> : null}
    </div>
  );
}
