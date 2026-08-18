import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { paths } from "@/lib/routes";
import type { Category } from "@/types/catalog";

export function CategoryCard({
  category,
  headingLevel = "h3",
}: {
  category: Category;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="card-surface overflow-hidden">
      <Link href={paths.category(category.slug)} className="block text-ink hover:text-ink">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <CatalogMedia image={category.image} />
        </div>
        <div className="space-y-2 p-5">
          <Heading className="font-heading text-card-title">{category.name}</Heading>
          <p className="text-sm text-muted">{category.shortDescription}</p>
          <span className="inline-block text-sm font-medium text-leaf">
            Shop {category.name.toLowerCase()}
          </span>
        </div>
      </Link>
    </article>
  );
}
