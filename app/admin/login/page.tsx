import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
