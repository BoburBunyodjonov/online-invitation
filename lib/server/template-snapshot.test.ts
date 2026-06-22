import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildTemplateSnapshot,
  parseTemplateSnapshot,
  resolveInvitationTemplate,
} from "@/lib/server/template-snapshot";

const template = {
  id: "tpl1",
  slug: "beach-romantic",
  name: "Beach",
  category: "beach",
  thumbnail: "/t.jpg",
  previewImages: [],
  componentKey: "beach-romantic",
  fieldsSchema: { fields: [] },
  themeDefaults: { accentColor: "#c79a6b", backgroundColor: "#fff", fontPair: "playfair", mode: "light" as const },
  priceAmount: 350000,
  currency: "UZS",
  isPublished: true,
  badgeNew: false,
  badgePopular: false,
  views: 0,
  createdAt: new Date(),
};

describe("template-snapshot", () => {
  it("builds a snapshot from template", () => {
    const snap = buildTemplateSnapshot(template);
    assert.equal(snap.componentKey, "beach-romantic");
    assert.equal(snap.templateSlug, "beach-romantic");
    assert.ok(snap.snapshotAt);
  });

  it("prefers snapshot over live template", () => {
    const snapshot = buildTemplateSnapshot(template);
    const live = { ...template, componentKey: "islamic-elegant" };
    const resolved = resolveInvitationTemplate(
      { templateSnapshot: snapshot },
      live,
    );
    assert.equal(resolved.componentKey, "beach-romantic");
  });

  it("falls back to live template when snapshot missing", () => {
    const resolved = resolveInvitationTemplate({ templateSnapshot: null }, template);
    assert.equal(resolved.componentKey, "beach-romantic");
  });

  it("parseTemplateSnapshot rejects invalid data", () => {
    assert.equal(parseTemplateSnapshot(null), null);
    assert.equal(parseTemplateSnapshot({ foo: 1 }), null);
  });
});
