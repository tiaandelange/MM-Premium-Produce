import { BundleEditor } from "@/components/admin/bundle-editor";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata = { title: "New produce box" };

export default async function NewBundlePage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-page-title">New produce box</h1>
      <BundleEditor />
    </div>
  );
}
