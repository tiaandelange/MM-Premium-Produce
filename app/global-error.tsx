"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global render error", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="global-error-body">
        <main className="global-error-panel">
          <h1>Something went wrong</h1>
          <p>Please refresh the page or try again.</p>
          {error.digest ? (
            <p>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
          <button type="button" className="global-error-button" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
