import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "cat_vegetables",
    slug: "vegetables",
    name: "Vegetables",
    shortDescription: "Leafy greens, roots, onions and everyday cooking vegetables.",
    description:
      "Shop fresh vegetables from M & M Premium Produce, including lettuce, spinach, onions, potatoes, carrots and more. Each item has its own product page with pack size and price where those details are listed for sale.",
    image: {
      src: "/images/categories/fresh-vegetables.webp",
      alt: "Fresh vegetables from M & M Premium Produce",
      width: 1400,
      height: 1400,
    },
    seoTitle: "Fresh Vegetables",
    seoDescription:
      "Browse fresh vegetables from M & M Premium Produce, including leafy greens, carrots, tomatoes, onions and potatoes. Each item has its own product page.",
    featured: true,
    indexable: true,
    isSample: false,
    sortOrder: 1,
  },
  {
    id: "cat_fruit",
    slug: "fruit",
    name: "Fruit",
    shortDescription: "Everyday fresh fruit, from apples and grapes to citrus and berries.",
    description:
      "Shop fresh fruit from M & M Premium Produce. Apples, citrus, grapes, berries and other fruit are listed as individual products so each item can be opened, shared and found on its own page.",
    image: {
      src: "/images/categories/fresh-fruit.webp",
      alt: "Fresh fruit from M & M Premium Produce",
      width: 1400,
      height: 1401,
    },
    seoTitle: "Fresh Fruit",
    seoDescription:
      "Browse fresh fruit from M & M Premium Produce, including apples, citrus, grapes and berries. Each fruit has its own product page.",
    featured: true,
    indexable: true,
    isSample: false,
    sortOrder: 2,
  },
];
