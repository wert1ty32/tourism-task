"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { getInitials } from "@/lib/avatar";
import styles from "@/styles/app.module.css";

type TopbarUser = {
  name: string;
  position: string | null;
  role: "admin" | "employee";
};

export function Topbar({ user }: { user: TopbarUser }) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const isBoard = pathname === "/";
  const isCalendar = pathname.startsWith("/calendar");
  const isProfile = pathname.startsWith("/profile");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className={styles.topbar}>
      <svg className={styles.ridge} viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          d="M0 40 L0 26 L150 8 L320 30 L480 6 L650 28 L820 10 L1000 26 L1200 12 L1200 40 Z"
          fill="#234A1F"
        />
      </svg>

      <div className={styles.brand}>
        <Image src="/logo.png" alt="Tourism Department" width={40} height={40} />
        <div className={styles.txt}>
          <small>Tourism Department</small>
          <b>Управління поїздками</b>
        </div>
      </div>

      <nav className={styles.tabs}>
        <Link href="/" className={isBoard ? styles.active : undefined}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16M15 4v10" />
          </svg>
          Дошка
        </Link>
        <Link href="/calendar" className={isCalendar ? styles.active : undefined}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4" />
          </svg>
          Календар
        </Link>
        <Link href="/profile" className={isProfile ? styles.active : undefined}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
          </svg>
          Профіль
        </Link>
        {user.role === "admin" && (
          <Link href="/admin" className={isAdmin ? styles.active : undefined}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3z" />
            </svg>
            Адмінка
          </Link>
        )}
      </nav>

      <div className={styles.spacer} />

      <div className={styles.curr} role="group" aria-label="Валюта">
        <button
          className={currency === "EUR" ? styles.active : undefined}
          onClick={() => setCurrency("EUR")}
        >
          € EUR
        </button>
        <button
          className={currency === "UAH" ? styles.active : undefined}
          onClick={() => setCurrency("UAH")}
        >
          ₴ UAH
        </button>
      </div>

      <Link href="/profile" className={styles.userchip}>
        <span className={styles.avatar}>{getInitials(user.name)}</span>
        <span className={styles.who}>
          <small>{user.position ?? (user.role === "admin" ? "Адміністратор" : "Співробітник")}</small>
          <b>{user.name}</b>
        </span>
      </Link>
    </header>
  );
}
