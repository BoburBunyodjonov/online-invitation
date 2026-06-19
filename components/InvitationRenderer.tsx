"use client";

import { createElement } from "react";
import { getTemplateComponent } from "@/templates/registry";
import type { InvitationData } from "@/lib/validation/invitation-data";
import type { ThemeDefaults } from "@/lib/validation/template";

/**
 * Client wrapper that resolves a template componentKey from the registry and
 * renders it. Used by the preview route, the live /i/[slug] page, and the admin
 * live-preview pane — one renderer, one source of truth.
 */
export function InvitationRenderer({
  componentKey,
  data,
  theme,
}: {
  componentKey: string;
  data: InvitationData;
  theme: ThemeDefaults;
}) {
  const component = getTemplateComponent(componentKey);

  if (!component) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        Unknown template component: <code>{componentKey}</code>
      </div>
    );
  }

  // Resolve the already-defined component from the registry (not created here).
  return createElement(component, { data, theme });
}
