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
import { useTranslations } from "next-intl";
import { REGISTRY_KEYS } from "@/templates/registry";

const STEP_KEYS = [
  { title: "checklistStep1Title", detail: "checklistStep1Detail" },
  { title: "checklistStep2Title", detail: "checklistStep2Detail" },
  { title: "checklistStep3Title", detail: "checklistStep3Detail" },
  { title: "checklistStep4Title", detail: "checklistStep4Detail" },
  { title: "checklistStep5Title", detail: "checklistStep5Detail" },
] as const;

export function NewTemplateChecklist({ componentKey }: { componentKey?: string }) {
  const t = useTranslations("admin");
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
        <Typography variant="subtitle2">{t("checklistTitle")}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List dense disablePadding>
          {STEP_KEYS.map((step, index) => {
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
                  primary={t(step.title)}
                  secondary={t(step.detail)}
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
          {t("checklistGuide")}{" "}
          <Link
            href="https://github.com/BoburBunyodjonov/online-invitation#adding-a-template"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("checklistGuideLink")}
          </Link>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
