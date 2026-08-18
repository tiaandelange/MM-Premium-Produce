import Image from "next/image";
import type { CatalogImage } from "@/types/catalog";

export function CatalogMedia({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 100vw",
  className = "",
}: {
  image: CatalogImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const isSvg = image.src.endsWith(".svg");

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={isSvg}
      className={`h-full w-full ${className || "object-cover"}`.trim()}
    />
  );
}
