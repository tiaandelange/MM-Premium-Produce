import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { createPaths } from "@/lib/i18n/paths";
import { getMessages, interpolate } from "@/lib/i18n/messages";
import type { Category } from "@/types/catalog";

export function CategoryCard({
  category,
  headingLevel = "h3",
}: {
  category: Category;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const paths = createPaths(category.locale);
  const messages = getMessages(category.locale);
  return (
    <article className="category-card">
      <Link href={paths.category(category.slug)} className="category-card-link text-ink hover:text-ink">
        <div className="category-card-media">
          <CatalogMedia image={category.image} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="category-card-body">
          <Heading className="font-heading text-section-title">{category.name}</Heading>
          <p className="mt-1 text-sm text-inverse-muted">{category.shortDescription}</p>
          <span className="mt-3 inline-block text-sm font-medium text-inverse-accent">
            {interpolate(messages.shopCategory, { name: category.name })}
          </span>
        </div>
      </Link>
    </article>
  );
}
