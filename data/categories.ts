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
    shortDescription: "Leafy greens, roots, onions and everyday cooking vegetables, listed as individual products.",
    description:
      "This range is for weekly cooking vegetables — potatoes, carrots, onions, spinach, lettuce, cucumber and similar staples. Open any item for pack size, price and availability. Fruit is listed separately in the fruit shop.",
    image: {
      src: "/images/categories/vegetables.webp",
      alt: "Fresh peppers, broccoli, carrots, potatoes, Brussels sprouts and sweet potato from M & M Premium Produce",
      width: 1600,
      height: 1067,
    },
    seoTitle: "Fresh Vegetables",
    seoDescription:
      "Shop fresh vegetables from M & M Premium Produce: potatoes, carrots, spinach, lettuce, onions and everyday cooking veg. Each item has its own page with pack size and price.",
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
    shortDescription: "Everyday fruit listed as individual products, from apples to seasonal citrus and berries.",
    description:
      "Each fruit has its own page so you can check pack size, price and whether it is in stock. Availability changes with the season. Vegetables are listed in the vegetable shop.",
    image: {
      src: "/images/categories/fruits.webp",
      alt: "Fresh pineapple, papaya, citrus, grapes, kiwi and avocado from M & M Premium Produce",
      width: 1600,
      height: 1067,
    },
    seoTitle: "Fresh Fruit",
    seoDescription:
      "Shop fresh fruit from M & M Premium Produce. Apples are listed with variety options; other fruit appears when it is in the current catalogue.",
    featured: true,
    indexable: true,
    isSample: false,
    sortOrder: 2,
  },
];
