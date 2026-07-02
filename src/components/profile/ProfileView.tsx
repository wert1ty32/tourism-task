"use client";

import { Money } from "@/components/currency/Money";
import { getInitials } from "@/lib/avatar";
import { formatDateParts } from "@/lib/date";
import type { ProfileData } from "@/lib/data/profile";
import type { TripWithResponsibles } from "@/lib/data/trips";
import styles from "@/styles/app.module.css";

const STATUS: Record<TripWithResponsibles["status"], { label: string; className: "sPlan" | "sPrep" | "sDone" }> = {
  planned: { label: "Заплановано", className: "sPlan" },
  in_prep: { label: "У підготовці", className: "sPrep" },
  done: { label: "Виконано", className: "sDone" },
};

const ROLE_LABELS: Record<"admin" | "employee", string> = {
  admin: "Адміністратор",
  employee: "Співробітник",
};

export function ProfileView({ user, trips, stats, isSelf }: ProfileData & { isSelf: boolean }) {
  const nearest = stats.nearestTrip ? formatDateParts(stats.nearestTrip.startDate) : null;

  return (
    <main className={styles.wrap}>
      <div className={styles.pageHead}>
        <div>
          <h1>{isSelf ? "Мій профіль" : `Профіль: ${user.name}`}</h1>
          <p>
            {isSelf
              ? "Ваша діяльність та історія поїздок"
              : "Перегляд доступний лише адміністратору"}
          </p>
        </div>
      </div>

      <div className={styles.profileGrid}>
        <div>
          <div className={`${styles.pcard} ${styles.hero}`}>
            <div className={styles.band}>
              <svg viewBox="0 0 400 20" preserveAspectRatio="none">
                <path
                  d="M0 20 L0 12 L70 4 L140 14 L210 3 L280 13 L350 5 L400 12 L400 20 Z"
                  fill="#234A1F"
                />
              </svg>
            </div>
            <div className={styles.bigAvatar}>{getInitials(user.name)}</div>
            <h2>{user.name}</h2>
            <div className={styles.role}>{user.position ?? ROLE_LABELS[user.role]}</div>
            <div className={styles.email}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {user.email}
            </div>
            <div className={styles.privacy}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Приватний профіль — видно лише вам та адміністратору
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.k}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
                  <path d="M3 12h4l3-8 4 16 3-8h4" />
                </svg>
                Усього поїздок
              </div>
              <div className={styles.v}>{stats.totalTrips}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.k}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
                Цей квартал
              </div>
              <div className={styles.v}>{stats.thisQuarterTrips}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.k}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Найближча
              </div>
              <div className={styles.v}>
                {nearest ? (
                  <>
                    {nearest.day} <small>{nearest.month}</small>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.k}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
                  <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Загальна вартість
              </div>
              <div className={styles.v}>
                <Money amountEur={stats.totalCostEur} compact />
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.pcard} ${styles.activity}`}>
          <div className={styles.aHead}>
            <h3>{isSelf ? "Мої поїздки" : "Поїздки"}</h3>
          </div>
          <div className={styles.sub}>Кожна поїздка зараховується до акаунта відповідального</div>

          {trips.length === 0 && <p className={styles.sub}>Ще немає поїздок.</p>}

          {trips.map((trip) => {
            const parts = formatDateParts(trip.startDate);
            const status = STATUS[trip.status];
            return (
              <div className={styles.trow} key={trip.id}>
                <div className={styles.tdate}>
                  {parts.month}
                  <b>{parts.day}</b>
                </div>
                <div className={styles.tinfo}>
                  <b>{trip.title}</b>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
                      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {trip.destination}
                  </span>
                </div>
                <div className={styles.tcost}>
                  <Money amountEur={trip.costEur} />
                </div>
                <div className={`${styles.tstatus} ${styles[status.className]}`}>{status.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
