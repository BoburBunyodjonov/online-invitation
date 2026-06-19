"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
  Alert,
  Button,
  alpha,
} from "@mui/material";
import {
  TicketIcon,
  EyeIcon,
  SquaresFourIcon,
  CurrencyCircleDollarIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useAdminStats } from "@/lib/queries/useAdminStats";
import { formatTemplatePrice } from "@/lib/format-price";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

function StatCard({
  label,
  value,
  icon: Icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: typeof TicketIcon;
  color?: "primary" | "success" | "warning" | "info";
}) {
  const palette = {
    primary: "#b08968",
    success: "#1b7a58",
    warning: "#c9a227",
    info: "#3d64b4",
  }[color];

  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(palette, 0.12),
              color: palette,
            }}
          >
            <Icon weight="duotone" size={24} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const t = useTranslations("admin");
  const { data, isPending, isError, refetch } = useAdminStats();

  if (isPending) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={80} />
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={110} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        }
      >
        {t("loadError")}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <AdminPageHeader
        title={t("dashboard")}
        subtitle={t("dashboardSubtitle")}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statOrdersTotal")}
            value={data.orders.total}
            icon={TicketIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statOrdersNew")}
            value={data.orders.new}
            icon={TrendUpIcon}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statOrdersDone")}
            value={data.orders.done}
            icon={TicketIcon}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statInvitationsPublished")}
            value={data.invitations.published}
            icon={SquaresFourIcon}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statTotalViews")}
            value={data.invitations.totalViews}
            icon={EyeIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statPaidRevenue")}
            value={formatTemplatePrice(data.revenue.paidAmountUzs, "UZS")}
            icon={CurrencyCircleDollarIcon}
            color="success"
          />
        </Grid>
      </Grid>

      {data.topTemplates.length > 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("statTopTemplates")}
            </Typography>
            <Stack spacing={1.5}>
              {data.topTemplates.map((row, i) => (
                <Stack
                  key={row.templateId}
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: i < data.topTemplates.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
                  <Typography color="text.secondary">
                    {t("statOrderCount", { count: row.orderCount })}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
