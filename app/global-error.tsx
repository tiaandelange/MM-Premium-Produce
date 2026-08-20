"use client";

import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="global-error-body">
        <main className="global-error-panel">
          <h1>Something went wrong</h1>
          <p>Please refresh the page or try again.</p>
          <button type="button" className="global-error-button" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
