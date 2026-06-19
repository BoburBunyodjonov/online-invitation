"use client";

import { useEffect } from "react";

/**
 * Records a view via API on each visit. The /i/[slug] page is ISR-cached, so
 * server-side increment on render would miss most requests.
 */
export function InvitationViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `invitation-view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — still try to record
    }

    void fetch(`/api/i/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
