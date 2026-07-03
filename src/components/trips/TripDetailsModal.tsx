"use client";

import { Money } from "@/components/currency/Money";
import { getInitials, getAvatarVariant } from "@/lib/avatar";
import { formatDateRangeUk } from "@/lib/date";
import type { TripWithResponsibles } from "@/lib/data/trips";
import styles from "@/styles/app.module.css";

const STATUS_STRIP_CLASS = {
  planned: "evPlan",
  in_prep: "evPrep",
  done: "evDone",
} as const;

const STATUS_BADGE_CLASS = {
  planned: "dsPlan",
  in_prep: "dsPrep",
  done: "dsDone",
} as const;

const STATUS_LABELS = {
  planned: "Заплановано",
  in_prep: "У підготовці",
  done: "Завершено",
} as const;

export function TripDetailsModal({
  trip,
  onClose,
  onEdit,
}: {
  trip: TripWithResponsibles;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className={styles.dOverlay} onClick={onClose}>
      <div className={styles.dModal} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.dStrip} ${styles[STATUS_STRIP_CLASS[trip.status]]}`} />
        <div className={styles.dBody}>
          <div className={styles.dTop}>
            <span className={`${styles.dStatus} ${styles[STATUS_BADGE_CLASS[trip.status]]}`}>
              {STATUS_LABELS[trip.status]}
            </span>
            <button type="button" className={styles.dClose} onClick={onClose} aria-label="Закрити">
              <svg viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <h2>{trip.title}</h2>

          <div className={styles.dMeta}>
            <div className={styles.dRow}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 2v4M16 2v4" />
              </svg>
              <span className={styles.lbl}>Дати</span>
              <span>{formatDateRangeUk(trip.startDate, trip.endDate)}</span>
            </div>
            <div className={styles.dRow}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className={styles.lbl}>Місце</span>
              <span>{trip.destination}</span>
            </div>
            <div className={styles.dRow}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className={styles.lbl}>Вартість</span>
              <span className={styles.dCost}>
                <Money amountEur={trip.costEur} />
              </span>
            </div>
          </div>

          <div className={styles.dDesc}>{trip.description}</div>

          <div className={styles.dPeople}>
            <span className={styles.lbl}>
              {trip.responsibles.length}{" "}
              {trip.responsibles.length === 1 ? "відповідальний" : "відповідальні"}
            </span>
            <div className={styles.dPeopleList}>
              {trip.responsibles.map((person) => (
                <div key={person.id} className={styles.dPersonRow}>
                  <span className={`${styles.avatar} ${styles[getAvatarVariant(person.id)]}`}>
                    {getInitials(person.name)}
                  </span>
                  <span className={styles.dPersonName}>{person.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.dFoot}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Закрити
            </button>
            <button type="button" className={styles.btnPrimary} onClick={onEdit}>
              Редагувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
