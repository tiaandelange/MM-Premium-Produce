import { requireAdmin } from "@/lib/auth/guards";
import { paths } from "@/lib/routes";
import { getCatalog } from "@/services/catalog";
import { formatMoney } from "@/lib/utils/format";
import { priceUnitLabel, resolvePriceUnit } from "@/lib/catalog/price-unit";
import Link from "next/link";

export const metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  await requireAdmin();
  const catalog = await getCatalog();
  const products = await catalog.listProducts({ includeInactive: true });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-page-title">Products</h1>
          <p className="mt-3 max-w-3xl text-muted">
            Edit names, slugs, prices, availability, images and SEO fields. Publishing
            does not make a page indexable unless the content quality gate is met.
          </p>
        </div>
        <Link href={paths.adminProductNew} className="btn-primary">
          New product
        </Link>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 capitalize">{product.status === "active" ? "published" : product.status}</td>
                <td className="px-4 py-3 font-mono text-xs">{product.slug}</td>
                <td className="px-4 py-3">{product.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {product.price ? (
                    <>
                      {formatMoney(product.price, "en")}
                      <span className="ml-1 text-xs text-muted">
                        {priceUnitLabel(
                          resolvePriceUnit({
                            unit: product.unit,
                            packSize: product.packSize,
                            productId: product.id,
                          }),
                          "en",
                        )}
                      </span>
                    </>
                  ) : (
                    "Unset"
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={paths.adminProduct(product.id)}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
