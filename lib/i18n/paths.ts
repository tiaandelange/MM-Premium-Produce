import type { AppLocale } from "@/lib/i18n/config";
import type { Route } from "next";

export const routeKeys = [
  "home",
  "shop",
  "products",
  "bundles",
  "about",
  "delivery",
  "contact",
  "faq",
  "guides",
  "recipes",
  "cart",
  "checkout",
  "orderConfirmation",
  "privacy",
  "terms",
  "returns",
] as const;

export type RouteKey = (typeof routeKeys)[number];

export const routeSegments: Record<AppLocale, Record<Exclude<RouteKey, "home">, string>> = {
  en: {
    shop: "shop",
    products: "products",
    bundles: "bundles",
    about: "about",
    delivery: "delivery",
    contact: "contact",
    faq: "faq",
    guides: "guides",
    recipes: "recipes",
    cart: "cart",
    checkout: "checkout",
    orderConfirmation: "order-confirmation",
    privacy: "privacy",
    terms: "terms",
    returns: "delivery-and-returns",
  },
  af: {
    shop: "winkel",
    products: "produkte",
    bundles: "bokse",
    about: "oor-ons",
    delivery: "aflewering",
    contact: "kontak",
    faq: "gereelde-vrae",
    guides: "gidse",
    recipes: "resepte",
    cart: "mandjie",
    checkout: "betaal",
    orderConfirmation: "bestelling-bevestig",
    privacy: "privaatheid",
    terms: "verkoopvoorwaardes",
    returns: "aflewering-en-terugsendings",
  },
};

const internalSegments = routeSegments.en;

export function createPaths(locale: AppLocale) {
  const segment = routeSegments[locale];
  const prefix = `/${locale}`;

  return {
    home: prefix as Route,
    shop: `${prefix}/${segment.shop}` as Route,
    category: (slug: string) => `${prefix}/${segment.shop}/${slug}` as Route,
    product: (slug: string) => `${prefix}/${segment.products}/${slug}` as Route,
    bundles: `${prefix}/${segment.bundles}` as Route,
    bundle: (slug: string) => `${prefix}/${segment.bundles}/${slug}` as Route,
    about: `${prefix}/${segment.about}` as Route,
    delivery: `${prefix}/${segment.delivery}` as Route,
    contact: `${prefix}/${segment.contact}` as Route,
    faq: `${prefix}/${segment.faq}` as Route,
    guides: `${prefix}/${segment.guides}` as Route,
    guide: (slug: string) => `${prefix}/${segment.guides}/${slug}` as Route,
    recipes: `${prefix}/${segment.recipes}` as Route,
    recipe: (slug: string) => `${prefix}/${segment.recipes}/${slug}` as Route,
    cart: `${prefix}/${segment.cart}` as Route,
    checkout: `${prefix}/${segment.checkout}` as Route,
    orderConfirmation: (id: string) => `${prefix}/${segment.orderConfirmation}/${id}` as Route,
    privacy: `${prefix}/${segment.privacy}` as Route,
    terms: `${prefix}/${segment.terms}` as Route,
    returns: `${prefix}/${segment.returns}` as Route,
  };
}

export function internalPath(
  locale: AppLocale,
  key: Exclude<RouteKey, "home">,
  rest = "",
): string {
  const suffix = rest ? `/${rest.replace(/^\/+/, "")}` : "";
  return `/${locale}/${internalSegments[key]}${suffix}`;
}

export function publicPath(
  locale: AppLocale,
  key: Exclude<RouteKey, "home">,
  rest = "",
): string {
  const suffix = rest ? `/${rest.replace(/^\/+/, "")}` : "";
  return `/${locale}/${routeSegments[locale][key]}${suffix}`;
}

export function segmentToRouteKey(
  locale: AppLocale,
  segment: string | undefined,
): Exclude<RouteKey, "home"> | null {
  if (!segment) return null;
  const entries = Object.entries(routeSegments[locale]) as Array<
    [Exclude<RouteKey, "home">, string]
  >;
  const match = entries.find(([, value]) => value === segment);
  return match?.[0] ?? null;
}

export function englishSegmentToRouteKey(segment: string | undefined): Exclude<RouteKey, "home"> | null {
  if (!segment) return null;
  const entries = Object.entries(internalSegments) as Array<[Exclude<RouteKey, "home">, string]>;
  const match = entries.find(([, value]) => value === segment);
  return match?.[0] ?? null;
}

export const unprefixedStorefrontPrefixes = [
  "/shop",
  "/products",
  "/bundles",
  "/about",
  "/delivery",
  "/contact",
  "/faq",
  "/guides",
  "/recipes",
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/privacy",
  "/terms",
  "/delivery-and-returns",
] as const;
