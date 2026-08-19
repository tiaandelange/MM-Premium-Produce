import { requireAdmin } from "@/lib/auth/guards";
import { getCatalog } from "@/services/catalog";

export const metadata = {
  title: "Collections",
};

export default async function AdminCollectionsPage() {
  await requireAdmin();
  const catalog = await getCatalog();
  const collections = await catalog.listCollections({ includeNonIndexable: true });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Collections</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Collections are merchandising groups, not taxonomy. They can later power
          seasonal produce, weekly favourites or campaign pages without duplicating
          category URLs. Public collection routes are not generated until a collection
          is indexable and has useful content.
        </p>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-t border-line">
                <td className="px-4 py-3">{collection.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{collection.slug}</td>
                <td className="px-4 py-3">{collection.productIds.length}</td>
                <td className="px-4 py-3">{collection.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{collection.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
