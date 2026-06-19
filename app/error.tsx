"use client";

import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { WarningIcon } from "@phosphor-icons/react";
import { reportError } from "@/lib/monitoring/report-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportError(error, { boundary: "error.tsx" });
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "60dvh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box>
        <WarningIcon weight="duotone" size={56} color="var(--color-brand)" />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          {error.message || "An unexpected error occurred."}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Try again
        </Button>
      </Box>
    </Box>
  );
}
