import { getCatalog } from "@/services/catalog";

export const metadata = {
  title: "Bundles",
};

export default async function AdminBundlesPage() {
  const catalog = await getCatalog();
  const bundles = await catalog.listBundles();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Bundles</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Bundles remain first-class commerce objects. Future editors will add or remove
          component products, change quantities, pricing, images, SEO fields and
          indexable status. Availability can later be derived from the component
          products.
        </p>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((bundle) => (
              <tr key={bundle.id} className="border-t border-line">
                <td className="px-4 py-3">{bundle.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{bundle.slug}</td>
                <td className="px-4 py-3">{bundle.items.length}</td>
                <td className="px-4 py-3">{bundle.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {bundle.price ? `${bundle.price.amount} ${bundle.price.currency}` : "Unset"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
