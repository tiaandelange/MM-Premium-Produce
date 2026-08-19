import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "cat_vegetables",
    locale: "en",
    translationStatus: "published",
    alternates: [
      { locale: "en", slug: "vegetables", status: "published" },
      { locale: "af", slug: "groente", status: "published" },
    ],
    slug: "vegetables",
    name: "Vegetables",
    shortDescription: "Leafy greens, roots, onions and everyday cooking vegetables.",
    description:
      "Shop fresh vegetables from M & M Premium Produce, including lettuce, spinach, onions, potatoes, carrots and more. Each item has its own product page with pack size and price where those details are listed for sale.",
    image: {
      src: "/images/categories/vegetables.webp",
      alt: "Fresh peppers, broccoli, carrots, potatoes, Brussels sprouts and sweet potato from M & M Premium Produce",
      width: 1600,
      height: 1067,
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
    locale: "en",
    translationStatus: "published",
    alternates: [
      { locale: "en", slug: "fruit", status: "published" },
      { locale: "af", slug: "vrugte", status: "published" },
    ],
    slug: "fruit",
    name: "Fruit",
    shortDescription: "Everyday fresh fruit, from apples and grapes to citrus and berries.",
    description:
      "Shop fresh fruit from M & M Premium Produce. Apples, citrus, grapes, berries and other fruit are listed as individual products so each item can be opened, shared and found on its own page.",
    image: {
      src: "/images/categories/fruits.webp",
      alt: "Fresh pineapple, papaya, citrus, grapes, kiwi and avocado from M & M Premium Produce",
      width: 1600,
      height: 1067,
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
