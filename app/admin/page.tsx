import { paths } from "@/lib/routes";
import Link from "next/link";

export const metadata = {
  title: "Catalogue administration",
};

const sections = [
  {
    href: paths.adminProducts,
    title: "Products",
    body: "SEO fields, slugs, pricing, availability and indexation for individual produce.",
  },
  {
    href: paths.adminCategories,
    title: "Categories",
    body: "Taxonomy landing pages with introductory copy and category SEO.",
  },
  {
    href: paths.adminCollections,
    title: "Collections",
    body: "Editorial merchandising groups, independent from category taxonomy.",
  },
  {
    href: paths.adminBundles,
    title: "Bundles",
    body: "Purchasable produce boxes with component products and quantities.",
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-page-title">Catalogue administration</h1>
        <p className="mt-4 max-w-3xl text-muted">
          This is the information architecture for the future admin system. It reads the
          same catalogue service as the storefront. CRUD persistence, image uploads,
          inventory, orders and authentication belong to a later phase.
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.href} className="card-surface p-5">
            <h2 className="font-heading text-card-title">{section.title}</h2>
            <p className="mt-2 text-sm text-muted">{section.body}</p>
            <Link href={section.href} className="mt-4 inline-block text-sm font-medium">
              Open {section.title.toLowerCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
