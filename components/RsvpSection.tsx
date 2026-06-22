"use client";

import { useState } from "react";
import type { Locale } from "@/config/locales";
import { RSVP_STRINGS } from "@/templates/shared/rsvp-strings";
import type { RsvpStatus } from "@/lib/generated/prisma";

export function RsvpSection({
  slug,
  locale,
  accent,
  backgroundColor = "#fbf7f2",
}: {
  slug: string;
  locale: Locale;
  accent: string;
  backgroundColor?: string;
}) {
  const t = RSVP_STRINGS[locale] ?? RSVP_STRINGS.uz;
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<RsvpStatus>("ATTENDING");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/i/${encodeURIComponent(slug)}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          phone: phone || undefined,
          status,
          guestCount: status === "ATTENDING" ? guestCount : 0,
          message: message || undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? t.error);
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section
        style={{
          padding: "3rem 1.5rem",
          background: backgroundColor,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.125rem", color: accent, fontWeight: 600 }}>
          {t.success}
        </p>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      style={{
        padding: "3rem 1.5rem 4rem",
        background: backgroundColor,
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "1.75rem",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          {t.title}
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6f6259",
            marginBottom: "2rem",
          }}
        >
          {t.subtitle}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.name}</span>
            <input
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.phone}</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </label>

          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 8 }}>
              {t.status}
            </legend>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(
                [
                  ["ATTENDING", t.attending],
                  ["NOT_ATTENDING", t.notAttending],
                  ["MAYBE", t.maybe],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="rsvp-status"
                    value={value}
                    checked={status === value}
                    onChange={() => setStatus(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {status === "ATTENDING" && (
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {t.guestCount}
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                style={inputStyle}
              />
            </label>
          )}

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.message}</span>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          {error && (
            <p style={{ color: "#b42318", fontSize: "0.875rem", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "0.5rem",
              padding: "0.875rem 1.5rem",
              borderRadius: 999,
              border: "none",
              background: accent,
              color: "#fff",
              fontWeight: 600,
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "…" : t.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "1px solid #e8dfd6",
  fontSize: "1rem",
  background: "#fff",
};
