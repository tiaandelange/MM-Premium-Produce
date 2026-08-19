import { z } from "zod";
import { isSeoSafeSlug } from "@/lib/utils/slug";

const entityStatus = z.enum(["draft", "active", "archived"]);
const availability = z.enum(["unknown", "in_stock", "out_of_stock", "preorder", "discontinued"]);

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const productFormSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2, "Name is required."),
  slug: z.string().trim().min(2).refine(isSeoSafeSlug, "Use a lowercase hyphenated slug."),
  sku: z.string().trim().min(2, "SKU is required."),
  status: entityStatus,
  shortDescription: z.string().trim().min(1, "Short description is required."),
  description: z.string().trim().min(1, "Full description is required."),
  categoryId: z.string().trim().min(1, "Category is required."),
  collectionIds: z.array(z.string()).default([]),
  tags: z.string().trim().optional(),
  price: z.string().trim().optional(),
  compareAtPrice: z.string().trim().optional(),
  unit: optionalText,
  packSize: optionalText,
  availability,
  stockQuantity: z.string().trim().optional(),
  featured: z.boolean().default(false),
  indexable: z.boolean().default(false),
  seoTitle: optionalText,
  seoDescription: optionalText,
  canonicalOverride: optionalText,
  ogTitle: optionalText,
  ogDescription: optionalText,
  ogImageSrc: optionalText,
  primaryImageSrc: z.string().trim().min(1, "Primary image is required."),
  primaryImageAlt: z.string().trim().min(1, "Image alt text is required."),
  additionalImages: z.string().trim().optional(),
  variantsJson: z.string().trim().optional(),
  storageGuidance: optionalText,
  selectionGuidance: optionalText,
  typicalUses: optionalText,
  seasonality: optionalText,
  origin: optionalText,
});

export const categoryFormSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).refine(isSeoSafeSlug, "Use a lowercase hyphenated slug."),
  shortIntroduction: z.string().trim().min(1),
  longContent: z.string().trim().min(1),
  featuredImageSrc: z.string().trim().min(1),
  featuredImageAlt: z.string().trim().min(1),
  seoTitle: optionalText,
  seoDescription: optionalText,
  ogImageSrc: optionalText,
  indexable: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const bundleFormSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).refine(isSeoSafeSlug, "Use a lowercase hyphenated slug."),
  sku: z.string().trim().min(2),
  status: entityStatus,
  shortDescription: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.string().trim().optional(),
  availability,
  featured: z.boolean().default(false),
  indexable: z.boolean().default(false),
  seoTitle: optionalText,
  seoDescription: optionalText,
  primaryImageSrc: z.string().trim().min(1),
  primaryImageAlt: z.string().trim().min(1),
  itemsJson: z.string().trim().min(2, "Add at least one component product."),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type BundleFormInput = z.infer<typeof bundleFormSchema>;
