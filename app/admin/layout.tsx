import { getAdminSession } from "@/lib/auth/session";
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

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await getAdminSession();

  if (!session) {
    return (
      <div className="flex min-h-full flex-col bg-canvas">
        <main id="admin-main" className="site-container flex-1 py-16">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <a href="#admin-main" className="skip-link">
        Skip to admin content
      </a>
      <AdminNav email={session.email} />
      <div className="border-b border-line bg-notice px-4 py-3 text-sm text-ink">
        <p className="site-container">
          Admin routes are noindex and are not in the sitemap. Catalogue edits write to
          PostgreSQL and become the storefront source of truth.
        </p>
      </div>
      <main id="admin-main" className="site-container flex-1 py-10">
        {children}
      </main>
    </div>
  );
}
