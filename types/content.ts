/**
 * Reserved content types for later informational SEO.
 * Do not generate thin or mass-produced pages in Phase 1.
 */
export type ContentStatus = "draft" | "published";

export type ContentKind =
  | "recipe"
  | "guide"
  | "seasonal-produce"
  | "storage-guide"
  | "how-to";

export type EditorialEntry = {
  id: string;
  slug: string;
  kind: ContentKind;
  title: string;
  description: string;
  status: ContentStatus;
  indexable: boolean;
};
