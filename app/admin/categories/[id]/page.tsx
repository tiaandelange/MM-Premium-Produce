import { CategoryEditor } from "@/components/admin/category-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatalog } from "@/services/catalog";
import { getCategoryTranslation } from "@/services/catalog/admin";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit category" };

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const catalog = await getCatalog();
  const [category, afTranslation] = await Promise.all([
    catalog.getCategoryById(id),
    getCategoryTranslation(id, "af"),
  ]);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Edit {category.name}</h1>
      </header>
      <CategoryEditor category={category} afTranslation={afTranslation} />
    </div>
  );
}
