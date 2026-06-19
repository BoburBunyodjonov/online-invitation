"use client";

/**
 * Small month calendar with the wedding day circled. Pure presentational —
 * builds the grid for the month of `date`.
 */
export function WeddingCalendar({
  date,
  accent,
  weekdayLabels,
}: {
  date: Date;
  accent: string;
  /** 7 short labels starting Monday. */
  weekdayLabels: string[];
}) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const weddingDay = date.getDate();

  const first = new Date(year, month, 1);
  // Convert JS Sunday-first (0) to Monday-first index.
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="card-glass mx-auto w-full max-w-xs p-4">
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-ink-soft">
        {weekdayLabels.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {cells.map((d, i) => {
          if (d === null) return <span key={i} />;
          const isWedding = d === weddingDay;
          return (
            <span
              key={i}
              className="flex h-8 items-center justify-center rounded-full"
              style={
                isWedding
                  ? {
                      backgroundColor: accent,
                      color: "#fff",
                      fontWeight: 700,
                    }
                  : { color: "var(--color-ink)" }
              }
            >
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}
