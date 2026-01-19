import { addDays, format, getDay, isAfter, isBefore, isSameDay, parseISO, startOfWeek } from "date-fns";
import { NATIONAL_HOLIDAYS_2026 } from "./constants";
import { prisma } from "./prisma";

export function isWithinRange(date: Date) {
  return !isBefore(date, new Date("2026-03-01")) && !isAfter(date, new Date("2026-12-31"));
}

export function isWeekStartMonday(date: Date) {
  return getDay(date) === 1;
}

export async function isBlockedDiaD(date: Date) {
  const day = getDay(date);
  if (![3, 5].includes(day)) return true;
  if (NATIONAL_HOLIDAYS_2026.some((holiday) => isSameDay(date, parseISO(holiday)))) return true;
  const municipal = await prisma.holidayMunicipal.findUnique({
    where: { date }
  });
  return Boolean(municipal);
}

export function weekBounds(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  return { weekStart, weekEnd };
}

export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
