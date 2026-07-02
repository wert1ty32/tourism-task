import type { TripWithResponsibles } from "@/lib/data/trips";

function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toMidnight(a) === toMidnight(b);
}

export function getMonthGridWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const gridStart = new Date(year, month, 1 - mondayIndex(first));
  const gridEnd = new Date(year, month, last.getDate() + (6 - mondayIndex(last)));

  const weeks: Date[][] = [];
  let week: Date[] = [];
  for (let d = new Date(gridStart); d.getTime() <= gridEnd.getTime(); d.setDate(d.getDate() + 1)) {
    week.push(new Date(d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}

export function getTripsInMonth(trips: TripWithResponsibles[], year: number, month: number): TripWithResponsibles[] {
  const monthStart = toMidnight(new Date(year, month, 1));
  const monthEnd = toMidnight(new Date(year, month + 1, 0));

  return trips
    .filter((trip) => toMidnight(trip.startDate) <= monthEnd && toMidnight(trip.endDate) >= monthStart)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export type TripSegment = {
  trip: TripWithResponsibles;
  colStart: number;
  colEnd: number;
  row: number;
};

export function layoutWeekEvents(weekDays: Date[], trips: TripWithResponsibles[]): TripSegment[] {
  const weekStart = toMidnight(weekDays[0]);
  const weekEnd = toMidnight(weekDays[6]);

  const raw = trips
    .map((trip) => {
      const tripStart = toMidnight(trip.startDate);
      const tripEnd = toMidnight(trip.endDate);
      if (tripStart > weekEnd || tripEnd < weekStart) return null;

      const segStart = Math.max(tripStart, weekStart);
      const segEnd = Math.min(tripEnd, weekEnd);
      const colStart = weekDays.findIndex((d) => toMidnight(d) === segStart) + 1;
      const colEnd = weekDays.findIndex((d) => toMidnight(d) === segEnd) + 2;

      return { trip, colStart, colEnd };
    })
    .filter((seg): seg is { trip: TripWithResponsibles; colStart: number; colEnd: number } => seg !== null)
    .sort((a, b) => {
      if (a.colStart !== b.colStart) return a.colStart - b.colStart;
      return b.colEnd - b.colStart - (a.colEnd - a.colStart);
    });

  const rows: { colStart: number; colEnd: number }[][] = [];
  const segments: TripSegment[] = [];

  for (const seg of raw) {
    let rowIndex = rows.findIndex((row) =>
      row.every((other) => seg.colStart >= other.colEnd || seg.colEnd <= other.colStart),
    );
    if (rowIndex === -1) {
      rowIndex = rows.length;
      rows.push([]);
    }
    rows[rowIndex].push({ colStart: seg.colStart, colEnd: seg.colEnd });
    segments.push({ ...seg, row: rowIndex + 1 });
  }

  return segments;
}
