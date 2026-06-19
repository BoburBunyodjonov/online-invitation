"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Skeleton,
  Alert,
  Switch,
  FormControlLabel,
  IconButton,
  alpha,
} from "@mui/material";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  TicketIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import {
  useAdminTemplates,
  useDeleteTemplate,
  useUpdateTemplate,
} from "@/lib/queries/useTemplates";
import type { TemplateDTO } from "@/lib/types";
import { formatTemplatePrice, type CurrencyCode } from "@/lib/format-price";
import { TemplateFormDialog } from "@/components/admin/TemplateFormDialog";
import { CreateOrderDialog } from "@/components/admin/CreateOrderDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminTemplatesPage() {
  const t = useTranslations("admin");
  const { data, isPending, isError, refetch } = useAdminTemplates();
  const deleteMut = useDeleteTemplate();
  const updateMut = useUpdateTemplate();
  const [editing, setEditing] = useState<TemplateDTO | null>(null);
  const [creating, setCreating] = useState(false);
  const [orderForTemplate, setOrderForTemplate] = useState<string | undefined>();

  return (
    <Box>
      <AdminPageHeader
        title={t("templates")}
        subtitle={t("templatesSubtitle")}
        action={
          <Button
            variant="contained"
            startIcon={<PlusIcon weight="bold" />}
            onClick={() => setCreating(true)}
          >
            {t("newTemplate")}
          </Button>
        }
      />

      {isError && (
        <Alert
          severity="error"
          sx={{ borderRadius: 3, mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t("retry")}
            </Button>
          }
        >
          {t("loadError")}
        </Alert>
      )}

      {isPending ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={360} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          }}
        >
          {(data ?? []).map((tpl) => (
            <Card
              key={tpl.id}
              sx={{
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "var(--shadow-card)",
                },
              }}
            >
              <Box
                sx={{
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  bgcolor: alpha("#b08968", 0.06),
                }}
              >
                {tpl.thumbnail && (
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "var(--font-serif)" }}
                >
                  {tpl.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    size="small"
                    label={tpl.category}
                    sx={{ textTransform: "capitalize" }}
                  />
                  <Chip size="small" label={tpl.componentKey} variant="outlined" />
                  <Chip
                    size="small"
                    color="primary"
                    label={
                      tpl.priceAmount > 0
                        ? formatTemplatePrice(
                            tpl.priceAmount,
                            tpl.currency as CurrencyCode,
                          )
                        : t("priceOnRequest")
                    }
                  />
                </Stack>
                <FormControlLabel
                  sx={{ mt: 1.5 }}
                  control={
                    <Switch
                      checked={tpl.isPublished}
                      onChange={(e) =>
                        updateMut.mutate({
                          id: tpl.id,
                          input: { isPublished: e.target.checked },
                        })
                      }
                    />
                  }
                  label={tpl.isPublished ? t("published") : t("draft")}
                />
              </CardContent>
              <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
                {tpl.isPublished && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TicketIcon weight="duotone" />}
                    onClick={() => setOrderForTemplate(tpl.id)}
                  >
                    {t("createOrderForTemplate")}
                  </Button>
                )}
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    startIcon={<PencilSimpleIcon weight="duotone" />}
                    onClick={() => setEditing(tpl)}
                  >
                    {t("edit")}
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (confirm(t("deleteConfirm", { name: tpl.name }))) {
                        deleteMut.mutate(tpl.id);
                      }
                    }}
                  >
                    <TrashIcon weight="duotone" />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Box>
      )}

      {(creating || editing) && (
        <TemplateFormDialog
          template={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <CreateOrderDialog
        open={Boolean(orderForTemplate)}
        defaultTemplateId={orderForTemplate}
        onClose={() => setOrderForTemplate(undefined)}
      />
    </Box>
  );
}
