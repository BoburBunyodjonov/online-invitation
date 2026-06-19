"use client";

import { useEffect, useState } from "react";

function getCountdown(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

export function HeroPreviewCountdown({
  targetDate,
  labels,
}: {
  targetDate: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const [parts, setParts] = useState(() =>
    getCountdown(`${targetDate}T${"16:00:00"}`),
  );

  useEffect(() => {
    const target = `${targetDate}T16:00:00`;
    const tick = () => setParts(getCountdown(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  const boxes = [
    { n: parts.days, l: labels.days },
    { n: parts.hours, l: labels.hours },
    { n: parts.minutes, l: labels.minutes },
    { n: parts.seconds, l: labels.seconds },
  ];

  return (
    <div className="landing-hero-phone-countdown">
      {boxes.map((box) => (
        <div key={box.l} className="landing-hero-countdown-box">
          <strong>{String(box.n).padStart(2, "0")}</strong>
          <span>{box.l}</span>
        </div>
      ))}
    </div>
  );
}
