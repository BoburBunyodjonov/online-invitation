"use client";

import { ScheduleIcon } from "./icon-map";
import { useTemplate } from "./TemplateContext";

export function ScheduleList({ accent }: { accent: string }) {
  const { data, t } = useTemplate();
  if (!data.schedule?.length) return null;

  return (
    <ul className="mx-auto flex max-w-md flex-col gap-4">
      {data.schedule.map((item, i) => (
        <li
          key={i}
          className="card-glass flex items-center gap-4 p-4"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}22` }}
          >
            <ScheduleIcon iconKey={item.icon} size={26} color={accent} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold" style={{ color: accent }}>
              {item.time}
            </span>
            <span className="text-ink">{t(item.label)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
