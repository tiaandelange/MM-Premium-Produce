import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const entityStatusEnum = pgEnum("entity_status", ["draft", "active", "archived"]);
export const availabilityEnum = pgEnum("availability_status", [
  "unknown",
  "in_stock",
  "out_of_stock",
  "preorder",
  "discontinued",
]);
export const redirectEntityEnum = pgEnum("redirect_entity_type", [
  "product",
  "category",
  "bundle",
  "collection",
  "other",
]);
export const localeEnum = pgEnum("locale_code", ["en", "af"]);
export const translationStatusEnum = pgEnum("translation_status", ["draft", "ready", "published"]);
export const inventoryOwnerEnum = pgEnum("inventory_owner_type", ["product", "variant", "bundle"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const adminUsers = pgTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("admin"),
    ...timestamps,
  },
  (table) => [uniqueIndex("admin_users_email_idx").on(table.email)],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: text("id").primaryKey(),
    originalFilename: text("original_filename").notNull(),
    originalAssetRef: text("original_asset_ref"),
    src: text("src").notNull(),
    alt: text("alt").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    mimeType: text("mime_type"),
    ...timestamps,
  },
  (table) => [uniqueIndex("media_assets_src_idx").on(table.src), index("media_assets_ref_idx").on(table.originalAssetRef)],
);

export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortIntroduction: text("short_introduction").notNull().default(""),
    longContent: text("long_content").notNull().default(""),
    featuredImageSrc: text("featured_image_src").notNull(),
    featuredImageAlt: text("featured_image_alt").notNull(),
    featuredImageWidth: integer("featured_image_width").notNull().default(1200),
    featuredImageHeight: integer("featured_image_height").notNull().default(1200),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImageSrc: text("og_image_src"),
    featured: boolean("featured").notNull().default(false),
    indexable: boolean("indexable").notNull().default(false),
    isSample: boolean("is_sample").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    parentId: text("parent_id"),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug),
    index("categories_sort_idx").on(table.sortOrder),
    index("categories_parent_idx").on(table.parentId),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    imageSrc: text("image_src"),
    imageAlt: text("image_alt"),
    imageWidth: integer("image_width"),
    imageHeight: integer("image_height"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    featured: boolean("featured").notNull().default(false),
    indexable: boolean("indexable").notNull().default(false),
    isSample: boolean("is_sample").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("collections_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    sku: text("sku").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    status: entityStatusEnum("status").notNull().default("draft"),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    primaryCategoryId: text("primary_category_id").notNull(),
    subcategoryId: text("subcategory_id"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }),
    priceCurrency: text("price_currency").notNull().default("ZAR"),
    compareAtAmount: numeric("compare_at_amount", { precision: 12, scale: 2 }),
    unit: text("unit"),
    packSize: text("pack_size"),
    weightGrams: integer("weight_grams"),
    featured: boolean("featured").notNull().default(false),
    availability: availabilityEnum("availability").notNull().default("unknown"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImageSrc: text("og_image_src"),
    indexable: boolean("indexable").notNull().default(false),
    isSample: boolean("is_sample").notNull().default(false),
    googleProductCategory: text("google_product_category"),
    productType: text("product_type"),
    gtin: text("gtin"),
    mpn: text("mpn"),
    storageGuidance: text("storage_guidance"),
    selectionGuidance: text("selection_guidance"),
    typicalUses: text("typical_uses"),
    seasonality: text("seasonality"),
    origin: text("origin"),
    shopifyProductId: text("shopify_product_id"),
    shopifyHandle: text("shopify_handle"),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    uniqueIndex("products_sku_idx").on(table.sku),
    uniqueIndex("products_shopify_id_idx").on(table.shopifyProductId),
    index("products_status_idx").on(table.status),
    index("products_category_idx").on(table.primaryCategoryId),
    index("products_featured_idx").on(table.featured),
    index("products_indexable_idx").on(table.indexable),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.categoryId] }),
    index("product_categories_category_idx").on(table.categoryId),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku"),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }),
    priceCurrency: text("price_currency").notNull().default("ZAR"),
    compareAtAmount: numeric("compare_at_amount", { precision: 12, scale: 2 }),
    availability: availabilityEnum("availability").notNull().default("unknown"),
    packSize: text("pack_size"),
    imageSrc: text("image_src"),
    imageAlt: text("image_alt"),
    imageWidth: integer("image_width"),
    imageHeight: integer("image_height"),
    sortOrder: integer("sort_order").notNull().default(0),
    shopifyVariantId: text("shopify_variant_id"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("product_variants_product_slug_idx").on(table.productId, table.slug),
    index("product_variants_product_idx").on(table.productId),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: text("media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    originalAssetRef: text("original_asset_ref"),
    src: text("src").notNull(),
    alt: text("alt").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index("product_images_product_idx").on(table.productId),
    index("product_images_primary_idx").on(table.productId, table.isPrimary),
  ],
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.productId] }),
    index("collection_products_product_idx").on(table.productId),
  ],
);

export const bundles = pgTable(
  "bundles",
  {
    id: text("id").primaryKey(),
    sku: text("sku").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    status: entityStatusEnum("status").notNull().default("draft"),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }),
    priceCurrency: text("price_currency").notNull().default("ZAR"),
    compareAtAmount: numeric("compare_at_amount", { precision: 12, scale: 2 }),
    featured: boolean("featured").notNull().default(false),
    availability: availabilityEnum("availability").notNull().default("unknown"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImageSrc: text("og_image_src"),
    indexable: boolean("indexable").notNull().default(false),
    isSample: boolean("is_sample").notNull().default(false),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("bundles_slug_idx").on(table.slug),
    uniqueIndex("bundles_sku_idx").on(table.sku),
    index("bundles_status_idx").on(table.status),
  ],
);

export const bundleItems = pgTable(
  "bundle_items",
  {
    id: text("id").primaryKey(),
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    quantity: integer("quantity").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("bundle_items_bundle_idx").on(table.bundleId), index("bundle_items_product_idx").on(table.productId)],
);

export const bundleImages = pgTable(
  "bundle_images",
  {
    id: text("id").primaryKey(),
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    mediaId: text("media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    originalAssetRef: text("original_asset_ref"),
    src: text("src").notNull(),
    alt: text("alt").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [index("bundle_images_bundle_idx").on(table.bundleId)],
);

export const inventory = pgTable(
  "inventory",
  {
    id: text("id").primaryKey(),
    ownerType: inventoryOwnerEnum("owner_type").notNull(),
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    bundleId: text("bundle_id").references(() => bundles.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    reserved: integer("reserved").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("inventory_product_idx").on(table.productId),
    index("inventory_variant_idx").on(table.variantId),
    index("inventory_bundle_idx").on(table.bundleId),
    check(
      "inventory_single_owner",
      sql`(
        (product_id is not null)::int +
        (variant_id is not null)::int +
        (bundle_id is not null)::int
      ) = 1`,
    ),
  ],
);

export const productTranslations = pgTable(
  "product_translations",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    status: translationStatusEnum("status").notNull().default("draft"),
    name: text("name").notNull().default(""),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    storageGuidance: text("storage_guidance"),
    selectionGuidance: text("selection_guidance"),
    typicalUses: text("typical_uses"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    imageAlt: text("image_alt"),
    indexable: boolean("indexable").notNull().default(false),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.locale] }),
    uniqueIndex("product_translations_locale_slug_idx").on(table.locale, table.slug),
    index("product_translations_status_idx").on(table.locale, table.status),
  ],
);

export const categoryTranslations = pgTable(
  "category_translations",
  {
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    status: translationStatusEnum("status").notNull().default("draft"),
    name: text("name").notNull().default(""),
    slug: text("slug").notNull(),
    shortIntroduction: text("short_introduction").notNull().default(""),
    longContent: text("long_content").notNull().default(""),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    imageAlt: text("image_alt"),
    indexable: boolean("indexable").notNull().default(false),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.locale] }),
    uniqueIndex("category_translations_locale_slug_idx").on(table.locale, table.slug),
  ],
);

export const bundleTranslations = pgTable(
  "bundle_translations",
  {
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    status: translationStatusEnum("status").notNull().default("draft"),
    name: text("name").notNull().default(""),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalOverride: text("canonical_override"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    imageAlt: text("image_alt"),
    indexable: boolean("indexable").notNull().default(false),
    publishedSlug: text("published_slug"),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.bundleId, table.locale] }),
    uniqueIndex("bundle_translations_locale_slug_idx").on(table.locale, table.slug),
  ],
);

export const collectionTranslations = pgTable(
  "collection_translations",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    status: translationStatusEnum("status").notNull().default("draft"),
    name: text("name").notNull().default(""),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    imageAlt: text("image_alt"),
    indexable: boolean("indexable").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.locale] }),
    uniqueIndex("collection_translations_locale_slug_idx").on(table.locale, table.slug),
  ],
);

export const redirects = pgTable(
  "redirects",
  {
    id: text("id").primaryKey(),
    fromPath: text("from_path").notNull(),
    toPath: text("to_path").notNull(),
    permanent: boolean("permanent").notNull().default(true),
    entityType: redirectEntityEnum("entity_type").notNull().default("other"),
    entityId: text("entity_id"),
    ...timestamps,
  },
  (table) => [uniqueIndex("redirects_from_path_idx").on(table.fromPath), index("redirects_entity_idx").on(table.entityId)],
);

/** Commerce tables for cart, checkout, delivery and orders. */
export const deliveryRules = pgTable(
  "delivery_rules",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    suburb: text("suburb"),
    city: text("city"),
    province: text("province"),
    postalCode: text("postal_code"),
    feeAmount: numeric("fee_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: text("currency").notNull().default("ZAR"),
    minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }),
    freeDeliveryThreshold: numeric("free_delivery_threshold", { precision: 12, scale: 2 }),
    estimatedWindow: text("estimated_window"),
    estimatedMinDays: integer("estimated_min_days"),
    estimatedMaxDays: integer("estimated_max_days"),
    published: boolean("published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [index("delivery_rules_published_idx").on(table.published, table.sortOrder)],
);

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    email: text("email"),
    name: text("name"),
    phone: text("phone"),
    locale: localeEnum("locale").notNull().default("en"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("customers_email_idx").on(table.email)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().default(""),
    customerId: text("customer_id").references(() => customers.id),
    locale: localeEnum("locale").notNull().default("en"),
    localeTag: text("locale_tag").notNull().default("en-ZA"),
    customerName: text("customer_name").notNull().default(""),
    customerFirstName: text("customer_first_name").notNull().default(""),
    customerLastName: text("customer_last_name").notNull().default(""),
    customerEmail: text("customer_email").notNull().default(""),
    customerPhone: text("customer_phone"),
    deliveryName: text("delivery_name").notNull().default(""),
    deliveryPhone: text("delivery_phone"),
    deliveryLine1: text("delivery_line1").notNull().default(""),
    deliverySuburb: text("delivery_suburb"),
    deliveryCity: text("delivery_city"),
    deliveryProvince: text("delivery_province"),
    deliveryPostalCode: text("delivery_postal_code"),
    deliveryNotes: text("delivery_notes"),
    deliveryRuleId: text("delivery_rule_id").references(() => deliveryRules.id, { onDelete: "set null" }),
    deliveryFeeAmount: numeric("delivery_fee_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    deliveryWindowSnapshot: text("delivery_window_snapshot"),
    subtotalAmount: numeric("subtotal_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: text("currency").notNull().default("ZAR"),
    paymentStatus: text("payment_status").notNull().default("awaiting_payment"),
    fulfilmentStatus: text("fulfilment_status").notNull().default("unfulfilled"),
    deliveryStatus: text("delivery_status").notNull().default("unscheduled"),
    paymentProvider: text("payment_provider").notNull().default("unconfigured"),
    paymentInstruction: text("payment_instruction"),
    accessToken: text("access_token"),
    idempotencyKey: text("idempotency_key"),
    status: text("status").notNull().default("pending_payment"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("orders_number_idx").on(table.number),
    uniqueIndex("orders_access_token_idx").on(table.accessToken),
    uniqueIndex("orders_idempotency_key_idx").on(table.idempotencyKey),
    index("orders_created_idx").on(table.createdAt),
    index("orders_payment_idx").on(table.paymentStatus),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    bundleId: text("bundle_id").references(() => bundles.id, { onDelete: "set null" }),
    skuSnapshot: text("sku_snapshot").notNull().default(""),
    nameSnapshot: text("name_snapshot").notNull().default(""),
    variantNameSnapshot: text("variant_name_snapshot"),
    quantity: integer("quantity").notNull().default(1),
    unitPriceAmount: numeric("unit_price_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    lineTotalAmount: numeric("line_total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: text("currency").notNull().default("ZAR"),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("unconfigured"),
    status: text("status").notNull().default("pending"),
    amount: numeric("amount", { precision: 12, scale: 2 }),
    currency: text("currency").notNull().default("ZAR"),
    externalRef: text("external_ref"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("payments_order_idx").on(table.orderId)],
);

export const deliveries = pgTable(
  "deliveries",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    method: text("method"),
    status: text("status").notNull().default("unscheduled"),
    addressJson: text("address_json"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("deliveries_order_idx").on(table.orderId)],
);

export const schema = {
  adminUsers,
  mediaAssets,
  categories,
  collections,
  products,
  productCategories,
  productVariants,
  productImages,
  collectionProducts,
  bundles,
  bundleItems,
  bundleImages,
  inventory,
  productTranslations,
  categoryTranslations,
  bundleTranslations,
  collectionTranslations,
  redirects,
  deliveryRules,
  customers,
  orders,
  orderItems,
  payments,
  deliveries,
};
