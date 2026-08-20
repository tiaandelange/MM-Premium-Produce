import type { ReactNode } from "react";

export function PageIntro({ children }: { children: ReactNode }) {
  return (
    <section className="page-intro">
      <div className="site-container page-intro-inner">{children}</div>
    </section>
  );
}

export function PageSection({
  children,
  className = "",
  muted = false,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section className={`page-section${muted ? " page-section-muted" : ""} ${className}`.trim()}>
      <div className="site-container">{children}</div>
    </section>
  );
}
