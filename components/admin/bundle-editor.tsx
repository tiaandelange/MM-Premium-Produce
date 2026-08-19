import { saveBundleAction } from "@/app/admin/actions";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import type { Bundle } from "@/types/catalog";
import type { TranslationStatus } from "@/lib/i18n/config";

export type BundleAfTranslation = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: TranslationStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  imageAlt: string | null;
  indexable: boolean;
};

export function BundleEditor({
  bundle,
  afTranslation,
}: {
  bundle?: Bundle;
  afTranslation?: BundleAfTranslation | null;
}) {
  const itemsJson = JSON.stringify(
    bundle?.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    })) ?? [],
    null,
    2,
  );

  return (
    <form action={saveBundleAction} className="space-y-8">
      {bundle ? <input type="hidden" name="id" value={bundle.id} /> : null}

      <section className="space-y-4">
        <h2 className="text-section-title">Shared box data</h2>
        <p className="text-sm text-muted">SKU, price, stock, images and component products are the same in every language.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SKU" name="sku">
            <TextInput name="sku" defaultValue={bundle?.sku} required />
          </Field>
          <Field label="Status" name="status">
            <select
              id="status"
              name="status"
              defaultValue={bundle?.status ?? "draft"}
              className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="active">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Price" name="price">
            <TextInput name="price" defaultValue={bundle?.price?.amount?.toString() ?? ""} />
          </Field>
          <Field label="Availability" name="availability">
            <select
              id="availability"
              name="availability"
              defaultValue={bundle?.availability ?? "unknown"}
              className="w-full rounded-control border border-line bg-surface px-3 py-2 text-sm"
            >
              <option value="unknown">Unknown</option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </Field>
          <Field label="Primary image" name="primaryImageSrc">
            <TextInput name="primaryImageSrc" defaultValue={bundle?.primaryImage.src} required />
          </Field>
          <Field label="English image alt" name="primaryImageAlt">
            <TextInput name="primaryImageAlt" defaultValue={bundle?.primaryImage.alt} required />
          </Field>
        </div>
        <Field
          label="Component products JSON"
          name="itemsJson"
          hint='[{ "productId": "prod_apples", "quantity": 1, "variantId": optional }]'
        >
          <TextInput name="itemsJson" defaultValue={itemsJson} required textarea rows={8} />
        </Field>
        <Checkbox name="featured" label="Featured" defaultChecked={bundle?.featured} />
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Localized content</h2>
        <LocaleTabs
          english={
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="English name" name="name">
                  <TextInput name="name" defaultValue={bundle?.name} required />
                </Field>
                <Field label="English slug" name="slug">
                  <TextInput name="slug" defaultValue={bundle?.slug} required />
                </Field>
              </div>
              <Field label="Short description" name="shortDescription">
                <TextInput name="shortDescription" defaultValue={bundle?.shortDescription} required textarea />
              </Field>
              <Field label="Description" name="description">
                <TextInput name="description" defaultValue={bundle?.description} required textarea rows={5} />
              </Field>
              <Field label="SEO title" name="seoTitle">
                <TextInput name="seoTitle" defaultValue={bundle?.seoTitle ?? ""} />
              </Field>
              <Field label="SEO description" name="seoDescription">
                <TextInput name="seoDescription" defaultValue={bundle?.seoDescription ?? ""} textarea />
              </Field>
              <Checkbox name="indexable" label="English indexable" defaultChecked={bundle?.indexable} />
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
                <TextInput
                  name="af_shortDescription"
                  defaultValue={afTranslation?.shortDescription ?? ""}
                  textarea
                />
              </Field>
              <Field label="Description" name="af_description">
                <TextInput name="af_description" defaultValue={afTranslation?.description ?? ""} textarea rows={5} />
              </Field>
              <Field label="SEO title" name="af_seoTitle">
                <TextInput name="af_seoTitle" defaultValue={afTranslation?.seoTitle ?? ""} />
              </Field>
              <Field label="SEO description" name="af_seoDescription">
                <TextInput name="af_seoDescription" defaultValue={afTranslation?.seoDescription ?? ""} textarea />
              </Field>
              <Field label="Image alt override" name="af_imageAlt">
                <TextInput name="af_imageAlt" defaultValue={afTranslation?.imageAlt ?? ""} />
              </Field>
              <Checkbox name="af_indexable" label="Afrikaans indexable" defaultChecked={afTranslation?.indexable} />
            </div>
          }
        />
      </section>

      <button type="submit" className="btn-primary">
        Save bundle
      </button>
    </form>
  );
}
