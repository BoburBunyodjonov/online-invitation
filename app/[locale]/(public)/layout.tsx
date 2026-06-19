import { Box } from "@mui/material";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box component="div" sx={{ minHeight: "100dvh" }}>
      {children}
    </Box>
  );
}
