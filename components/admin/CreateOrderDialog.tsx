"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import { TicketIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import {
  orderCreateSchema,
  type OrderCreate,
} from "@/lib/validation/order";
import { useCreateOrder } from "@/lib/queries/useOrders";
import { useAdminTemplates } from "@/lib/queries/useTemplates";
import { apiErrorMessage } from "@/lib/queries/axios";
import { formatTemplatePrice, type CurrencyCode } from "@/lib/format-price";

export function CreateOrderDialog({
  open,
  onClose,
  defaultTemplateId,
}: {
  open: boolean;
  onClose: () => void;
  defaultTemplateId?: string;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const createOrder = useCreateOrder();
  const { data: templates } = useAdminTemplates();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderCreate>({
    resolver: zodResolver(orderCreateSchema),
    defaultValues: {
      templateId: defaultTemplateId ?? "",
      customerName: "",
      telegramUsername: "",
      telegramChatId: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        templateId: defaultTemplateId ?? "",
        customerName: "",
        telegramUsername: "",
        telegramChatId: "",
        contactPhone: "",
      });
    }
  }, [open, defaultTemplateId, reset]);

  const onSubmit = async (values: OrderCreate) => {
    try {
      const order = await createOrder.mutateAsync(values);
      onClose();
      router.push(`/admin/orders/${order.id}`);
    } catch (e) {
      // shown via createOrder.error below
      console.error(apiErrorMessage(e));
    }
  };

  const published = (templates ?? []).filter((tpl) => tpl.isPublished);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha("#b08968", 0.12),
            }}
          >
            <TicketIcon weight="duotone" size={22} color="var(--color-brand)" />
          </Box>
          <Box>
            <Typography variant="h6">{t("createOrder")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("createOrderHint")}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {createOrder.isError && (
              <Alert severity="error">{apiErrorMessage(createOrder.error)}</Alert>
            )}
            <TextField
              select
              label={t("orderTemplate")}
              fullWidth
              {...register("templateId")}
              error={Boolean(errors.templateId)}
              helperText={errors.templateId?.message || (published.length === 0 ? t("noPublishedTemplates") : undefined)}
            >
              {published.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.name} ·{" "}
                  {tpl.priceAmount > 0
                    ? formatTemplatePrice(
                        tpl.priceAmount,
                        tpl.currency as CurrencyCode,
                      )
                    : tpl.category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t("customerName")}
              fullWidth
              placeholder="Ulugbek & Malika"
              {...register("customerName")}
              error={Boolean(errors.customerName)}
              helperText={errors.customerName?.message}
            />
            <TextField
              label={t("telegramUsername")}
              fullWidth
              placeholder="@username"
              {...register("telegramUsername")}
              helperText={t("telegramUsernameHint")}
            />
            <TextField
              label={t("contactPhone")}
              fullWidth
              placeholder="+998 90 123 45 67"
              {...register("contactPhone")}
            />
            <TextField
              label={t("telegramChatId")}
              fullWidth
              placeholder="123456789"
              {...register("telegramChatId")}
              helperText={t("telegramChatIdHint")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="text">
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createOrder.isPending}
          >
            {t("createOrderSubmit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
