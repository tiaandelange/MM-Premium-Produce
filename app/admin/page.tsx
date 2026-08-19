import { requireAdmin } from "@/lib/auth/guards";
import { paths } from "@/lib/routes";
import Link from "next/link";

export const metadata = {
  title: "Catalogue administration",
};

const sections = [
  {
    href: paths.adminProducts,
    title: "Products",
    body: "SEO fields, slugs, pricing, availability, variants, images and indexation.",
  },
  {
    href: paths.adminCategories,
    title: "Categories",
    body: "Organic landing pages with introductions, supporting copy and category SEO.",
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
  {
    href: paths.adminMedia,
    title: "Media",
    body: "Optimized production images, alt text, dimensions and original asset references.",
  },
  {
    href: paths.adminOrders,
    title: "Orders",
    body: "Order snapshots, payment, fulfilment and delivery status.",
  },
  {
    href: paths.adminDelivery,
    title: "Delivery",
    body: "Publish delivery areas, fees, minimums and windows. Unpublished rules stay hidden on the storefront.",
  },
  {
    href: paths.adminGuides,
    title: "Guides",
    body: "Informational produce guides: status, slugs, indexation and related catalogue links.",
  },
  {
    href: paths.adminRecipes,
    title: "Recipes",
    body: "Household recipes only. No fabricated ratings, nutrition or times.",
  },
];

export default async function AdminHomePage() {
  await requireAdmin();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-page-title">Catalogue and SEO CMS</h1>
        <p className="mt-4 max-w-3xl text-muted">
          This administration system writes to PostgreSQL. The storefront, metadata,
          JSON-LD, sitemap and future merchant feed all read the same catalogue service.
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.href} className="card-surface p-5">
            <h2 className="font-heading text-card-title">{section.title}</h2>
            <p className="mt-2 text-sm text-muted">{section.body}</p>
            <Link href={section.href as typeof paths.admin} className="mt-4 inline-block text-sm font-medium">
              Open {section.title.toLowerCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
