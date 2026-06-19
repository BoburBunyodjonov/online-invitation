import type { BlueEnvelopeLang } from "./locales";

export function buildCalendarGrid(weddingDate: string) {
  const [year, month, weddingDay] = weddingDate.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);

  let startDow = first.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let day = 1; day <= last.getDate(); day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return { weddingDay, rows };
}

export function formatCalendarMonth(
  weddingDate: string,
  lang: BlueEnvelopeLang,
): string {
  const [year, month] = weddingDate.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const locale = lang === "uz" ? "uz-UZ" : "ru-RU";
  const monthLabel = date.toLocaleDateString(locale, { month: "long" });
  const capitalized =
    monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  return `${capitalized}, ${year}`;
}

export function formatOrnamentDateParts(weddingDate: string) {
  const [year, month, day] = weddingDate.split("-");
  return {
    day,
    month,
    year: year.slice(-2),
  };
}
