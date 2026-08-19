import type {
  AvailabilityStatus,
  Bundle,
  CatalogImage,
  Category,
  Collection,
  EntityStatus,
  Money,
  Product,
  ProductVariant,
} from "@/types/catalog";

export function moneyFrom(amount: string | number | null | undefined, currency: string): Money | null {
  if (amount === null || amount === undefined || amount === "") return null;
  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value) || value <= 0) return null;
  return { amount: value, currency };
}

export function toIso(date: Date | string): string {
  return date instanceof Date ? date.toISOString() : date;
}

export function fallbackImage(alt: string): CatalogImage {
  return {
    src: "/images/catalog/tomatoes.svg",
    alt,
    width: 800,
    height: 800,
  };
}

export function mapCategory(row: {
  id: string;
  slug: string;
  name: string;
  shortIntroduction: string;
  longContent: string;
  featuredImageSrc: string;
  featuredImageAlt: string;
  featuredImageWidth: number;
  featuredImageHeight: number;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalOverride: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageSrc: string | null;
  featured: boolean;
  indexable: boolean;
  isSample: boolean;
  sortOrder: number;
  parentId: string | null;
}): Category {
  const image: CatalogImage = {
    src: row.featuredImageSrc,
    alt: row.featuredImageAlt,
    width: row.featuredImageWidth,
    height: row.featuredImageHeight,
  };
  return {
    id: row.id,
    locale: "en",
    translationStatus: "published",
    alternates: [],
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortIntroduction,
    description: row.longContent,
    image,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    canonicalOverride: row.canonicalOverride,
    ogTitle: row.ogTitle ?? undefined,
    ogDescription: row.ogDescription ?? undefined,
    ogImage: row.ogImageSrc ? { ...image, src: row.ogImageSrc } : image,
    featured: row.featured,
    indexable: row.indexable,
    isSample: row.isSample,
    sortOrder: row.sortOrder,
    parentId: row.parentId ?? undefined,
  };
}

export function mapCollection(
  row: {
    id: string;
    slug: string;
    name: string;
    description: string;
    imageSrc: string | null;
    imageAlt: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    seoTitle: string | null;
    seoDescription: string | null;
    featured: boolean;
    indexable: boolean;
    isSample: boolean;
  },
  productIds: string[],
): Collection {
  return {
    id: row.id,
    locale: "en",
    translationStatus: "published",
    slug: row.slug,
    name: row.name,
    description: row.description,
    productIds,
    image:
      row.imageSrc && row.imageAlt && row.imageWidth && row.imageHeight
        ? {
            src: row.imageSrc,
            alt: row.imageAlt,
            width: row.imageWidth,
            height: row.imageHeight,
          }
        : undefined,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    featured: row.featured,
    indexable: row.indexable,
    isSample: row.isSample,
  };
}

export function mapVariant(row: {
  id: string;
  sku: string | null;
  slug: string;
  name: string;
  priceAmount: string | null;
  priceCurrency: string;
  compareAtAmount: string | null;
  availability: AvailabilityStatus;
  packSize: string | null;
  imageSrc: string | null;
  imageAlt: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}): ProductVariant {
  return {
    id: row.id,
    sku: row.sku ?? undefined,
    slug: row.slug,
    name: row.name,
    price: moneyFrom(row.priceAmount, row.priceCurrency),
    compareAtPrice: moneyFrom(row.compareAtAmount, row.priceCurrency),
    availability: row.availability,
    packSize: row.packSize ?? undefined,
    image:
      row.imageSrc && row.imageAlt && row.imageWidth && row.imageHeight
        ? {
            src: row.imageSrc,
            alt: row.imageAlt,
            width: row.imageWidth,
            height: row.imageHeight,
          }
        : undefined,
  };
}

export function mapProduct(input: {
  product: {
    id: string;
    sku: string;
    slug: string;
    name: string;
    status: EntityStatus;
    shortDescription: string;
    description: string;
    primaryCategoryId: string;
    subcategoryId: string | null;
    tags: string[] | null;
    priceAmount: string | null;
    priceCurrency: string;
    compareAtAmount: string | null;
    unit: string | null;
    packSize: string | null;
    weightGrams: number | null;
    featured: boolean;
    availability: AvailabilityStatus;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalOverride: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageSrc: string | null;
    indexable: boolean;
    isSample: boolean;
    createdAt: Date;
    updatedAt: Date;
    googleProductCategory: string | null;
    productType: string | null;
    gtin: string | null;
    mpn: string | null;
    storageGuidance: string | null;
    selectionGuidance: string | null;
    typicalUses: string | null;
    seasonality: string | null;
    origin: string | null;
  };
  images: Array<{ src: string; alt: string; width: number; height: number; isPrimary: boolean; displayOrder: number }>;
  variants: ProductVariant[];
  collectionIds: string[];
  stockQuantity: number | null;
}): Product {
  const sortedImages = [...input.images].sort((a, b) => a.displayOrder - b.displayOrder);
  const primary =
    sortedImages.find((image) => image.isPrimary) ??
    sortedImages[0] ??
    fallbackImage(`Fresh ${input.product.name} from M & M Premium Produce`);
  const images = sortedImages.length
    ? sortedImages.map(({ src, alt, width, height }) => ({ src, alt, width, height }))
    : [primary];

  const guidance = {
    storage: input.product.storageGuidance ?? undefined,
    selection: input.product.selectionGuidance ?? undefined,
    typicalUses: input.product.typicalUses ?? undefined,
    seasonality: input.product.seasonality ?? undefined,
    origin: input.product.origin ?? undefined,
  };
  const hasGuidance = Object.values(guidance).some(Boolean);

  return {
    id: input.product.id,
    sku: input.product.sku,
    locale: "en",
    translationStatus: "published",
    alternates: [],
    slug: input.product.slug,
    name: input.product.name,
    status: input.product.status,
    shortDescription: input.product.shortDescription,
    description: input.product.description,
    categoryId: input.product.primaryCategoryId,
    subcategoryId: input.product.subcategoryId ?? undefined,
    collectionIds: input.collectionIds,
    tags: input.product.tags ?? [],
    price: moneyFrom(input.product.priceAmount, input.product.priceCurrency),
    compareAtPrice: moneyFrom(input.product.compareAtAmount, input.product.priceCurrency),
    unit: input.product.unit ?? undefined,
    packSize: input.product.packSize ?? undefined,
    weightGrams: input.product.weightGrams,
    featured: input.product.featured,
    availability: input.product.availability,
    stockQuantity: input.stockQuantity,
    images,
    primaryImage: { src: primary.src, alt: primary.alt, width: primary.width, height: primary.height },
    variants: input.variants.length ? input.variants : undefined,
    seoTitle: input.product.seoTitle ?? undefined,
    seoDescription: input.product.seoDescription ?? undefined,
    canonicalOverride: input.product.canonicalOverride,
    ogTitle: input.product.ogTitle ?? undefined,
    ogDescription: input.product.ogDescription ?? undefined,
    ogImage: input.product.ogImageSrc
      ? { ...primary, src: input.product.ogImageSrc }
      : undefined,
    indexable: input.product.indexable,
    isSample: input.product.isSample,
    createdAt: toIso(input.product.createdAt),
    updatedAt: toIso(input.product.updatedAt),
    googleProductCategory: input.product.googleProductCategory ?? undefined,
    productType: input.product.productType ?? undefined,
    gtin: input.product.gtin,
    mpn: input.product.mpn,
    guidance: hasGuidance ? guidance : undefined,
  };
}

export function mapBundle(input: {
  bundle: {
    id: string;
    sku: string;
    slug: string;
    name: string;
    status: EntityStatus;
    shortDescription: string;
    description: string;
    priceAmount: string | null;
    priceCurrency: string;
    compareAtAmount: string | null;
    featured: boolean;
    availability: AvailabilityStatus;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalOverride: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageSrc: string | null;
    indexable: boolean;
    isSample: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  items: Array<{ productId: string; variantId: string | null; quantity: number }>;
  images: Array<{ src: string; alt: string; width: number; height: number; isPrimary: boolean; displayOrder: number }>;
}): Bundle {
  const sortedImages = [...input.images].sort((a, b) => a.displayOrder - b.displayOrder);
  const primary =
    sortedImages.find((image) => image.isPrimary) ??
    sortedImages[0] ??
    fallbackImage(`${input.bundle.name} from M & M Premium Produce`);
  const images = sortedImages.length
    ? sortedImages.map(({ src, alt, width, height }) => ({ src, alt, width, height }))
    : [primary];

  return {
    id: input.bundle.id,
    sku: input.bundle.sku,
    locale: "en",
    translationStatus: "published",
    alternates: [],
    slug: input.bundle.slug,
    name: input.bundle.name,
    status: input.bundle.status,
    shortDescription: input.bundle.shortDescription,
    description: input.bundle.description,
    items: input.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? undefined,
      quantity: item.quantity,
    })),
    price: moneyFrom(input.bundle.priceAmount, input.bundle.priceCurrency),
    compareAtPrice: moneyFrom(input.bundle.compareAtAmount, input.bundle.priceCurrency),
    featured: input.bundle.featured,
    availability: input.bundle.availability,
    images,
    primaryImage: { src: primary.src, alt: primary.alt, width: primary.width, height: primary.height },
    seoTitle: input.bundle.seoTitle ?? undefined,
    seoDescription: input.bundle.seoDescription ?? undefined,
    canonicalOverride: input.bundle.canonicalOverride,
    ogTitle: input.bundle.ogTitle ?? undefined,
    ogDescription: input.bundle.ogDescription ?? undefined,
    ogImage: input.bundle.ogImageSrc ? { ...primary, src: input.bundle.ogImageSrc } : undefined,
    indexable: input.bundle.indexable,
    isSample: input.bundle.isSample,
    createdAt: toIso(input.bundle.createdAt),
    updatedAt: toIso(input.bundle.updatedAt),
  };
}
