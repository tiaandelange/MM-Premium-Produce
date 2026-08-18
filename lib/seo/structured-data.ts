import { confirmedValue, getSiteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { paths } from "@/lib/routes";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import type { AvailabilityStatus, Bundle, Product } from "@/types/catalog";

type JsonLd = Record<string, unknown>;

function availabilityUrl(status: AvailabilityStatus): string | undefined {
  switch (status) {
    case "in_stock":
      return "https://schema.org/InStock";
    case "out_of_stock":
      return "https://schema.org/OutOfStock";
    case "preorder":
      return "https://schema.org/PreOrder";
    case "discontinued":
      return "https://schema.org/Discontinued";
    default:
      return undefined;
  }
}

export function buildOrganizationStructuredData(): JsonLd {
  const site = getSiteConfig();
  const email = confirmedValue(site.email);
  const phone = confirmedValue(site.phone);
  const sameAs = confirmedValue(site.socialProfiles);
  const address = confirmedValue(site.address);

  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.businessName,
    url: buildCanonicalUrl(paths.home),
    logo: buildCanonicalUrl(site.logoPath),
  };

  if (email) data.email = email;
  if (phone) data.telephone = phone;
  if (sameAs?.length) data.sameAs = sameAs;
  if (address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    };
  }

  return data;
}

export function buildBreadcrumbStructuredData(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

function buildOffer(
  price: Product["price"],
  status: AvailabilityStatus,
  url: string,
): JsonLd | undefined {
  if (!price || price.amount <= 0) return undefined;

  const offer: JsonLd = {
    "@type": "Offer",
    url,
    price: price.amount.toFixed(2),
    priceCurrency: price.currency,
    itemCondition: "https://schema.org/NewCondition",
  };

  const availability = availabilityUrl(status);
  if (availability) {
    offer.availability = availability;
  }

  return offer;
}

export function buildProductStructuredData(product: Product): JsonLd {
  const url = buildCanonicalUrl(paths.product(product.slug));
  const site = getSiteConfig();
  const brand = {
    "@type": "Brand",
    name: site.businessName,
  };
  const images = product.images.map((image) => buildCanonicalUrl(image.src));
  const variants = product.variants ?? [];

  if (variants.length) {
    const data: JsonLd = {
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      name: product.name,
      description: product.shortDescription,
      productGroupID: product.sku,
      brand,
      url,
      image: images,
      hasVariant: variants.map((variant) => {
        const variantUrl = `${url}#${variant.slug}`;
        const variantData: JsonLd = {
          "@type": "Product",
          name: `${product.name} — ${variant.name}`,
          sku: variant.id,
          url: variantUrl,
          image: variant.image ? [buildCanonicalUrl(variant.image.src)] : images,
        };
        const offer = buildOffer(variant.price, variant.availability, variantUrl);
        if (offer) variantData.offers = offer;
        return variantData;
      }),
    };
    return data;
  }

  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand,
    url,
    image: images,
  };

  if (product.gtin) data.gtin = product.gtin;
  if (product.mpn) data.mpn = product.mpn;

  const offer = buildOffer(product.price, product.availability, url);
  if (offer) data.offers = offer;

  return data;
}

export function buildBundleStructuredData(
  bundle: Bundle,
  componentNames: string[],
  componentUrls: string[],
): JsonLd {
  const url = buildCanonicalUrl(paths.bundle(bundle.slug));
  const site = getSiteConfig();
  const description = [bundle.shortDescription, componentNames.length ? `Includes: ${componentNames.join(", ")}.` : ""]
    .filter(Boolean)
    .join(" ");

  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description,
    sku: bundle.sku,
    brand: {
      "@type": "Brand",
      name: site.businessName,
    },
    url,
    image: bundle.images.map((image) => buildCanonicalUrl(image.src)),
  };

  if (componentUrls.length) {
    data.isRelatedTo = componentUrls.map((componentUrl) => ({
      "@type": "Product",
      url: componentUrl,
    }));
  }

  const offer = buildOffer(bundle.price, bundle.availability, url);
  if (offer) data.offers = offer;

  return data;
}

export function buildItemListStructuredData(
  name: string,
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: buildCanonicalUrl(item.path),
    })),
  };
}
