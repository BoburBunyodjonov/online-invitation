"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@phosphor-icons/react";

export function TemplateCardPreview({
  thumbnail,
  name,
  previewHref,
  previewLabel,
}: {
  thumbnail: string;
  name: string;
  previewHref: string;
  previewLabel: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = thumbnail && !failed;

  return (
    <Link
      href={previewHref}
      className="catalogue-card-visual catalogue-card-visual--link"
      aria-label={previewLabel}
    >
      <div className="catalogue-card-stage" aria-hidden>
        <div className="catalogue-card-glow" />
        <div className="catalogue-sheet">
          {showImage ? (
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="catalogue-fallback">
              <span>{name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="catalogue-device">
          <div className="catalogue-device-bezel">
            <div className="catalogue-device-island" />
            <div className="catalogue-device-screen">
              {showImage ? (
                <img
                  src={thumbnail}
                  alt=""
                  loading="lazy"
                  onError={() => setFailed(true)}
                />
              ) : (
                <div className="catalogue-fallback catalogue-fallback--device">
                  <span>{name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="catalogue-card-hover">
        <EyeIcon weight="duotone" size={20} />
        <span>{previewLabel}</span>
      </div>
    </Link>
  );
}
