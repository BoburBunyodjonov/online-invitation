"use client";

import { Box, Typography, Stack, type SxProps, type Theme } from "@mui/material";

export function AdminPageHeader({
  title,
  subtitle,
  action,
  sx,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        mb: 4,
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        ...sx,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 520 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}
