import { BundleEditor } from "@/components/admin/bundle-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatalog } from "@/services/catalog";
import { getBundleTranslation } from "@/services/catalog/admin";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit produce box" };

export default async function EditBundlePage({
  params,
}: PageProps<"/admin/bundles/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const catalog = await getCatalog();
  const [bundle, afTranslation] = await Promise.all([
    catalog.getBundleById(id),
    getBundleTranslation(id, "af"),
  ]);
  if (!bundle) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Edit {bundle.name}</h1>
      </header>
      <BundleEditor bundle={bundle} afTranslation={afTranslation} />
    </div>
  );
}
