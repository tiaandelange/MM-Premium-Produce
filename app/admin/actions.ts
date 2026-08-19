"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  requireAdminSession,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { bundleFormSchema, categoryFormSchema, loginSchema, productFormSchema } from "@/lib/admin/validation";
import { paths } from "@/lib/routes";
import { saveBundle, saveCategory, saveMediaAsset, saveProduct } from "@/services/catalog/admin";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { toSeoSlug } from "@/lib/utils/slug";
import type { Route } from "next";

function go(url: string): never {
  redirect(url as Route);
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function formBool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });
  if (!parsed.success) {
    go(`${paths.adminLogin}?error=invalid` as Route);
  }

  const db = getDb();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, parsed.data.email.toLowerCase()))
    .limit(1);
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    go(`${paths.adminLogin}?error=invalid` as Route);
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const store = await cookies();
  store.set(sessionCookieOptions(token));
  const nextPath = formString(formData, "next") || paths.admin;
  const destination = (nextPath.startsWith("/admin") ? nextPath : paths.admin) as Route;
  go(destination);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  go(paths.adminLogin);
}

export async function saveProductAction(formData: FormData) {
  await requireAdminSession();
  const parsed = productFormSchema.safeParse({
    id: formString(formData, "id") || undefined,
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    sku: formString(formData, "sku"),
    status: formString(formData, "status") || "draft",
    shortDescription: formString(formData, "shortDescription"),
    description: formString(formData, "description"),
    categoryId: formString(formData, "categoryId"),
    collectionIds: formData.getAll("collectionIds").filter((value): value is string => typeof value === "string"),
    tags: formString(formData, "tags"),
    price: formString(formData, "price"),
    compareAtPrice: formString(formData, "compareAtPrice"),
    unit: formString(formData, "unit"),
    packSize: formString(formData, "packSize"),
    availability: formString(formData, "availability") || "unknown",
    stockQuantity: formString(formData, "stockQuantity"),
    featured: formBool(formData, "featured"),
    indexable: formBool(formData, "indexable"),
    seoTitle: formString(formData, "seoTitle"),
    seoDescription: formString(formData, "seoDescription"),
    canonicalOverride: formString(formData, "canonicalOverride"),
    ogTitle: formString(formData, "ogTitle"),
    ogDescription: formString(formData, "ogDescription"),
    ogImageSrc: formString(formData, "ogImageSrc"),
    primaryImageSrc: formString(formData, "primaryImageSrc"),
    primaryImageAlt: formString(formData, "primaryImageAlt"),
    additionalImages: formString(formData, "additionalImages"),
    variantsJson: formString(formData, "variantsJson"),
    storageGuidance: formString(formData, "storageGuidance"),
    selectionGuidance: formString(formData, "selectionGuidance"),
    typicalUses: formString(formData, "typicalUses"),
    seasonality: formString(formData, "seasonality"),
    origin: formString(formData, "origin"),
  });

  if (!parsed.success) {
    go(`${paths.adminProducts}?error=validation`);
  }

  const afName = formString(formData, "af_name");
  const afSlug = formString(formData, "af_slug");
  const afStatus = (formString(formData, "af_status") || "draft") as "draft" | "ready" | "published";

  let additionalImages: Array<{ src: string; alt: string }> = [];
  if (parsed.data.additionalImages) {
    additionalImages = parsed.data.additionalImages
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [src, ...altParts] = line.split("|");
        return { src: src.trim(), alt: altParts.join("|").trim() };
      });
  }

  let variants: Array<{
    name: string;
    slug: string;
    price?: string;
    availability: "unknown" | "in_stock" | "out_of_stock" | "preorder" | "discontinued";
    packSize?: string;
    imageSrc?: string;
  }> = [];
  if (parsed.data.variantsJson) {
    try {
      variants = JSON.parse(parsed.data.variantsJson) as typeof variants;
    } catch {
      go(`${paths.adminProducts}?error=variants`);
    }
  }

  const saved = await saveProduct({
    ...parsed.data,
    tags: (parsed.data.tags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    additionalImages,
    variants,
    translations: afName && afSlug
      ? {
          af: {
            status: afStatus,
            name: afName,
            slug: afSlug,
            shortDescription: formString(formData, "af_shortDescription"),
            description: formString(formData, "af_description"),
            seoTitle: formString(formData, "af_seoTitle") || undefined,
            seoDescription: formString(formData, "af_seoDescription") || undefined,
            imageAlt: formString(formData, "af_imageAlt") || undefined,
            indexable: formBool(formData, "af_indexable"),
            storageGuidance: formString(formData, "af_storageGuidance") || undefined,
            selectionGuidance: formString(formData, "af_selectionGuidance") || undefined,
            typicalUses: formString(formData, "af_typicalUses") || undefined,
          },
        }
      : undefined,
  });

  go(`${paths.adminProduct(saved.id)}?saved=1${saved.indexable ? "" : "&noindex=1"}`);
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdminSession();
  const parsed = categoryFormSchema.safeParse({
    id: formString(formData, "id") || undefined,
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    shortIntroduction: formString(formData, "shortIntroduction"),
    longContent: formString(formData, "longContent"),
    featuredImageSrc: formString(formData, "featuredImageSrc"),
    featuredImageAlt: formString(formData, "featuredImageAlt"),
    seoTitle: formString(formData, "seoTitle"),
    seoDescription: formString(formData, "seoDescription"),
    ogImageSrc: formString(formData, "ogImageSrc"),
    indexable: formBool(formData, "indexable"),
    featured: formBool(formData, "featured"),
    sortOrder: formString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) {
    go(`${paths.adminCategories}?error=validation`);
  }
  const saved = await saveCategory({
    ...parsed.data,
    translations: formString(formData, "af_name") && formString(formData, "af_slug")
      ? {
          af: {
            status: (formString(formData, "af_status") || "draft") as "draft" | "ready" | "published",
            name: formString(formData, "af_name"),
            slug: formString(formData, "af_slug"),
            shortIntroduction: formString(formData, "af_shortIntroduction"),
            longContent: formString(formData, "af_longContent"),
            seoTitle: formString(formData, "af_seoTitle") || undefined,
            seoDescription: formString(formData, "af_seoDescription") || undefined,
            imageAlt: formString(formData, "af_imageAlt") || undefined,
            indexable: formBool(formData, "af_indexable"),
          },
        }
      : undefined,
  });
  go(`${paths.adminCategory(saved.id)}?saved=1`);
}

export async function saveBundleAction(formData: FormData) {
  await requireAdminSession();
  const parsed = bundleFormSchema.safeParse({
    id: formString(formData, "id") || undefined,
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    sku: formString(formData, "sku"),
    status: formString(formData, "status") || "draft",
    shortDescription: formString(formData, "shortDescription"),
    description: formString(formData, "description"),
    price: formString(formData, "price"),
    availability: formString(formData, "availability") || "unknown",
    featured: formBool(formData, "featured"),
    indexable: formBool(formData, "indexable"),
    seoTitle: formString(formData, "seoTitle"),
    seoDescription: formString(formData, "seoDescription"),
    primaryImageSrc: formString(formData, "primaryImageSrc"),
    primaryImageAlt: formString(formData, "primaryImageAlt"),
    itemsJson: formString(formData, "itemsJson"),
  });
  if (!parsed.success) {
    go(`${paths.adminBundles}?error=validation`);
  }
  let items: Array<{ productId: string; variantId?: string; quantity: number }> = [];
  try {
    items = JSON.parse(parsed.data.itemsJson) as typeof items;
  } catch {
    go(`${paths.adminBundles}?error=items`);
  }
  const saved = await saveBundle({
    ...parsed.data,
    items,
    translations: formString(formData, "af_name") && formString(formData, "af_slug")
      ? {
          af: {
            status: (formString(formData, "af_status") || "draft") as "draft" | "ready" | "published",
            name: formString(formData, "af_name"),
            slug: formString(formData, "af_slug"),
            shortDescription: formString(formData, "af_shortDescription"),
            description: formString(formData, "af_description"),
            seoTitle: formString(formData, "af_seoTitle") || undefined,
            seoDescription: formString(formData, "af_seoDescription") || undefined,
            imageAlt: formString(formData, "af_imageAlt") || undefined,
            indexable: formBool(formData, "af_indexable"),
          },
        }
      : undefined,
  });
  go(`${paths.adminBundle(saved.id)}?saved=1`);
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("file");
  const alt = formString(formData, "alt") || "Catalogue image";
  if (!(file instanceof File) || file.size === 0) {
    go(`${paths.adminMedia}?error=file`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(bytes).rotate().webp({ quality: 82 }).toBuffer();
  const metadata = await sharp(webp).metadata();
  const filename = `${Date.now()}-${toSeoSlug(file.name.replace(/\.[^.]+$/, ""))}.webp`;
  const directory = path.join(process.cwd(), "public", "media");
  await mkdir(directory, { recursive: true });
  const diskPath = path.join(directory, filename);
  await writeFile(diskPath, webp);
  const src = `/media/${filename}`;
  await saveMediaAsset({
    originalFilename: file.name,
    originalAssetRef: `upload:${file.name}`,
    src,
    alt,
    width: metadata.width ?? 1200,
    height: metadata.height ?? 1200,
    mimeType: "image/webp",
  });
  go(`${paths.adminMedia}?saved=1`);
}

export async function saveDeliveryRuleAction(formData: FormData) {
  await requireAdminSession();
  const { saveDeliveryRule } = await import("@/services/delivery");
  await saveDeliveryRule({
    id: formString(formData, "id") || undefined,
    name: formString(formData, "name"),
    suburb: formString(formData, "suburb"),
    city: formString(formData, "city"),
    province: formString(formData, "province"),
    postalCode: formString(formData, "postalCode"),
    feeAmount: formString(formData, "feeAmount") || "0",
    minOrderAmount: formString(formData, "minOrderAmount"),
    freeDeliveryThreshold: formString(formData, "freeDeliveryThreshold"),
    estimatedWindow: formString(formData, "estimatedWindow"),
    estimatedMinDays: formString(formData, "estimatedMinDays"),
    estimatedMaxDays: formString(formData, "estimatedMaxDays"),
    published: formBool(formData, "published"),
    sortOrder: Number(formString(formData, "sortOrder") || 0),
    notes: formString(formData, "notes"),
  });
  go(`${paths.adminDelivery}?saved=1`);
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminSession();
  const { updateOrderStatuses } = await import("@/services/orders");
  const id = formString(formData, "id");
  await updateOrderStatuses({
    id,
    paymentStatus: formString(formData, "paymentStatus") || undefined,
    fulfilmentStatus: formString(formData, "fulfilmentStatus") || undefined,
    deliveryStatus: formString(formData, "deliveryStatus") || undefined,
  });
  go(`${paths.adminOrder(id)}?saved=1`);
}
