"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatMoney, formatMoneyCompact } from "@/lib/currency";

export function Money({ amountEur, compact = false }: { amountEur: number; compact?: boolean }) {
  const { currency, eurToUah } = useCurrency();
  return compact
    ? formatMoneyCompact(amountEur, currency, eurToUah)
    : formatMoney(amountEur, currency, eurToUah);
}
