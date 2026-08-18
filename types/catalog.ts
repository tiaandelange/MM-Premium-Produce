export type EntityStatus = "draft" | "active" | "archived";

export type AvailabilityStatus =
  | "unknown"
  | "in_stock"
  | "out_of_stock"
  | "preorder"
  | "discontinued";

export type Money = {
  amount: number;
  currency: string;
};

export type CatalogImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  slug: string;
  name: string;
  price: Money | null;
  availability: AvailabilityStatus;
  packSize?: string;
  image?: CatalogImage;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  status: EntityStatus;
  shortDescription: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  collectionIds: string[];
  tags: string[];
  price: Money | null;
  compareAtPrice: Money | null;
  unit?: string;
  packSize?: string;
  weightGrams?: number | null;
  featured: boolean;
  availability: AvailabilityStatus;
  stockQuantity: number | null;
  images: CatalogImage[];
  primaryImage: CatalogImage;
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  indexable: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
  googleProductCategory?: string;
  productType?: string;
  gtin?: string | null;
  mpn?: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: CatalogImage;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  indexable: boolean;
  isSample: boolean;
  sortOrder: number;
  parentId?: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  productIds: string[];
  image?: CatalogImage;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  indexable: boolean;
  isSample: boolean;
};

export type BundleItem = {
  productId: string;
  quantity: number;
};

export type Bundle = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  items: BundleItem[];
  price: Money | null;
  compareAtPrice: Money | null;
  featured: boolean;
  availability: AvailabilityStatus;
  images: CatalogImage[];
  primaryImage: CatalogImage;
  seoTitle?: string;
  seoDescription?: string;
  indexable: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CatalogEntity = Product | Category | Collection | Bundle;
