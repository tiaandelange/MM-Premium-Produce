import { SiteFooter } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SkipLink } from "@/components/layout/skip-link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
