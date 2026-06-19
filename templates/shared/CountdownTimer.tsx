"use client";

import { useEffect, useState } from "react";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function CountdownTimer({
  target,
  accent,
  labels,
}: {
  target: Date;
  accent: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const targetMs = target.getTime();
  const [parts, setParts] = useState<Parts>(() => diff(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const cells: Array<[number, string]> = [
    [parts.days, labels.days],
    [parts.hours, labels.hours],
    [parts.minutes, labels.minutes],
    [parts.seconds, labels.seconds],
  ];

  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-4">
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="card-glass flex min-w-16 flex-col items-center px-3 py-3 sm:min-w-20"
        >
          <span
            className="text-2xl font-bold tabular-nums sm:text-3xl"
            style={{ color: accent }}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-soft sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
