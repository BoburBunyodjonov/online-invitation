"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring/report-error";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportError(error, { boundary: "global-error.tsx" });
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: "#666", marginBottom: 24 }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#5d2e32",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
