export type Currency = "EUR" | "UAH";

export function convertFromEur(amountEur: number, currency: Currency, eurToUah: number): number {
  return currency === "UAH" ? amountEur * eurToUah : amountEur;
}

export function formatMoney(amountEur: number, currency: Currency, eurToUah: number): string {
  const value = convertFromEur(amountEur, currency, eurToUah);
  const symbol = currency === "UAH" ? "₴" : "€";
  return `${symbol} ${new Intl.NumberFormat("uk-UA").format(Math.round(value))}`;
}

export function formatMoneyCompact(
  amountEur: number,
  currency: Currency,
  eurToUah: number,
): string {
  const value = convertFromEur(amountEur, currency, eurToUah);
  const symbol = currency === "UAH" ? "₴" : "€";
  const thousands = value / 1000;
  const rounded = thousands >= 100 ? Math.round(thousands).toString() : thousands.toFixed(1);
  return `${symbol}${rounded}к`;
}
