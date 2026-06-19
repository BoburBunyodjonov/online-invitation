"use client";

import { MapPinIcon, NavigationArrowIcon } from "@phosphor-icons/react";
import { useTemplate } from "./TemplateContext";

export function VenueMap({
  accent,
  labels,
}: {
  accent: string;
  labels: { google: string; yandex: string };
}) {
  const { data, t } = useTemplate();
  const { venue } = data;
  if (!venue) return null;

  const { lat, lng } = venue;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const googleRoute = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const yandexRoute = `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`;

  return (
    <div className="card-glass mx-auto w-full max-w-md overflow-hidden">
      <div className="aspect-video w-full">
        <iframe
          title={t(venue.name)}
          src={mapSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-2.5">
          <MapPinIcon weight="duotone" size={22} color={accent} />
          <div>
            <p className="font-semibold text-ink">{t(venue.name)}</p>
            <p className="text-sm text-ink-soft">{t(venue.address)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={googleRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-invite flex-1"
            style={{ backgroundColor: accent }}
          >
            <NavigationArrowIcon weight="bold" size={16} />
            {labels.google}
          </a>
          <a
            href={yandexRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-invite-outline flex-1"
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            <NavigationArrowIcon weight="bold" size={16} />
            {labels.yandex}
          </a>
        </div>
      </div>
    </div>
  );
}
