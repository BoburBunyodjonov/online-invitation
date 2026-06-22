import type { ComponentType } from "react";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";
import BeachRomanticTemplate from "./beach-romantic";
import IslamicElegantTemplate from "./islamic-elegant";
import BlueEnvelopeTemplate from "./blue-envelope";
import UzbStyleTemplate from "./uzb-style";

export interface TemplateComponentProps {
  data: InvitationData;
  theme: ThemeDefaults;
}

/**
 * Maps Template.componentKey (stored in DB) -> the React component that renders
 * it. This is the indirection that lets admins create many DB templates that
 * reuse a handful of code components.
 */
export const TEMPLATE_REGISTRY: Record<
  string,
  ComponentType<TemplateComponentProps>
> = {
  "beach-romantic": BeachRomanticTemplate,
  "islamic-elegant": IslamicElegantTemplate,
  "blue-envelope": BlueEnvelopeTemplate,
  "uzb-style": UzbStyleTemplate,
};

export const REGISTRY_KEYS = Object.keys(TEMPLATE_REGISTRY);

export function getTemplateComponent(componentKey: string) {
  return TEMPLATE_REGISTRY[componentKey] ?? null;
}
