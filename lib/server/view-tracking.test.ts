import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasAdminSessionCookie,
  hasRecentViewCookie,
  isBotUserAgent,
  shouldCountView,
} from "@/lib/server/view-tracking";

describe("view-tracking", () => {
  it("detects bot user agents", () => {
    assert.equal(isBotUserAgent("Googlebot/2.1"), true);
    assert.equal(isBotUserAgent("Mozilla/5.0 Chrome/120"), false);
  });

  it("skips admin sessions", () => {
    assert.equal(
      hasAdminSessionCookie("authjs.session-token=abc; other=1"),
      true,
    );
    assert.equal(hasAdminSessionCookie("other=1"), false);
  });

  it("deduplicates via view cookie", () => {
    assert.equal(
      hasRecentViewCookie("vt_invitation_ulugbek-malika=1", "invitation", "ulugbek-malika"),
      true,
    );
  });

  it("shouldCountView returns false for admin preview", () => {
    assert.equal(
      shouldCountView(
        {
          userAgent: "Mozilla/5.0",
          cookieHeader: "authjs.session-token=x",
          referer: null,
        },
        "invitation",
        "test-slug",
      ),
      false,
    );
  });
});
