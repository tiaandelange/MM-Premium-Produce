import type { CatalogImage } from "@/types/catalog";

export function catalogImage(
  src: string,
  alt: string,
  width: number,
  height: number,
): CatalogImage {
  return { src, alt, width, height };
}
