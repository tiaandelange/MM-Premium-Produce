import type { AvailabilityStatus, Category, Product } from "@/types/catalog";

export type CatalogueAvailabilityFilter = "all" | "in_stock" | "out_of_stock" | "unpriced";
export type CatalogueSort = "featured" | "name-asc" | "price-asc" | "price-desc";

export type CatalogueQuery = {
  q: string;
  category: string;
  availability: CatalogueAvailabilityFilter;
  sort: CatalogueSort;
};

const AVAILABILITY: CatalogueAvailabilityFilter[] = ["all", "in_stock", "out_of_stock", "unpriced"];
const SORTS: CatalogueSort[] = ["featured", "name-asc", "price-asc", "price-desc"];

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseCatalogueQuery(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogueQuery {
  const q = firstParam(searchParams.q).trim();
  const category = firstParam(searchParams.category).trim();
  const availabilityRaw = firstParam(searchParams.availability).trim() as CatalogueAvailabilityFilter;
  const sortRaw = firstParam(searchParams.sort).trim() as CatalogueSort;
  return {
    q,
    category,
    availability: AVAILABILITY.includes(availabilityRaw) ? availabilityRaw : "all",
    sort: SORTS.includes(sortRaw) ? sortRaw : "featured",
  };
}

function isPurchasableListed(product: Product): boolean {
  return Boolean(product.price) && product.availability === "in_stock";
}

function availabilityMatches(product: Product, filter: CatalogueAvailabilityFilter): boolean {
  if (filter === "all") return true;
  if (filter === "unpriced") return !product.price;
  if (filter === "out_of_stock") return product.availability === "out_of_stock";
  return product.availability === "in_stock" && Boolean(product.price);
}

function rankAvailability(status: AvailabilityStatus, hasPrice: boolean): number {
  if (hasPrice && status === "in_stock") return 0;
  if (status === "preorder") return 1;
  if (!hasPrice) return 2;
  if (status === "out_of_stock") return 3;
  return 4;
}

export function filterAndSortProducts(
  products: Product[],
  query: CatalogueQuery,
  categories: Category[] = [],
): Product[] {
  const needle = query.q.toLowerCase();
  const categoryId =
    query.category &&
    (categories.find((item) => item.slug === query.category || item.id === query.category)?.id ??
      query.category);

  let next = products.filter((product) => {
    if (categoryId && product.categoryId !== categoryId) return false;
    if (!availabilityMatches(product, query.availability)) return false;
    if (!needle) return true;
    const haystack = `${product.name} ${product.shortDescription} ${product.tags.join(" ")}`.toLowerCase();
    return haystack.includes(needle);
  });

  next = [...next].sort((a, b) => {
    if (query.sort === "name-asc") return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    if (query.sort === "price-asc" || query.sort === "price-desc") {
      const aPrice = a.price?.amount ?? Number.POSITIVE_INFINITY;
      const bPrice = b.price?.amount ?? Number.POSITIVE_INFINITY;
      const diff = aPrice - bPrice;
      return query.sort === "price-asc" ? diff : -diff;
    }
    // Featured: available priced first, then featured flag, then name.
    const rank =
      rankAvailability(a.availability, Boolean(a.price)) - rankAvailability(b.availability, Boolean(b.price));
    if (rank !== 0) return rank;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return next;
}

export function catalogueQueryToSearchParams(query: CatalogueQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.availability !== "all") params.set("availability", query.availability);
  if (query.sort !== "featured") params.set("sort", query.sort);
  return params;
}

export function isListedPurchasable(product: Product): boolean {
  return isPurchasableListed(product);
}
