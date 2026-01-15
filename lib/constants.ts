import { addDays, endOfMonth, format, isAfter, isBefore, isSameDay, startOfMonth } from "date-fns";

export const CAMPAIGN_MONTHS = [
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
  "2026-12"
];

export const BIMESTERS = [
  { key: "2026-03-04", label: "Mar-Abr" },
  { key: "2026-05-06", label: "Mai-Jun" },
  { key: "2026-07-08", label: "Jul-Ago" },
  { key: "2026-09-10", label: "Set-Out" },
  { key: "2026-11-12", label: "Nov-Dez" }
];

export const DIA_D_TYPES = [
  "Dia D",
  "Encarte Dia D",
  "Revista Digital Quinzenal",
  "Disparo Whats",
  "E-mail MKT",
  "Face/Insta/LinkedIn",
  "Stories"
];

export const NATIONAL_HOLIDAYS_2026 = [
  "2026-04-03",
  "2026-04-21",
  "2026-05-01",
  "2026-09-07",
  "2026-10-12",
  "2026-11-02",
  "2026-11-15",
  "2026-12-25"
];

export function isWithinPlannerRange(date: Date) {
  return !isBefore(date, new Date("2026-03-01")) && !isAfter(date, new Date("2026-12-31"));
}

export function isNationalHoliday(date: Date) {
  return NATIONAL_HOLIDAYS_2026.some((holiday) => isSameDay(date, new Date(holiday)));
}

export function buildMonthDays(monthKey: string) {
  const start = startOfMonth(new Date(`${monthKey}-01T00:00:00`));
  const end = endOfMonth(start);
  const days: Date[] = [];
  let cursor = start;
  while (!isAfter(cursor, end)) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
