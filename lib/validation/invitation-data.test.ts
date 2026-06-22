import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { invitationDataSchema } from "@/lib/validation/invitation-data";

const validData = {
  locales: ["uz", "ru"],
  defaultLocale: "uz",
  groomName: { uz: "Ulugbek", ru: "Ulugbek", en: "", "uz-Cyrl": "" },
  brideName: { uz: "Malika", ru: "Malika", en: "", "uz-Cyrl": "" },
  weddingDate: "2026-09-12",
  startTime: "16:00",
  schedule: [],
  venue: {
    name: { uz: "Restoran", ru: "Restoran", en: "", "uz-Cyrl": "" },
    address: { uz: "Toshkent", ru: "Tashkent", en: "", "uz-Cyrl": "" },
    lat: 41.3,
    lng: 69.2,
  },
  gallery: [],
  unlockGate: true,
};

describe("invitationDataSchema", () => {
  it("parses valid invitation data", () => {
    const parsed = invitationDataSchema.parse(validData);
    assert.equal(parsed.defaultLocale, "uz");
    assert.equal(parsed.groomName.uz, "Ulugbek");
  });

  it("rejects missing venue", () => {
    const { venue: _venue, ...rest } = validData;
    assert.throws(() => invitationDataSchema.parse(rest));
  });
});
