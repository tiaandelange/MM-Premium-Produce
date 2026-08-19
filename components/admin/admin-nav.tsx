import { logoutAction } from "@/app/admin/actions";
import { paths } from "@/lib/routes";
import Link from "next/link";

const adminNav = [
  { href: paths.admin, label: "Overview" },
  { href: paths.adminProducts, label: "Products" },
  { href: paths.adminCategories, label: "Categories" },
  { href: paths.adminCollections, label: "Collections" },
  { href: paths.adminBundles, label: "Bundles" },
  { href: paths.adminMedia, label: "Media" },
  { href: paths.adminOrders, label: "Orders" },
  { href: paths.adminDelivery, label: "Delivery" },
] as const;

export function AdminNav({ email }: { email?: string }) {
  return (
    <nav aria-label="Admin" className="inverse-bar border-b border-line">
      <div className="site-container flex flex-wrap items-center gap-4 py-4">
        <p className="font-heading text-lg">Admin</p>
        <ul className="flex flex-wrap gap-3 text-sm">
          {adminNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href as typeof paths.admin} className="text-inverse-accent hover:text-inverse-fg">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex flex-wrap items-center gap-3 text-sm text-inverse-muted">
          {email ? <span>{email}</span> : null}
          <Link href={paths.home}>View storefront</Link>
          <form action={logoutAction}>
            <button type="submit" className="text-inverse-accent">
              Log out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
