import { uploadMediaAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/guards";
import { listMediaAssets } from "@/services/catalog/admin";

export const metadata = { title: "Media" };

export default async function AdminMediaPage() {
  await requireAdmin();
  const assets = await listMediaAssets();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-page-title">Media</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Uploads are optimized to WebP and stored as production assets. Google Drive
          URLs are never used as live image hosts. Record the original asset reference
          for mapping.
        </p>
      </header>
      <form action={uploadMediaAction} className="card-surface space-y-4 p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Image file</span>
          <input type="file" name="file" accept="image/*" required />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Alt text</span>
          <input
            type="text"
            name="alt"
            required
            className="w-full rounded-control border border-line px-3 py-2 text-sm"
          />
        </label>
        <button type="submit" className="btn-primary">
          Upload and optimize
        </button>
      </form>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <li key={asset.id} className="card-surface overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.src} alt={asset.alt} className="aspect-square w-full object-contain bg-sand p-3" />
            <div className="space-y-1 p-4 text-sm">
              <p className="font-medium">{asset.alt}</p>
              <p className="font-mono text-xs text-muted">{asset.src}</p>
              <p className="text-xs text-muted">
                {asset.width}×{asset.height}
                {asset.originalAssetRef ? ` · ${asset.originalAssetRef}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
