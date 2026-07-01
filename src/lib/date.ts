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

export function formatDateUk(date: Date): string {
  return `${date.getDate()} ${MONTHS_UK_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateParts(date: Date): { month: string; day: number } {
  return { month: MONTHS_UK_SHORT[date.getMonth()], day: date.getDate() };
}
