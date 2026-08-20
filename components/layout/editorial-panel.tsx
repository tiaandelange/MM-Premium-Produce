import type { ReactNode } from "react";

export function EditorialPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`editorial-panel ${className}`.trim()}>{children}</div>;
}
