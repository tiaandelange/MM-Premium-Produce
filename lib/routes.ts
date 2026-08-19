import type { Route } from "next";
import { createPaths } from "@/lib/i18n/paths";

export const paths = {
  home: "/en" as Route,
  shop: "/en/shop" as Route,
  category: (slug: string) => `/en/shop/${slug}` as Route,
  product: (slug: string) => `/en/products/${slug}` as Route,
  bundles: "/en/bundles" as Route,
  bundle: (slug: string) => `/en/bundles/${slug}` as Route,
  about: "/en/about" as Route,
  delivery: "/en/delivery" as Route,
  contact: "/en/contact" as Route,
  faq: "/en/faq" as Route,
  admin: "/admin",
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  adminProductNew: "/admin/products/new",
  adminProduct: (id: string) => `/admin/products/${id}` as Route,
  adminCategories: "/admin/categories",
  adminCategoryNew: "/admin/categories/new",
  adminCategory: (id: string) => `/admin/categories/${id}` as Route,
  adminCollections: "/admin/collections",
  adminBundles: "/admin/bundles",
  adminBundleNew: "/admin/bundles/new",
  adminBundle: (id: string) => `/admin/bundles/${id}` as Route,
  adminMedia: "/admin/media",
  adminOrders: "/admin/orders",
  adminOrder: (id: string) => `/admin/orders/${id}` as Route,
  adminDelivery: "/admin/delivery",
} as const;

export type PublicNavItem = {
  href: Route;
  label: string;
};

export function storefrontNav(locale: "en" | "af"): { primary: PublicNavItem[]; footer: PublicNavItem[] } {
  const localized = createPaths(locale);
  const fruitSlug = locale === "af" ? "vrugte" : "fruit";
  const vegetableSlug = locale === "af" ? "groente" : "vegetables";
  return {
    primary: [
      { href: localized.shop, label: locale === "af" ? "Winkel" : "Shop" },
      { href: localized.category(fruitSlug), label: locale === "af" ? "Vrugte" : "Fruit" },
      { href: localized.category(vegetableSlug), label: locale === "af" ? "Groente" : "Vegetables" },
      { href: localized.bundles, label: locale === "af" ? "Bokse" : "Bundles" },
      { href: localized.about, label: locale === "af" ? "Oor ons" : "About" },
      { href: localized.delivery, label: locale === "af" ? "Aflewering" : "Delivery" },
      { href: localized.contact, label: locale === "af" ? "Kontak" : "Contact" },
    ],
    footer: [
      { href: localized.shop, label: locale === "af" ? "Winkel" : "Shop" },
      { href: localized.category(fruitSlug), label: locale === "af" ? "Vrugte" : "Fruit" },
      { href: localized.category(vegetableSlug), label: locale === "af" ? "Groente" : "Vegetables" },
      { href: localized.bundles, label: locale === "af" ? "Produkbokse" : "Produce boxes" },
      { href: localized.about, label: locale === "af" ? "Oor ons" : "About" },
      { href: localized.delivery, label: locale === "af" ? "Aflewering" : "Delivery" },
      { href: localized.faq, label: locale === "af" ? "Gereelde vrae" : "FAQ" },
      { href: localized.contact, label: locale === "af" ? "Kontak" : "Contact" },
    ],
  };
}

export const primaryNav = storefrontNav("en").primary;
export const footerNav = storefrontNav("en").footer;

/**
 * Planned informational routes. Do not create thin pages until there is
 * genuine content to publish.
 */
export const plannedContentPaths = [
  "/en/recipes",
  "/en/recipes/[slug]",
  "/en/guides",
  "/en/seasonal-produce",
  "/en/storage-guides",
  "/en/how-to-select-produce",
] as const;

export const noindexPathPrefixes = [
  "/admin",
  "/api",
  "/cart",
  "/checkout",
  "/account",
  "/login",
  "/search",
  "/en/cart",
  "/af/mandjie",
  "/en/checkout",
  "/af/betaal",
  "/af/afrekening",
  "/en/order-confirmation",
  "/af/bestelling-bevestig",
] as const;
