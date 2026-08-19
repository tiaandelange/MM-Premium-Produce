import { CategoryEditor } from "@/components/admin/category-editor";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata = { title: "New category" };

export default async function NewCategoryPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-page-title">New category</h1>
      <CategoryEditor />
    </div>
  );
}
