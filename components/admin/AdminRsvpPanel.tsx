"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { DownloadSimpleIcon, UsersIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { rsvpExportUrl, useInvitationRsvps } from "@/lib/queries/useRsvps";

const STATUS_COLORS: Record<string, "success" | "error" | "warning" | "default"> = {
  ATTENDING: "success",
  NOT_ATTENDING: "error",
  MAYBE: "warning",
};

export function AdminRsvpPanel({ invitationId }: { invitationId: string }) {
  const t = useTranslations("admin");
  const { data, isPending, isError, refetch } = useInvitationRsvps(invitationId);

  if (isPending) {
    return <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />;
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

  const { responses, summary } = data;

  return (
    <Card sx={{ borderRadius: 3, mt: 4 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("rsvpTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("rsvpSubtitle")}
            </Typography>
          </Box>
          <Button
            component="a"
            href={rsvpExportUrl(invitationId)}
            variant="outlined"
            startIcon={<DownloadSimpleIcon weight="duotone" />}
            sx={{ borderRadius: 999, alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            {t("rsvpExport")}
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Chip
            icon={<UsersIcon weight="duotone" />}
            label={t("rsvpAttending", {
              count: summary.attending,
              guests: summary.totalGuests,
            })}
            color="success"
            variant="outlined"
          />
          <Chip
            label={t("rsvpNotAttending", { count: summary.notAttending })}
            color="error"
            variant="outlined"
          />
          <Chip
            label={t("rsvpMaybe", { count: summary.maybe })}
            color="warning"
            variant="outlined"
          />
        </Stack>

        {responses.length === 0 ? (
          <Typography color="text.secondary">{t("rsvpEmpty")}</Typography>
        ) : (
          <Stack spacing={1.5}>
            {responses.map((row) => (
              <Box
                key={row.id}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{row.guestName}</Typography>
                    {row.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {row.phone}
                      </Typography>
                    )}
                    {row.message && (
                      <Typography variant="body2" sx={{ mt: 0.5, fontStyle: "italic" }}>
                        {row.message}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Chip
                      size="small"
                      label={t(`rsvpStatus_${row.status}`)}
                      color={STATUS_COLORS[row.status] ?? "default"}
                    />
                    {row.status === "ATTENDING" && row.guestCount > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        ×{row.guestCount}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
