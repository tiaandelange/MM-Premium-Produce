import Link from "next/link";
import type { Route } from "next";

type ComingSoonNavLinkProps = {
  href: Route;
  label: string;
  status: string;
  current?: boolean;
};

/**
 * Linked destination with an accessible coming-soon status.
 * Keeps the page reachable while making it clear it is not yet purchasable.
 */
export function ComingSoonNavLink({ href, label, status, current }: ComingSoonNavLinkProps) {
  return (
    <Link
      href={href}
      className="nav-coming-soon"
      aria-current={current ? "page" : undefined}
    >
      <span className="nav-coming-soon-label">{label}</span>
      <span className="sr-only"> — </span>
      <span className="nav-coming-soon-badge">{status}</span>
    </Link>
  );
}
