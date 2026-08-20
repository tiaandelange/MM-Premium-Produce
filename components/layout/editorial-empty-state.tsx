import type { ReactNode } from "react";

export function EditorialEmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="editorial-empty-state">
      <h2 className="font-heading text-card-title text-ink">{title}</h2>
      <div className="mt-3 max-w-prose text-muted">{children}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
