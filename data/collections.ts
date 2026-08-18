import type { Collection } from "@/types/catalog";

export const collections: Collection[] = [
  {
    id: "col_featured_produce",
    slug: "featured-produce",
    name: "Featured produce",
    description:
      "Merchandising collection for homepage featured fruit and vegetables. This is not a public SEO landing page.",
    productIds: [
      "prod_baby_spinach",
      "prod_cherry_tomatoes",
      "prod_iceberg_lettuce",
      "prod_apples",
      "prod_carrots",
      "prod_cucumber",
    ],
    image: {
      src: "/images/categories/fresh-vegetables.webp",
      alt: "Featured fresh produce from M & M Premium Produce",
      width: 1400,
      height: 1400,
    },
    featured: true,
    indexable: false,
    isSample: false,
  },
];
