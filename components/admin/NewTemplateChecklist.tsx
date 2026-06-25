"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { CaretDownIcon, CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { REGISTRY_KEYS } from "@/templates/registry";

const STEPS = [
  {
    title: "Create the React component",
    detail: "Add templates/<key>/index.tsx using blocks from templates/shared/.",
  },
  {
    title: "Register in the registry",
    detail: "Import the component in templates/registry.ts and add it to TEMPLATE_REGISTRY.",
  },
  {
    title: "Add sample data (optional)",
    detail:
      "Extend templates/sample-data.ts with FIELDS_SCHEMA_BY_COMPONENT, THEME_BY_COMPONENT, and SAMPLE_DATA_BY_COMPONENT entries.",
  },
  {
    title: "Create the DB template here",
    detail:
      "Pick the component key, set theme + editable fields, upload thumbnail and preview images, then publish.",
  },
  {
    title: "Verify preview",
    detail: "Open /templates/<slug>/preview and create a test order from the admin panel.",
  },
] as const;

export function NewTemplateChecklist({ componentKey }: { componentKey?: string }) {
  const isRegistered = componentKey
    ? REGISTRY_KEYS.includes(componentKey as (typeof REGISTRY_KEYS)[number])
    : false;

  return (
    <Accordion
      disableGutters
      elevation={0}
      defaultExpanded
      sx={{
        border: "1px solid",
        borderColor: "info.main",
        bgcolor: "action.hover",
        borderRadius: "12px !important",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<CaretDownIcon size={18} />}>
        <Typography variant="subtitle2">New template checklist</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List dense disablePadding>
          {STEPS.map((step, index) => {
            const done =
              index === 1
                ? isRegistered
                : index === 3
                  ? Boolean(componentKey)
                  : false;

            return (
              <ListItem key={step.title} disableGutters sx={{ alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                  {done ? (
                    <CheckCircleIcon size={18} weight="fill" color="var(--mui-palette-success-main)" />
                  ) : (
                    <CircleIcon size={18} color="var(--mui-palette-text-disabled)" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={step.title}
                  secondary={step.detail}
                  slotProps={{
                    primary: { variant: "body2", sx: { fontWeight: 600 } },
                    secondary: { variant: "caption" },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        <Typography variant="caption" color="text.secondary">
          Full guide:{" "}
          <Link
            href="https://github.com/BoburBunyodjonov/online-invitation#adding-a-template"
            target="_blank"
            rel="noopener noreferrer"
          >
            README → Adding a template
          </Link>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
