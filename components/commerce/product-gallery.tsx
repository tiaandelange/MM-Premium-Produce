import { CatalogMedia } from "@/components/commerce/catalog-media";
import type { CatalogImage } from "@/types/catalog";

export function ProductGallery({
  images,
  productName,
}: {
  images: CatalogImage[];
  productName: string;
}) {
  const [primary, ...rest] = images;

  return (
    <div className="space-y-4">
      <figure className="relative aspect-square overflow-hidden rounded-card border border-line bg-sand">
        <CatalogMedia
          image={primary}
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-contain p-4"
        />
        <figcaption className="sr-only">{primary.alt || productName}</figcaption>
      </figure>
      {rest.length ? (
        <ul className="grid grid-cols-3 gap-3">
          {rest.map((image) => (
            <li key={image.src}>
              <figure className="relative aspect-square overflow-hidden rounded-card border border-line bg-sand">
                <CatalogMedia image={image} sizes="20vw" className="object-contain p-2" />
                <figcaption className="sr-only">{image.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
