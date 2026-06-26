"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useUpload } from "@/lib/queries/useUpload";

export function PreviewImagesField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const t = useTranslations("admin");
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUpload();

  const addUrl = (url: string) => {
    if (!url.trim()) return;
    onChange([...value, url.trim()]);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    const url = await upload.mutateAsync(file);
    addUrl(url);
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {t("previewImagesTitle")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={
            upload.isPending ? (
              <CircularProgress size={14} />
            ) : (
              <UploadSimpleIcon weight="duotone" />
            )
          }
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          {t("previewImagesUpload")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {t("previewImagesHint")}
      </Typography>

      {value.length === 0 ? (
        <Box
          sx={{
            py: 3,
            px: 2,
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("previewImagesEmpty")}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1}>
          {value.map((url, index) => (
            <Stack
              key={`${url}-${index}`}
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                p: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  overflow: "hidden",
                  flexShrink: 0,
                  bgcolor: "action.hover",
                }}
              >
                <img
                  src={url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {url}
              </Typography>
              <IconButton
                size="small"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label={t("previewImagesMoveUp")}
              >
                <ArrowUpIcon size={16} />
              </IconButton>
              <IconButton
                size="small"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
                aria-label={t("previewImagesMoveDown")}
              >
                <ArrowDownIcon size={16} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeAt(index)}
                aria-label={t("previewImagesRemove")}
              >
                <TrashIcon size={16} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}

      <Button
        size="small"
        variant="text"
        startIcon={<PlusIcon weight="bold" />}
        onClick={() => {
          const url = window.prompt(t("previewImagesPromptUrl"));
          if (url) addUrl(url);
        }}
        sx={{ alignSelf: "flex-start" }}
      >
        {t("previewImagesAddUrl")}
      </Button>
    </Stack>
  );
}
