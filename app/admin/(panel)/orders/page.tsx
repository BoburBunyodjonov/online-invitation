"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Alert,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { PlusIcon, TicketIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useOrders } from "@/lib/queries/useOrders";
import { ORDER_STATUSES } from "@/lib/validation/order";
import type { OrderDTO } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CreateOrderDialog } from "@/components/admin/CreateOrderDialog";

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "warning" | "success" | "error"
> = {
  NEW: "info",
  IN_PROGRESS: "warning",
  DONE: "success",
  CANCELLED: "error",
};

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: alpha("#fff", 0.8),
      }}
    >
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontFamily: "var(--font-serif)", color: accent, mt: 0.5 }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default function OrdersPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { data: allOrders } = useOrders();
  const { data, isPending, isError, refetch } = useOrders(status ?? undefined);

  const stats = useMemo(() => {
    const all = allOrders ?? [];
    return {
      total: all.length,
      new: all.filter((o) => o.status === "NEW").length,
      progress: all.filter((o) => o.status === "IN_PROGRESS").length,
      done: all.filter((o) => o.status === "DONE").length,
    };
  }, [allOrders]);

  const columns: GridColDef<OrderDTO>[] = [
    {
      field: "createdAt",
      headerName: t("colDate"),
      width: 170,
      valueGetter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      field: "template",
      headerName: t("colTemplate"),
      flex: 1,
      minWidth: 160,
      valueGetter: (_v, row) => row.template?.name ?? "—",
    },
    {
      field: "telegramUsername",
      headerName: t("colCustomer"),
      flex: 1,
      minWidth: 140,
      valueGetter: (value) => {
        const v = value as string | null;
        if (!v) return "—";
        return v.startsWith("@") ? v : v;
      },
    },
    {
      field: "contactPhone",
      headerName: t("colPhone"),
      width: 140,
      valueGetter: (value) => value ?? "—",
    },
    {
      field: "status",
      headerName: t("colStatus"),
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value as string}
          color={STATUS_COLORS[params.value as string] ?? "default"}
        />
      ),
    },
    {
      field: "invitation",
      headerName: t("colInvitation"),
      width: 130,
      renderCell: (params) =>
        params.row.invitation ? (
          <Chip
            size="small"
            label={
              params.row.invitation.isPublished ? t("published") : t("draft")
            }
            color={params.row.invitation.isPublished ? "success" : "default"}
          />
        ) : (
          <span>—</span>
        ),
    },
    {
      field: "views",
      headerName: t("colViews"),
      width: 100,
      type: "number",
      align: "right",
      headerAlign: "right",
      valueGetter: (_v, row) => row.invitation?.views ?? null,
      renderCell: (params) => {
        const views = params.row.invitation?.views;
        if (views == null || !params.row.invitation?.isPublished) return "—";
        return views.toLocaleString();
      },
    },
  ];

  return (
    <Box>
      <AdminPageHeader
        title={t("orders")}
        subtitle={t("ordersSubtitle")}
        action={
          <Button
            variant="contained"
            startIcon={<PlusIcon weight="bold" />}
            onClick={() => setCreateOpen(true)}
          >
            {t("createOrder")}
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          mb: 3,
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        <StatCard label={t("statTotal")} value={stats.total} accent="var(--color-brand)" />
        <StatCard label={t("statNew")} value={stats.new} accent="#6b8fae" />
        <StatCard label={t("statProgress")} value={stats.progress} accent="#d99a4e" />
        <StatCard label={t("statDone")} value={stats.done} accent="#5a8f69" />
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Chip
          label={t("filterAll")}
          variant={status === null ? "filled" : "outlined"}
          color={status === null ? "primary" : "default"}
          onClick={() => setStatus(null)}
        />
        {ORDER_STATUSES.map((s) => (
          <Chip
            key={s}
            label={s}
            variant={status === s ? "filled" : "outlined"}
            color={status === s ? "primary" : "default"}
            onClick={() => setStatus(s)}
          />
        ))}
      </Stack>

      {isError ? (
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
      ) : (
        <Paper
          elevation={0}
          sx={{
            height: 560,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            bgcolor: alpha("#fff", 0.85),
          }}
        >
          <DataGrid
            rows={data ?? []}
            columns={columns}
            loading={isPending}
            onRowClick={(params) => router.push(`/admin/orders/${params.id}`)}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              cursor: "pointer",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: alpha("#b08968", 0.06),
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: alpha("#b08968", 0.04),
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{
              noRowsOverlay: () => (
                <Stack
                  spacing={1}
                  sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <TicketIcon weight="duotone" size={40} />
                  <Typography>{t("noOrders")}</Typography>
                  <Button variant="outlined" onClick={() => setCreateOpen(true)}>
                    {t("createOrder")}
                  </Button>
                </Stack>
              ),
            }}
          />
        </Paper>
      )}

      <CreateOrderDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}
