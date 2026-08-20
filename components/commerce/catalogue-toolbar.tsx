import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { CatalogueQuery } from "@/lib/catalog/catalogue-query";
import type { Category } from "@/types/catalog";

export function CatalogueToolbar({
  locale,
  action,
  categories,
  query,
  resultCount,
}: {
  locale: AppLocale;
  action: string;
  categories: Category[];
  query: CatalogueQuery;
  resultCount: number;
}) {
  const messages = getMessages(locale);

  return (
    <form method="get" action={action} className="catalogue-toolbar" role="search">
      <div className="catalogue-toolbar-grid">
        <label className="catalogue-toolbar-field">
          <span className="catalogue-toolbar-label">{messages.search}</span>
          <input
            type="search"
            name="q"
            defaultValue={query.q}
            placeholder={messages.searchProducts}
            className="field-control w-full"
            autoComplete="off"
          />
        </label>

        <label className="catalogue-toolbar-field">
          <span className="catalogue-toolbar-label">{messages.categoryLabel}</span>
          <select name="category" defaultValue={query.category} className="field-control w-full">
            <option value="">{messages.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalogue-toolbar-field">
          <span className="catalogue-toolbar-label">{messages.availabilityFilter}</span>
          <select name="availability" defaultValue={query.availability} className="field-control w-full">
            <option value="all">{messages.filterAll}</option>
            <option value="in_stock">{messages.inStock}</option>
            <option value="out_of_stock">{messages.soldOut}</option>
            <option value="unpriced">{messages.priceToConfirm}</option>
          </select>
        </label>

        <label className="catalogue-toolbar-field">
          <span className="catalogue-toolbar-label">{messages.sortBy}</span>
          <select name="sort" defaultValue={query.sort} className="field-control w-full">
            <option value="featured">{messages.sortFeatured}</option>
            <option value="name-asc">{messages.sortNameAsc}</option>
            <option value="price-asc">{messages.sortPriceAsc}</option>
            <option value="price-desc">{messages.sortPriceDesc}</option>
          </select>
        </label>
      </div>

      <div className="catalogue-toolbar-actions">
        <p className="text-sm text-muted" aria-live="polite">
          {messages.showingProducts.replace("{count}", String(resultCount))}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn-secondary">
            {messages.applyFilters}
          </button>
          <a href={action} className="btn-ghost">
            {messages.clearFilters}
          </a>
        </div>
      </div>
    </form>
  );
}
