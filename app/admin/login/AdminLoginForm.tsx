"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { HeartIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { loginAdmin } from "@/app/actions/auth";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginForm() {
  const t = useTranslations("admin");
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@example.com",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const callbackUrl = params.get("callbackUrl") ?? "/admin/orders";
    const result = await loginAdmin(values.email, values.password, callbackUrl);
    if (result?.error) {
      setError(t("loginError"));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "var(--color-bg-subtle)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "var(--shadow-card)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <AdminLocaleSwitcher />
        </Box>
        <Stack spacing={1} sx={{ alignItems: "center", mb: 3 }}>
          <HeartIcon weight="fill" size={36} color="var(--color-brand)" />
          <Typography variant="h5">{t("login")}</Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label={t("email")}
              type="email"
              fullWidth
              autoComplete="email"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label={t("password")}
              type="password"
              fullWidth
              autoComplete="current-password"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              {t("signIn")}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
