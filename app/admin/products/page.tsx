import { getCatalog } from "@/services/catalog";

export const metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const catalog = await getCatalog();
  const products = await catalog.listProducts({ includeInactive: true });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Products</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Future editors will manage name, slug, short description, full description, SEO
          title, SEO description, primary image, image alt, category, collections, tags,
          price, compare-at price, availability, featured status and indexable status
          separately. Persistence is not wired yet.
        </p>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">SEO title</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{product.slug}</td>
                <td className="px-4 py-3">{product.seoTitle ?? "—"}</td>
                <td className="px-4 py-3">{product.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{product.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{product.price ? `${product.price.amount} ${product.price.currency}` : "Unset"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
