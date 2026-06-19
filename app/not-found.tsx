import { Box, Typography } from "@mui/material";
import { HeartBreakIcon } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/components/LinkButton";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box>
        <HeartBreakIcon weight="duotone" size={64} color="var(--color-brand)" />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          This invitation or page does not exist or is not published yet.
        </Typography>
        <LinkButton href="/" variant="contained">
          Go home
        </LinkButton>
      </Box>
    </Box>
  );
}
