import { ProductEditor } from "@/components/admin/product-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatalog } from "@/services/catalog";

export const metadata = {
  title: "New product",
};

export default async function NewProductPage() {
  await requireAdmin();
  const catalog = await getCatalog();
  const [categories, collections] = await Promise.all([
    catalog.listCategories(),
    catalog.listCollections({ includeNonIndexable: true }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">New product</h1>
        <p className="mt-3 text-muted">Drafts stay noindex until published and quality-checked.</p>
      </header>
      <ProductEditor categories={categories} collections={collections} />
    </div>
  );
}
