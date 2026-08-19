import { ProductEditor } from "@/components/admin/product-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatalog } from "@/services/catalog";
import { getProductTranslation } from "@/services/catalog/admin";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit product",
};

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const catalog = await getCatalog();
  const [product, categories, collections, afTranslation] = await Promise.all([
    catalog.getProductById(id),
    catalog.listCategories(),
    catalog.listCollections({ includeNonIndexable: true }),
    getProductTranslation(id, "af"),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Edit {product.name}</h1>
        <p className="mt-3 text-muted">
          Status: {product.status === "active" ? "published" : product.status}. Indexable:{" "}
          {product.indexable ? "yes" : "no"}.
        </p>
      </header>
      <ProductEditor
        product={product}
        categories={categories}
        collections={collections}
        afTranslation={afTranslation}
      />
    </div>
  );
}
