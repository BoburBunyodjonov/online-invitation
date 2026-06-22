import type { Template } from "@/lib/generated/prisma";
import type { ThemeDefaults } from "@/lib/validation/template";

/** Locked template config stored on Invitation at create/publish time. */
export type TemplateSnapshot = {
  componentKey: string;
  fieldsSchema: unknown;
  themeDefaults: ThemeDefaults;
  templateSlug: string;
  snapshotAt: string;
};

export function buildTemplateSnapshot(template: Template): TemplateSnapshot {
  return {
    componentKey: template.componentKey,
    fieldsSchema: template.fieldsSchema,
    themeDefaults: template.themeDefaults as ThemeDefaults,
    templateSlug: template.slug,
    snapshotAt: new Date().toISOString(),
  };
}

export function parseTemplateSnapshot(
  raw: unknown,
): TemplateSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<TemplateSnapshot>;
  if (
    typeof s.componentKey !== "string" ||
    typeof s.templateSlug !== "string" ||
    !s.themeDefaults
  ) {
    return null;
  }
  return s as TemplateSnapshot;
}

/** Prefer locked snapshot; fall back to live template row. */
export function resolveInvitationTemplate(
  invitation: { templateSnapshot: unknown },
  template: Template,
): { componentKey: string; theme: ThemeDefaults } {
  const snapshot = parseTemplateSnapshot(invitation.templateSnapshot);
  if (snapshot) {
    return {
      componentKey: snapshot.componentKey,
      theme: snapshot.themeDefaults,
    };
  }
  return {
    componentKey: template.componentKey,
    theme: template.themeDefaults as ThemeDefaults,
  };
}
