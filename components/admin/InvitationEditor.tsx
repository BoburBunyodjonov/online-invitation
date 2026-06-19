"use client";

import { useDeferredValue, useMemo, useState } from "react";
import "./invitation-preview.css";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { FloppyDiskIcon, RocketLaunchIcon, EyeIcon } from "@phosphor-icons/react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/config/locales";
import type { OrderDTO } from "@/lib/types";
import type { InvitationData } from "@/lib/validation/invitation-data";
import { invitationDataSchema } from "@/lib/validation/invitation-data";
import { SAMPLE_DATA } from "@/templates/sample-data";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { SchemaForm } from "./SchemaForm";
import {
  useCreateInvitation,
  useUpdateInvitation,
  usePublishInvitation,
} from "@/lib/queries/useInvitation";
import { apiErrorMessage } from "@/lib/queries/axios";

function defaultData(): InvitationData {
  // Deep clone the sample so the admin starts from a complete, editable structure.
  return JSON.parse(JSON.stringify(SAMPLE_DATA)) as InvitationData;
}

export function InvitationEditor({ order }: { order: OrderDTO }) {
  const existing = order.invitation ?? null;
  const [data, setData] = useState<InvitationData>(
    existing ? (existing.data as InvitationData) : defaultData(),
  );
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [editLocale, setEditLocale] = useState<Locale>(data.defaultLocale);
  const [invitationId, setInvitationId] = useState<string | null>(
    existing?.id ?? null,
  );
  const [toast, setToast] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  const createMut = useCreateInvitation();
  const updateMut = useUpdateInvitation();
  const publishMut = usePublishInvitation();

  const theme = order.template!.themeDefaults;
  const componentKey = order.template!.componentKey;

  // Admin preview: skip the full-screen envelope gate and defer heavy re-renders.
  const previewData = useMemo(
    () => ({ ...data, defaultLocale: editLocale, unlockGate: false }),
    [data, editLocale],
  );
  const deferredPreviewData = useDeferredValue(previewData);

  const validate = (): InvitationData | null => {
    const parsed = invitationDataSchema.safeParse(data);
    if (!parsed.success) {
      setToast({
        msg: parsed.error.issues[0]?.message ?? "Validation failed",
        severity: "error",
      });
      return null;
    }
    return parsed.data;
  };

  const handleSave = async () => {
    const valid = validate();
    if (!valid) return;
    try {
      if (invitationId) {
        await updateMut.mutateAsync({
          id: invitationId,
          input: { data: valid, slug: slug || undefined },
        });
      } else {
        const created = await createMut.mutateAsync({
          orderId: order.id,
          templateId: order.templateId,
          slug: slug || undefined,
          data: valid,
          isPublished: false,
        });
        setInvitationId(created.id);
        setSlug(created.slug);
      }
      setToast({ msg: "Saved", severity: "success" });
    } catch (e) {
      setToast({ msg: apiErrorMessage(e), severity: "error" });
    }
  };

  const handlePublish = async () => {
    if (!invitationId) {
      setToast({ msg: "Save the invitation first", severity: "error" });
      return;
    }
    try {
      const published = await publishMut.mutateAsync(invitationId);
      setSlug(published.slug);
      setToast({ msg: "Published! Customer notified.", severity: "success" });
    } catch (e) {
      setToast({ msg: apiErrorMessage(e), severity: "error" });
    }
  };

  const saving = createMut.isPending || updateMut.isPending;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 420px" },
        alignItems: "start",
      }}
    >
      {/* FORM */}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, alignItems: "center", flexWrap: "wrap" }}
        >
          <TextField
            label="Public slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ulugbek-malika"
            helperText="Leave empty to auto-generate"
          />
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            startIcon={<FloppyDiskIcon weight="duotone" />}
            onClick={handleSave}
            disabled={saving}
          >
            {invitationId ? "Save" : "Create"}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<RocketLaunchIcon weight="duotone" />}
            onClick={handlePublish}
            disabled={publishMut.isPending || !invitationId}
          >
            Publish
          </Button>
        </Stack>

        {invitationId && slug && (
          <Button
            component="a"
            href={`/i/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            startIcon={<EyeIcon weight="duotone" />}
            sx={{ mb: 2 }}
          >
            Open live page /i/{slug}
          </Button>
        )}

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Editing language
        </Typography>
        <Tabs
          value={editLocale}
          onChange={(_e, v) => setEditLocale(v)}
          variant="scrollable"
          sx={{ mb: 3 }}
        >
          {LOCALES.map((l) => (
            <Tab key={l} value={l} label={LOCALE_LABELS[l]} />
          ))}
        </Tabs>

        <SchemaForm
          schema={order.template!.fieldsSchema}
          value={data as unknown as Record<string, unknown>}
          editLocale={editLocale}
          onChange={(next) => setData(next as unknown as InvitationData)}
        />
      </Paper>

      {/* LIVE PREVIEW */}
      <Box sx={{ position: "sticky", top: 88 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Live preview ({LOCALE_LABELS[editLocale]})
        </Typography>
        <Paper
          variant="outlined"
          className="invitation-preview-frame"
          sx={{
            height: { xs: "min(70vh, 640px)", lg: "70vh" },
            overflow: "auto",
            borderRadius: 4,
            position: "relative",
            "& *": { scrollBehavior: "auto" },
          }}
        >
          <InvitationRenderer
            key={editLocale}
            componentKey={componentKey}
            data={deferredPreviewData}
            theme={theme}
          />
        </Paper>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
