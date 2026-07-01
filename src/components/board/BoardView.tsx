"use client";

import { useMemo, useState } from "react";
import { TripCard } from "@/components/board/TripCard";
import { TripFormModal } from "@/components/board/TripFormModal";
import type { TripWithResponsibles, Employee } from "@/lib/data/trips";
import type { TripInput } from "@/lib/actions/trips";
import styles from "@/styles/app.module.css";

const COLUMNS: { key: TripInput["status"]; label: string; className: keyof typeof styles; allowAdd: boolean }[] = [
  { key: "planned", label: "Заплановані", className: "cPlan", allowAdd: true },
  { key: "in_prep", label: "У підготовці", className: "cPrep", allowAdd: true },
  { key: "done", label: "Завершені", className: "cDone", allowAdd: false },
];

export function BoardView({
  trips,
  employees,
}: {
  trips: TripWithResponsibles[];
  employees: Employee[];
}) {
  const [query, setQuery] = useState("");
  const [editingTrip, setEditingTrip] = useState<TripWithResponsibles | null>(null);
  const [creatingStatus, setCreatingStatus] = useState<TripInput["status"] | null>(null);

  const filteredTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q) ||
        trip.description.toLowerCase().includes(q),
    );
  }, [trips, query]);

  const modalOpen = editingTrip !== null || creatingStatus !== null;

  function closeModal() {
    setEditingTrip(null);
    setCreatingStatus(null);
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Дошка поїздок</h1>
          <p>Заплановані відрядження та поїздки команди департаменту</p>
        </div>
        <div className={styles.headActions}>
          <div className={styles.search}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Пошук поїздок…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className={styles.btnPrimary} onClick={() => setCreatingStatus("planned")}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.1">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Нова поїздка
          </button>
        </div>
      </div>

      <div className={styles.board}>
        {COLUMNS.map((column) => {
          const columnTrips = filteredTrips.filter((trip) => trip.status === column.key);
          return (
            <section key={column.key} className={`${styles.column} ${styles[column.className]}`}>
              <div className={styles.colHead}>
                <span className={styles.dot} />
                <b>{column.label}</b>
                <span className={styles.count}>{columnTrips.length}</span>
              </div>
              <div className={styles.cards}>
                {columnTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onClick={() => setEditingTrip(trip)} />
                ))}
                {column.allowAdd && (
                  <button
                    className={styles.addCard}
                    onClick={() => setCreatingStatus(column.key)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Додати поїздку
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {modalOpen && (
        <TripFormModal
          trip={editingTrip ?? undefined}
          initialStatus={creatingStatus ?? undefined}
          employees={employees}
          onClose={closeModal}
        />
      )}
    </>
  );
}
