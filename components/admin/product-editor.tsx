import { saveProductAction } from "@/app/admin/actions";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import type { Category, Collection, Product } from "@/types/catalog";
import { parsePriceUnit, resolvePriceUnit } from "@/lib/catalog/price-unit";

export function ProductEditor({
  product,
  categories,
  collections,
  afTranslation,
}: {
  product?: Product;
  categories: Category[];
  collections: Collection[];
  afTranslation?: {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    status: "draft" | "ready" | "published";
    seoTitle: string | null;
    seoDescription: string | null;
    imageAlt: string | null;
    indexable: boolean;
    storageGuidance: string | null;
    selectionGuidance: string | null;
    typicalUses: string | null;
  } | null;
}) {
  const variantsJson = product?.variants?.length
    ? JSON.stringify(
        product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          slug: variant.slug,
          price: variant.price?.amount?.toString() ?? "",
          availability: variant.availability,
          packSize: variant.packSize ?? "",
          imageSrc: variant.image?.src ?? "",
        })),
        null,
        2,
      )
    : "[]";
  const additionalImages =
    product?.images
      .filter((image) => image.src !== product.primaryImage.src)
      .map((image) => `${image.src}|${image.alt}`)
      .join("\n") ?? "";

  return (
    <form action={saveProductAction} className="space-y-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <section className="space-y-4">
        <h2 className="text-section-title">Shared product data</h2>
        <p className="text-sm text-muted">SKU, price, stock, images and variants are the same in every language.</p>
        <div className="grid gap-4 md:grid-cols-2">
        <Field label="SKU" name="sku">
          <TextInput name="sku" defaultValue={product?.sku} required />
        </Field>
        <Field label="Status" name="status">
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? "draft"}
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Category" name="categoryId">
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Availability" name="availability">
          <select
            id="availability"
            name="availability"
            defaultValue={product?.availability ?? "unknown"}
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="unknown">Unknown</option>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="preorder">Preorder</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </Field>
        <Field label="Price (ZAR)" name="price">
          <TextInput name="price" defaultValue={product?.price?.amount?.toString() ?? ""} />
        </Field>
        <Field
          label="Price unit"
          name="unit"
          hint="How the listed price is sold. Does not change the amount. ea = head, punnet or packed bag; /kg or /g only when the price itself is per kilogram or gram."
        >
          <select
            id="unit"
            name="unit"
            defaultValue={parsePriceUnit(product?.unit) ?? resolvePriceUnit({ unit: product?.unit, packSize: product?.packSize, productId: product?.id })}
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="ea">ea — each</option>
            <option value="kg">/kg — per kilogram</option>
            <option value="g">/g — per gram</option>
          </select>
        </Field>
        <Field label="Compare-at price" name="compareAtPrice">
          <TextInput name="compareAtPrice" defaultValue={product?.compareAtPrice?.amount?.toString() ?? ""} />
        </Field>
        <Field label="Pack size" name="packSize">
          <TextInput name="packSize" defaultValue={product?.packSize ?? ""} />
        </Field>
        <Field label="Stock quantity" name="stockQuantity">
          <TextInput name="stockQuantity" defaultValue={product?.stockQuantity?.toString() ?? ""} />
        </Field>
        <Field label="Tags" name="tags" hint="Comma separated.">
          <TextInput name="tags" defaultValue={product?.tags.join(", ") ?? ""} />
        </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Localized content</h2>
        <LocaleTabs
          english={
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="English name" name="name">
                  <TextInput name="name" defaultValue={product?.name} required />
                </Field>
                <Field label="English slug" name="slug">
                  <TextInput name="slug" defaultValue={product?.slug} required />
                </Field>
              </div>
              <Field label="Short description" name="shortDescription">
                <TextInput name="shortDescription" defaultValue={product?.shortDescription} required textarea rows={3} />
              </Field>
              <Field label="Full description" name="description">
                <TextInput name="description" defaultValue={product?.description} required textarea rows={6} />
              </Field>
            </div>
          }
          afrikaans={
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Afrikaans name" name="af_name">
                  <TextInput name="af_name" defaultValue={afTranslation?.name ?? ""} />
                </Field>
                <Field label="Afrikaans slug" name="af_slug">
                  <TextInput name="af_slug" defaultValue={afTranslation?.slug ?? ""} />
                </Field>
              </div>
              <Field label="Translation status" name="af_status">
                <select
                  id="af_status"
                  name="af_status"
                  defaultValue={afTranslation?.status ?? "draft"}
                  className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <Field label="Short description" name="af_shortDescription">
                <TextInput name="af_shortDescription" defaultValue={afTranslation?.shortDescription ?? ""} textarea rows={3} />
              </Field>
              <Field label="Full description" name="af_description">
                <TextInput name="af_description" defaultValue={afTranslation?.description ?? ""} textarea rows={6} />
              </Field>
              <Field label="SEO title" name="af_seoTitle">
                <TextInput name="af_seoTitle" defaultValue={afTranslation?.seoTitle ?? ""} />
              </Field>
              <Field label="SEO description" name="af_seoDescription">
                <TextInput name="af_seoDescription" defaultValue={afTranslation?.seoDescription ?? ""} textarea rows={3} />
              </Field>
              <Field label="Image alt override" name="af_imageAlt">
                <TextInput name="af_imageAlt" defaultValue={afTranslation?.imageAlt ?? ""} />
              </Field>
              <Field label="Storage guidance" name="af_storageGuidance">
                <TextInput name="af_storageGuidance" defaultValue={afTranslation?.storageGuidance ?? ""} textarea rows={3} />
              </Field>
              <Field label="Selection guidance" name="af_selectionGuidance">
                <TextInput name="af_selectionGuidance" defaultValue={afTranslation?.selectionGuidance ?? ""} textarea rows={3} />
              </Field>
              <Field label="Typical uses" name="af_typicalUses">
                <TextInput name="af_typicalUses" defaultValue={afTranslation?.typicalUses ?? ""} textarea rows={3} />
              </Field>
              <Checkbox name="af_indexable" label="Afrikaans indexable" defaultChecked={afTranslation?.indexable} />
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Images</h2>
        <Field label="Primary image path" name="primaryImageSrc">
          <TextInput name="primaryImageSrc" defaultValue={product?.primaryImage.src} required />
        </Field>
        <Field label="Primary image alt text" name="primaryImageAlt">
          <TextInput name="primaryImageAlt" defaultValue={product?.primaryImage.alt} required />
        </Field>
        <Field
          label="Additional images"
          name="additionalImages"
          hint="One per line: /images/products/file.webp|Alt text"
        >
          <TextInput name="additionalImages" defaultValue={additionalImages} textarea rows={4} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">SEO CMS</h2>
        <Field label="SEO title" name="seoTitle">
          <TextInput name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
        </Field>
        <Field label="SEO meta description" name="seoDescription">
          <TextInput name="seoDescription" defaultValue={product?.seoDescription ?? ""} textarea rows={3} />
        </Field>
        <Field
          label="Canonical override"
          name="canonicalOverride"
          hint="Leave blank unless a genuine canonical exception is required."
        >
          <TextInput name="canonicalOverride" defaultValue={product?.canonicalOverride ?? ""} />
        </Field>
        <Field label="OG title" name="ogTitle">
          <TextInput name="ogTitle" defaultValue={product?.ogTitle ?? ""} />
        </Field>
        <Field label="OG description" name="ogDescription">
          <TextInput name="ogDescription" defaultValue={product?.ogDescription ?? ""} textarea rows={3} />
        </Field>
        <Field label="OG image path" name="ogImageSrc">
          <TextInput name="ogImageSrc" defaultValue={product?.ogImage?.src ?? ""} />
        </Field>
        <div className="flex flex-wrap gap-6">
          <Checkbox name="indexable" label="Indexable (Google)" defaultChecked={product?.indexable} />
          <Checkbox name="featured" label="Featured" defaultChecked={product?.featured} />
        </div>
        <p className="text-xs text-muted">
          Indexable is only honoured for published products that meet the minimum content
          quality gate (name, slug, descriptions, category, image and alt text).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Useful content (factual only)</h2>
        <Field label="Storage guidance" name="storageGuidance">
          <TextInput name="storageGuidance" defaultValue={product?.guidance?.storage ?? ""} textarea rows={3} />
        </Field>
        <Field label="Selection guidance" name="selectionGuidance">
          <TextInput name="selectionGuidance" defaultValue={product?.guidance?.selection ?? ""} textarea rows={3} />
        </Field>
        <Field label="Typical uses" name="typicalUses">
          <TextInput name="typicalUses" defaultValue={product?.guidance?.typicalUses ?? ""} textarea rows={3} />
        </Field>
        <Field label="Seasonality" name="seasonality">
          <TextInput name="seasonality" defaultValue={product?.guidance?.seasonality ?? ""} />
        </Field>
        <Field label="Origin" name="origin">
          <TextInput name="origin" defaultValue={product?.guidance?.origin ?? ""} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Collections</h2>
        <div className="flex flex-wrap gap-4">
          {collections.map((collection) => (
            <label key={collection.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="collectionIds"
                value={collection.id}
                defaultChecked={product?.collectionIds.includes(collection.id)}
              />
              {collection.name}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Variants</h2>
        <Field
          label="Variants JSON"
          name="variantsJson"
          hint='Array of {name, slug, price, availability, packSize, imageSrc}. Use [] if there are no variants.'
        >
          <TextInput name="variantsJson" defaultValue={variantsJson} textarea rows={8} />
        </Field>
      </section>

      <button type="submit" className="btn-primary">
        Save product
      </button>
    </form>
  );
}

