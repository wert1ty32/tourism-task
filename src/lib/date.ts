const MONTHS_UK_SHORT = [
  "січ",
  "лют",
  "бер",
  "кві",
  "тра",
  "чер",
  "лип",
  "серп",
  "вер",
  "жов",
  "лис",
  "груд",
];

const MONTHS_UK_GENITIVE = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

export const WEEKDAYS_UK_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export const MONTHS_UK_FULL = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

export function formatDateUk(date: Date): string {
  return `${date.getDate()} ${MONTHS_UK_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateParts(date: Date): { month: string; day: number } {
  return { month: MONTHS_UK_SHORT[date.getMonth()], day: date.getDate() };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateRangeUk(start: Date, end: Date): string {
  if (isSameDay(start, end)) {
    return `${start.getDate()} ${MONTHS_UK_GENITIVE[start.getMonth()]} ${start.getFullYear()}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}–${end.getDate()} ${MONTHS_UK_GENITIVE[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${MONTHS_UK_GENITIVE[start.getMonth()]} – ${end.getDate()} ${MONTHS_UK_GENITIVE[end.getMonth()]} ${end.getFullYear()}`;
  }

  return `${start.getDate()} ${MONTHS_UK_GENITIVE[start.getMonth()]} ${start.getFullYear()} – ${end.getDate()} ${MONTHS_UK_GENITIVE[end.getMonth()]} ${end.getFullYear()}`;
}
