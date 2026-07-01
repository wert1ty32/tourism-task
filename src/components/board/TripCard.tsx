"use client";

import { Money } from "@/components/currency/Money";
import { getInitials, getAvatarVariant } from "@/lib/avatar";
import { formatDateUk } from "@/lib/date";
import type { TripWithResponsibles } from "@/lib/data/trips";
import styles from "@/styles/app.module.css";

export function TripCard({
  trip,
  onClick,
}: {
  trip: TripWithResponsibles;
  onClick: () => void;
}) {
  return (
    <article className={styles.trip} onClick={onClick}>
      <span className={styles.accent} />
      <div className={styles.tripTop}>
        <span className={styles.datePill}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          {formatDateUk(trip.date)}
        </span>
        <span className={styles.costPill}>
          <Money amountEur={trip.costEur} />
        </span>
      </div>

      <h3>{trip.title}</h3>
      <div className={styles.place}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9">
          <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {trip.destination}
      </div>
      <p className={styles.desc}>{trip.description}</p>

      <div className={styles.tripFoot}>
        <div className={styles.stack}>
          {trip.responsibles.map((person) => (
            <span
              key={person.id}
              className={`${styles.avatar} ${styles[getAvatarVariant(person.id)]}`}
            >
              {getInitials(person.name)}
            </span>
          ))}
          <span className={styles.respLabel}>
            {trip.responsibles.length}{" "}
            {trip.responsibles.length === 1 ? "відповідальний" : "відповідальні"}
          </span>
        </div>
        {trip.status === "done" && <span className={`${styles.status} ${styles.stDone}`}>Виконано</span>}
      </div>
    </article>
  );
}
