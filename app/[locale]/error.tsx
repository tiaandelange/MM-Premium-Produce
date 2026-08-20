"use client";

import { EditorialEmptyState } from "@/components/layout/editorial-empty-state";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="site-container py-20">
      <EditorialEmptyState
        title="Something went wrong"
        action={
          <button type="button" className="btn-primary" onClick={() => reset()}>
            Try again
          </button>
        }
      >
        <p>Please refresh the page or try again.</p>
      </EditorialEmptyState>
    </div>
  );
}
