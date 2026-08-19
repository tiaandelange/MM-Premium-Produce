"use client";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="site-container py-20">
      <h1 className="text-page-title">Something went wrong</h1>
      <p className="mt-4 max-w-xl text-muted">Please refresh the page or try again.</p>
      <button type="button" className="btn-primary mt-8" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
