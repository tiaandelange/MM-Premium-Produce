import type { Route } from "next";

export const paths = {
  home: "/",
  shop: "/shop",
  category: (slug: string) => `/shop/${slug}` as Route,
  product: (slug: string) => `/products/${slug}` as Route,
  bundles: "/bundles",
  bundle: (slug: string) => `/bundles/${slug}` as Route,
  about: "/about",
  delivery: "/delivery",
  contact: "/contact",
  faq: "/faq",
  admin: "/admin",
  adminProducts: "/admin/products",
  adminCategories: "/admin/categories",
  adminCollections: "/admin/collections",
  adminBundles: "/admin/bundles",
} as const;

export type PublicNavItem = {
  href: Route;
  label: string;
};

export const primaryNav: PublicNavItem[] = [
  { href: paths.shop, label: "Shop" },
  { href: paths.category("fruit") as Route, label: "Fruit" },
  { href: paths.category("vegetables") as Route, label: "Vegetables" },
  { href: paths.bundles, label: "Bundles" },
  { href: paths.about, label: "About" },
  { href: paths.delivery, label: "Delivery" },
  { href: paths.contact, label: "Contact" },
];

export const footerNav: PublicNavItem[] = [
  { href: paths.shop, label: "Shop" },
  { href: paths.category("fruit") as Route, label: "Fruit" },
  { href: paths.category("vegetables") as Route, label: "Vegetables" },
  { href: paths.bundles, label: "Produce boxes" },
  { href: paths.about, label: "About" },
  { href: paths.delivery, label: "Delivery" },
  { href: paths.faq, label: "FAQ" },
  { href: paths.contact, label: "Contact" },
];

/**
 * Planned informational routes. Do not create thin pages until there is
 * genuine content to publish.
 */
export const plannedContentPaths = [
  "/recipes",
  "/recipes/[slug]",
  "/guides",
  "/seasonal-produce",
  "/storage-guides",
  "/how-to-select-produce",
] as const;

export const noindexPathPrefixes = [
  "/admin",
  "/api",
  "/cart",
  "/checkout",
  "/account",
  "/login",
  "/search",
] as const;
