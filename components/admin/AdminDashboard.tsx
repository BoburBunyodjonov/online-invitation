import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {
  TicketIcon,
  EyeIcon,
  SquaresFourIcon,
  CurrencyCircleDollarIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import type { AdminStats } from "@/lib/server/stats";
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

export async function AdminDashboard({ stats }: { stats: AdminStats }) {
  const t = await getTranslations("admin");

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
            value={stats.orders.total}
            icon={TicketIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statOrdersNew")}
            value={stats.orders.new}
            icon={TrendUpIcon}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statOrdersDone")}
            value={stats.orders.done}
            icon={TicketIcon}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statInvitationsPublished")}
            value={stats.invitations.published}
            icon={SquaresFourIcon}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statTotalViews")}
            value={stats.invitations.totalViews}
            icon={EyeIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            label={t("statPaidRevenue")}
            value={formatTemplatePrice(stats.revenue.paidAmountUzs, "UZS")}
            icon={CurrencyCircleDollarIcon}
            color="success"
          />
        </Grid>
      </Grid>

      {stats.topTemplates.length > 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("statTopTemplates")}
            </Typography>
            <Stack spacing={1.5}>
              {stats.topTemplates.map((row, i) => (
                <Stack
                  key={row.templateId}
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom:
                      i < stats.topTemplates.length - 1 ? "1px solid" : "none",
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
