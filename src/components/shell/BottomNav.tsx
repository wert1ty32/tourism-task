"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/app.module.css";

export function BottomNav({ role }: { role: "admin" | "employee" }) {
  const pathname = usePathname();
  const isBoard = pathname === "/";
  const isCalendar = pathname.startsWith("/calendar");
  const isProfile = pathname.startsWith("/profile");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className={styles.bottomnav}>
      <Link href="/" className={isBoard ? styles.active : undefined}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16M15 4v10" />
        </svg>
        Дошка
      </Link>
      <Link href="/calendar" className={isCalendar ? styles.active : undefined}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" />
        </svg>
        Календар
      </Link>
      <Link href="/profile" className={isProfile ? styles.active : undefined}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
        Профіль
      </Link>
      {role === "admin" && (
        <Link href="/admin" className={isAdmin ? styles.active : undefined}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
            <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          </svg>
          Адмінка
        </Link>
      )}
    </nav>
  );
}
