"use client";

import { use } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  TextField,
  MenuItem,
  Skeleton,
  Alert,
  Button,
  Breadcrumbs,
  alpha,
} from "@mui/material";
import { ArrowLeftIcon, UserIcon, PhoneIcon, EyeIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useOrder, useUpdateOrder } from "@/lib/queries/useOrders";
import { ORDER_STATUSES } from "@/lib/validation/order";
import { PAYMENT_STATUSES, formatTemplatePrice, type CurrencyCode } from "@/lib/format-price";
import { InvitationEditor } from "@/components/admin/InvitationEditor";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("admin");
  const { data: order, isPending, isError, refetch } = useOrder(id);
  const updateOrder = useUpdateOrder();

  if (isPending) {
    return <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />;
  }

  if (isError || !order) {
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
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          href="/admin/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "inherit",
          }}
        >
          <ArrowLeftIcon weight="bold" size={16} /> {t("orders")}
        </Link>
        <Typography color="text.primary">
          #{order.id.slice(0, 8)}
        </Typography>
      </Breadcrumbs>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: alpha("#fff", 0.85),
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          sx={{ alignItems: { lg: "center" } }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {t("colTemplate")}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontFamily: "var(--font-serif)", mt: 0.5 }}
            >
              {order.template?.name ?? "—"}
            </Typography>
            {order.priceAmount != null && order.priceAmount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {formatTemplatePrice(
                  order.priceAmount,
                  (order.currency ?? "UZS") as CurrencyCode,
                )}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <Chip
              icon={<UserIcon weight="duotone" />}
              label={order.telegramUsername ?? "—"}
              variant="outlined"
            />
            {order.contactPhone && (
              <Chip
                icon={<PhoneIcon weight="duotone" />}
                label={order.contactPhone}
                variant="outlined"
              />
            )}
            {order.invitation && (
              <Chip
                label={
                  order.invitation.isPublished ? t("published") : t("draft")
                }
                color={order.invitation.isPublished ? "success" : "default"}
              />
            )}
            {order.invitation?.isPublished && (
              <Chip
                icon={<EyeIcon weight="duotone" />}
                label={t("viewsCount", { count: order.invitation.views })}
                variant="outlined"
                color="info"
              />
            )}
          </Stack>

          <TextField
            select
            label={t("colStatus")}
            size="small"
            value={order.status}
            onChange={(e) =>
              updateOrder.mutate({
                id: order.id,
                input: { status: e.target.value as never },
              })
            }
            sx={{ minWidth: 180 }}
          >
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t("colPayment")}
            size="small"
            value={order.paymentStatus}
            onChange={(e) =>
              updateOrder.mutate({
                id: order.id,
                input: { paymentStatus: e.target.value as never },
              })
            }
            sx={{ minWidth: 180 }}
          >
            {PAYMENT_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`payment_${s}`)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <Typography
        variant="h5"
        sx={{ mb: 2, fontFamily: "var(--font-serif)" }}
      >
        {t("invitationEditor")}
      </Typography>
      <InvitationEditor order={order} />
    </Box>
  );
}
