export function hasMinimumIndexableContent(input: {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  imageSrc: string;
  imageAlt: string;
}): boolean {
  return Boolean(
    input.name.trim() &&
      input.slug.trim() &&
      input.shortDescription.trim().length >= 8 &&
      input.description.trim().length >= 40 &&
      input.categoryId.trim() &&
      input.imageSrc.trim() &&
      input.imageAlt.trim().length >= 8,
  );
}
