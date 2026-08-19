import { BundleEditor } from "@/components/admin/bundle-editor";
import { requireAdmin } from "@/lib/auth/guards";
import { paths } from "@/lib/routes";
import { getCatalog } from "@/services/catalog";
import { getBundleTranslation } from "@/services/catalog/admin";
import Link from "next/link";

export const metadata = { title: "Bundles" };

export default async function AdminBundlesPage() {
  await requireAdmin();
  const catalog = await getCatalog();
  const bundles = await catalog.listBundles({ includeInactive: true });
  const afTranslations = await Promise.all(bundles.map((bundle) => getBundleTranslation(bundle.id, "af")));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-page-title">Bundles</h1>
          <p className="mt-3 max-w-3xl text-muted">
            Bundles are first-class purchasable boxes with component products, not
            text-only fake products.
          </p>
        </div>
        <Link href={paths.adminBundleNew} className="btn-primary">
          New bundle
        </Link>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {bundles.length ? (
              bundles.map((bundle) => (
                <tr key={bundle.id} className="border-t border-line">
                  <td className="px-4 py-3">{bundle.name}</td>
                  <td className="px-4 py-3">{bundle.status === "active" ? "published" : bundle.status}</td>
                  <td className="px-4 py-3">{bundle.items.length}</td>
                  <td className="px-4 py-3">{bundle.indexable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <Link href={paths.adminBundle(bundle.id)}>Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={5}>
                  No bundles yet. Create one with real component products.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {bundles.map((bundle, index) => (
        <section key={bundle.id} className="card-surface p-6">
          <h2 className="font-heading text-card-title">{bundle.name}</h2>
          <div className="mt-6">
            <BundleEditor bundle={bundle} afTranslation={afTranslations[index]} />
          </div>
        </section>
      ))}
    </div>
  );
}
