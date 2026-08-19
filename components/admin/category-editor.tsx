import { saveCategoryAction } from "@/app/admin/actions";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import type { Category } from "@/types/catalog";
import type { TranslationStatus } from "@/lib/i18n/config";

export type CategoryAfTranslation = {
  name: string;
  slug: string;
  shortIntroduction: string;
  longContent: string;
  status: TranslationStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  imageAlt: string | null;
  indexable: boolean;
};

export function CategoryEditor({
  category,
  afTranslation,
}: {
  category?: Category;
  afTranslation?: CategoryAfTranslation | null;
}) {
  return (
    <form action={saveCategoryAction} className="space-y-8">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <section className="space-y-4">
        <h2 className="text-section-title">Shared category data</h2>
        <p className="text-sm text-muted">Images and merchandising flags are the same in every language.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Sort order" name="sortOrder">
            <TextInput name="sortOrder" defaultValue={String(category?.sortOrder ?? 0)} />
          </Field>
          <Field label="Featured image" name="featuredImageSrc">
            <TextInput name="featuredImageSrc" defaultValue={category?.image.src} required />
          </Field>
          <Field label="English image alt" name="featuredImageAlt">
            <TextInput name="featuredImageAlt" defaultValue={category?.image.alt} required />
          </Field>
          <Field label="OG image" name="ogImageSrc">
            <TextInput name="ogImageSrc" defaultValue={category?.ogImage?.src ?? ""} />
          </Field>
        </div>
        <div className="flex gap-6">
          <Checkbox name="featured" label="Featured" defaultChecked={category?.featured} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-section-title">Localized content</h2>
        <LocaleTabs
          english={
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="English name" name="name">
                  <TextInput name="name" defaultValue={category?.name} required />
                </Field>
                <Field label="English slug" name="slug">
                  <TextInput name="slug" defaultValue={category?.slug} required />
                </Field>
              </div>
              <Field label="Short introduction" name="shortIntroduction">
                <TextInput
                  name="shortIntroduction"
                  defaultValue={category?.shortDescription}
                  required
                  textarea
                  rows={3}
                />
              </Field>
              <Field label="Long-form supporting content" name="longContent">
                <TextInput name="longContent" defaultValue={category?.description} required textarea rows={6} />
              </Field>
              <Field label="SEO title" name="seoTitle">
                <TextInput name="seoTitle" defaultValue={category?.seoTitle ?? ""} />
              </Field>
              <Field label="SEO description" name="seoDescription">
                <TextInput name="seoDescription" defaultValue={category?.seoDescription ?? ""} textarea rows={3} />
              </Field>
              <Checkbox name="indexable" label="English indexable" defaultChecked={category?.indexable} />
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
              <Field label="Short introduction" name="af_shortIntroduction">
                <TextInput
                  name="af_shortIntroduction"
                  defaultValue={afTranslation?.shortIntroduction ?? ""}
                  textarea
                  rows={3}
                />
              </Field>
              <Field label="Long-form supporting content" name="af_longContent">
                <TextInput
                  name="af_longContent"
                  defaultValue={afTranslation?.longContent ?? ""}
                  textarea
                  rows={6}
                />
              </Field>
              <Field label="SEO title" name="af_seoTitle">
                <TextInput name="af_seoTitle" defaultValue={afTranslation?.seoTitle ?? ""} />
              </Field>
              <Field label="SEO description" name="af_seoDescription">
                <TextInput
                  name="af_seoDescription"
                  defaultValue={afTranslation?.seoDescription ?? ""}
                  textarea
                  rows={3}
                />
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
        Save category
      </button>
    </form>
  );
}
