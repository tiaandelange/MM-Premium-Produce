import { getCatalog } from "@/services/catalog";

export const metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const catalog = await getCatalog();
  const categories = await catalog.listCategories();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Categories</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Category editors will eventually control name, slug, short introduction,
          long-form copy, image, alt text, SEO title, SEO description, indexable toggle,
          featured toggle and sort order.
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
              <th className="px-4 py-3 font-medium">Sort</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-line">
                <td className="px-4 py-3">{category.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{category.slug}</td>
                <td className="px-4 py-3">{category.seoTitle ?? "—"}</td>
                <td className="px-4 py-3">{category.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{category.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
