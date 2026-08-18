import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { primaryNav } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="site-container flex min-w-0 items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" className="min-w-0 text-ink hover:text-ink">
          <Wordmark compact />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm font-medium text-ink hover:text-leaf">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <details className="mobile-nav relative lg:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-line bg-canvas px-3 text-sm font-medium text-ink">
            Menu
          </summary>
          <nav
            aria-label="Primary mobile"
            className="absolute right-0 z-20 mt-2 w-56 rounded-card border border-line bg-surface p-3 shadow-sm"
          >
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-sm px-3 py-2 text-ink hover:bg-sand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
