import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { getSiteConfig } from "@/config/site";
import { footerNav, paths } from "@/lib/routes";

export function SiteFooter() {
  const { businessName } = getSiteConfig();

  return (
    <footer className="band-ink mt-auto">
      <div className="site-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Wordmark inverse />
          <p className="mt-4 max-w-sm text-sm text-[#d7d0c3]">
            Personally handpicked fruit and vegetables. Quality does matter.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-label font-semibold uppercase tracking-[0.16em] text-[#cfc6b6]">
            Shop
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-label font-semibold uppercase tracking-[0.16em] text-[#cfc6b6]">
            Contact
          </p>
          <p className="mt-4 text-sm text-[#d7d0c3]">
            Public email, phone and address will appear once they are confirmed.{" "}
            <Link href={paths.contact}>Open the contact page</Link>. Privacy, terms and
            POPIA pages will follow when those policies are written.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="site-container py-4 text-sm text-[#cfc6b6]">
          © {new Date().getFullYear()} {businessName}
        </p>
      </div>
    </footer>
  );
}
