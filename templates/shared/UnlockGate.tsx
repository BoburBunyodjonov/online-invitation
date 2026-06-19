"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { EnvelopeOpenIcon } from "@phosphor-icons/react";

export function UnlockGate({
  enabled,
  accent,
  backgroundImage,
  title,
  subtitle,
  buttonLabel,
  children,
}: {
  enabled: boolean;
  accent: string;
  backgroundImage?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(!enabled);

  return (
    <>
      {children}
      {!unlocked && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/65" />
          <div className="relative flex flex-col items-center text-white">
            <EnvelopeOpenIcon weight="duotone" size={64} color={accent} />
            <h2 className="mt-6 font-serif text-2xl font-semibold">{title}</h2>
            <p className="mt-2 max-w-xs text-sm text-white/82">{subtitle}</p>
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="btn-invite mt-8 px-10 py-3.5 text-sm"
              style={{ backgroundColor: accent }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
