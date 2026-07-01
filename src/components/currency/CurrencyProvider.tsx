"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { setPreferredCurrency } from "@/lib/actions/currency";
import type { Currency } from "@/lib/currency";

type CurrencyContextValue = {
  currency: Currency;
  eurToUah: number;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initialCurrency,
  eurToUah,
  children,
}: {
  initialCurrency: Currency;
  eurToUah: number;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);
  const [, startTransition] = useTransition();

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    startTransition(() => {
      setPreferredCurrency(next);
    });
  }

  return (
    <CurrencyContext.Provider value={{ currency, eurToUah, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
