import { requireAdmin } from "@/lib/auth/guards";
import { getEditorial } from "@/services/editorial";

export const metadata = {
  title: "Guides",
};

export default async function AdminGuidesPage() {
  await requireAdmin();
  const editorial = await getEditorial("en");
  const guides = await editorial.listGuides(true);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Guides</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Body copy is seeded from <code>data/editorial/guides.ts</code>. Run{" "}
          <code>npm run db:editorial</code> after edits. Unpublished or non-indexable
          Afrikaans translations stay out of the sitemap.
        </p>
      </header>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">EN slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Indexable</th>
              <th className="px-4 py-3 font-medium">AF</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => {
              const af = guide.alternates.find((item) => item.locale === "af");
              return (
                <tr key={guide.id} className="border-t border-line">
                  <td className="px-4 py-3">{guide.title}</td>
                  <td className="px-4 py-3 font-mono text-xs">{guide.slug}</td>
                  <td className="px-4 py-3">
                    {guide.status} / {guide.translationStatus}
                  </td>
                  <td className="px-4 py-3">{guide.indexable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    {af?.status ?? "missing"}
                    {guide.localeIndexable.af ? " · indexable" : " · noindex"}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/en/guides/${guide.slug}`}>EN</a>
                    {af?.slug ? (
                      <>
                        {" · "}
                        <a href={`/af/gidse/${af.slug}`}>AF</a>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
