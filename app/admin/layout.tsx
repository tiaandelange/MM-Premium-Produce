import { AdminNav } from "@/components/admin/admin-nav";
import { adminRobots } from "@/lib/seo/indexation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | M & M Premium Produce",
  },
  robots: adminRobots,
  referrer: "no-referrer",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <a href="#admin-main" className="skip-link">
        Skip to admin content
      </a>
      <AdminNav />
      <div className="border-b border-line bg-notice px-4 py-3 text-sm text-ink">
        <p className="site-container">
          Admin routes are noindex and are not in the sitemap. Authentication is not
          implemented yet — do not treat this area as private.
        </p>
      </div>
      <main id="admin-main" className="site-container flex-1 py-10">
        {children}
      </main>
    </div>
  );
}
