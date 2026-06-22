import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidInvitationSlug, slugify } from "@/lib/server/slug";

describe("slugify", () => {
  it("lowercases and hyphenates names", () => {
    assert.equal(slugify("Ulugbek & Malika"), "ulugbek-malika");
  });

  it("rejects reserved slugs", () => {
    assert.equal(slugify("-"), "");
    assert.equal(slugify("opengraph-image"), "");
  });

  it("strips special characters", () => {
    assert.equal(slugify("O'zbekiston 2026!"), "ozbekiston-2026");
  });
});

describe("isValidInvitationSlug", () => {
  it("accepts valid slugs", () => {
    assert.equal(isValidInvitationSlug("ulugbek-malika"), true);
  });

  it("rejects reserved and invalid slugs", () => {
    assert.equal(isValidInvitationSlug("opengraph-image"), false);
    assert.equal(isValidInvitationSlug("a"), false);
    assert.equal(isValidInvitationSlug("Bad_Slug"), false);
  });
});
