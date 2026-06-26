"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { Box, Button, TextField, CircularProgress, Stack } from "@mui/material";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { useUpload } from "@/lib/queries/useUpload";

export function FileUploadField({
  label,
  value,
  accept = "image/*",
  preview = true,
  error,
  helperText,
  uploadLabel,
  onChange,
}: {
  label: string;
  value?: string;
  accept?: string;
  preview?: boolean;
  error?: string;
  helperText?: string;
  uploadLabel?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUpload();

  const handleFile = async (file?: File) => {
    if (!file) return;
    const url = await upload.mutateAsync(file);
    onChange(url);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <TextField
          label={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          placeholder="https://... or /templates/..."
          error={Boolean(error)}
          helperText={error ?? helperText}
        />
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          startIcon={
            upload.isPending ? (
              <CircularProgress size={16} />
            ) : (
              <UploadSimpleIcon weight="duotone" />
            )
          }
        >
          {uploadLabel ?? "Upload"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </Stack>
      {preview && value && accept.startsWith("image") && (
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <img
            src={value}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}
    </Stack>
  );
}
