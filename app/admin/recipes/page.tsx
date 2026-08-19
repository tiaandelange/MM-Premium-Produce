import { requireAdmin } from "@/lib/auth/guards";
import { getEditorial } from "@/services/editorial";

export const metadata = {
  title: "Recipes",
};

export default async function AdminRecipesPage() {
  await requireAdmin();
  const editorial = await getEditorial("en");
  const recipes = await editorial.listRecipes(true);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-page-title">Recipes</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Body copy is seeded from <code>data/editorial/recipes.ts</code>. Only genuine
          household recipes are published. There are no fabricated ratings, nutrition
          panels or cook times.
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
            {recipes.map((recipe) => {
              const af = recipe.alternates.find((item) => item.locale === "af");
              return (
                <tr key={recipe.id} className="border-t border-line">
                  <td className="px-4 py-3">{recipe.title}</td>
                  <td className="px-4 py-3 font-mono text-xs">{recipe.slug}</td>
                  <td className="px-4 py-3">
                    {recipe.status} / {recipe.translationStatus}
                  </td>
                  <td className="px-4 py-3">{recipe.indexable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    {af?.status ?? "missing"}
                    {recipe.localeIndexable.af ? " · indexable" : " · noindex"}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/en/recipes/${recipe.slug}`}>EN</a>
                    {af?.slug ? (
                      <>
                        {" · "}
                        <a href={`/af/resepte/${af.slug}`}>AF</a>
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
