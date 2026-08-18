import Link from "next/link";
import { paths } from "@/lib/routes";

const adminNav = [
  { href: paths.admin, label: "Overview" },
  { href: paths.adminProducts, label: "Products" },
  { href: paths.adminCategories, label: "Categories" },
  { href: paths.adminCollections, label: "Collections" },
  { href: paths.adminBundles, label: "Bundles" },
] as const;

export function AdminNav() {
  return (
    <nav aria-label="Admin" className="border-b border-line bg-ink text-canvas">
      <div className="site-container flex flex-wrap items-center gap-4 py-4">
        <p className="font-heading text-lg">Admin</p>
        <ul className="flex flex-wrap gap-3 text-sm">
          {adminNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-[#f0d9b8] hover:text-canvas">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={paths.home} className="ml-auto text-sm text-[#d7d0c3]">
          View storefront
        </Link>
      </div>
    </nav>
  );
}
