"use client";

import { useEffect } from "react";

/** Records a view when the live invitation page loads (works with ISR cache). */
export function InvitationViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `invitation-view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — still try to record
    }

    void fetch(`/api/i/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
