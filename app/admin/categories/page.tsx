import { CategoryEditor } from "@/components/admin/category-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { paths } from "@/lib/routes";
import { getCatalog } from "@/services/catalog";
import { getCategoryTranslation } from "@/services/catalog/admin";
import Link from "next/link";

export const metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const catalog = await getCatalog();
  const categories = await catalog.listCategories();
  const afTranslations = await Promise.all(
    categories.map((category) => getCategoryTranslation(category.id, "af")),
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-page-title">Categories</h1>
          <p className="mt-3 max-w-3xl text-muted">
            Category pages are organic landing pages. Keep introductions and supporting
            copy specific to the range.
          </p>
        </div>
        <Link href={paths.adminCategoryNew} className="btn-secondary">
          New category
        </Link>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-line">
                <td className="px-4 py-3">{category.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{category.slug}</td>
                <td className="px-4 py-3">{category.indexable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{category.sortOrder}</td>
                <td className="px-4 py-3">
                  <Link href={paths.adminCategory(category.id)}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categories.map((category, index) => (
        <section key={category.id} className="card-surface p-6">
          <h2 className="font-heading text-card-title">{category.name}</h2>
          <div className="mt-6">
            <CategoryEditor category={category} afTranslation={afTranslations[index]} />
          </div>
        </section>
      ))}
    </div>
  );
}
